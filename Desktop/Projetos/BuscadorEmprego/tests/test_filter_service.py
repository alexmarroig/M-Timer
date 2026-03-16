"""Tests for services/filter_service.py — pure filter rules, no DB, no I/O."""
import pytest
from langdetect.detector_factory import DetectorFactory

from connectors.base import JobDTO
from models.profile import JobPreferences

# Seed langdetect at module level for deterministic results in all tests
DetectorFactory.seed = 0


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


# ── check_source ──────────────────────────────────────────────────────────

def test_check_source_allowed(prefs):
    from services.filter_service import apply_filters
    result = apply_filters([_dto(source="indeed")], prefs)
    assert len(result.approved) == 1


def test_check_source_blocked(prefs):
    from services.filter_service import apply_filters
    result = apply_filters([_dto(source="linkedin")], prefs)
    assert len(result.rejected) == 1
    assert "source" in result.rejected[0][1]


# ── check_modality ────────────────────────────────────────────────────────

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


# ── check_blocked_keywords ────────────────────────────────────────────────

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
    assert len(result.rejected) == 1


def test_check_blocked_keyword_none_summary_is_fine(prefs):
    from services.filter_service import apply_filters
    result = apply_filters([_dto(summary=None)], prefs)
    assert len(result.approved) == 1


def test_check_blocked_keyword_none_present(prefs):
    from services.filter_service import apply_filters
    result = apply_filters([_dto(title="Senior Product Manager", summary="AI experience required.")], prefs)
    assert len(result.approved) == 1


# ── check_required_keywords ───────────────────────────────────────────────

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


# ── check_location ────────────────────────────────────────────────────────

def test_check_location_passes_for_remote(prefs):
    from services.filter_service import apply_filters
    result = apply_filters([_dto(location="Remote - Work from Anywhere")], prefs)
    assert len(result.approved) == 1


def test_check_location_allowed_country(prefs):
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


# ── check_salary ──────────────────────────────────────────────────────────

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
    """$80k/year * 5.0 / 12 = R$33,333/month > R$20,000 → pass."""
    from services.filter_service import apply_filters
    result = apply_filters([_dto(salary_raw="$80k a year")], prefs)
    assert len(result.approved) == 1


def test_check_salary_annual_too_low(prefs):
    """$30,000/year * 5.0 / 12 = R$12,500/month < R$20,000 → reject."""
    from services.filter_service import apply_filters
    result = apply_filters([_dto(salary_raw="$30,000 a year")], prefs)
    assert len(result.rejected) == 1
    assert "salary" in result.rejected[0][1]


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
    import dataclasses
    skip_prefs = dataclasses.replace(prefs, salary_missing="skip")
    result = apply_filters([_dto(salary_raw=None)], skip_prefs)
    assert len(result.rejected) == 1


# ── check_language ────────────────────────────────────────────────────────

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
    jp_summary = "この仕事はプロダクトマネージャーを募集しています。経験者優遇。フルリモート可能です。給与は高め。"
    result = apply_filters([_dto(summary=jp_summary)], prefs)
    assert len(result.rejected) == 1


# ── apply_filters integration ─────────────────────────────────────────────

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
