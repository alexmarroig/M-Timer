"""
SerpAPI connector — discovers job listings via Google Jobs (SerpAPI).

Layer contract:
- Returns list[JobDTO] only. Never imports SQLAlchemy models.
- Does NOT implement JobConnector Protocol (query-based, not URL-based).
- Used directly by job_service, not via Protocol dispatch.
"""
from __future__ import annotations

import httpx

from connectors.base import JobDTO

SERPAPI_URL = "https://serpapi.com/search.json"

# Map SerpAPI `via` field substrings → our source identifiers
_SOURCE_MAP: list[tuple[str, str]] = [
    ("Indeed", "indeed"),
    ("Glassdoor", "glassdoor"),
    ("Remote OK", "remoteok"),
    ("We Work Remotely", "weworkremotely"),
    ("Wellfound", "wellfound"),
    ("AngelList", "wellfound"),
]


class SerpAPIQuotaError(Exception):
    """Raised when SerpAPI returns HTTP 429 (quota exceeded)."""


class SerpAPIAuthError(Exception):
    """Raised when SerpAPI returns HTTP 401 (invalid API key)."""


class SerpAPIConnector:
    """Fetches job listings from Google Jobs via the SerpAPI REST API."""

    def __init__(self, api_key: str) -> None:
        self.api_key = api_key

    async def fetch_jobs(self, query: str, num: int = 10) -> list[JobDTO]:
        """Query Google Jobs for `query` and return up to `num` JobDTOs."""
        response = await self._get({"engine": "google_jobs", "q": query, "num": num})
        dtos: list[JobDTO] = []
        for item in response.get("jobs_results", []):
            dto = self._parse_item(item)
            if dto is not None:
                dtos.append(dto)
        return dtos

    async def _get(self, params: dict) -> dict:
        """Make a GET request to SerpAPI. Raises on auth/quota errors."""
        async with httpx.AsyncClient(timeout=30) as client:
            resp = await client.get(
                SERPAPI_URL,
                params={**params, "api_key": self.api_key},
            )
        if resp.status_code == 401:
            raise SerpAPIAuthError("Invalid SerpAPI key")
        if resp.status_code == 429:
            raise SerpAPIQuotaError("SerpAPI quota exceeded")
        resp.raise_for_status()
        return resp.json()

    def _parse_item(self, item: dict) -> JobDTO | None:
        """Map a single Google Jobs result to a JobDTO. Returns None if URL missing."""
        url = self._extract_url(item)
        if not url:
            return None

        via = item.get("via", "")
        source = self._detect_source(via)
        salary_raw = item.get("detected_extensions", {}).get("salary")

        return JobDTO(
            source=source,
            title=item.get("title", "").strip(),
            company=item.get("company_name", "Unknown").strip(),
            location=item.get("location", "Unknown").strip(),
            url=url,
            summary=item.get("description") or None,
            is_easy_apply=False,
            salary_raw=salary_raw or None,
            salary_flagged=False,
        )

    @staticmethod
    def _extract_url(item: dict) -> str | None:
        """Return the best available apply URL, or None if not found."""
        apply_options = item.get("apply_options", [])
        if apply_options and apply_options[0].get("link"):
            return apply_options[0]["link"]
        return None

    @staticmethod
    def _detect_source(via: str) -> str:
        """Map the SerpAPI `via` string to our internal source identifier."""
        for substring, source_id in _SOURCE_MAP:
            if substring.lower() in via.lower():
                return source_id
        return "other"
