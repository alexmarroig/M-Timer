# Job Filter & Matching System Implementation Plan

> **For agentic workers:** REQUIRED: Use superpowers:subagent-driven-development (if subagents available) or superpowers:executing-plans to implement this plan. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add multi-source job discovery via SerpAPI, rule-based filtering against candidate preferences, and skill-match scoring — replacing the Indeed-only scraper with a reliable, profile-driven pipeline.

**Architecture:** `SerpAPIConnector` queries Google Jobs and returns `list[JobDTO]`; `filter_service.apply_filters()` applies 7 sequential rules (source, modality, keywords, salary, location, language) against `JobPreferences`; `skill_matcher.compute_match()` scores approved DTOs; `job_service.fetch_and_persist(profile)` orchestrates the full pipeline and upserts results to SQLite.

**Tech Stack:** Python 3.11, FastAPI, SQLAlchemy 2.x (sync), Pydantic v2, httpx (async HTTP), langdetect, SerpAPI Google Jobs endpoint.

**Spec:** `docs/superpowers/specs/2026-03-15-job-filter-matching-design.md`

---

## Chunk 1: Foundation — Config, Profile, Data Models

### Task 1: Update `requirements.txt` and `config.py`

**Files:**
- Modify: `requirements.txt`
- Modify: `config.py`
- Modify: `tests/test_config.py` (read first to understand existing tests)

- [ ] **Step 1: Read existing test_config.py**

```bash
cat tests/test_config.py
```

- [ ] **Step 2: Write failing tests for new config fields**

Add to `tests/test_config.py`:

```python
def test_serp_api_key_has_default(monkeypatch):
    """serp_api_key must default to empty string (not required)."""
    monkeypatch.delenv("SERP_API_KEY", raising=False)
    monkeypatch.delenv("INDEED_EMAIL", raising=False)
    monkeypatch.delenv("INDEED_PASSWORD", raising=False)
    import importlib, config
    importlib.reload(config)
    assert config.settings.serp_api_key == ""

def test_indeed_credentials_optional(monkeypatch):
    """indeed_email and indeed_password must not raise when absent."""
    monkeypatch.delenv("INDEED_EMAIL", raising=False)
    monkeypatch.delenv("INDEED_PASSWORD", raising=False)
    import importlib, config
    importlib.reload(config)
    assert config.settings.indeed_email == ""
    assert config.settings.indeed_password == ""
```

- [ ] **Step 3: Run tests to verify they fail**

```bash
cd C:/Users/gaming/Desktop/Projetos/BuscadorEmprego
python -m pytest tests/test_config.py -v -k "serp_api or indeed_credentials"
```

Expected: FAIL — `ValidationError` (fields required) or `AttributeError`.

- [ ] **Step 4: Update `requirements.txt`**

Add two lines at the end of `requirements.txt`:

```
langdetect>=1.0.9
httpx>=0.27.0
```

- [ ] **Step 5: Update `config.py`**

Replace the three `indeed_email`, `indeed_password` lines and add `serp_api_key`:

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

    # Credentials — optional so tests and CI work without .env
    indeed_email: str = ""
    indeed_password: str = ""
    serp_api_key: str = ""

    database_url: str = "sqlite:///jobs.db"
    browser_context_path: Path = Path(".browser_context")
    screenshot_dir: Path = Path("screenshots")
    profile_path: Path = Path("profile.json")

    def model_post_init(self, __context) -> None:
        object.__setattr__(self, "browser_context_path", _abs(str(self.browser_context_path)))
        object.__setattr__(self, "screenshot_dir", _abs(str(self.screenshot_dir)))
        object.__setattr__(self, "profile_path", _abs(str(self.profile_path)))

        url = self.database_url
        if url.startswith("sqlite:///"):
            db_file = url[len("sqlite:///"):]
            db_path = Path(db_file)
            if not db_path.is_absolute():
                abs_db = (_BASE / db_file).resolve()
                object.__setattr__(self, "database_url", f"sqlite:///{abs_db}")


settings = Settings()
```

- [ ] **Step 6: Install new dependencies**

```bash
pip install langdetect httpx
```

- [ ] **Step 7: Run tests to verify they pass**

```bash
python -m pytest tests/test_config.py -v
```

Expected: All PASS.

- [ ] **Step 8: Run full test suite to confirm nothing broke**

```bash
python -m pytest tests/ -v
```

Expected: All existing tests still pass.

- [ ] **Step 9: Commit**

```bash
git add requirements.txt config.py tests/test_config.py
git commit -m "feat: make indeed credentials optional, add serp_api_key and httpx/langdetect deps"
```

---

### Task 2: Update `models/profile.py` — `JobPreferences` + `CandidateProfile`

**Files:**
- Modify: `models/profile.py`
- Create: `tests/test_profile.py`

- [ ] **Step 1: Write failing tests**

Create `tests/test_profile.py`:

```python
import json
import pytest
from pathlib import Path


def _write_profile(tmp_path: Path, data: dict) -> Path:
    p = tmp_path / "profile.json"
    p.write_text(json.dumps(data), encoding="utf-8")
    return p


MINIMAL_PREFS = {
    "modality": ["remote"],
    "min_salary_brl": 20000,
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
}

FULL_PROFILE = {
    "name": "Test User",
    "email": "test@test.com",
    "phone": "+55 11 99999-9999",
    "location": "São Paulo, Brazil",
    "skills": ["python", "sql"],
    "cv_path": "cv.pdf",
    "answers": {"key": "value"},
    "linkedin_url": "https://linkedin.com/in/test",
    "portfolio_url": "https://mysite.com",
    "github_url": "https://github.com/test",
    "current_role": "Engineer",
    "current_company": "Acme",
    "years_experience": 5,
    "desired_salary_brl": 15000,
    "preferences": MINIMAL_PREFS,
}


def test_load_profile_returns_candidate_profile(tmp_path):
    from models.profile import CandidateProfile, load_profile
    p = _write_profile(tmp_path, FULL_PROFILE)
    profile = load_profile(p)
    assert isinstance(profile, CandidateProfile)
    assert profile.name == "Test User"
    assert profile.email == "test@test.com"
    assert profile.years_experience == 5


def test_load_profile_nested_preferences(tmp_path):
    from models.profile import JobPreferences, load_profile
    p = _write_profile(tmp_path, FULL_PROFILE)
    profile = load_profile(p)
    assert isinstance(profile.preferences, JobPreferences)
    assert profile.preferences.min_salary_brl == 20000
    assert profile.preferences.apply_mode == "auto"
    assert profile.preferences.sources_allowed == ["indeed"]


def test_load_profile_optional_fields_none(tmp_path):
    """portfolio_url and github_url can be omitted (default None) or explicit null."""
    data = {**FULL_PROFILE, "portfolio_url": None, "github_url": None}
    p = _write_profile(tmp_path, data)
    profile = load_profile(p)
    assert profile.portfolio_url is None
    assert profile.github_url is None


def test_load_profile_file_not_found():
    from models.profile import load_profile
    with pytest.raises(FileNotFoundError):
        load_profile(Path("/nonexistent/profile.json"))


