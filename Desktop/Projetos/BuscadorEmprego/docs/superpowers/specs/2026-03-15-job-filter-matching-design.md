# Job Filter & Matching System — Design Spec
**Date:** 2026-03-15
**Project:** BuscadorEmprego
**Status:** Approved

---

## 1. Problem Statement

The current system scrapes job listings from Indeed via Playwright and persists all results indiscriminately. This is insufficient because:

1. Indeed's ToS explicitly prohibits scraping bots; Cloudflare anti-bot blocks headless Playwright quickly and reliably.
2. There is no filtering logic — the system would apply to every scraped job regardless of relevance.
3. The `CandidateProfile` model lacks job preferences, salary expectations, and fields required by application forms.

This spec defines the **job filtering, profile preferences, and multi-source discovery** system that makes automated applications safe, targeted, and useful.

---

## 2. Goals

- Replace the Indeed Playwright scraper with **SerpAPI** (Google Jobs aggregator) for job discovery — no CAPTCHA, no ToS violation, structured data.
- Filter discovered jobs against the candidate's preferences **before** saving or applying.
- Enrich persisted jobs with a **skill match percentage** (informational, not a gate).
- Keep Playwright for the **apply step only** (opening the real job board URL and submitting the form).
- Support these sources: **Indeed, Glassdoor, RemoteOK, WeWorkRemotely, Wellfound**. Exclude LinkedIn.
- Extend `CandidateProfile` with `preferences: JobPreferences` and all fields needed for application forms.

---

## 3. Architecture Overview

```
profile.json
    ↓
[1] SerpAPIConnector         ← queries Google Jobs via SerpAPI REST API
    ↓  list[JobDTO]
[2] SourceFilter             ← keep only allowed sources (indeed, glassdoor, remoteok, etc.)
    ↓
[3] JobFilter                ← rule-based: modality, keywords, salary, location, seniority
    ↓  (approved DTOs + rejection reasons for skipped)
[4] SkillMatcher             ← computes skill_match_pct; does NOT gate candidacy
    ↓
[5] job_service.upsert()     ← persists approved jobs to SQLite; skipped jobs saved with status="skipped" + reason
    ↓
[6] ApplyService             ← Playwright opens real job board URL and fills the form
    ↓
[7] ApplicationLog           ← screenshot, result, salary_flagged, skill_match_pct
```

**Layer contracts:**
- `SerpAPIConnector` returns `list[JobDTO]` only — no SQLAlchemy imports.
- `FilterService` and `SkillMatcher` are pure functions — no I/O, no DB, no Playwright.
- `ApplyService` is the only layer that imports Playwright.
- `api/` never imports connectors or Playwright directly.

---

## 4. Profile Schema

### 4.1 `CandidateProfile` (updated dataclass)

```python
@dataclass
class JobPreferences:
    modality: list[str]                    # ["remote"]
    min_salary_brl: float                  # 20000.0
    usd_to_brl_rate: float                 # 5.8
    eur_to_brl_rate: float                 # 6.3
    salary_missing: str                    # "include_flagged" | "skip"
    sources_allowed: list[str]             # ["indeed", "glassdoor", ...]
    locations_allowed: list[str]           # ["remote", "united states", ...]
    languages_allowed: list[str]           # ["english", "portuguese"]
    keywords_required: list[str]           # at least one must appear in title/summary
    keywords_blocked: list[str]            # none may appear in title/summary/location
    seniority_allowed: list[str]           # ["mid", "senior", "lead", ...]
    apply_mode: str                        # "auto" | "review" | "off"
    max_applications_per_day: int          # 10
    max_results_per_run: int               # 50
    search_queries: list[str]              # SerpAPI query strings

@dataclass
class CandidateProfile:
    name: str
    email: str
    phone: str
    location: str
    linkedin_url: str
    portfolio_url: str | None
    github_url: str | None
    current_role: str
    current_company: str
    years_experience: int
    cv_path: str
    desired_salary_brl: float
    skills: list[str]
    answers: dict[str, str]
    preferences: JobPreferences
```

### 4.2 `profile.json` (Alex Da Cunha Marroig)

