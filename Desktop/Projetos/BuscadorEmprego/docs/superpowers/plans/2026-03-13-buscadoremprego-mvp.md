# BuscadorEmprego MVP v0 Implementation Plan

> **For agentic workers:** REQUIRED: Use superpowers:subagent-driven-development (if subagents available) or superpowers:executing-plans to implement this plan. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build MVP v0 of BuscadorEmprego — a FastAPI service that scrapes Indeed job listings via Playwright and persists results in SQLite, with all architectural hooks for Phase 2 (auto-apply) already in place.

**Architecture:** FastAPI routes delegate to services; services orchestrate connectors (Playwright) and the DB layer (SQLAlchemy sync); connectors return plain `JobDTO` Pydantic objects and never touch the ORM. SQLite via SQLAlchemy 2.x (sync sessions — sufficient for local, single-user tool). Each layer is strictly isolated: `connectors/` → DTOs only; `services/` → ORM + DB only; `api/` → HTTP only.

**Tech Stack:** Python 3.11+, FastAPI 0.110+, Playwright 1.43+ (Chromium), SQLAlchemy 2.x (sync), Pydantic v2, pydantic-settings v2, pytest + pytest-asyncio + httpx

---

## File Map

| File | Responsibility |
|---|---|
| `.gitignore` | Excludes `.env`, `profile.json`, `jobs.db`, `.browser_context/`, `screenshots/` |
| `.env.example` | Template for required env vars |
| `requirements.txt` | Pinned runtime deps |
| `requirements-dev.txt` | Pinned test/dev deps |
| `config.py` | Reads `.env` via pydantic-settings; resolves all paths to absolute using `pathlib.Path` |
| `models/job.py` | `Job` SQLAlchemy ORM model + `JobSchema` Pydantic response schema; `JobStatus` enum |
| `models/profile.py` | `CandidateProfile` dataclass; `load_profile(path)` function |
| `models/application_log.py` | `ApplicationLog` SQLAlchemy ORM model (schema-first; nothing writes to it in v0) |
| `db/database.py` | SQLite engine, `Session` factory (sessionmaker), `init_db()` (runs `create_all`) |
| `connectors/base.py` | `JobDTO` Pydantic model; `JobConnector` Protocol |
| `connectors/indeed.py` | `IndeedConnector` class; `CaptchaError`; private helpers `_find_first`, `_is_easy_apply`, `_parse_card` |
| `services/job_service.py` | `fetch_and_persist(search_url, max_results)`, `query_jobs(...)`, `update_status(job_id, status)` |
| `services/apply_service.py` | All public methods raise `NotImplementedError("Phase 2")` |
| `api/routes_jobs.py` | `POST /indeed/fetch_jobs`, `GET /jobs`, `PATCH /jobs/{id}/status` |
| `api/routes_apply.py` | `POST /apply/{job_id}`, `GET /applications` — both return HTTP 501 |
| `main.py` | FastAPI app creation, router registration, lifespan (calls `init_db`) |
| `profile.json` | Gitignored; personal data; populated by user |
| `tests/conftest.py` | Shared fixtures: test DB, test app client, mock connector |
| `tests/test_config.py` | Config loads and resolves paths correctly |
| `tests/test_models.py` | ORM creates tables; Pydantic schemas validate; enum enforcement |
| `tests/test_connectors.py` | `JobDTO` validation; `_find_first`; `_parse_card` via local HTML fixture |
| `tests/test_job_service.py` | `fetch_and_persist` with mocked connector; upsert; `query_jobs`; `update_status` |
| `tests/test_api.py` | All active endpoints; error cases; stub 501s |
| `tests/fixtures/indeed_listing.html` | Minimal HTML mimicking Indeed's DOM for offline connector tests |

---

## Chunk 1: Project Scaffold

### Task 1: Gitignore, env example, requirements

**Files:**
- Create: `.gitignore`
- Create: `.env.example`
- Create: `requirements.txt`
- Create: `requirements-dev.txt`

- [ ] **Step 1: Create `.gitignore`**

```
# secrets & personal data
.env
profile.json

# runtime artifacts
jobs.db
.browser_context/
screenshots/

# python
__pycache__/
*.py[cod]
*.egg-info/
dist/
.venv/
venv/

# IDE
.vscode/
.idea/
```

- [ ] **Step 2: Create `.env.example`**

```env
INDEED_EMAIL=you@example.com
INDEED_PASSWORD=yourpassword
BROWSER_CONTEXT_PATH=.browser_context
SCREENSHOT_DIR=screenshots
PROFILE_PATH=profile.json
DATABASE_URL=sqlite:///jobs.db
```

- [ ] **Step 3: Create `requirements.txt`**

