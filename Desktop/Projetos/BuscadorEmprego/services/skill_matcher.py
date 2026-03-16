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