```json
{
  "name": "Alex Da Cunha Marroig",
  "email": "alex.c.marroig@gmail.com",
  "phone": "+55 (21) 965003495",
  "location": "São Paulo, Brazil",
  "linkedin_url": "https://linkedin.com/in/alexmarroig/",
  "portfolio_url": "https://alex-portfolio-seven-psi.vercel.app/",
  "github_url": "https://github.com/alexmarroig",
  "current_role": "Onboarding Tech Manager / Delivery Manager",
  "current_company": "Inbenta",
  "years_experience": 9,
  "cv_path": "cv.pdf",
  "desired_salary_brl": 20000,
  "skills": [
    "product management", "project management", "AI product management",
    "delivery management", "agile", "scrum", "lean", "kanban",
    "zero-to-one product development", "MVP definition", "product discovery",
    "hypothesis testing", "B2B SaaS", "cross-functional leadership",
    "async remote collaboration", "roadmap", "stakeholder management",
    "process improvement", "six sigma", "power automate", "power bi",
    "jira", "asana", "clickup", "servicenow", "SAP", "API integration",
    "NLP", "RAG", "no-code", "automation", "chatbot", "data analytics"
  ],
  "answers": {
    "authorized_to_work": "No – will require sponsorship",
    "willing_to_relocate": "No",
    "work_authorization": "Brazilian citizen, open to visa sponsorship",
    "cover_letter": "I am a PMP-certified Project Manager and Product Manager with 9+ years of experience in AI-driven platforms, B2B SaaS, and remote-first environments. I specialize in zero-to-one product development, delivery management, and AI-powered automation."
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
      "united kingdom", "germany", "france", "netherlands", "spain",
      "portugal", "sweden", "norway", "denmark", "ireland", "switzerland",
      "austria", "finland", "belgium", "italy", "poland",
      "china", "japan"
    ],
    "languages_allowed": ["english", "portuguese"],
    "keywords_required": [
      "project manager", "product manager",
      "ai project manager", "ai product manager",
      "delivery manager", "program manager",
      "technical program manager", "tpm",
      "no code developer", "no-code developer",
      "ai developer", "ai engineer",
      "chief of staff", "growth manager"
    ],
    "keywords_blocked": [
      "presencial", "in site", "on site", "on-site", "onsite", "in-office",
      "híbrido", "hybrid", "estágio", "estagiário", "intern", "internship",
      "junior", "jr.", "entry level", "entry-level", "trainee"
    ],
    "seniority_allowed": [
      "mid", "mid-level", "pleno", "senior", "sênior", "sr.",
      "lead", "staff", "principal", "head", "director",
      "vp", "vice president", "c-level", "manager", "associate"
    ],
    "apply_mode": "auto",
    "max_applications_per_day": 10,
    "max_results_per_run": 50,
    "search_queries": [
      "AI product manager remote",
      "AI project manager remote",
      "delivery manager remote",
      "technical program manager remote AI",
      "no-code developer remote"
    ]
  }
}
```

---

## 5. New Components

### 5.1 `connectors/serpapi.py` — `SerpAPIConnector`

Replaces `IndeedConnector` for **discovery only**.

```python
class SerpAPIConnector:
    async def fetch_jobs(self, query: str, num: int = 10) -> list[JobDTO]: ...
```

- Calls `https://serpapi.com/search.json?engine=google_jobs&q={query}&num={num}`
- Maps response fields to `JobDTO`: title, company, location, url, summary, source (detected from `via` field), salary_raw (raw string when present)
- Adds `salary_raw: str | None` to `JobDTO` to carry unparsed salary text through the pipeline
- Does NOT import SQLAlchemy

**Source detection from SerpAPI `via` field:**

| `via` contains | `source` value |
|----------------|---------------|
| "Indeed" | "indeed" |
| "Glassdoor" | "glassdoor" |
| "Remote OK" / "RemoteOK" | "remoteok" |
| "We Work Remotely" | "weworkremotely" |
| "Wellfound" / "AngelList" | "wellfound" |
| anything else | "other" |

### 5.2 `services/filter_service.py` — `JobFilter`

Pure functions. No I/O.

```python
@dataclass
class FilterResult:
    approved: list[JobDTO]
    rejected: list[tuple[JobDTO, str]]   # (dto, reason)

def apply_filters(dtos: list[JobDTO], prefs: JobPreferences) -> FilterResult: ...
```

**Filter chain (applied in order, first failure = reject):**

| Filter | Logic |
|--------|-------|
| `check_source` | `dto.source in prefs.sources_allowed` |
| `check_modality` | `"remote"` in `dto.location.lower()` or title |
| `check_blocked_keywords` | none of `keywords_blocked` appear in title+summary+location (case-insensitive) |
| `check_required_keywords` | at least one of `keywords_required` is a substring of title or summary (case-insensitive) |
| `check_location` | any of `locations_allowed` is a substring of `dto.location.lower()`, OR modality check already passed |
| `check_salary` | salary ≥ min (after currency conversion), OR salary absent → flag but pass |
| `check_language` | title/summary contains only words consistent with allowed languages (heuristic: detect via `langdetect` on summary; default pass if summary is None) |