def test_job_preferences_all_fields_accessible(tmp_path):
    from models.profile import load_profile
    p = _write_profile(tmp_path, FULL_PROFILE)
    prefs = load_profile(p).preferences
    assert prefs.modality == ["remote"]
    assert prefs.usd_to_brl_rate == 5.8
    assert prefs.eur_to_brl_rate == 6.3
    assert prefs.salary_missing == "include_flagged"
    assert prefs.keywords_required == ["engineer"]
    assert prefs.keywords_blocked == ["intern"]
    assert prefs.seniority_allowed == ["senior"]
    assert prefs.max_applications_per_day == 10
    assert prefs.search_queries == ["engineer remote"]


def test_profile_has_no_roles_field(tmp_path):
    """roles field was removed; loading a profile without it should work."""
    data = {k: v for k, v in FULL_PROFILE.items() if k != "roles"}
    p = _write_profile(tmp_path, data)
    from models.profile import load_profile
    profile = load_profile(p)
    assert not hasattr(profile, "roles")
```

- [ ] **Step 2: Run tests to verify they fail**

```bash
python -m pytest tests/test_profile.py -v
```

Expected: FAIL — `CandidateProfile` doesn't have new fields yet.

- [ ] **Step 3: Replace `models/profile.py`**

```python
import json
from dataclasses import dataclass
from pathlib import Path


@dataclass
class JobPreferences:
    modality: list[str]
    min_salary_brl: float
    usd_to_brl_rate: float
    eur_to_brl_rate: float
    salary_missing: str                 # "include_flagged" | "skip"
    sources_allowed: list[str]
    locations_allowed: list[str]
    languages_allowed: list[str]
    keywords_required: list[str]
    keywords_blocked: list[str]
    seniority_allowed: list[str]
    apply_mode: str                     # "auto" | "review" | "off"
    max_applications_per_day: int
    max_results_per_run: int
    search_queries: list[str]


@dataclass
class CandidateProfile:
    # Core identity
    name: str
    email: str
    phone: str
    location: str
    # Professional
    linkedin_url: str
    portfolio_url: str | None
    github_url: str | None
    current_role: str
    current_company: str
    years_experience: int
    # Application assets
    cv_path: str
    desired_salary_brl: float
    skills: list[str]
    answers: dict[str, str]
    # Filtering preferences
    preferences: JobPreferences


def load_profile(path: Path) -> CandidateProfile:
    """Load CandidateProfile from a JSON file. Raises FileNotFoundError if missing."""
    if not path.exists():
        raise FileNotFoundError(f"Profile not found: {path}")
    data = json.loads(path.read_text(encoding="utf-8"))
    data["preferences"] = JobPreferences(**data["preferences"])
    return CandidateProfile(**data)
```

- [ ] **Step 4: Run tests to verify they pass**

```bash
python -m pytest tests/test_profile.py -v
```

Expected: All PASS.

- [ ] **Step 5: Run full test suite**

```bash
python -m pytest tests/ -v
```

Expected: All existing tests still pass. (`test_models.py` uses `CandidateProfile` indirectly; if it imports `load_profile`, it may need an update — fix any failures before committing.)

- [ ] **Step 6: Commit**

```bash
git add models/profile.py tests/test_profile.py
git commit -m "feat: add JobPreferences dataclass and update CandidateProfile with new fields"
```

---

### Task 3: Update `connectors/base.py` (JobDTO) and `models/job.py` (ORM + Schema)

**Files:**
- Modify: `connectors/base.py`
- Modify: `models/job.py`

No new test files needed — existing `test_connectors.py` and `test_models.py` cover these; we extend them.

- [ ] **Step 1: Write failing tests for new JobDTO fields**

Add to `tests/test_connectors.py` (append at end):

```python
def test_job_dto_salary_raw_defaults_none():
    from connectors.base import JobDTO
    dto = JobDTO(
        source="indeed", title="Dev", company="Co",
        location="Remote", url="https://indeed.com/job/1",
        summary=None, is_easy_apply=False,
    )
    assert dto.salary_raw is None
    assert dto.salary_flagged is False


def test_job_dto_salary_fields_accepted():
    from connectors.base import JobDTO
    dto = JobDTO(
        source="indeed", title="Dev", company="Co",
        location="Remote", url="https://indeed.com/job/1",
        summary="Good role", is_easy_apply=True,
        salary_raw="$5,000 a month",
        salary_flagged=False,
    )
    assert dto.salary_raw == "$5,000 a month"
    assert dto.salary_flagged is False
```

- [ ] **Step 2: Write failing tests for new Job ORM columns**

Add to `tests/test_models.py` (append at end):

```python
def test_job_has_salary_columns(test_engine):
    from sqlalchemy import inspect as sa_inspect
    from models.job import Job
    inspector = sa_inspect(test_engine)
    cols = {c["name"] for c in inspector.get_columns("jobs")}
    assert "salary_raw" in cols
    assert "salary_flagged" in cols
    assert "skill_match_pct" in cols
    assert "filter_reason" in cols


def test_job_schema_includes_new_fields():
    from models.job import JobSchema
    schema = JobSchema(
        id=1, source="indeed", title="Dev", company="Co",
        location="Remote", url="https://x.com", summary=None,
        is_easy_apply=False, collected_at="2026-01-01T00:00:00Z",
        status="new",
        salary_raw="$5k/month",
        salary_flagged=True,
        skill_match_pct=75,
        filter_reason=None,
    )
    assert schema.salary_raw == "$5k/month"
    assert schema.salary_flagged is True
    assert schema.skill_match_pct == 75
    assert schema.filter_reason is None


def test_job_schema_new_fields_default_to_none_false():
    """Existing JobSchema creation without new fields should still work."""
    from models.job import JobSchema
    schema = JobSchema(
        id=1, source="indeed", title="Dev", company="Co",
        location="Remote", url="https://x.com", summary=None,
        is_easy_apply=False, collected_at="2026-01-01T00:00:00Z",
        status="new",
    )
    assert schema.salary_raw is None
    assert schema.salary_flagged is False
    assert schema.skill_match_pct is None
    assert schema.filter_reason is None
```

- [ ] **Step 3: Run tests to verify they fail**

```bash
python -m pytest tests/test_connectors.py::test_job_dto_salary_raw_defaults_none tests/test_models.py::test_job_has_salary_columns -v
```

Expected: FAIL.

- [ ] **Step 4: Update `connectors/base.py`**

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
```

- [ ] **Step 5: Update `models/job.py`**

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
    # Filter & match metadata
    salary_raw: Mapped[str | None] = mapped_column(Text, nullable=True)
    salary_flagged: Mapped[bool] = mapped_column(Boolean, nullable=False, default=False)
    skill_match_pct: Mapped[int | None] = mapped_column(Integer, nullable=True)
    filter_reason: Mapped[str | None] = mapped_column(String(255), nullable=True)


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
    salary_raw: str | None = None
    salary_flagged: bool = False
    skill_match_pct: int | None = None
    filter_reason: str | None = None
