import pytest
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker

from connectors.base import JobDTO
from models.job import Base
from models.profile import CandidateProfile, JobPreferences


# ---- In-memory test database ------------------------------------------ #

@pytest.fixture(scope="function")
def test_engine():
    engine = create_engine("sqlite:///:memory:", connect_args={"check_same_thread": False})
    Base.metadata.create_all(engine)
    yield engine
    Base.metadata.drop_all(engine)
    engine.dispose()


@pytest.fixture(scope="function")
def test_session_factory(test_engine):
    return sessionmaker(test_engine, autoflush=False, autocommit=False)


# ---- FastAPI test client (in-memory DB, no lifespan side-effects) -------- #

@pytest.fixture(scope="function")
def test_app(monkeypatch, tmp_path):
    db_url = f"sqlite:///{tmp_path / 'test_api.db'}"
    monkeypatch.setenv("INDEED_EMAIL", "t@t.com")
    monkeypatch.setenv("INDEED_PASSWORD", "x")
    monkeypatch.setenv("SERP_API_KEY", "test-key")
    monkeypatch.setenv("DATABASE_URL", db_url)
    monkeypatch.setenv("BROWSER_CONTEXT_PATH", str(tmp_path))
    monkeypatch.setenv("SCREENSHOT_DIR", str(tmp_path))
    monkeypatch.setenv("PROFILE_PATH", str(tmp_path / "profile.json"))

    import importlib, config, db.database
    importlib.reload(config)
    importlib.reload(db.database)

    from fastapi.testclient import TestClient
    from main import app
    with TestClient(app) as client:
        yield client


# ---- Sample DTOs --------------------------------------------------------- #

@pytest.fixture
def sample_dtos():
    return [
        JobDTO(
            source="indeed",
            title="Senior Product Manager",
            company="Acme",
            location="Remote, United States",
            url="https://www.indeed.com/job/1",
            summary="Great role for a product manager with AI experience.",
            is_easy_apply=True,
            salary_raw=None,
            salary_flagged=False,
        ),
        JobDTO(
            source="glassdoor",
            title="AI Delivery Manager",
            company="Beta",
            location="Remote, Canada",
            url="https://www.glassdoor.com/job/2",
            summary="Seeking an experienced delivery manager.",
            is_easy_apply=False,
            salary_raw="$6,000 a month",
            salary_flagged=False,
        ),
    ]


# ---- Sample CandidateProfile -------------------------------------------- #

@pytest.fixture
def sample_profile():
    prefs = JobPreferences(
        modality=["remote"],
        min_salary_brl=5000,
        usd_to_brl_rate=5.0,
        eur_to_brl_rate=6.0,
        salary_missing="include_flagged",
        sources_allowed=["indeed", "glassdoor", "remoteok", "weworkremotely", "wellfound"],
        locations_allowed=["remote", "united states", "canada"],
        languages_allowed=["english", "portuguese"],
        keywords_required=["product manager", "delivery manager", "ai developer"],
        keywords_blocked=["intern", "junior"],
        seniority_allowed=["mid", "senior", "lead"],
        apply_mode="auto",
        max_applications_per_day=10,
        max_results_per_run=50,
        search_queries=["product manager remote"],
    )
    return CandidateProfile(
        name="Test User",
        email="test@test.com",
        phone="+1234",
        location="Remote",
        skills=["product management", "agile", "ai"],
        cv_path="cv.pdf",
        answers={},
        linkedin_url="https://linkedin.com/in/test",
        portfolio_url=None,
        github_url=None,
        current_role="Product Manager",
        current_company="Acme",
        years_experience=5,
        desired_salary_brl=10000,
        preferences=prefs,
    )
