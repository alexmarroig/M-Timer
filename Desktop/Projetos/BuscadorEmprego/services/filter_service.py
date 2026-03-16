"""
filter_service — rule-based job filtering.

Pure functions only: no I/O, no DB, no Playwright.
Receives list[JobDTO] + JobPreferences, returns FilterResult.
"""
from __future__ import annotations

import re
from dataclasses import dataclass

from langdetect import LangDetectException, detect_langs
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
    dto.salary_flagged = flagged  # Pydantic v2 models are mutable by default

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
        allowed_codes: list[str] = []
        for lang_name in prefs.languages_allowed:
            allowed_codes.extend(_LANG_CODES.get(lang_name.lower(), []))

        candidates = detect_langs(dto.summary)
        # Pass if any allowed language appears anywhere in the candidate list.
        # This handles short/ambiguous text where the top prediction may be wrong
        # but the correct language still appears as a secondary candidate.
        detected_codes = {str(c).split(":")[0] for c in candidates}
        if detected_codes & set(allowed_codes):
            return True, ""

        top_lang = str(candidates[0]).split(":")[0]
        return False, f"detected language '{top_lang}' not in {prefs.languages_allowed}"
    except LangDetectException:
        return True, ""  # default pass on detection failure


# ------------------------------------------------------------------ #
# Internal helpers                                                    #
# ------------------------------------------------------------------ #

def _parse_salary_brl(
    salary_raw: str | None, prefs: JobPreferences
) -> tuple[float | None, bool]:
    """
    Parse salary_raw to a monthly BRL float. Returns (amount_brl, flagged).
    flagged=True means salary was absent, currency unknown, or unparseable.
    Annual salaries are normalized to monthly by dividing by 12.
    """
    if not salary_raw:
        return None, True

    text = salary_raw.strip()

    # Detect currency symbol — check R$ before $ to avoid false USD match
    if "R$" in text or "BRL" in text.upper():
        rate = 1.0
    elif "$" in text or "USD" in text.upper():
        rate = prefs.usd_to_brl_rate
    elif "€" in text or "EUR" in text.upper():
        rate = prefs.eur_to_brl_rate
    else:
        return None, True  # unknown currency

    # Detect pay period — normalize everything to monthly
    text_lower = text.lower()
    if any(p in text_lower for p in ["year", "/yr", "yr ", "annual", "per year", "a year"]):
        period_divisor = 12.0
    elif any(p in text_lower for p in ["week", "/wk", "per week", "a week"]):
        period_divisor = 52.0 / 12.0  # ~4.33 weeks/month
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
        # Take lower bound of any range (e.g. "$80k–$120k" → $80k)
        amount_per_period = min(values) * rate
        amount_monthly = amount_per_period / period_divisor
        return amount_monthly, False
    except (ValueError, ZeroDivisionError):
        return None, True