```

- [ ] **Step 6: Run tests to verify they pass**

```bash
python -m pytest tests/test_connectors.py tests/test_models.py -v
```

Expected: All PASS (including new and existing tests).

- [ ] **Step 7: Run full test suite**

```bash
python -m pytest tests/ -v
```

Expected: All pass. Note: `test_models.py::test_job_has_salary_columns` uses `test_engine` fixture — confirm the in-memory DB is recreated fresh per test.

- [ ] **Step 8: Commit**

```bash
git add connectors/base.py models/job.py tests/test_connectors.py tests/test_models.py
git commit -m "feat: add salary_raw/salary_flagged to JobDTO and 4 new columns to Job ORM+Schema"
```

---

## Chunk 2: Filter Service and Skill Matcher

### Task 4: Create `services/filter_service.py`

**Files:**
- Create: `services/filter_service.py`
- Create: `tests/test_filter_service.py`

- [ ] **Step 1: Write ALL failing tests first**

Create `tests/test_filter_service.py`:

```python
"""Tests for services/filter_service.py — pure filter rules, no DB, no I/O."""
import pytest
from langdetect.detector_factory import DetectorFactory

from connectors.base import JobDTO
from models.profile import JobPreferences

# Seed langdetect at module level for deterministic results in all tests
DetectorFactory.seed = 0


# ------------------------------------------------------------------ #
# Fixtures                                                            #
# ------------------------------------------------------------------ #

@pytest.fixture
def prefs():
    return JobPreferences(
        modality=["remote"],
        min_salary_brl=20000,
        usd_to_brl_rate=5.0,
        eur_to_brl_rate=6.0,
        salary_missing="include_flagged",
        sources_allowed=["indeed", "glassdoor", "remoteok", "weworkremotely", "wellfound"],
        locations_allowed=["remote", "united states", "canada", "united kingdom"],
        languages_allowed=["english", "portuguese"],
        keywords_required=["product manager", "project manager", "ai developer", "delivery manager"],
        keywords_blocked=["junior", "intern", "on-site", "presencial"],
        seniority_allowed=["mid", "senior", "lead"],
        apply_mode="auto",
        max_applications_per_day=10,
        max_results_per_run=20,
        search_queries=["product manager remote"],
    )


def _dto(**overrides) -> JobDTO:
    """Build a passing JobDTO with sensible defaults; override any field."""
    defaults = dict(
        source="indeed",
        title="Senior Product Manager",
        company="TechCorp",
        location="Remote, United States",
        url="https://indeed.com/job/1",
        summary="Looking for a product manager with AI experience.",
        is_easy_apply=True,
        salary_raw="$5,000 a month",
        salary_flagged=False,
    )
    return JobDTO(**{**defaults, **overrides})


# ------------------------------------------------------------------ #
# check_source                                                        #
# ------------------------------------------------------------------ #

def test_check_source_allowed(prefs):
    from services.filter_service import apply_filters
    result = apply_filters([_dto(source="indeed")], prefs)
    assert len(result.approved) == 1


def test_check_source_blocked(prefs):
    from services.filter_service import apply_filters
    result = apply_filters([_dto(source="linkedin")], prefs)
    assert len(result.rejected) == 1
    assert "source" in result.rejected[0][1]


# ------------------------------------------------------------------ #
# check_modality                                                      #
# ------------------------------------------------------------------ #

def test_check_modality_remote_in_location(prefs):
    from services.filter_service import apply_filters
    result = apply_filters([_dto(location="Remote, United States")], prefs)
    assert len(result.approved) == 1


def test_check_modality_remote_in_title(prefs):
    from services.filter_service import apply_filters
    result = apply_filters([_dto(title="Remote Product Manager", location="Anywhere")], prefs)
    assert len(result.approved) == 1


def test_check_modality_remoto_portuguese(prefs):
    from services.filter_service import apply_filters
    result = apply_filters([_dto(location="Remoto, Brasil")], prefs)
    assert len(result.approved) == 1


def test_check_modality_no_remote_fails(prefs):
    from services.filter_service import apply_filters
    result = apply_filters([_dto(location="New York, NY", title="Product Manager")], prefs)
    assert len(result.rejected) == 1
    assert "modality" in result.rejected[0][1]


# ------------------------------------------------------------------ #
# check_blocked_keywords                                              #
# ------------------------------------------------------------------ #

def test_check_blocked_keyword_in_title(prefs):
    from services.filter_service import apply_filters
    result = apply_filters([_dto(title="Junior Product Manager Remote")], prefs)
    assert len(result.rejected) == 1
    assert "junior" in result.rejected[0][1]


def test_check_blocked_keyword_case_insensitive(prefs):
    from services.filter_service import apply_filters
    result = apply_filters([_dto(title="INTERN Product Manager Remote")], prefs)
    assert len(result.rejected) == 1


def test_check_blocked_keyword_in_summary(prefs):
    from services.filter_service import apply_filters
    result = apply_filters([_dto(summary="This is an internship position.")], prefs)
    # "intern" matches "internship" as substring — confirm rejection
    assert len(result.rejected) == 1


def test_check_blocked_keyword_none_summary_is_fine(prefs):
    """summary=None should not crash; only title and location are checked."""
    from services.filter_service import apply_filters
    result = apply_filters([_dto(summary=None)], prefs)
    assert len(result.approved) == 1


def test_check_blocked_keyword_none_present(prefs):
    from services.filter_service import apply_filters
    result = apply_filters([_dto(title="Senior Product Manager", summary="AI experience required.")], prefs)
    assert len(result.approved) == 1


# ------------------------------------------------------------------ #
# check_required_keywords                                             #
# ------------------------------------------------------------------ #

def test_check_required_keyword_in_title(prefs):
    from services.filter_service import apply_filters
    result = apply_filters([_dto(title="Remote AI Developer")], prefs)
    assert len(result.approved) == 1


def test_check_required_keyword_in_summary(prefs):
    from services.filter_service import apply_filters
    result = apply_filters([_dto(title="Remote Tech Lead", summary="We need a delivery manager.")], prefs)
    assert len(result.approved) == 1


def test_check_required_keyword_case_insensitive(prefs):
    from services.filter_service import apply_filters
    result = apply_filters([_dto(title="Remote PRODUCT MANAGER")], prefs)
    assert len(result.approved) == 1


def test_check_required_keyword_none_match(prefs):
    from services.filter_service import apply_filters
    result = apply_filters([_dto(title="Remote Data Entry Clerk", summary="Type fast.")], prefs)
    assert len(result.rejected) == 1
    assert "keyword" in result.rejected[0][1]


# ------------------------------------------------------------------ #
# check_location                                                      #
# ------------------------------------------------------------------ #

def test_check_location_passes_for_remote(prefs):
    """Remote jobs pass location check regardless of specific city."""
    from services.filter_service import apply_filters
    result = apply_filters([_dto(location="Remote - Work from Anywhere")], prefs)
    assert len(result.approved) == 1


