import pytest
from pydantic import ValidationError


def test_job_dto_requires_mandatory_fields():
    from connectors.base import JobDTO
    with pytest.raises(ValidationError):
        JobDTO()  # all fields required


def test_job_dto_is_easy_apply_defaults_false():
    from connectors.base import JobDTO
    dto = JobDTO(
        source="indeed",
        title="Dev",
        company="Co",
        location="SP",
        url="https://indeed.com/job/1",
        summary=None,
        is_easy_apply=False,
    )
    assert dto.is_easy_apply is False


def test_job_dto_summary_optional():
    from connectors.base import JobDTO
    dto = JobDTO(
        source="indeed", title="Dev", company="Co",
        location="SP", url="https://indeed.com/job/1",
        summary=None, is_easy_apply=True,
    )
    assert dto.summary is None


def test_job_connector_protocol_has_required_methods():
    """Verify JobConnector Protocol defines fetch_jobs and apply_job."""
    from connectors.base import JobConnector
    import inspect
    members = {name for name, _ in inspect.getmembers(JobConnector)}
    assert "fetch_jobs" in members
    assert "apply_job" in members


import pytest
from pathlib import Path

FIXTURE_HTML = Path(__file__).parent / "fixtures" / "indeed_listing.html"


@pytest.mark.asyncio
async def test_parse_card_extracts_title_company_location(tmp_path):
    from playwright.async_api import async_playwright
    from connectors.indeed import IndeedConnector

    async with async_playwright() as pw:
        browser = await pw.chromium.launch(headless=True)
        page = await browser.new_page()
        await page.goto(FIXTURE_HTML.as_uri())

        connector = IndeedConnector(context_path=tmp_path)
        cards = await page.query_selector_all('[data-testid="slider_item"]')
        assert len(cards) == 2

        dto = await connector._parse_card(cards[0])
        assert dto is not None
        assert dto.title == "Software Engineer"
        assert dto.company == "Acme Corp"
        assert dto.location == "São Paulo, SP"
        assert dto.summary == "Work on amazing distributed systems"
        assert dto.source == "indeed"

        await browser.close()


@pytest.mark.asyncio
async def test_parse_card_detects_easy_apply(tmp_path):
    from playwright.async_api import async_playwright
    from connectors.indeed import IndeedConnector

    async with async_playwright() as pw:
        browser = await pw.chromium.launch(headless=True)
        page = await browser.new_page()
        await page.goto(FIXTURE_HTML.as_uri())

        connector = IndeedConnector(context_path=tmp_path)
        cards = await page.query_selector_all('[data-testid="slider_item"]')

        dto_easy = await connector._parse_card(cards[0])
        dto_normal = await connector._parse_card(cards[1])

        assert dto_easy.is_easy_apply is True
        assert dto_normal.is_easy_apply is False

        await browser.close()


@pytest.mark.asyncio
async def test_parse_card_normalizes_relative_url(tmp_path):
    from playwright.async_api import async_playwright
    from connectors.indeed import IndeedConnector

    async with async_playwright() as pw:
        browser = await pw.chromium.launch(headless=True)
        page = await browser.new_page()
        await page.goto(FIXTURE_HTML.as_uri())

        connector = IndeedConnector(context_path=tmp_path)
        cards = await page.query_selector_all('[data-testid="slider_item"]')
        dto = await connector._parse_card(cards[0])

        assert dto.url.startswith("https://www.indeed.com")

        await browser.close()


@pytest.mark.asyncio
async def test_captcha_error_raised_on_bad_page(tmp_path):
    from playwright.async_api import async_playwright
    from connectors.indeed import IndeedConnector, CaptchaError

    async with async_playwright() as pw:
        browser = await pw.chromium.launch(headless=True)
        page = await browser.new_page()
        # Empty page — no job cards, simulates a blocked/CAPTCHA page
        await page.set_content("<html><head><title>Just a moment</title></head><body></body></html>")

        connector = IndeedConnector(context_path=tmp_path)
        with pytest.raises(CaptchaError):
            await connector._check_captcha(page, "https://www.indeed.com/jobs?q=test")

        await browser.close()