**Salary parsing from `salary_raw`:**
- Detect currency symbol: `$` → USD, `€` → EUR, `R$` → BRL, no symbol → assume job's country currency
- Extract numeric range (e.g. "$80k–$120k/yr") → take lower bound
- Convert to BRL using rates from `prefs`
- If parsing fails → treat as missing → `salary_missing` policy applies

### 5.3 `services/skill_matcher.py` — `SkillMatcher`

```python
def compute_match(summary: str | None, candidate_skills: list[str]) -> int:
    """Returns 0-100. 0 if summary is None."""
```

- Lowercases summary and skills
- Counts how many candidate skills appear as substrings in summary
- Returns `matched / total_skills * 100` rounded to nearest int
- Result stored in `Job.skill_match_pct` (new column, nullable int)

### 5.4 Updated `JobDTO`

```python
class JobDTO(BaseModel):
    source: str
    title: str
    company: str
    location: str
    url: str
    summary: str | None
    is_easy_apply: bool
    salary_raw: str | None = None       # new: raw salary string from source
    salary_flagged: bool = False         # new: True when salary absent/unparseable
```

### 5.5 Updated `Job` ORM model

New columns:
- `salary_raw: Text nullable` — raw salary string as scraped
- `salary_flagged: Boolean default False` — True when salary was absent or unparseable
- `skill_match_pct: Integer nullable` — 0–100, computed by SkillMatcher
- `filter_reason: String(255) nullable` — rejection reason for skipped jobs

---

## 6. Config Changes

New entries in `.env` / `config.py`:

```env
SERP_API_KEY=your_serpapi_key_here
```

```python
class Settings(BaseSettings):
    ...
    serp_api_key: str = ""
```

---

## 7. Updated `job_service.py`

`fetch_and_persist` updated to orchestrate the full pipeline:

```python
async def fetch_and_persist(prefs: JobPreferences) -> dict:
    connector = SerpAPIConnector(settings.serp_api_key)
    all_dtos: list[JobDTO] = []
    for query in prefs.search_queries[:5]:  # max 5 queries per run
        dtos = await connector.fetch_jobs(query, num=prefs.max_results_per_run // len(prefs.search_queries))
        all_dtos.extend(dtos)

    result = apply_filters(all_dtos, prefs)

    # Persist approved
    for dto in result.approved:
        match_pct = compute_match(dto.summary, profile.skills)
        upsert_job(dto, skill_match_pct=match_pct, salary_flagged=dto.salary_flagged)

    # Persist rejected as skipped
    for dto, reason in result.rejected:
        upsert_job(dto, status="skipped", filter_reason=reason)

    return {
        "total_found": len(all_dtos),
        "approved": len(result.approved),
        "skipped": len(result.rejected),
    }
```

---

## 8. Error Handling

| Error | Handling |
|-------|----------|
| SerpAPI quota exceeded (429) | Raise `SerpAPIQuotaError`; API returns HTTP 429 |
| SerpAPI auth failure (401) | Raise `SerpAPIAuthError`; API returns HTTP 401 |
| No jobs found | Return empty list, no error |
| Salary parse failure | Treat as missing; apply `salary_missing` policy |
| `langdetect` failure | Default to pass (do not reject based on language) |
| Apply blocked by CAPTCHA | `CaptchaError` propagated; job status set to `new` (retry later) |

---

## 9. Testing Strategy

All new services are pure functions → unit tests with no mocks needed.

| Test file | What it covers |
|-----------|---------------|
| `tests/test_filter_service.py` | Each filter rule independently; edge cases (no summary, unicode, mixed case) |
| `tests/test_skill_matcher.py` | 0%, 50%, 100% match; None summary |
| `tests/test_serpapi_connector.py` | Source detection mapping; DTO construction from mock response |
| `tests/test_profile.py` | `JobPreferences` dataclass loading from JSON; missing optional fields |
| `tests/test_job_service.py` (extend) | Full pipeline with mock SerpAPI response |

---

## 10. Out of Scope (This Phase)

- Live currency rate API (use fixed rates from profile)
- LinkedIn as a source
- AI-based compatibility scoring (Phase 3)
- Notification/email on job found
- Web UI / dashboard
- Multi-profile support
