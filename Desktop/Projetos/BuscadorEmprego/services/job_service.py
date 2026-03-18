"""
job_service — orchestrates discovery, filtering, and persistence.

This is the only layer allowed to import from connectors/, models/, and db/.
The api/ layer calls these functions; it never imports connectors directly.
"""
from __future__ import annotations

from datetime import datetime, timezone

from connectors.base import JobDTO
from connectors.serpapi import SerpAPIConnector, SerpAPIAuthError, SerpAPIQuotaError  # noqa: F401 re-exported
from models.job import Job

# Session is imported lazily so tests can patch it before the first real call.
Session = None


def _get_session():
    global Session
    if Session is None:
        from db.database import Session as _S
        Session = _S
    return Session


async def fetch_and_persist(profile) -> dict:
    """
    Discover jobs via SerpAPI, apply profile filters, compute skill match,
    upsert all results to SQLite, and return a summary dict.

    Returns:
        {"total_found": int, "approved": int, "skipped": int}
    """
    from config import settings
    from services.filter_service import apply_filters
    from services.skill_matcher import compute_match

    prefs = profile.preferences
    connector = SerpAPIConnector(api_key=settings.serp_api_key)

    all_dtos: list[JobDTO] = []
    num_per_query = max(1, prefs.max_results_per_run // max(1, len(prefs.search_queries)))
    for query in prefs.search_queries[:5]:
        dtos = await connector.fetch_jobs(query, num=num_per_query)
        all_dtos.extend(dtos)

    filter_result = apply_filters(all_dtos, prefs)

    SessionFactory = _get_session()
    with SessionFactory() as session:
        for dto in filter_result.approved:
            match_pct = compute_match(dto.summary, profile.skills)
            _upsert_job(session, dto, skill_match_pct=match_pct)

        for dto, reason in filter_result.rejected:
            _upsert_job(session, dto, status="skipped", filter_reason=reason)

        session.commit()

    return {
        "total_found": len(all_dtos),
        "approved": len(filter_result.approved),
        "skipped": len(filter_result.rejected),
    }


def _upsert_job(
    session,
    dto: JobDTO,
    *,
    status: str = "new",
    skill_match_pct: int | None = None,
    filter_reason: str | None = None,
) -> Job:
    """
    Insert or update a Job row by URL.

    Status transition rules:
    - New row → set to given status
    - Existing "applied" → never overwrite
    - Existing "skipped" + incoming "new" → update to "new" (allow retry)
    - Otherwise → update to given status
    """
    existing = session.query(Job).filter_by(url=dto.url).first()

    if existing is None:
        job = Job(
            source=dto.source,
            title=dto.title,
            company=dto.company,
            location=dto.location,
            url=dto.url,
            summary=dto.summary,
            is_easy_apply=dto.is_easy_apply,
            collected_at=datetime.now(timezone.utc),
            status=status,
            salary_raw=dto.salary_raw,
            salary_flagged=dto.salary_flagged,
            skill_match_pct=skill_match_pct,
            filter_reason=filter_reason,
        )
        session.add(job)
        session.flush()
        return job

    # Update metadata unconditionally
    existing.salary_raw = dto.salary_raw
    existing.salary_flagged = dto.salary_flagged
    existing.skill_match_pct = skill_match_pct
    existing.filter_reason = filter_reason

    # Status transitions
    if existing.status == "applied":
        pass  # never overwrite applied
    elif existing.status == "skipped" and status == "new":
        existing.status = "new"  # re-approved: allow retry
    else:
        existing.status = status

    return existing


def query_jobs(
    status: str | None = None,
    source: str | None = None,
    limit: int = 50,
) -> list[Job]:
    """Return jobs matching optional filters. Limit capped at 200."""
    effective_limit = min(limit, 200)
    SessionFactory = _get_session()
    with SessionFactory() as session:
        q = session.query(Job)
        if status:
            q = q.filter(Job.status == status)
        if source:
            q = q.filter(Job.source == source)
        jobs = q.limit(effective_limit).all()
        session.expunge_all()
        return jobs


def update_status(job_id: int, status: str) -> Job | None:
    """Update Job.status. Returns the updated Job, or None if not found."""
    SessionFactory = _get_session()
    with SessionFactory() as session:
        job = session.get(Job, job_id)
        if job is None:
            return None
        job.status = status
        session.commit()
        session.refresh(job)
        session.expunge(job)
        return job
