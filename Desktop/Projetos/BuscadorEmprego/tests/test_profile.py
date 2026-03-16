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
    from models.profile import load_profile
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
