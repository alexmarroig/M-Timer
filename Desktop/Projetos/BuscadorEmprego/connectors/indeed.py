"""
Indeed connector — scrapes job listings via Playwright.

Layer contract:
- Returns list[JobDTO] only. Never imports SQLAlchemy models.
- All Playwright logic stays here; nothing above this layer touches Playwright.
"""
from __future__ import annotations

from pathlib import Path
from typing import TYPE_CHECKING

from playwright.async_api import BrowserContext, ElementHandle, Page, async_playwright

from connectors.base import JobDTO

if TYPE_CHECKING:
    from models.application_log import ApplicationLog
    from models.profile import CandidateProfile

MAX_PAGES = 3
INDEED_BASE_URL = "https://www.indeed.com"
CAPTCHA_TITLES = {"just a moment", "verify you are human", "security check"}


class CaptchaError(Exception):
    """Raised when Indeed serves a CAPTCHA or bot-detection page."""

    def __init__(self, url: str) -> None:
        super().__init__(f"CAPTCHA or bot-detection page at: {url}")
        self.url = url


class IndeedConnector:
    """Implements the JobConnector protocol for Indeed."""

    def __init__(self, context_path: Path) -> None:
        self.context_path = Path(context_path)
        self._state_file = self.context_path / "state.json"

    async def fetch_jobs(self, search_url: str, max_results: int = 20) -> list[JobDTO]:
        """Open search_url, scrape up to max_results jobs, return DTOs."""
        async with async_playwright() as pw:
            browser = await pw.chromium.launch(headless=True)
            context = await self._load_context(browser)
            page = await context.new_page()
            try:
                return await self._scrape(page, search_url, max_results)
            finally:
                self.context_path.mkdir(parents=True, exist_ok=True)
                await context.storage_state(path=str(self._state_file))
                await context.close()
                await browser.close()

    async def apply_job(
        self,
        job_url: str,
        profile: "CandidateProfile",
        mode: str,
    ) -> "ApplicationLog":
        raise NotImplementedError("apply_job is implemented in Phase 2")

    # ------------------------------------------------------------------ #
    # Internal helpers                                                     #
    # ------------------------------------------------------------------ #

    async def _load_context(self, browser) -> BrowserContext:
        if self._state_file.exists():
            return await browser.new_context(storage_state=str(self._state_file))
        return await browser.new_context()

    async def _scrape(self, page: Page, search_url: str, max_results: int) -> list[JobDTO]:
        await page.goto(search_url, wait_until="domcontentloaded")
        await self._check_captcha(page, search_url)

        jobs: list[JobDTO] = []
        pages_visited = 0

        while len(jobs) < max_results and pages_visited < MAX_PAGES:
            cards = await page.query_selector_all(
                '#mosaic-provider-jobcards [data-testid="slider_item"], .job_seen_beacon'
            )
            for card in cards:
                if len(jobs) >= max_results:
                    break
                dto = await self._parse_card(card)
                if dto is not None:
                    jobs.append(dto)

            pages_visited += 1

            if len(jobs) >= max_results or pages_visited >= MAX_PAGES:
                break

            next_btn = await _find_first(page, '[data-testid="pagination-page-next"]')
            if next_btn is None:
                break

            await next_btn.click()
            await page.wait_for_timeout(1500)
            await self._check_captcha(page, search_url)

        return jobs

    async def _check_captcha(self, page: Page, url: str) -> None:
        """Raise CaptchaError if the page looks like a bot-detection gate."""
        title = (await page.title()).lower()
        if any(t in title for t in CAPTCHA_TITLES):
            raise CaptchaError(url)
        # If job cards are absent after 5 s, treat it as a block
        try:
            await page.wait_for_selector(
                '#mosaic-provider-jobcards [data-testid="slider_item"], .job_seen_beacon',
                timeout=5000,
            )
        except Exception:
            raise CaptchaError(url)

    async def _parse_card(self, card: ElementHandle) -> JobDTO | None:
        """Extract a JobDTO from a single job card element. Returns None on parse failure."""
        try:
            title_el = await card.query_selector("h2.jobTitle a")
            if title_el is None:
                return None

            company_el = await card.query_selector('[data-testid="company-name"]')
            location_el = await card.query_selector('[data-testid="text-location"]')
            summary_el = await card.query_selector(".job-snippet")

            title = (await title_el.inner_text()).strip()
            href = (await title_el.get_attribute("href")) or ""
            url = href if href.startswith("http") else f"{INDEED_BASE_URL}{href}"

            company = (await company_el.inner_text()).strip() if company_el else "Unknown"
            location = (await location_el.inner_text()).strip() if location_el else "Unknown"
            summary = (await summary_el.inner_text()).strip() if summary_el else None

            return JobDTO(
                source="indeed",
                title=title,
                company=company,
                location=location,
                url=url,
                summary=summary,
                is_easy_apply=await _is_easy_apply(card),
            )
        except Exception:
            return None


# ------------------------------------------------------------------ #
# Module-level helpers (pure functions, no self state)               #
# ------------------------------------------------------------------ #


async def _find_first(
    page_or_element,
    *selectors: str,
) -> ElementHandle | None:
    """Return the first element matching any of the given CSS selectors."""
    for selector in selectors:
        el = await page_or_element.query_selector(selector)
        if el is not None:
            return el
    return None


async def _is_easy_apply(card: ElementHandle) -> bool:
    """Detect Indeed Apply badge using three selectors in priority order."""
    el = await _find_first(
        card,
        '[data-testid="indeedApply"]',
        '.jobMetaDataGroup [class*="indeedApply"]',
    )
    if el is not None:
        return True
    # Text fallback
    text = (await card.inner_text()).lower()
    return "easily apply" in text
