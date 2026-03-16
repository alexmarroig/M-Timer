from typing import TYPE_CHECKING, Protocol, runtime_checkable

from pydantic import BaseModel

if TYPE_CHECKING:
    from models.application_log import ApplicationLog
    from models.profile import CandidateProfile


class JobDTO(BaseModel):
    """Data Transfer Object returned by connectors. No SQLAlchemy dependency."""

    source: str
    title: str
    company: str
    location: str
    url: str
    summary: str | None
    is_easy_apply: bool
    salary_raw: str | None = None       # raw salary string from source
    salary_flagged: bool = False         # True when salary absent or unparseable


@runtime_checkable
class JobConnector(Protocol):
    async def fetch_jobs(self, search_url: str, max_results: int) -> list[JobDTO]:
        """Scrape job listings from search_url and return up to max_results DTOs."""
        ...

    async def apply_job(
        self,
        job_url: str,
        profile: "CandidateProfile",
        mode: str,
    ) -> "ApplicationLog":
        """Apply to job_url using profile data. Phase 2."""
        ...