```
fastapi>=0.110,<1
uvicorn[standard]>=0.29,<1
playwright>=1.43,<2
sqlalchemy>=2.0,<3
pydantic>=2.0,<3
pydantic-settings>=2.0,<3
python-dotenv>=1.0,<2
```

- [ ] **Step 4: Create `requirements-dev.txt`**

```
-r requirements.txt
pytest>=7.0,<9
pytest-asyncio>=0.23,<1
httpx>=0.27,<1
```

- [ ] **Step 5: Commit**

```bash
git add .gitignore .env.example requirements.txt requirements-dev.txt
git commit -m "chore: add project scaffold files"
```

---

### Task 2: Config module

**Files:**
- Create: `config.py`
- Create: `tests/test_config.py`

- [ ] **Step 1: Write the failing test**

Create `tests/__init__.py` (empty) and `tests/test_config.py`:

```python
import os
from pathlib import Path


def test_settings_resolves_paths_to_absolute(monkeypatch, tmp_path):
    monkeypatch.setenv("INDEED_EMAIL", "test@test.com")
    monkeypatch.setenv("INDEED_PASSWORD", "secret")
    monkeypatch.setenv("DATABASE_URL", "sqlite:///jobs.db")
    monkeypatch.setenv("BROWSER_CONTEXT_PATH", ".browser_context")
    monkeypatch.setenv("SCREENSHOT_DIR", "screenshots")
    monkeypatch.setenv("PROFILE_PATH", "profile.json")

    # Force reimport to pick up monkeypatched env
    import importlib
    import config
    importlib.reload(config)

    assert config.settings.browser_context_path.is_absolute()
    assert config.settings.screenshot_dir.is_absolute()
    assert config.settings.profile_path.is_absolute()


def test_database_url_uses_absolute_path(monkeypatch):
    monkeypatch.setenv("INDEED_EMAIL", "test@test.com")
    monkeypatch.setenv("INDEED_PASSWORD", "secret")
    monkeypatch.setenv("DATABASE_URL", "sqlite:///jobs.db")
    monkeypatch.setenv("BROWSER_CONTEXT_PATH", ".browser_context")
    monkeypatch.setenv("SCREENSHOT_DIR", "screenshots")
    monkeypatch.setenv("PROFILE_PATH", "profile.json")

    import importlib
    import config
    importlib.reload(config)

    # On Windows the URL looks like sqlite:///C:\abs\path\jobs.db (3 slashes + drive letter)
    # On POSIX it looks like sqlite:////abs/path/jobs.db (4 slashes)
    # Either way, the portion after sqlite:/// must be an absolute path.
    url = config.settings.database_url
    assert url.startswith("sqlite:///")
    db_path = Path(url[len("sqlite:///"):])
    assert db_path.is_absolute(), f"Expected absolute path in URL, got: {url}"
```

- [ ] **Step 2: Run test to verify it fails**

```bash
pytest tests/test_config.py -v
```

Expected: `ModuleNotFoundError: No module named 'config'`

- [ ] **Step 3: Create `config.py`**

```python
from pathlib import Path
from pydantic_settings import BaseSettings, SettingsConfigDict

_BASE = Path(__file__).parent


def _abs(p: str) -> Path:
    """Resolve a possibly-relative path to absolute, anchored at project root."""
    path = Path(p)
    return path if path.is_absolute() else (_BASE / path).resolve()


class Settings(BaseSettings):
    model_config = SettingsConfigDict(env_file=".env", env_file_encoding="utf-8")

    indeed_email: str
    indeed_password: str

    database_url: str = "sqlite:///jobs.db"
    browser_context_path: Path = Path(".browser_context")
    screenshot_dir: Path = Path("screenshots")
    profile_path: Path = Path("profile.json")

    def model_post_init(self, __context) -> None:
        # Resolve all paths to absolute so cwd never matters
        object.__setattr__(self, "browser_context_path", _abs(str(self.browser_context_path)))
        object.__setattr__(self, "screenshot_dir", _abs(str(self.screenshot_dir)))
        object.__setattr__(self, "profile_path", _abs(str(self.profile_path)))

        # Fix SQLite URL to use an absolute path.
        # sqlite:///relative.db → sqlite:///C:\abs\path\relative.db (Windows)
        #                       → sqlite:////abs/path/relative.db (POSIX)
        url = self.database_url
        if url.startswith("sqlite:///"):
            db_file = url[len("sqlite:///"):]
            db_path = Path(db_file)
            if not db_path.is_absolute():
                abs_db = (_BASE / db_file).resolve()
                object.__setattr__(self, "database_url", f"sqlite:///{abs_db}")


settings = Settings()
```

- [ ] **Step 4: Run tests to verify they pass**

```bash
pytest tests/test_config.py -v
```

Expected: 2 passed

