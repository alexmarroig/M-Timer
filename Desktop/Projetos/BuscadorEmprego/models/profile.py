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
