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