- [ ] **Step 5: Commit**

```bash
git add config.py tests/__init__.py tests/test_config.py
git commit -m "feat: add config module with path resolution"
```

---

## Chunk 2: Models & Database

### Task 3: Job model

**Files:**
- Create: `models/__init__.py`
- Create: `models/job.py`
- Create: `tests/test_models.py`

- [ ] **Step 1: Write failing tests**

Create `tests/test_models.py`:

```python
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
```

- [ ] **Step 2: Run tests to verify they fail**

```bash
pytest tests/test_models.py -v
```

Expected: `ModuleNotFoundError: No module named 'models'`

- [ ] **Step 3: Create `models/__init__.py`** (empty)

- [ ] **Step 4: Create `models/job.py`**

```python
import enum
from datetime import datetime, timezone
from typing import Literal

from pydantic import BaseModel
from sqlalchemy import Boolean, DateTime, Enum, Integer, String, Text
from sqlalchemy.orm import DeclarativeBase, Mapped, mapped_column


class Base(DeclarativeBase):
    pass


class JobStatus(str, enum.Enum):
    new = "new"
    applied = "applied"
    skipped = "skipped"


class Job(Base):
    __tablename__ = "jobs"

    id: Mapped[int] = mapped_column(Integer, primary_key=True, autoincrement=True)
    source: Mapped[str] = mapped_column(String(50), nullable=False)
    title: Mapped[str] = mapped_column(String(255), nullable=False)
    company: Mapped[str] = mapped_column(String(255), nullable=False)
    location: Mapped[str] = mapped_column(String(255), nullable=False)
    url: Mapped[str] = mapped_column(String(2048), unique=True, nullable=False)
    summary: Mapped[str | None] = mapped_column(Text, nullable=True)
    is_easy_apply: Mapped[bool] = mapped_column(Boolean, default=False)
    collected_at: Mapped[datetime] = mapped_column(
        DateTime, nullable=False, default=lambda: datetime.now(timezone.utc)
    )
    status: Mapped[str] = mapped_column(
        Enum("new", "applied", "skipped", name="job_status"),
        default="new",
        nullable=False,
    )


# Pydantic response schema — decoupled from ORM
class JobSchema(BaseModel):
    model_config = {"from_attributes": True}

    id: int
    source: str
    title: str
    company: str
    location: str
    url: str
    summary: str | None
    is_easy_apply: bool
    collected_at: datetime
    status: Literal["new", "applied", "skipped"]
```

- [ ] **Step 5: Run tests**

```bash
pytest tests/test_models.py -v
```

Expected: 4 passed

- [ ] **Step 6: Commit**

```bash
git add models/__init__.py models/job.py tests/test_models.py
git commit -m "feat: add Job ORM model and Pydantic schema"
```

---

### Task 4: CandidateProfile model

**Files:**
- Create: `models/profile.py`
- Modify: `tests/test_models.py` (append)

- [ ] **Step 1: Append failing tests to `tests/test_models.py`**

```python
def test_load_profile_returns_candidate_profile(tmp_path):
    import json
    from models.profile import CandidateProfile, load_profile

    data = {
        "name": "Fulano",
        "email": "f@example.com",
        "phone": "+55 11 99999",
        "location": "SP",
        "roles": ["Engineer"],
        "skills": ["Python"],
        "cv_path": "/tmp/cv.pdf",
        "answers": {"Years of exp?": "3"},
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
```

- [ ] **Step 2: Run tests to verify they fail**

```bash
pytest tests/test_models.py::test_load_profile_returns_candidate_profile -v
```

Expected: `ImportError`

- [ ] **Step 3: Create `models/profile.py`**

```python
import json
from dataclasses import dataclass
from pathlib import Path


@dataclass
class CandidateProfile:
    name: str
    email: str
    phone: str
    location: str
    roles: list[str]
    skills: list[str]
    cv_path: str
    answers: dict[str, str]


def load_profile(path: Path) -> CandidateProfile:
    """Load CandidateProfile from a JSON file. Raises FileNotFoundError if missing."""
    if not path.exists():
        raise FileNotFoundError(f"Profile not found: {path}")
    data = json.loads(path.read_text(encoding="utf-8"))
    return CandidateProfile(**data)
```

- [ ] **Step 4: Run tests**

```bash
pytest tests/test_models.py -v
```

Expected: 6 passed

- [ ] **Step 5: Commit**

```bash
git add models/profile.py tests/test_models.py
git commit -m "feat: add CandidateProfile dataclass and load_profile"
```

---

### Task 5: ApplicationLog model (schema-first)

**Files:**
- Create: `models/application_log.py`

- [ ] **Step 1: Append failing test to `tests/test_models.py`**