def test_check_location_allowed_country(prefs):
    """Non-remote job in allowed country should pass."""
    from services.filter_service import apply_filters
    # Force non-remote by using a title without "remote" and location without "remote"
    # but with an allowed country; however modality would fail first.
    # To test check_location independently: call the internal function
    from services.filter_service import _check_location
    dto = _dto(location="London, United Kingdom", title="Product Manager")
    ok, _ = _check_location(dto, prefs)
    assert ok is True


def test_check_location_disallowed_country(prefs):
    from services.filter_service import _check_location
    dto = _dto(location="Mumbai, India", title="Product Manager")
    ok, reason = _check_location(dto, prefs)
    assert ok is False
    assert "location" in reason


# ------------------------------------------------------------------ #
# check_salary                                                        #
# ------------------------------------------------------------------ #

def test_check_salary_usd_above_min(prefs):
    """$5000/month * 5.0 = R$25,000 > R$20,000 → pass."""
    from services.filter_service import apply_filters
    result = apply_filters([_dto(salary_raw="$5,000 a month")], prefs)
    assert len(result.approved) == 1


def test_check_salary_usd_below_min(prefs):
    """$1000/month * 5.0 = R$5,000 < R$20,000 → reject."""
    from services.filter_service import apply_filters
    result = apply_filters([_dto(salary_raw="$1,000 a month")], prefs)
    assert len(result.rejected) == 1
    assert "salary" in result.rejected[0][1]


def test_check_salary_eur_conversion(prefs):
    """€4000/month * 6.0 = R$24,000 > R$20,000 → pass."""
    from services.filter_service import apply_filters
    result = apply_filters([_dto(salary_raw="€4,000/month")], prefs)
    assert len(result.approved) == 1


def test_check_salary_brl_above_min(prefs):
    from services.filter_service import apply_filters
    result = apply_filters([_dto(salary_raw="R$25,000 por mês")], prefs)
    assert len(result.approved) == 1


def test_check_salary_k_notation(prefs):
    """$80k/year / 12 * 5.0 = R$33,333/month > R$20,000 → pass."""
    from services.filter_service import apply_filters
    result = apply_filters([_dto(salary_raw="$80k a year")], prefs)
    assert len(result.approved) == 1


def test_check_salary_annual_low_rejected(prefs):
    """$30,000/year / 12 * 5.0 = R$12,500/month < R$20,000 → reject."""
    from services.filter_service import apply_filters
    result = apply_filters([_dto(salary_raw="$30,000 a year")], prefs)
    assert len(result.rejected) == 1
    assert "salary" in result.rejected[0][1]


def test_check_salary_annual_high_approved(prefs):
    """$100,000/year / 12 * 5.0 = R$41,667/month > R$20,000 → pass."""
    from services.filter_service import apply_filters
    result = apply_filters([_dto(salary_raw="$100,000 a year")], prefs)
    assert len(result.approved) == 1


def test_check_salary_missing_include_flagged(prefs):
    """salary_raw=None with policy=include_flagged → pass, dto.salary_flagged=True."""
    from services.filter_service import apply_filters
    dto = _dto(salary_raw=None)
    result = apply_filters([dto], prefs)
    assert len(result.approved) == 1
    assert result.approved[0].salary_flagged is True


def test_check_salary_missing_skip_policy(prefs):
    """salary_raw=None with policy=skip → reject."""
    from services.filter_service import apply_filters
    skip_prefs = JobPreferences(
        **{**prefs.__dict__, "salary_missing": "skip"}
    )
    result = apply_filters([_dto(salary_raw=None)], skip_prefs)
    assert len(result.rejected) == 1


# ------------------------------------------------------------------ #
# check_language                                                      #
# ------------------------------------------------------------------ #

def test_check_language_english_passes(prefs):
    from services.filter_service import apply_filters
    result = apply_filters([_dto(summary="This is a software role requiring product management skills.")], prefs)
    assert len(result.approved) == 1


def test_check_language_none_summary_passes(prefs):
    from services.filter_service import apply_filters
    result = apply_filters([_dto(summary=None)], prefs)
    assert len(result.approved) == 1


def test_check_language_unsupported_fails(prefs):
    """Japanese text should not pass English/Portuguese filter."""
    from services.filter_service import apply_filters
    # Long enough Japanese text for langdetect to work reliably
    jp_summary = "この仕事はプロダクトマネージャーを募集しています。経験者優遇。フルリモート可能です。給与は高め。"
    result = apply_filters([_dto(summary=jp_summary)], prefs)
    assert len(result.rejected) == 1


# ------------------------------------------------------------------ #
# apply_filters integration                                           #
# ------------------------------------------------------------------ #

def test_apply_filters_empty_list(prefs):
    from services.filter_service import apply_filters
    result = apply_filters([], prefs)
    assert result.approved == []
    assert result.rejected == []


def test_apply_filters_mixed_results(prefs):
    from services.filter_service import apply_filters
    good = _dto()
    bad = _dto(source="linkedin")
    result = apply_filters([good, bad], prefs)
    assert len(result.approved) == 1
    assert len(result.rejected) == 1


def test_apply_filters_rejection_reason_not_empty(prefs):
    from services.filter_service import apply_filters
    result = apply_filters([_dto(source="linkedin")], prefs)
    assert result.rejected[0][1] != ""
```

- [ ] **Step 2: Run tests to verify they fail**

```bash
python -m pytest tests/test_filter_service.py -v
```

Expected: ImportError or multiple FAILs — `filter_service` doesn't exist yet.

- [ ] **Step 3: Create `services/filter_service.py`**

```python
"""
filter_service — rule-based job filtering.

Pure functions only: no I/O, no DB, no Playwright.
Receives list[JobDTO] + JobPreferences, returns FilterResult.
"""
from __future__ import annotations

import re
from dataclasses import dataclass

from langdetect import LangDetectException, detect
from langdetect.detector_factory import DetectorFactory

from connectors.base import JobDTO
from models.profile import JobPreferences

# Seed langdetect for reproducibility
DetectorFactory.seed = 0

# Portuguese equivalents for modality values
_MODALITY_PT: dict[str, str] = {
    "remote": "remoto",
    "hybrid": "híbrido",
    "on-site": "presencial",
}

# Map profile language names → langdetect language codes
_LANG_CODES: dict[str, list[str]] = {
    "english": ["en"],
    "portuguese": ["pt"],
    "spanish": ["es"],
    "french": ["fr"],
    "german": ["de"],
}


@dataclass
class FilterResult:
    approved: list[JobDTO]
    rejected: list[tuple[JobDTO, str]]  # (dto, reason)


def apply_filters(dtos: list[JobDTO], prefs: JobPreferences) -> FilterResult:
    """Run all filter rules against each DTO in order. First failure rejects."""
    approved: list[JobDTO] = []
    rejected: list[tuple[JobDTO, str]] = []

    _rules = [
        _check_source,
        _check_modality,
        _check_blocked_keywords,
        _check_required_keywords,
        _check_location,
        _check_salary,
        _check_language,
    ]

    for dto in dtos:
        reject_reason: str | None = None
        for rule in _rules:
            ok, msg = rule(dto, prefs)
            if not ok:
                reject_reason = msg
                break
        if reject_reason is None:
            approved.append(dto)
        else:
            rejected.append((dto, reject_reason))

    return FilterResult(approved=approved, rejected=rejected)


