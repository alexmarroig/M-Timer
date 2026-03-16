import pytest
from pydantic import ValidationError


def test_job_status_enum_values():
    from models.job import JobStatus
    assert set(JobStatus) == {JobStatus.new, JobStatus.applied, JobStatus.skipped}


def test_job_schema_rejects_invalid_status():
    from models.job import JobSchema
    with pytest.raises(ValidationError):
        JobSchema(
            id=1, source="indeed", title="Dev", company="Co",
            location="SP", url="https://x.com", summary=None,
            is_easy_apply=False, collected_at="2026-01-01T00:00:00Z",
            status="invalid_value",
        )


def test_job_schema_accepts_valid_status():
    from models.job import JobSchema
    schema = JobSchema(
        id=1, source="indeed", title="Dev", company="Co",
        location="SP", url="https://x.com", summary=None,
        is_easy_apply=False, collected_at="2026-01-01T00:00:00Z",
        status="new",
    )
    assert schema.status == "new"


def test_job_schema_summary_optional():
    from models.job import JobSchema
    schema = JobSchema(
        id=1, source="indeed", title="Dev", company="Co",
        location="SP", url="https://x.com", summary=None,
        is_easy_apply=True, collected_at="2026-01-01T00:00:00Z",
        status="new",
    )
    assert schema.summary is None


def test_job_schema_roundtrip_from_orm():
    """JobSchema.model_validate works on a Job ORM instance (from_attributes=True)."""
    from datetime import datetime, timezone
    from models.job import Job, JobSchema

    job = Job()
    job.id = 42
    job.source = "indeed"
    job.title = "Engineer"
    job.company = "Corp"
    job.location = "SP"
    job.url = "https://www.indeed.com/job/42"
    job.summary = "Cool role"
    job.is_easy_apply = True
    job.collected_at = datetime(2026, 1, 1, tzinfo=timezone.utc)
    job.status = "new"

    schema = JobSchema.model_validate(job)
    assert schema.id == 42
    assert schema.status == "new"
    assert schema.is_easy_apply is True


def test_load_profile_returns_candidate_profile(tmp_path):
    import json
    from models.profile import CandidateProfile, load_profile

    data = {
        "name": "Fulano",
        "email": "f@example.com",
        "phone": "+55 11 99999",
        "location": "SP",
        "linkedin_url": "https://linkedin.com/in/fulano",
        "portfolio_url": None,
        "github_url": None,
        "current_role": "Engineer",
        "current_company": "Corp",
        "years_experience": 3,
        "skills": ["Python"],
        "cv_path": "/tmp/cv.pdf",
        "desired_salary_brl": 10000,
        "answers": {"Years of exp?": "3"},
        "preferences": {
            "modality": ["remote"],
            "min_salary_brl": 5000,
            "usd_to_brl_rate": 5.8,
            "eur_to_brl_rate": 6.3,
            "salary_missing": "include_flagged",
            "sources_allowed": ["indeed"],
            "locations_allowed": ["remote"],
            "languages_allowed": ["english"],
            "keywords_required": ["engineer"],
            "keywords_blocked": ["intern"],
            "seniority_allowed": ["senior"],
            "apply_mode": "auto",
            "max_applications_per_day": 10,
            "max_results_per_run": 20,
            "search_queries": ["engineer remote"],
        },
    }
    p = tmp_path / "profile.json"
    p.write_text(json.dumps(data))

    profile = load_profile(p)
    assert isinstance(profile, CandidateProfile)
    assert profile.name == "Fulano"
    assert profile.answers["Years of exp?"] == "3"


def test_load_profile_missing_file_raises():
    from pathlib import Path
    from models.profile import load_profile

    with pytest.raises(FileNotFoundError):
        load_profile(Path("/nonexistent/profile.json"))


def test_application_log_table_exists_in_metadata():
    from models.application_log import ApplicationLog
    from models.job import Base
    assert "application_logs" in Base.metadata.tables


def test_init_db_creates_tables(monkeypatch, tmp_path):
    db_path = tmp_path / "test.db"
    monkeypatch.setenv("INDEED_EMAIL", "t@t.com")
    monkeypatch.setenv("INDEED_PASSWORD", "x")
    monkeypatch.setenv("DATABASE_URL", f"sqlite:///{db_path}")
    monkeypatch.setenv("BROWSER_CONTEXT_PATH", str(tmp_path))
    monkeypatch.setenv("SCREENSHOT_DIR", str(tmp_path))
    monkeypatch.setenv("PROFILE_PATH", str(tmp_path / "profile.json"))

    import importlib
    import config
    import db.database
    importlib.reload(config)
    importlib.reload(db.database)

    from db.database import engine, init_db
    init_db()

    from sqlalchemy import inspect as sa_inspect
    inspector = sa_inspect(engine)
    tables = inspector.get_table_names()
    assert "jobs" in tables
    assert "application_logs" in tables