```python
def test_application_log_table_exists_in_metadata():
    from models.application_log import ApplicationLog
    from models.job import Base
    assert "application_logs" in Base.metadata.tables
```

- [ ] **Step 2: Run test to verify it fails**

```bash
pytest tests/test_models.py::test_application_log_table_exists_in_metadata -v
```

Expected: `ImportError`

- [ ] **Step 3: Create `models/application_log.py`**

```python
"""
ApplicationLog — schema-first model.
Nothing writes to this table in MVP v0. It is created by init_db() so
Phase 2 can start writing to it without a migration.
"""
from datetime import datetime

from sqlalchemy import Boolean, DateTime, ForeignKey, Integer, String, Text
from sqlalchemy.orm import Mapped, mapped_column

from models.job import Base


class ApplicationLog(Base):
    __tablename__ = "application_logs"

    id: Mapped[int] = mapped_column(Integer, primary_key=True, autoincrement=True)
    job_id: Mapped[int] = mapped_column(Integer, ForeignKey("jobs.id"), nullable=False)
    applied_at: Mapped[datetime] = mapped_column(DateTime, nullable=False)
    mode: Mapped[str] = mapped_column(String(20), nullable=False)  # "auto" | "copilot"
    success: Mapped[bool] = mapped_column(Boolean, nullable=False)
    error_msg: Mapped[str | None] = mapped_column(Text, nullable=True)
    screenshot: Mapped[str | None] = mapped_column(Text, nullable=True)  # absolute path via pathlib
```

- [ ] **Step 4: Run tests**

```bash
pytest tests/test_models.py -v
```

Expected: 7 passed

- [ ] **Step 5: Commit**

```bash
git add models/application_log.py tests/test_models.py
git commit -m "feat: add ApplicationLog schema-first ORM model"
```

---

### Task 6: Database setup

**Files:**
- Create: `db/__init__.py`
- Create: `db/database.py`
- Append: `tests/test_models.py`

- [ ] **Step 1: Append failing test**

```python
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
```

- [ ] **Step 2: Run to verify failure**

```bash
pytest tests/test_models.py::test_init_db_creates_tables -v
```

Expected: `ModuleNotFoundError: No module named 'db'`

- [ ] **Step 3: Create `db/__init__.py`** (empty)

- [ ] **Step 4: Create `db/database.py`**

```python
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker

from config import settings

# Import ApplicationLog to register it in Base.metadata even though
# nothing writes to it in v0 — ensures create_all creates the table.
from models.application_log import ApplicationLog  # noqa: F401
from models.job import Base, Job  # noqa: F401

engine = create_engine(
    settings.database_url,
    connect_args={"check_same_thread": False},  # required for SQLite + threading
)

Session = sessionmaker(engine, autoflush=False, autocommit=False)


def init_db() -> None:
    """Create all tables. Safe to call multiple times (no-op if tables exist)."""
    Base.metadata.create_all(engine)
```

- [ ] **Step 5: Run all model tests**

```bash
pytest tests/test_models.py tests/test_config.py -v
```

Expected: all pass

- [ ] **Step 6: Commit**

```bash
git add db/__init__.py db/database.py tests/test_models.py
git commit -m "feat: add database engine, session factory, and init_db"
```

---

## Chunk 3: Connectors

### Task 7: JobDTO and Connector Protocol

**Files:**
- Create: `connectors/__init__.py`
- Create: `connectors/base.py`
- Create: `tests/test_connectors.py`

- [ ] **Step 1: Write failing tests**

Create `tests/test_connectors.py`:

```python
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
```

- [ ] **Step 2: Run tests to verify they fail**

```bash
pytest tests/test_connectors.py -v
```

Expected: `ImportError`

- [ ] **Step 3: Create `connectors/__init__.py`** (empty)

- [ ] **Step 4: Create `connectors/base.py`**

```python
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
```

- [ ] **Step 5: Run tests**

```bash
pytest tests/test_connectors.py -v
```

Expected: 4 passed

- [ ] **Step 6: Commit**

```bash
git add connectors/__init__.py connectors/base.py tests/test_connectors.py
git commit -m "feat: add JobDTO and JobConnector protocol"
```

---

### Task 8: Indeed connector

**Files:**
- Create: `connectors/indeed.py`
- Create: `tests/fixtures/indeed_listing.html`
- Append: `tests/test_connectors.py`

- [ ] **Step 1: Create the HTML fixture for offline DOM tests**

Create `tests/fixtures/indeed_listing.html`:

