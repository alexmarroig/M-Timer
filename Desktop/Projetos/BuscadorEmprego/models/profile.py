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