# ------------------------------------------------------------------ #
# Individual rule functions: (dto, prefs) -> (passed: bool, reason)  #
# ------------------------------------------------------------------ #

def _check_source(dto: JobDTO, prefs: JobPreferences) -> tuple[bool, str]:
    if dto.source in prefs.sources_allowed:
        return True, ""
    return False, f"source '{dto.source}' not in sources_allowed"


def _check_modality(dto: JobDTO, prefs: JobPreferences) -> tuple[bool, str]:
    text = f"{dto.location} {dto.title}".lower()
    for mode in prefs.modality:
        if mode.lower() in text:
            return True, ""
        pt_equiv = _MODALITY_PT.get(mode.lower(), "")
        if pt_equiv and pt_equiv.lower() in text:
            return True, ""
    return False, f"modality {prefs.modality} not found in location/title"


def _check_blocked_keywords(dto: JobDTO, prefs: JobPreferences) -> tuple[bool, str]:
    text = " ".join(filter(None, [dto.title, dto.summary, dto.location])).lower()
    for kw in prefs.keywords_blocked:
        if kw.lower() in text:
            return False, f"blocked keyword '{kw}' found"
    return True, ""


def _check_required_keywords(dto: JobDTO, prefs: JobPreferences) -> tuple[bool, str]:
    text = " ".join(filter(None, [dto.title, dto.summary])).lower()
    for kw in prefs.keywords_required:
        if kw.lower() in text:
            return True, ""
    return False, "no required keyword found in title/summary"


def _check_location(dto: JobDTO, prefs: JobPreferences) -> tuple[bool, str]:
    # Remote jobs are location-agnostic once modality is confirmed
    mod_ok, _ = _check_modality(dto, prefs)
    if mod_ok:
        return True, ""
    loc = dto.location.lower()
    for allowed in prefs.locations_allowed:
        if allowed.lower() in loc:
            return True, ""
    return False, f"location '{dto.location}' not in locations_allowed"


def _check_salary(dto: JobDTO, prefs: JobPreferences) -> tuple[bool, str]:
    amount_brl, flagged = _parse_salary_brl(dto.salary_raw, prefs)
    # Pydantic v2 models are mutable by default (not frozen). This intentional
    # mutation enriches the DTO with flagged status for persistence downstream.
    # The test `test_check_salary_missing_include_flagged` validates this behavior.
    dto.salary_flagged = flagged

    if flagged:
        if prefs.salary_missing == "skip":
            return False, "salary absent/unparseable and salary_missing=skip"
        return True, ""  # include_flagged: pass but flagged

    if amount_brl is not None and amount_brl < prefs.min_salary_brl:
        return False, (
            f"salary {amount_brl:.0f} BRL below minimum {prefs.min_salary_brl:.0f} BRL"
        )
    return True, ""


def _check_language(dto: JobDTO, prefs: JobPreferences) -> tuple[bool, str]:
    if dto.summary is None:
        return True, ""
    try:
        lang = detect(dto.summary)
        allowed_codes: list[str] = []
        for lang_name in prefs.languages_allowed:
            allowed_codes.extend(_LANG_CODES.get(lang_name.lower(), []))
        if any(lang == c or lang.startswith(c + "-") for c in allowed_codes):
            return True, ""
        return False, f"detected language '{lang}' not in {prefs.languages_allowed}"
    except LangDetectException:
        return True, ""  # default pass on detection failure


# ------------------------------------------------------------------ #
# Internal helpers                                                    #
# ------------------------------------------------------------------ #

def _parse_salary_brl(
    salary_raw: str | None, prefs: JobPreferences
) -> tuple[float | None, bool]:
    """Parse salary_raw to BRL float. Returns (amount_brl, flagged)."""
    if not salary_raw:
        return None, True

    text = salary_raw.strip()
    text_lower = text.lower()

    # Detect currency symbol
    if "R$" in text or "BRL" in text.upper():
        rate = 1.0
    elif "$" in text or "USD" in text.upper():
        rate = prefs.usd_to_brl_rate
    elif "€" in text or "EUR" in text.upper():
        rate = prefs.eur_to_brl_rate
    else:
        return None, True  # unknown currency

    # Detect pay period — normalize everything to monthly
    if any(p in text_lower for p in ["year", "/yr", "yr ", "annual", "per year", "a year"]):
        period_divisor = 12.0
    elif any(p in text_lower for p in ["week", "/wk", "per week", "a week"]):
        period_divisor = 4.33  # avg weeks per month
    else:
        period_divisor = 1.0  # assume monthly

    # Extract numeric values — handles "80k", "80,000", "80.5"
    nums = re.findall(r"[\d,]+(?:\.\d+)?[kK]?", text)

    def to_float(s: str) -> float:
        s = s.replace(",", "")
        if s.lower().endswith("k"):
            return float(s[:-1]) * 1000
        return float(s)

    try:
        values = [to_float(n) for n in nums if n]
        if not values:
            return None, True
        # Take lower bound of any range (e.g. "$80k–$120k" → $80k), then normalize to monthly
        amount_monthly = (min(values) * rate) / period_divisor
        return amount_monthly, False
    except (ValueError, ZeroDivisionError):
        return None, True
```

- [ ] **Step 4: Run tests to verify they pass**

```bash
python -m pytest tests/test_filter_service.py -v
```

Expected: All PASS. If `test_check_language_unsupported_fails` is flaky (langdetect non-deterministic), verify `DetectorFactory.seed = 0` is set at the top of the test module.

- [ ] **Step 5: Run full test suite**

```bash
python -m pytest tests/ -v
```

Expected: All pass.

- [ ] **Step 6: Commit**

```bash
git add services/filter_service.py tests/test_filter_service.py
git commit -m "feat: add filter_service with 7 rule-based filters and FilterResult"
```

---

### Task 5: Create `services/skill_matcher.py`

**Files:**
- Create: `services/skill_matcher.py`
- Create: `tests/test_skill_matcher.py`

- [ ] **Step 1: Write failing tests**

Create `tests/test_skill_matcher.py`:

```python
"""Tests for services/skill_matcher.py — pure skill match scoring."""


def test_compute_match_100_pct():
    from services.skill_matcher import compute_match
    skills = ["python", "sql", "agile"]
    summary = "We need someone with python, sql and agile experience."
    assert compute_match(summary, skills) == 100


def test_compute_match_50_pct():
    from services.skill_matcher import compute_match
    skills = ["python", "java"]
    summary = "Strong python skills required."
    assert compute_match(summary, skills) == 50


def test_compute_match_0_pct():
    from services.skill_matcher import compute_match
    skills = ["python", "sql"]
    summary = "Must know Ruby and PHP."
    assert compute_match(summary, skills) == 0


def test_compute_match_none_summary_returns_0():
    from services.skill_matcher import compute_match
    assert compute_match(None, ["python", "sql"]) == 0


def test_compute_match_empty_skills_returns_0():
    from services.skill_matcher import compute_match
    assert compute_match("python and sql required", []) == 0