```html
<!DOCTYPE html>
<html>
<body>
  <div id="mosaic-provider-jobcards">

    <div data-testid="slider_item">
      <h2 class="jobTitle">
        <a href="/pagead/clk?job=abc123">Software Engineer</a>
      </h2>
      <span data-testid="company-name">Acme Corp</span>
      <div data-testid="text-location">São Paulo, SP</div>
      <div class="job-snippet">Work on amazing distributed systems</div>
      <div data-testid="indeedApply"></div>
    </div>

    <div data-testid="slider_item">
      <h2 class="jobTitle">
        <a href="/pagead/clk?job=def456">Backend Developer</a>
      </h2>
      <span data-testid="company-name">Beta Inc</span>
      <div data-testid="text-location">Remote</div>
      <div class="job-snippet">Build scalable APIs with Python</div>
      <!-- no indeedApply badge = is_easy_apply False -->
    </div>

  </div>
</body>
</html>
```

- [ ] **Step 2: Append connector tests**

Append to `tests/test_connectors.py`:

```python
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
```

- [ ] **Step 3: Run new tests to verify they fail**

```bash
pytest tests/test_connectors.py -k "parse_card or captcha" -v
```

Expected: `ImportError: cannot import name 'IndeedConnector'`

- [ ] **Step 4: Create `connectors/indeed.py`**

```python
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
```

- [ ] **Step 5: Run connector tests**

```bash
pytest tests/test_connectors.py -v
```

Expected: all pass (requires `playwright install chromium` to be done first)

> If Playwright is not installed yet, run: `pip install -r requirements-dev.txt && playwright install chromium`

- [ ] **Step 6: Commit**

```bash
git add connectors/indeed.py tests/test_connectors.py tests/fixtures/indeed_listing.html
git commit -m "feat: add IndeedConnector with Playwright scraping and offline tests"
```

---

## Chunk 4: Services

### Task 9: job_service

**Files:**
- Create: `services/__init__.py`
- Create: `services/job_service.py`
- Create: `tests/conftest.py`
- Create: `tests/test_job_service.py`

- [ ] **Step 1: Create `tests/conftest.py`**

This sets up a fresh in-memory SQLite DB and a mock connector for each test:

```python
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
```

- [ ] **Step 2: Create failing tests in `tests/test_job_service.py`**

```python
import pytest
from unittest.mock import AsyncMock, patch
from connectors.base import JobDTO


@pytest.mark.asyncio
async def test_fetch_and_persist_saves_new_jobs(test_session_factory, sample_dtos):
    with patch("services.job_service.Session", test_session_factory), \
         patch("services.job_service.IndeedConnector") as MockConnector:
        mock_instance = MockConnector.return_value
        mock_instance.fetch_jobs = AsyncMock(return_value=sample_dtos)

        from services import job_service
        result = await job_service.fetch_and_persist("https://www.indeed.com/jobs?q=dev", 20)

    assert result["found"] == 2
    assert result["new"] == 2
    assert len(result["jobs"]) == 2


@pytest.mark.asyncio
async def test_fetch_and_persist_upsert_preserves_status(test_session_factory, sample_dtos):
    """Running the same URL twice should not duplicate and must preserve existing status."""
    with patch("services.job_service.Session", test_session_factory), \
         patch("services.job_service.IndeedConnector") as MockConnector:
        mock_instance = MockConnector.return_value
        mock_instance.fetch_jobs = AsyncMock(return_value=sample_dtos)

        from services import job_service

        # First run
        await job_service.fetch_and_persist("https://www.indeed.com/jobs?q=dev", 20)

        # Manually mark the first job as "skipped"
        with test_session_factory() as session:
            from models.job import Job
            job = session.query(Job).filter_by(url=sample_dtos[0].url).first()
            job.status = "skipped"
            session.commit()

        # Second run with same DTOs
        result2 = await job_service.fetch_and_persist("https://www.indeed.com/jobs?q=dev", 20)

    assert result2["new"] == 0  # no new jobs
    assert result2["found"] == 2

    # Status preserved
    with test_session_factory() as session:
        from models.job import Job
        job = session.query(Job).filter_by(url=sample_dtos[0].url).first()
        assert job.status == "skipped"


def test_query_jobs_returns_all_by_default(test_session_factory, sample_dtos):
    from models.job import Job
    from datetime import datetime, timezone

    with test_session_factory() as session:
        for dto in sample_dtos:
            session.add(Job(
                source=dto.source, title=dto.title, company=dto.company,
                location=dto.location, url=dto.url, summary=dto.summary,
                is_easy_apply=dto.is_easy_apply,
                collected_at=datetime.now(timezone.utc), status="new",
            ))
        session.commit()

    with patch("services.job_service.Session", test_session_factory):
        from services import job_service
        jobs = job_service.query_jobs()

    assert len(jobs) == 2


def test_query_jobs_filters_by_status(test_session_factory, sample_dtos):
    from models.job import Job
    from datetime import datetime, timezone

    with test_session_factory() as session:
        for i, dto in enumerate(sample_dtos):
            status = "new" if i == 0 else "skipped"
            session.add(Job(
                source=dto.source, title=dto.title, company=dto.company,
                location=dto.location, url=dto.url, summary=dto.summary,
                is_easy_apply=dto.is_easy_apply,
                collected_at=datetime.now(timezone.utc), status=status,
            ))
        session.commit()

    with patch("services.job_service.Session", test_session_factory):
        from services import job_service
        new_jobs = job_service.query_jobs(status="new")

    assert len(new_jobs) == 1
    assert new_jobs[0].status == "new"


def test_update_status_changes_job(test_session_factory, sample_dtos):
    from models.job import Job
    from datetime import datetime, timezone

    with test_session_factory() as session:
        job = Job(
            source=sample_dtos[0].source, title=sample_dtos[0].title,
            company=sample_dtos[0].company, location=sample_dtos[0].location,
            url=sample_dtos[0].url, summary=sample_dtos[0].summary,
            is_easy_apply=sample_dtos[0].is_easy_apply,
            collected_at=datetime.now(timezone.utc), status="new",
        )
        session.add(job)
        session.commit()
        job_id = job.id

    with patch("services.job_service.Session", test_session_factory):
        from services import job_service
        updated = job_service.update_status(job_id, "skipped")

    assert updated.status == "skipped"


def test_update_status_returns_none_for_missing_id(test_session_factory):
    with patch("services.job_service.Session", test_session_factory):
        from services import job_service
        result = job_service.update_status(99999, "skipped")

    assert result is None
```

