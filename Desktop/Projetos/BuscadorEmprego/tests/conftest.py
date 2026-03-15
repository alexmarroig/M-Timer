import pytest
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker

from connectors.base import JobDTO
from models.job import Base


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
    """
    Returns a FastAPI TestClient with lifespan wired to a temp SQLite DB.
    Patches db.database so the app never touches the real jobs.db.
    """
    db_url = f"sqlite:///{tmp_path / 'test_api.db'}"
    monkeypatch.setenv("INDEED_EMAIL", "t@t.com")
    monkeypatch.setenv("INDEED_PASSWORD", "x")
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
            title="Software Engineer",
            company="Acme",
            location="SP",
            url="https://www.indeed.com/job/1",
            summary="Great role",
            is_easy_apply=True,
        ),
        JobDTO(
            source="indeed",
            title="Backend Dev",
            company="Beta",
            location="Remote",
            url="https://www.indeed.com/job/2",
            summary=None,
            is_easy_apply=False,
        ),
    ]