def test_compute_match_case_insensitive():
    from services.skill_matcher import compute_match
    skills = ["Python", "SQL"]
    summary = "Requires python and sql."
    assert compute_match(summary, skills) == 100


def test_compute_match_partial_word_counts():
    """'B2B SaaS' in skills should match 'B2B SaaS platform' in summary."""
    from services.skill_matcher import compute_match
    skills = ["B2B SaaS"]
    summary = "Experience with B2B SaaS platform required."
    assert compute_match(summary, skills) == 100


def test_compute_match_returns_int():
    from services.skill_matcher import compute_match
    result = compute_match("python is needed", ["python", "java"])
    assert isinstance(result, int)
```

- [ ] **Step 2: Run tests to verify they fail**

```bash
python -m pytest tests/test_skill_matcher.py -v
```

Expected: ImportError — `skill_matcher` doesn't exist yet.

- [ ] **Step 3: Create `services/skill_matcher.py`**

```python
"""
skill_matcher — compute candidate skill match percentage against a job summary.

Pure function: no I/O, no DB, no Playwright.
Returns 0–100 (int). Used as informational enrichment — does NOT gate candidacy.
"""
from __future__ import annotations


def compute_match(summary: str | None, candidate_skills: list[str]) -> int:
    """
    Count how many candidate skills appear (case-insensitive substring) in summary.
    Returns 0–100. Returns 0 if summary is None or skills list is empty.
    """
    if not summary or not candidate_skills:
        return 0

    summary_lower = summary.lower()
    matched = sum(
        1 for skill in candidate_skills
        if skill.lower() in summary_lower
    )
    return round(matched / len(candidate_skills) * 100)
```

- [ ] **Step 4: Run tests to verify they pass**

```bash
python -m pytest tests/test_skill_matcher.py -v
```

Expected: All PASS.

- [ ] **Step 5: Run full test suite**

```bash
python -m pytest tests/ -v
```

Expected: All pass.

- [ ] **Step 6: Commit**

```bash
git add services/skill_matcher.py tests/test_skill_matcher.py
git commit -m "feat: add skill_matcher with compute_match returning 0-100 pct"
```

---

## Chunk 3: SerpAPI Connector, Service Update, and Migration

### Task 6: Create `connectors/serpapi.py`

**Files:**
- Create: `connectors/serpapi.py`
- Create: `tests/test_serpapi_connector.py`

- [ ] **Step 1: Write failing tests**

Create `tests/test_serpapi_connector.py`:

```python
"""
Tests for SerpAPIConnector.
All tests are offline — they inject a mock JSON response, no HTTP calls.
"""
import pytest
from unittest.mock import AsyncMock, MagicMock, patch


# ── Minimal SerpAPI Google Jobs response structure ─────────────────────────
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


# ── Source detection ───────────────────────────────────────────────────────

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


# ── DTO field mapping ──────────────────────────────────────────────────────

@pytest.mark.asyncio
async def test_dto_title_company_location_mapped():
    from connectors.serpapi import SerpAPIConnector
    connector = SerpAPIConnector(api_key="test-key")
    response = _serpapi_response()

    with patch.object(connector, "_get", AsyncMock(return_value=response)):
        dtos = await connector.fetch_jobs("q", num=1)

    dto = dtos[0]
    assert dto.title == "Senior Product Manager"
    assert dto.company == "TechCorp"
    assert dto.location == "Remote, United States"


@pytest.mark.asyncio
async def test_dto_url_from_apply_options():
    from connectors.serpapi import SerpAPIConnector
    connector = SerpAPIConnector(api_key="test-key")
    response = _serpapi_response()

    with patch.object(connector, "_get", AsyncMock(return_value=response)):
        dtos = await connector.fetch_jobs("q", num=1)

    assert dtos[0].url == "https://www.indeed.com/job/abc123"


@pytest.mark.asyncio
async def test_dto_salary_raw_populated():
    from connectors.serpapi import SerpAPIConnector
    connector = SerpAPIConnector(api_key="test-key")
    response = _serpapi_response(salary="$5,000 a month")

    with patch.object(connector, "_get", AsyncMock(return_value=response)):
        dtos = await connector.fetch_jobs("q", num=1)

    assert dtos[0].salary_raw == "$5,000 a month"


@pytest.mark.asyncio
async def test_dto_salary_raw_none_when_absent():
    from connectors.serpapi import SerpAPIConnector
    connector = SerpAPIConnector(api_key="test-key")
    response = _serpapi_response(salary=None)

    with patch.object(connector, "_get", AsyncMock(return_value=response)):
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
    """Jobs with no apply_options and no fallback URL are skipped."""
    from connectors.serpapi import SerpAPIConnector
    connector = SerpAPIConnector(api_key="test-key")
    response = {
        "jobs_results": [{
            "title": "PM", "company_name": "Co", "location": "Remote",
            "via": "via Indeed", "description": "desc",
            # no apply_options
        }]
    }
    with patch.object(connector, "_get", AsyncMock(return_value=response)):
        dtos = await connector.fetch_jobs("q", num=1)

    assert dtos == []
```

- [ ] **Step 2: Run tests to verify they fail**

```bash
python -m pytest tests/test_serpapi_connector.py -v
```

Expected: ImportError — `connectors/serpapi.py` doesn't exist yet.

- [ ] **Step 3: Create `connectors/serpapi.py`**

```python
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

    # ---------------------------------------------------------------- #
    # Internal parsing helpers                                          #
    # ---------------------------------------------------------------- #

    def _parse_item(self, item: dict) -> JobDTO | None:
        """Map a single Google Jobs result to a JobDTO. Returns None if URL missing."""
        # Extract apply URL — skip jobs with no apply link
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
            is_easy_apply=False,  # SerpAPI does not expose Easy Apply flag
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
```

- [ ] **Step 4: Run tests to verify they pass**

```bash
python -m pytest tests/test_serpapi_connector.py -v
```

Expected: All PASS.

- [ ] **Step 5: Run full test suite**

```bash
python -m pytest tests/ -v
```

Expected: All pass.

- [ ] **Step 6: Commit**

```bash
git add connectors/serpapi.py tests/test_serpapi_connector.py
git commit -m "feat: add SerpAPIConnector with Google Jobs source detection and DTO mapping"
```

---

### Task 7: Update `services/job_service.py` + Migrate `tests/test_job_service.py`

**Files:**
- Modify: `services/job_service.py`
- Modify: `tests/conftest.py`
- Modify: `tests/test_job_service.py`

- [ ] **Step 1: Update `tests/conftest.py`**

Add a `sample_profile` fixture and update `sample_dtos` to include new fields and remote locations. Replace the entire file:

```python
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
    """
    Returns a FastAPI TestClient with lifespan wired to a temp SQLite DB.
    Patches db.database so the app never touches the real jobs.db.
    """
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
        min_salary_brl=5000,        # low threshold so test DTOs pass salary check
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
```

- [ ] **Step 2: Replace `tests/test_job_service.py`**

```python
"""
Tests for services/job_service.py.
SerpAPIConnector.fetch_jobs is patched — no real HTTP calls made.
"""
import pytest
from datetime import datetime, timezone
from unittest.mock import AsyncMock, patch