- [ ] **Step 3: Run tests to verify they fail**

```bash
pytest tests/test_job_service.py -v
```

Expected: `ImportError: No module named 'services'`

- [ ] **Step 4: Create `services/__init__.py`** (empty)

- [ ] **Step 5: Create `services/job_service.py`**

```python
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
from db.database import Session
from models.job import Job


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

    with Session() as session:
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
    with Session() as session:
        q = session.query(Job)
        if status:
            q = q.filter(Job.status == status)
        if source:
            q = q.filter(Job.source == source)
        jobs = q.limit(effective_limit).all()
        # Expire loaded objects so they can be used outside the session
        session.expunge_all()
        return jobs


def update_status(job_id: int, status: str) -> Job | None:
    """Update Job.status. Returns the updated Job, or None if not found."""
    with Session() as session:
        job = session.get(Job, job_id)
        if job is None:
            return None
        job.status = status
        session.commit()
        session.refresh(job)
        session.expunge(job)
        return job
```

- [ ] **Step 6: Run service tests**

```bash
pytest tests/test_job_service.py -v
```

Expected: all pass

- [ ] **Step 7: Commit**

```bash
git add services/__init__.py services/job_service.py tests/conftest.py tests/test_job_service.py
git commit -m "feat: add job_service with fetch_and_persist, query_jobs, update_status"
```

---

### Task 10: apply_service stub

**Files:**
- Create: `services/apply_service.py`

- [ ] **Step 1: Append test**

Append to `tests/test_job_service.py`:

```python
def test_apply_service_raises_not_implemented():
    import pytest
    from services.apply_service import apply_job

    with pytest.raises(NotImplementedError, match="Phase 2"):
        import asyncio
        asyncio.run(apply_job(job_id=1, mode="auto"))
```

- [ ] **Step 2: Create `services/apply_service.py`**

```python
"""
apply_service — Phase 2 stub.
All public methods raise NotImplementedError until Phase 2 is implemented.
"""


async def apply_job(job_id: int, mode: str) -> None:
    """Apply to a job. Implemented in Phase 2."""
    raise NotImplementedError("apply_job is not implemented — Phase 2")
```

- [ ] **Step 3: Run test**

```bash
pytest tests/test_job_service.py::test_apply_service_raises_not_implemented -v
```

Expected: pass

- [ ] **Step 4: Commit**

```bash
git add services/apply_service.py tests/test_job_service.py
git commit -m "feat: add apply_service stub (Phase 2 placeholder)"
```

---

## Chunk 5: API & Wiring

### Task 11: Job routes

**Files:**
- Create: `api/__init__.py`
- Create: `api/routes_jobs.py`
- Create: `tests/test_api.py`

- [ ] **Step 1: Create failing tests in `tests/test_api.py`**

