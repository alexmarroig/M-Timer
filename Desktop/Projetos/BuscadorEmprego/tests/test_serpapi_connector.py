"""
Tests for SerpAPIConnector.
All tests are offline — they inject a mock JSON response, no HTTP calls.
"""
import pytest
from unittest.mock import AsyncMock, patch


def _serpapi_response(via: str = "via Indeed", salary: str | None = "$5,000 a month") -> dict:
    job = {
        "title": "Senior Product Manager",
        "company_name": "TechCorp",
        "location": "Remote, United States",
        "via": via,
        "description": "Looking for a product manager with AI experience.",
        "apply_options": [{"link": "https://www.indeed.com/job/abc123"}],
    }
    if salary:
        job["detected_extensions"] = {"salary": salary}
    return {"jobs_results": [job]}


@pytest.mark.parametrize("via,expected_source", [
    ("via Indeed", "indeed"),
    ("via Glassdoor", "glassdoor"),
    ("via Remote OK", "remoteok"),
    ("via We Work Remotely", "weworkremotely"),
    ("via Wellfound", "wellfound"),
    ("via AngelList", "wellfound"),
    ("via LinkedIn", "other"),
    ("via Some Random Board", "other"),
])
@pytest.mark.asyncio
async def test_source_detection(via, expected_source):
    from connectors.serpapi import SerpAPIConnector
    connector = SerpAPIConnector(api_key="test-key")
    response = _serpapi_response(via=via)

    with patch.object(connector, "_get", AsyncMock(return_value=response)):
        dtos = await connector.fetch_jobs("product manager remote", num=1)

    assert len(dtos) == 1
    assert dtos[0].source == expected_source


@pytest.mark.asyncio
async def test_dto_title_company_location_mapped():
    from connectors.serpapi import SerpAPIConnector
    connector = SerpAPIConnector(api_key="test-key")

    with patch.object(connector, "_get", AsyncMock(return_value=_serpapi_response())):
        dtos = await connector.fetch_jobs("q", num=1)

    dto = dtos[0]
    assert dto.title == "Senior Product Manager"
    assert dto.company == "TechCorp"
    assert dto.location == "Remote, United States"


@pytest.mark.asyncio
async def test_dto_url_from_apply_options():
    from connectors.serpapi import SerpAPIConnector
    connector = SerpAPIConnector(api_key="test-key")

    with patch.object(connector, "_get", AsyncMock(return_value=_serpapi_response())):
        dtos = await connector.fetch_jobs("q", num=1)

    assert dtos[0].url == "https://www.indeed.com/job/abc123"


@pytest.mark.asyncio
async def test_dto_salary_raw_populated():
    from connectors.serpapi import SerpAPIConnector
    connector = SerpAPIConnector(api_key="test-key")

    with patch.object(connector, "_get", AsyncMock(return_value=_serpapi_response(salary="$5,000 a month"))):
        dtos = await connector.fetch_jobs("q", num=1)

    assert dtos[0].salary_raw == "$5,000 a month"


@pytest.mark.asyncio
async def test_dto_salary_raw_none_when_absent():
    from connectors.serpapi import SerpAPIConnector
    connector = SerpAPIConnector(api_key="test-key")

    with patch.object(connector, "_get", AsyncMock(return_value=_serpapi_response(salary=None))):
        dtos = await connector.fetch_jobs("q", num=1)

    assert dtos[0].salary_raw is None


@pytest.mark.asyncio
async def test_empty_jobs_results_returns_empty_list():
    from connectors.serpapi import SerpAPIConnector
    connector = SerpAPIConnector(api_key="test-key")

    with patch.object(connector, "_get", AsyncMock(return_value={"jobs_results": []})):
        dtos = await connector.fetch_jobs("q", num=10)

    assert dtos == []


@pytest.mark.asyncio
async def test_missing_apply_options_skips_job():
    from connectors.serpapi import SerpAPIConnector
    connector = SerpAPIConnector(api_key="test-key")
    response = {
        "jobs_results": [{
            "title": "PM", "company_name": "Co", "location": "Remote",
            "via": "via Indeed", "description": "desc",
        }]
    }
    with patch.object(connector, "_get", AsyncMock(return_value=response)):
        dtos = await connector.fetch_jobs("q", num=1)

    assert dtos == []
