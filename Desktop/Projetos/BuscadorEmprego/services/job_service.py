"""
job_service — orchestrates the Indeed connector and the Job DB model.

This is the only layer that is allowed to:
- Import from connectors/
- Import from models/
- Import from db/

The api/ layer calls these functions; it never imports connectors directly.
"""
from __future__ import annotations

from datetime import datetime, timezone

from connectors.indeed import CaptchaError as CaptchaError, IndeedConnector  # CaptchaError re-exported for api/
from models.job import Job

# Session is imported lazily (inside each function) so that importing this
# module does NOT trigger db.database / config.py at collection time.
# Tests patch "services.job_service.Session" after the first function call
# causes the real import to populate the name in this module's namespace.
Session = None  # placeholder; overwritten on first use via _get_session


def _get_session():
    """Return the Session factory, importing it lazily on first call."""
    global Session
    if Session is None:
        from db.database import Session as _S
        Session = _S
    return Session


async def fetch_and_persist(search_url: str, max_results: int = 20) -> dict:
    """
    Scrape search_url via the Indeed connector, upsert results in SQLite,
    and return a summary dict.

    Raises:
        CaptchaError: propagated from the connector; the API layer maps it to HTTP 502.
    """
    from config import settings

    connector = IndeedConnector(context_path=settings.browser_context_path)
    dtos = await connector.fetch_jobs(search_url, max_results)  # may raise CaptchaError

    new_count = 0
    persisted: list[Job] = []

    SessionFactory = _get_session()
    with SessionFactory() as session:
        for dto in dtos:
            existing = session.query(Job).filter_by(url=dto.url).first()
            if existing:
                persisted.append(existing)
            else:
                job = Job(
                    source=dto.source,
                    title=dto.title,
                    company=dto.company,
                    location=dto.location,
                    url=dto.url,
                    summary=dto.summary,
                    is_easy_apply=dto.is_easy_apply,
                    collected_at=datetime.now(timezone.utc),
                    status="new",
                )
                session.add(job)
                session.flush()
                persisted.append(job)
                new_count += 1
        session.commit()
        for j in persisted:
            session.refresh(j)
        session.expunge_all()  # detach before session closes to avoid DetachedInstanceError

    return {"found": len(dtos), "new": new_count, "jobs": persisted}


def query_jobs(
    status: str | None = None,
    source: str | None = None,
    limit: int = 50,
) -> list[Job]:
    """Return jobs matching optional filters. limit is capped at 200."""
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