```python
import pytest
from unittest.mock import AsyncMock, patch, MagicMock
from fastapi.testclient import TestClient
from datetime import datetime, timezone


def _make_job(id=1, status="new"):
    from models.job import Job
    j = Job()
    j.id = id
    j.source = "indeed"
    j.title = "Software Engineer"
    j.company = "Acme"
    j.location = "SP"
    j.url = f"https://www.indeed.com/job/{id}"
    j.summary = "Great role"
    j.is_easy_apply = True
    j.collected_at = datetime.now(timezone.utc)
    j.status = status
    return j


# ---- POST /indeed/fetch_jobs ----------------------------------------- #

def test_fetch_jobs_returns_200_with_jobs(test_app):
    jobs = [_make_job(1), _make_job(2)]
    with patch("services.job_service.fetch_and_persist", new=AsyncMock(
        return_value={"found": 2, "new": 2, "jobs": jobs}
    )):
        response = test_app.post("/indeed/fetch_jobs", json={
            "search_url": "https://www.indeed.com/jobs?q=dev",
            "max_results": 20,
        })
    assert response.status_code == 200
    data = response.json()
    assert data["found"] == 2
    assert data["new"] == 2
    assert len(data["jobs"]) == 2


def test_fetch_jobs_rejects_non_indeed_url(test_app):
    response = test_app.post("/indeed/fetch_jobs", json={
        "search_url": "https://www.google.com/search?q=dev",
    })
    assert response.status_code == 422


def test_fetch_jobs_returns_502_on_captcha(test_app):
    from connectors.indeed import CaptchaError
    with patch("services.job_service.fetch_and_persist", new=AsyncMock(
        side_effect=CaptchaError("https://www.indeed.com/jobs?q=dev")
    )):
        response = test_app.post("/indeed/fetch_jobs", json={
            "search_url": "https://www.indeed.com/jobs?q=dev",
        })
    assert response.status_code == 502
    assert "CAPTCHA" in response.json()["detail"]


# ---- GET /jobs --------------------------------------------------------- #

def test_get_jobs_returns_list(test_app):
    jobs = [_make_job(1), _make_job(2)]
    with patch("services.job_service.query_jobs", return_value=jobs):
        response = test_app.get("/jobs")
    assert response.status_code == 200
    assert len(response.json()) == 2


def test_get_jobs_filters_by_status(test_app):
    with patch("services.job_service.query_jobs", return_value=[]) as mock_q:
        test_app.get("/jobs?status=skipped&limit=10")
    mock_q.assert_called_once_with(status="skipped", source=None, limit=10)


# ---- PATCH /jobs/{id}/status ------------------------------------------ #

def test_patch_status_updates_job(test_app):
    job = _make_job(1, status="skipped")
    with patch("services.job_service.update_status", return_value=job):
        response = test_app.patch("/jobs/1/status", json={"status": "skipped"})
    assert response.status_code == 200
    assert response.json()["status"] == "skipped"


def test_patch_status_returns_404_when_not_found(test_app):
    with patch("services.job_service.update_status", return_value=None):
        response = test_app.patch("/jobs/999/status", json={"status": "skipped"})
    assert response.status_code == 404


def test_patch_status_rejects_invalid_value(test_app):
    response = test_app.patch("/jobs/1/status", json={"status": "garbage"})
    assert response.status_code == 422


# ---- Stub routes ------------------------------------------------------- #

def test_apply_route_returns_501(test_app):
    response = test_app.post("/apply/1", json={"mode": "auto"})
    assert response.status_code == 501


def test_applications_route_returns_501(test_app):
    response = test_app.get("/applications")
    assert response.status_code == 501
```

- [ ] **Step 2: Run tests to verify they fail**

```bash
pytest tests/test_api.py -v
```

Expected: `ImportError: No module named 'api'` or `No module named 'main'`

- [ ] **Step 3: Create `api/__init__.py`** (empty)

- [ ] **Step 4: Create `api/routes_jobs.py`**

```python
from typing import Literal

from fastapi import APIRouter, HTTPException
from pydantic import BaseModel, field_validator

from models.job import JobSchema
import services.job_service as job_service
# CaptchaError is imported from services (not connectors) to respect layer rules
from services.job_service import CaptchaError  # re-exported from service layer

router = APIRouter()


class FetchJobsRequest(BaseModel):
    search_url: str
    max_results: int = 20

    @field_validator("search_url")
    @classmethod
    def must_be_indeed(cls, v: str) -> str:
        if "indeed.com" not in v:
            raise ValueError("search_url must be an Indeed URL (must contain 'indeed.com')")
        return v


class FetchJobsResponse(BaseModel):
    found: int
    new: int
    jobs: list[JobSchema]


class StatusUpdate(BaseModel):
    status: Literal["new", "applied", "skipped"]


@router.post("/indeed/fetch_jobs", response_model=FetchJobsResponse)
async def fetch_jobs(body: FetchJobsRequest):
    try:
        result = await job_service.fetch_and_persist(body.search_url, body.max_results)
    except CaptchaError as e:
        raise HTTPException(
            status_code=502,
            detail=f"CAPTCHA encountered — open the browser in headed mode to solve manually. URL: {e.url}",
        )
    return FetchJobsResponse(
        found=result["found"],
        new=result["new"],
        jobs=[JobSchema.model_validate(j) for j in result["jobs"]],
    )


@router.get("/jobs", response_model=list[JobSchema])
def get_jobs(
    status: str | None = None,
    source: str | None = None,
    limit: int = 50,
):
    jobs = job_service.query_jobs(status=status, source=source, limit=limit)
    return [JobSchema.model_validate(j) for j in jobs]


@router.patch("/jobs/{job_id}/status", response_model=JobSchema)
def patch_job_status(job_id: int, body: StatusUpdate):
    job = job_service.update_status(job_id, body.status)
    if job is None:
        raise HTTPException(status_code=404, detail=f"Job {job_id} not found")
    return JobSchema.model_validate(job)
```

