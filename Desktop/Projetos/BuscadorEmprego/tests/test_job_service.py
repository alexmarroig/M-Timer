"""
Tests for services/job_service.py.
SerpAPIConnector.fetch_jobs is patched — no real HTTP calls made.
"""
import pytest
from datetime import datetime, timezone
from unittest.mock import AsyncMock, patch

from connectors.base import JobDTO
from models.job import Job


# ---- fetch_and_persist -------------------------------------------------- #

@pytest.mark.asyncio
async def test_fetch_and_persist_saves_approved_jobs(test_session_factory, sample_dtos, sample_profile):
    """Approved jobs are saved to DB with status='new'."""
    with patch("services.job_service.Session", test_session_factory), \
         patch("services.job_service.SerpAPIConnector") as MockConn:
        MockConn.return_value.fetch_jobs = AsyncMock(return_value=sample_dtos)

        from services import job_service
        result = await job_service.fetch_and_persist(sample_profile)

    assert result["total_found"] == 2
    assert result["approved"] == 2
    assert result["skipped"] == 0


@pytest.mark.asyncio
async def test_fetch_and_persist_skips_filtered_jobs(test_session_factory, sample_profile):
    """Jobs that fail filters are saved with status='skipped' and a reason."""
    bad_dto = JobDTO(
        source="linkedin",
        title="Product Manager",
        company="Corp",
        location="Remote",
        url="https://linkedin.com/job/99",
        summary="Great role.",
        is_easy_apply=False,
    )
    with patch("services.job_service.Session", test_session_factory), \
         patch("services.job_service.SerpAPIConnector") as MockConn:
        MockConn.return_value.fetch_jobs = AsyncMock(return_value=[bad_dto])

        from services import job_service
        result = await job_service.fetch_and_persist(sample_profile)

    assert result["total_found"] == 1
    assert result["approved"] == 0
    assert result["skipped"] == 1

    with test_session_factory() as session:
        job = session.query(Job).filter_by(url=bad_dto.url).first()
        assert job is not None
        assert job.status == "skipped"
        assert job.filter_reason is not None
        assert job.filter_reason != ""


@pytest.mark.asyncio
async def test_fetch_and_persist_upsert_no_duplicate(test_session_factory, sample_dtos, sample_profile):
    """Running twice with same DTOs does not create duplicate rows."""
    with patch("services.job_service.Session", test_session_factory), \
         patch("services.job_service.SerpAPIConnector") as MockConn:
        MockConn.return_value.fetch_jobs = AsyncMock(return_value=sample_dtos)

        from services import job_service
        await job_service.fetch_and_persist(sample_profile)
        await job_service.fetch_and_persist(sample_profile)

    with test_session_factory() as session:
        count = session.query(Job).count()
    assert count == 2


@pytest.mark.asyncio
async def test_fetch_and_persist_applied_status_preserved(test_session_factory, sample_dtos, sample_profile):
    """Jobs with status='applied' are never overwritten."""
    with patch("services.job_service.Session", test_session_factory), \
         patch("services.job_service.SerpAPIConnector") as MockConn:
        MockConn.return_value.fetch_jobs = AsyncMock(return_value=sample_dtos)

        from services import job_service
        await job_service.fetch_and_persist(sample_profile)

        with test_session_factory() as session:
            job = session.query(Job).filter_by(url=sample_dtos[0].url).first()
            job.status = "applied"
            session.commit()

        await job_service.fetch_and_persist(sample_profile)

    with test_session_factory() as session:
        job = session.query(Job).filter_by(url=sample_dtos[0].url).first()
        assert job.status == "applied"


@pytest.mark.asyncio
async def test_fetch_and_persist_skipped_becomes_new_if_re_approved(test_session_factory, sample_dtos, sample_profile):
    """A previously-skipped job that re-passes filters is updated back to 'new'."""
    with patch("services.job_service.Session", test_session_factory), \
         patch("services.job_service.SerpAPIConnector") as MockConn:
        MockConn.return_value.fetch_jobs = AsyncMock(return_value=sample_dtos)

        from services import job_service
        await job_service.fetch_and_persist(sample_profile)

        with test_session_factory() as session:
            job = session.query(Job).filter_by(url=sample_dtos[0].url).first()
            job.status = "skipped"
            session.commit()

        await job_service.fetch_and_persist(sample_profile)

    with test_session_factory() as session:
        job = session.query(Job).filter_by(url=sample_dtos[0].url).first()
        assert job.status == "new"


@pytest.mark.asyncio
async def test_fetch_and_persist_sets_skill_match_pct(test_session_factory, sample_dtos, sample_profile):
    """Approved jobs get skill_match_pct populated."""
    with patch("services.job_service.Session", test_session_factory), \
         patch("services.job_service.SerpAPIConnector") as MockConn:
        MockConn.return_value.fetch_jobs = AsyncMock(return_value=sample_dtos)

        from services import job_service
        await job_service.fetch_and_persist(sample_profile)

    with test_session_factory() as session:
        job = session.query(Job).filter_by(url=sample_dtos[0].url).first()
        assert job.skill_match_pct is not None
        assert 0 <= job.skill_match_pct <= 100


# ---- query_jobs --------------------------------------------------------- #

def test_query_jobs_returns_all_by_default(test_session_factory, sample_dtos):
    from models.job import Job

    with test_session_factory() as session:
        for dto in sample_dtos:
            session.add(Job(
                source=dto.source, title=dto.title, company=dto.company,
                location=dto.location, url=dto.url, summary=dto.summary,
                is_easy_apply=dto.is_easy_apply,
                collected_at=datetime.now(timezone.utc), status="new",
            ))
        session.commit()

    with patch("services.job_service.Session", test_session_factory):
        from services import job_service
        jobs = job_service.query_jobs()

    assert len(jobs) == 2


def test_query_jobs_filters_by_status(test_session_factory, sample_dtos):
    from models.job import Job

    with test_session_factory() as session:
        for i, dto in enumerate(sample_dtos):
            status = "new" if i == 0 else "skipped"
            session.add(Job(
                source=dto.source, title=dto.title, company=dto.company,
                location=dto.location, url=dto.url, summary=dto.summary,
                is_easy_apply=dto.is_easy_apply,
                collected_at=datetime.now(timezone.utc), status=status,
            ))
        session.commit()

    with patch("services.job_service.Session", test_session_factory):
        from services import job_service
        new_jobs = job_service.query_jobs(status="new")

    assert len(new_jobs) == 1
    assert new_jobs[0].status == "new"


def test_update_status_changes_job(test_session_factory, sample_dtos):
    from models.job import Job

    with test_session_factory() as session:
        job = Job(
            source=sample_dtos[0].source, title=sample_dtos[0].title,
            company=sample_dtos[0].company, location=sample_dtos[0].location,
            url=sample_dtos[0].url, summary=sample_dtos[0].summary,
            is_easy_apply=sample_dtos[0].is_easy_apply,
            collected_at=datetime.now(timezone.utc), status="new",
        )
        session.add(job)
        session.commit()
        job_id = job.id

    with patch("services.job_service.Session", test_session_factory):
        from services import job_service
        updated = job_service.update_status(job_id, "skipped")

    assert updated.status == "skipped"


def test_update_status_returns_none_for_missing_id(test_session_factory):
    with patch("services.job_service.Session", test_session_factory):
        from services import job_service
        result = job_service.update_status(99999, "skipped")

    assert result is None


def test_apply_service_raises_not_implemented():
    from services.apply_service import apply_job
    import asyncio
    with pytest.raises(NotImplementedError, match="Phase 2"):
        asyncio.run(apply_job(job_id=1, mode="auto"))