from connectors.base import JobDTO
from models.job import Job


# ---- fetch_and_persist -------------------------------------------------- #

@pytest.mark.asyncio
async def test_fetch_and_persist_saves_approved_jobs(test_session_factory, sample_dtos, sample_profile):
    """Approved jobs are saved to DB with status='new'."""
    with patch("services.job_service.Session", test_session_factory), \
         patch("services.job_service.SerpAPIConnector") as MockConn:
        MockConn.return_value.fetch_jobs = AsyncMock(return_value=sample_dtos)

        from services import job_service
        result = await job_service.fetch_and_persist(sample_profile)

    assert result["total_found"] == 2
    assert result["approved"] == 2
    assert result["skipped"] == 0


@pytest.mark.asyncio
async def test_fetch_and_persist_skips_filtered_jobs(test_session_factory, sample_profile):
    """Jobs that fail filters are saved with status='skipped' and a reason."""
    bad_dto = JobDTO(
        source="linkedin",      # not in sources_allowed → rejected
        title="Product Manager",
        company="Corp",
        location="Remote",
        url="https://linkedin.com/job/99",
        summary="Great role.",
        is_easy_apply=False,
    )
    with patch("services.job_service.Session", test_session_factory), \
         patch("services.job_service.SerpAPIConnector") as MockConn:
        MockConn.return_value.fetch_jobs = AsyncMock(return_value=[bad_dto])

        from services import job_service
        result = await job_service.fetch_and_persist(sample_profile)

    assert result["total_found"] == 1
    assert result["approved"] == 0
    assert result["skipped"] == 1

    # Verify DB row has reason and status=skipped
    with test_session_factory() as session:
        job = session.query(Job).filter_by(url=bad_dto.url).first()
        assert job is not None
        assert job.status == "skipped"
        assert job.filter_reason is not None
        assert job.filter_reason != ""


@pytest.mark.asyncio
async def test_fetch_and_persist_upsert_no_duplicate(test_session_factory, sample_dtos, sample_profile):
    """Running twice with same DTOs does not create duplicate rows."""
    with patch("services.job_service.Session", test_session_factory), \
         patch("services.job_service.SerpAPIConnector") as MockConn:
        MockConn.return_value.fetch_jobs = AsyncMock(return_value=sample_dtos)

        from services import job_service
        await job_service.fetch_and_persist(sample_profile)
        await job_service.fetch_and_persist(sample_profile)

    with test_session_factory() as session:
        count = session.query(Job).count()
    assert count == 2   # exactly 2 rows, not 4


@pytest.mark.asyncio
async def test_fetch_and_persist_applied_status_preserved(test_session_factory, sample_dtos, sample_profile):
    """Jobs with status='applied' are never overwritten."""
    with patch("services.job_service.Session", test_session_factory), \
         patch("services.job_service.SerpAPIConnector") as MockConn:
        MockConn.return_value.fetch_jobs = AsyncMock(return_value=sample_dtos)

        from services import job_service
        await job_service.fetch_and_persist(sample_profile)

        # Manually mark first job as applied
        with test_session_factory() as session:
            job = session.query(Job).filter_by(url=sample_dtos[0].url).first()
            job.status = "applied"
            session.commit()

        # Second run — should not overwrite "applied"
        await job_service.fetch_and_persist(sample_profile)

    with test_session_factory() as session:
        job = session.query(Job).filter_by(url=sample_dtos[0].url).first()
        assert job.status == "applied"


@pytest.mark.asyncio
async def test_fetch_and_persist_skipped_becomes_new_if_re_approved(test_session_factory, sample_dtos, sample_profile):
    """A previously-skipped job that re-passes filters is updated back to 'new'."""
    with patch("services.job_service.Session", test_session_factory), \
         patch("services.job_service.SerpAPIConnector") as MockConn:
        MockConn.return_value.fetch_jobs = AsyncMock(return_value=sample_dtos)

        from services import job_service
        await job_service.fetch_and_persist(sample_profile)

        with test_session_factory() as session:
            job = session.query(Job).filter_by(url=sample_dtos[0].url).first()
            job.status = "skipped"
            session.commit()

        # Second run — job still passes filters → should become "new" again
        await job_service.fetch_and_persist(sample_profile)

    with test_session_factory() as session:
        job = session.query(Job).filter_by(url=sample_dtos[0].url).first()
        assert job.status == "new"


@pytest.mark.asyncio
async def test_fetch_and_persist_sets_skill_match_pct(test_session_factory, sample_dtos, sample_profile):
    """Approved jobs get skill_match_pct populated."""
    with patch("services.job_service.Session", test_session_factory), \
         patch("services.job_service.SerpAPIConnector") as MockConn:
        MockConn.return_value.fetch_jobs = AsyncMock(return_value=sample_dtos)

        from services import job_service
        await job_service.fetch_and_persist(sample_profile)

    with test_session_factory() as session:
        job = session.query(Job).filter_by(url=sample_dtos[0].url).first()
        assert job.skill_match_pct is not None
        assert 0 <= job.skill_match_pct <= 100


# ---- query_jobs --------------------------------------------------------- #

def test_query_jobs_returns_all_by_default(test_session_factory, sample_dtos):
    from models.job import Job

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


def test_apply_service_raises_not_implemented():
    from services.apply_service import apply_job
    import asyncio
    with pytest.raises(NotImplementedError, match="Phase 2"):
        asyncio.run(apply_job(job_id=1, mode="auto"))
```

- [ ] **Step 3: Run tests to verify they fail**

```bash
python -m pytest tests/test_job_service.py -v
```

Expected: FAIL — `SerpAPIConnector` not imported in `job_service` yet.

- [ ] **Step 4: Replace `services/job_service.py`**

```python
"""
job_service — orchestrates discovery, filtering, and persistence.

This is the only layer allowed to import from connectors/, models/, and db/.
The api/ layer calls these functions; it never imports connectors directly.
"""
from __future__ import annotations

from datetime import datetime, timezone

from connectors.base import JobDTO
from connectors.serpapi import SerpAPIConnector, SerpAPIAuthError, SerpAPIQuotaError  # noqa: F401 re-exported
from models.job import Job

# Session is imported lazily so tests can patch it before the first real call.
Session = None


def _get_session():
    global Session
    if Session is None:
        from db.database import Session as _S
        Session = _S
    return Session