- [ ] **Step 5: Create `api/routes_apply.py`**

```python
from typing import Literal

from fastapi import APIRouter
from fastapi.responses import JSONResponse
from pydantic import BaseModel

router = APIRouter()

_NOT_IMPLEMENTED = JSONResponse(
    status_code=501,
    content={"detail": "Not implemented — Phase 2"},
)


class ApplyRequest(BaseModel):
    mode: Literal["auto", "copilot"]


@router.post("/apply/{job_id}")
async def apply_job(_job_id: int, _body: ApplyRequest):
    return _NOT_IMPLEMENTED


@router.get("/applications")
async def get_applications():
    return _NOT_IMPLEMENTED
```

- [ ] **Step 6: Create `main.py`**

```python
from contextlib import asynccontextmanager

from fastapi import FastAPI

from api.routes_apply import router as apply_router
from api.routes_jobs import router as jobs_router
from db.database import init_db


@asynccontextmanager
async def lifespan(app: FastAPI):
    init_db()
    yield


app = FastAPI(
    title="BuscadorEmprego",
    description="Auto job-application assistant — MVP v0 (collection only)",
    version="0.1.0",
    lifespan=lifespan,
)

app.include_router(jobs_router)
app.include_router(apply_router)
```

- [ ] **Step 7: Run all API tests**

```bash
pytest tests/test_api.py -v
```

Expected: all pass

- [ ] **Step 8: Run the full test suite**

```bash
pytest -v
```

Expected: all pass

- [ ] **Step 9: Commit**

```bash
git add api/__init__.py api/routes_jobs.py api/routes_apply.py main.py tests/test_api.py
git commit -m "feat: add FastAPI routes and wire up all layers"
```

---

### Task 12: profile.json example and smoke test

**Files:**
- Create: `profile.json.example` (committed, unlike `profile.json`)

- [ ] **Step 1: Create `profile.json.example`**

```json
{
  "name": "Fulano de Tal",
  "email": "fulano@example.com",
  "phone": "+55 11 99999-9999",
  "location": "São Paulo, SP, Brasil",
  "roles": ["Software Engineer", "AI Engineer"],
  "skills": ["Python", "TypeScript", "LLM", "Playwright"],
  "cv_path": "/absolute/path/to/cv.pdf",
  "answers": {
    "How many years of experience do you have?": "5",
    "Are you authorized to work in Brazil?": "Yes",
    "What is your expected salary?": "Aberto a negociar, dependendo do escopo"
  }
}
```

- [ ] **Step 2: Verify the server starts**

```bash
# Copy the example to profile.json and fill in real values first
cp profile.json.example profile.json
# Create .env from template
cp .env.example .env
# Edit .env with your Indeed credentials

uvicorn main:app --reload
```

Open `http://localhost:8000/docs` — you should see the FastAPI Swagger UI with all endpoints.

- [ ] **Step 3: Commit**

```bash
git add profile.json.example
git commit -m "docs: add profile.json.example with field reference"
```

---

## Setup Instructions (run once)

```bash
# 1. Create virtual environment
python -m venv .venv
.venv\Scripts\activate          # Windows

# 2. Install dependencies
pip install -r requirements-dev.txt

# 3. Install Playwright browser
playwright install chromium

# 4. Configure environment
cp .env.example .env
# Edit .env with your Indeed credentials

# 5. Set up profile
cp profile.json.example profile.json
# Edit profile.json with your data

# 6. Run tests
pytest -v

# 7. Start server
uvicorn main:app --reload
```

---

## Post-MVP Checklist (Phase 2 hooks already in place)

- [ ] `IndeedConnector.apply_job()` — implement form-filling flow
- [ ] `services/apply_service.py` — replace `NotImplementedError` with real logic
- [ ] `api/routes_apply.py` — replace 501 stubs with real handlers
- [ ] `ApplicationLog` — start writing audit records per submission
- [ ] Login flow — implement `_load_context` with email/password for fresh sessions
