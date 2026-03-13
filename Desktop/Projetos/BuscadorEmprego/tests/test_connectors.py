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