async def fetch_and_persist(profile) -> dict:
    """
    Discover jobs via SerpAPI, apply profile filters, compute skill match,
    upsert all results to SQLite, and return a summary dict.

    Args:
        profile: CandidateProfile (not type-annotated here to avoid circular import)

    Returns:
        {"total_found": int, "approved": int, "skipped": int}

    Raises:
        SerpAPIAuthError: invalid API key
        SerpAPIQuotaError: monthly quota exceeded
    """
    from config import settings
    from services.filter_service import apply_filters
    from services.skill_matcher import compute_match

    prefs = profile.preferences
    connector = SerpAPIConnector(api_key=settings.serp_api_key)

    # Discover jobs across all configured search queries
    all_dtos: list[JobDTO] = []
    num_per_query = max(1, prefs.max_results_per_run // max(1, len(prefs.search_queries)))
    for query in prefs.search_queries[:5]:  # cap at 5 queries per run
        dtos = await connector.fetch_jobs(query, num=num_per_query)
        all_dtos.extend(dtos)

    # Filter
    filter_result = apply_filters(all_dtos, prefs)

    # Persist
    SessionFactory = _get_session()
    with SessionFactory() as session:
        for dto in filter_result.approved:
            match_pct = compute_match(dto.summary, profile.skills)
            _upsert_job(session, dto, skill_match_pct=match_pct)

        for dto, reason in filter_result.rejected:
            _upsert_job(session, dto, status="skipped", filter_reason=reason)

        session.commit()

    return {
        "total_found": len(all_dtos),
        "approved": len(filter_result.approved),
        "skipped": len(filter_result.rejected),
    }


def _upsert_job(
    session,
    dto: JobDTO,
    *,
    status: str = "new",
    skill_match_pct: int | None = None,
    filter_reason: str | None = None,
) -> Job:
    """
    Insert or update a Job row by URL.

    Status transition rules:
    - New row → set to given status
    - Existing "applied" → never overwrite (preserve history)
    - Existing "skipped" + incoming "new" → update to "new" (allow retry)
    - Otherwise → update to given status
    """
    existing = session.query(Job).filter_by(url=dto.url).first()

    if existing is None:
        job = Job(
            source=dto.source,
            title=dto.title,
            company=dto.company,
            location=dto.location,
            url=dto.url,
            summary=dto.summary,
            is_easy_apply=dto.is_easy_apply,
            collected_at=datetime.now(timezone.utc),
            status=status,
            salary_raw=dto.salary_raw,
            salary_flagged=dto.salary_flagged,
            skill_match_pct=skill_match_pct,
            filter_reason=filter_reason,
        )
        session.add(job)
        session.flush()
        return job

    # Update fields unconditionally
    existing.salary_raw = dto.salary_raw
    existing.salary_flagged = dto.salary_flagged
    existing.skill_match_pct = skill_match_pct
    existing.filter_reason = filter_reason

    # Status transitions
    if existing.status == "applied":
        pass  # never overwrite applied
    elif existing.status == "skipped" and status == "new":
        existing.status = "new"  # re-approved: allow retry
    else:
        existing.status = status

    return existing


def query_jobs(
    status: str | None = None,
    source: str | None = None,
    limit: int = 50,
) -> list[Job]:
    """Return jobs matching optional filters. Limit capped at 200."""
    effective_limit = min(limit, 200)
    SessionFactory = _get_session()
    with SessionFactory() as session:
        q = session.query(Job)
        if status:
            q = q.filter(Job.status == status)
        if source:
            q = q.filter(Job.source == source)
        jobs = q.limit(effective_limit).all()
        session.expunge_all()
        return jobs


def update_status(job_id: int, status: str) -> Job | None:
    """Update Job.status. Returns the updated Job, or None if not found."""
    SessionFactory = _get_session()
    with SessionFactory() as session:
        job = session.get(Job, job_id)
        if job is None:
            return None
        job.status = status
        session.commit()
        session.refresh(job)
        session.expunge(job)
        return job
```

- [ ] **Step 5: Run tests to verify they pass**

```bash
python -m pytest tests/test_job_service.py -v
```

Expected: All PASS.

- [ ] **Step 6: Run full test suite**

```bash
python -m pytest tests/ -v
```

Expected: All tests pass. Verify the final count is higher than the original 26 (should be ~50+).

- [ ] **Step 7: Commit**

```bash
git add services/job_service.py tests/conftest.py tests/test_job_service.py
git commit -m "feat: update job_service with SerpAPI, _upsert_job helper, and filter pipeline"
```

---

### Task 8: Create `profile.json.example` and Final Verification

**Files:**
- Create: `profile.json.example`

- [ ] **Step 1: Create `profile.json.example`**

```json
{
  "name": "Your Full Name",
  "email": "you@email.com",
  "phone": "+55 (XX) XXXXX-XXXX",
  "location": "City, Country",
  "linkedin_url": "https://linkedin.com/in/yourprofile",
  "portfolio_url": null,
  "github_url": null,
  "current_role": "Your Current Title",
  "current_company": "Your Company",
  "years_experience": 5,
  "cv_path": "cv.pdf",
  "desired_salary_brl": 20000,
  "skills": [
    "product management", "project management", "agile", "scrum"
  ],
  "answers": {
    "authorized_to_work": "No – will require sponsorship",
    "willing_to_relocate": "No",
    "cover_letter": "Brief cover letter text here."
  },
  "preferences": {
    "modality": ["remote"],
    "min_salary_brl": 20000,
    "usd_to_brl_rate": 5.8,
    "eur_to_brl_rate": 6.3,
    "salary_missing": "include_flagged",
    "sources_allowed": ["indeed", "glassdoor", "remoteok", "weworkremotely", "wellfound"],
    "locations_allowed": [
      "remote", "united states", "canada",
      "united kingdom", "germany", "france", "netherlands",
      "portugal", "ireland", "sweden", "norway", "denmark",
      "china", "japan"
    ],
    "languages_allowed": ["english", "portuguese"],
    "keywords_required": [
      "product manager", "project manager", "delivery manager",
      "ai product manager", "ai project manager",
      "program manager", "technical program manager",
      "no-code developer", "ai developer"
    ],
    "keywords_blocked": [
      "presencial", "in site", "on site", "on-site", "onsite",
      "hybrid", "híbrido", "estágio", "intern", "junior", "jr.",
      "entry level", "trainee"
    ],
    "seniority_allowed": [
      "mid", "mid-level", "senior", "lead", "staff",
      "principal", "head", "director", "vp", "manager"
    ],
    "apply_mode": "auto",
    "max_applications_per_day": 10,
    "max_results_per_run": 50,
    "search_queries": [
      "AI product manager remote",
      "delivery manager remote",
      "technical program manager remote"
    ]
  }
}
```

- [ ] **Step 2: Run final full test suite**

```bash
python -m pytest tests/ -v --tb=short
```

Expected: All tests pass.

- [ ] **Step 3: Commit**

```bash
git add profile.json.example
git commit -m "chore: add profile.json.example with full preferences template"
```

---

## Notes for Implementers

**Database reset:** After this feature, delete `jobs.db` before first run — new columns require fresh schema:
```bash
del jobs.db   # Windows
```

**SerpAPI key:** Get a free key at https://serpapi.com (100 free searches/month). Add to `.env`:
```
SERP_API_KEY=your_key_here
```

**`langdetect` determinism:** `DetectorFactory.seed = 0` is set at module level in both `filter_service.py` and `test_filter_service.py`. Do not remove it.

**Existing tests:** `test_connectors.py` tests for `IndeedConnector` and its HTML scraping are unchanged — that connector is still used for the apply step (Phase 2).
