import pytest
from unittest.mock import AsyncMock, patch
from connectors.base import JobDTO


@pytest.mark.asyncio
async def test_fetch_and_persist_saves_new_jobs(test_session_factory, sample_dtos):
    with patch("services.job_service.Session", test_session_factory), \
         patch("services.job_service.IndeedConnector") as MockConnector:
        mock_instance = MockConnector.return_value
        mock_instance.fetch_jobs = AsyncMock(return_value=sample_dtos)

        from services import job_service
        result = await job_service.fetch_and_persist("https://www.indeed.com/jobs?q=dev", 20)

    assert result["found"] == 2
    assert result["new"] == 2
    assert len(result["jobs"]) == 2


@pytest.mark.asyncio
async def test_fetch_and_persist_upsert_preserves_status(test_session_factory, sample_dtos):
    """Running the same URL twice should not duplicate and must preserve existing status."""
    with patch("services.job_service.Session", test_session_factory), \
         patch("services.job_service.IndeedConnector") as MockConnector:
        mock_instance = MockConnector.return_value
        mock_instance.fetch_jobs = AsyncMock(return_value=sample_dtos)

        from services import job_service

        # First run
        await job_service.fetch_and_persist("https://www.indeed.com/jobs?q=dev", 20)

        # Manually mark the first job as "skipped"
        with test_session_factory() as session:
            from models.job import Job
            job = session.query(Job).filter_by(url=sample_dtos[0].url).first()
            job.status = "skipped"
            session.commit()

        # Second run with same DTOs
        result2 = await job_service.fetch_and_persist("https://www.indeed.com/jobs?q=dev", 20)

    assert result2["new"] == 0  # no new jobs
    assert result2["found"] == 2

    # Status preserved
    with test_session_factory() as session:
        from models.job import Job
        job = session.query(Job).filter_by(url=sample_dtos[0].url).first()
        assert job.status == "skipped"


def test_query_jobs_returns_all_by_default(test_session_factory, sample_dtos):
    from models.job import Job
    from datetime import datetime, timezone

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
    from datetime import datetime, timezone

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
    from datetime import datetime, timezone

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
    import pytest
    from services.apply_service import apply_job

    with pytest.raises(NotImplementedError, match="Phase 2"):
        import asyncio
        asyncio.run(apply_job(job_id=1, mode="auto"))
