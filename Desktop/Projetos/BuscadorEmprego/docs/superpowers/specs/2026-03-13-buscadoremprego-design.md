# BuscadorEmprego — Design Spec (MVP v0)

**Date:** 2026-03-13
**Status:** Approved
**Scope:** MVP v0 — job collection only (no apply yet)

---

## 1. Context & Goals

Build an auto-job-application system starting exclusively with Indeed. The system must:

1. Accept an Indeed search URL (with filters already applied by the user).
2. Scrape the job listing and persist results.
3. Expose a REST API to inspect collected jobs.
4. Be architecturally ready to add auto-apply in the next phase.
5. Be extensible to other job sites (Glassdoor, Gupy, Greenhouse) without rewriting core logic.

### Runtime Environment

- Local Windows machine, run manually by the user.
- No deployment/Docker required for MVP.

### Key Decisions

| Decision | Choice | Reason |
|---|---|---|
| Browser automation | Playwright | Async-native, cleaner API, built-in waits, one-line file upload, persistent BrowserContext for sessions |
| Backend | FastAPI | Async, fast, great for REST APIs, pairs naturally with Playwright async |
| Database | SQLite + SQLAlchemy | Zero-config, sufficient for local use, easy to migrate later |
| Apply scope | Indeed Apply only | Simplifies apply flow; external redirects out of scope |
| Preferred apply mode | `auto` | User wants speed; copilot available but secondary |
| CV upload | Always upload PDF | Deterministic, no dependency on Indeed's stored resume |
| Login | Programmatic via `.env` credentials | Email/password stored in `.env`; BrowserContext saved to disk for reuse |

---

## 2. Architecture

### Folder Structure

```
BuscadorEmprego/
├── main.py                    # FastAPI app entrypoint
├── config.py                  # reads .env (credentials, paths)
├── requirements.txt
├── .env.example
├── .gitignore                 # must include: .env, profile.json, jobs.db, .browser_context/
│
├── models/
│   ├── job.py                 # SQLAlchemy ORM model + Pydantic schema
│   ├── profile.py             # CandidateProfile dataclass (loaded from JSON)
│   └── application_log.py    # audit record per submitted application (schema-first; written in Phase 2)
│
├── db/
│   └── database.py            # SQLite engine, Session factory, create_all
│
├── connectors/
│   ├── base.py                # Protocol + JobDTO Pydantic model (no SQLAlchemy)
│   └── indeed.py              # Indeed implementation
│
├── services/
│   ├── job_service.py         # fetch_and_persist(), query(), update_status()
│   └── apply_service.py       # stub: all methods raise NotImplementedError (Phase 2)
│
├── api/
│   ├── routes_jobs.py         # GET /jobs, POST /indeed/fetch_jobs, PATCH /jobs/{id}/status
│   └── routes_apply.py        # POST /apply/{job_id}, GET /applications (stub — 501 now)
│
└── profile.json               # candidate data (gitignored)
```

### Layer Rules

- `connectors/` knows only Playwright. Returns `list[JobDTO]` — **never ORM models**. No SQLAlchemy imports inside `connectors/`.
- `services/` knows only models and DB — no HTTP, no Playwright. Converts `JobDTO → Job ORM` internally.
- `api/` knows only HTTP — delegates everything to services. **`api/` never imports from `connectors/` directly.**
- The bridge: `job_service.fetch_and_persist(search_url, max_results)` calls the connector internally, maps DTOs to ORM models, upserts, and returns results. The route calls this service method.
- No layer imports from a layer above it.

### `JobDTO` — Connector Output Type

`JobDTO` is a plain Pydantic `BaseModel` defined in `connectors/base.py`. It is the **only** type connectors return. It has no SQLAlchemy dependency.

```python
class JobDTO(BaseModel):
    source: str
    title: str
    company: str
    location: str
    url: str
    summary: str | None
    is_easy_apply: bool
```

`job_service.fetch_and_persist()` maps each `JobDTO` → `Job` ORM model. This mapping is the sole responsibility of the service layer — connectors never touch the ORM.

### Connector Protocol

```python
class JobConnector(Protocol):
    async def fetch_jobs(self, search_url: str, max_results: int) -> list[JobDTO]: ...
    async def apply_job(self, job_url: str, profile: CandidateProfile, mode: str) -> ApplicationLog: ...
```

`indeed.py` implements this protocol. Future connectors (Glassdoor, Gupy) implement the same protocol — `job_service` works with any of them without changes.

### Note on `application_log`

`ApplicationLog` is defined schema-first in MVP: the ORM model and table are created via `create_all`, but nothing writes to it until Phase 2. This is intentional — it avoids a schema migration later.

---

## 3. Data Models

### `Job` (SQLAlchemy + Pydantic)

| Field | Type | Notes |
|---|---|---|
| `id` | int PK | autoincrement |
| `source` | str | always `"indeed"` for now |
| `title` | str | |
| `company` | str | |
| `location` | str | |
| `url` | str (unique) | vaga URL — used as upsert key |
| `summary` | str \| None | short snippet from listing |
| `is_easy_apply` | bool | detected from "Easily apply" badge |
| `collected_at` | datetime | UTC, auto-set |
| `status` | Enum | `"new"` \| `"applied"` \| `"skipped"` — enforced as `SQLAlchemy Enum` in ORM and `Literal["new", "applied", "skipped"]` in Pydantic schema |

### `ApplicationLog` (audit trail — schema-first, populated in Phase 2)

| Field | Type | Notes |
|---|---|---|
| `id` | int PK | |
| `job_id` | FK → Job | |
| `applied_at` | datetime | |
| `mode` | str | `"auto"` \| `"copilot"` |
| `success` | bool | |
| `error_msg` | str \| None | |
| `screenshot` | str \| None | absolute path to PNG; base dir from `SCREENSHOT_DIR` config; use `pathlib.Path` — never string concatenation |

### `CandidateProfile` (dataclass, never persisted)

```python
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
```

**`answers` key convention:** keys are the exact label text shown on the Indeed form (e.g., `"How many years of Python experience do you have?"`). The connector will match keys against form field labels at runtime.

Loaded from `profile.json` at startup. File is `.gitignore`d (personal data).

---

## 4. API Endpoints

### `POST /indeed/fetch_jobs`

```
Body:   { "search_url": str, "max_results": int = 20 }
Action: calls job_service.fetch_and_persist() → connector → DB upsert
Return: { "found": int, "new": int, "jobs": list[Job] }

Errors:
  HTTP 422  — search_url does not contain "indeed.com"
  HTTP 502  — Playwright failure (network error, CAPTCHA, timeout)
             body: { "detail": "<reason>" }
```

### `GET /jobs`

```
Query:  ?status=new&source=indeed&limit=50
Return: list[Job] (no pagination in MVP — limit is a hard cap, no offset param)
Default limit: 50. Max limit: 200.
```

### `PATCH /jobs/{id}/status`

```
Body:   { "status": "skipped" | "new" | "applied" }
Return: updated Job
Errors:
  HTTP 404  — job with given id does not exist
  HTTP 422  — invalid status value
```

### `POST /apply/{job_id}` *(stub — 501 Not Implemented)*

```
Body:   { "mode": "auto" | "copilot" }
Return: { "detail": "Not implemented — Phase 2" }
```

### `GET /applications` *(stub — 501 Not Implemented)*

```
Return: { "detail": "Not implemented — Phase 2" }
```

**Upsert semantics:** `fetch_jobs` uses `Job.url` as the unique key. Re-running the same search never duplicates jobs and preserves existing `status` values.

---

## 5. Indeed Connector — Scraping Strategy

### `fetch_jobs_indeed(search_url, max_results)` flow

1. Launch Chromium headless via Playwright with a persistent `BrowserContext` (path from `BROWSER_CONTEXT_PATH` config, resolved to absolute using `pathlib.Path`).
2. Navigate to `search_url`.
3. For each job card on the page, extract: title, company, location, job URL, summary snippet, `is_easy_apply`.
4. Stop when `len(jobs) >= max_results` OR there is no "Next page" button OR `MAX_PAGES` constant (default: `3`) is reached — whichever comes first. `MAX_PAGES` is a module-level constant, not hardcoded inline.
5. Apply `await page.wait_for_timeout(1500)` between pages.
6. Return `list[JobDTO]`.

### CAPTCHA Handling

If Playwright detects a CAPTCHA page (heuristic: page title contains "Just a moment" or "Verify you are human", or expected job card selectors are absent after 5s):

- Raise `CaptchaError(url)` — a custom exception defined in `connectors/indeed.py`.
- `job_service.fetch_and_persist()` catches it and re-raises as `HTTP 502` with `detail="CAPTCHA encountered — run the browser in headed mode to solve manually"`.
- No silent empty returns; failures are always surfaced.

### Expected Selectors *(must be validated against live DOM)*

```
Job cards:      #mosaic-provider-jobcards [data-testid="slider_item"]
                fallback: .job_seen_beacon
Title:          h2.jobTitle a
Company:        [data-testid="company-name"]
Location:       [data-testid="text-location"]
Summary:        .job-snippet
Easy Apply:     [data-testid="indeedApply"]
                fallback: .jobMetaDataGroup [class*="indeedApply"]
                fallback: span/badge containing text "Easily apply"
Next page:      [data-testid="pagination-page-next"]
```

The connector must try selectors in the order listed, using the first that resolves. Fallback logic lives in a private helper `_find_first(page, *selectors)` — not duplicated at each call site.

> These selectors reflect the current DOM as of early 2026. Indeed updates its markup frequently. Before running, open the search page in a headed browser and verify with DevTools.

### Login Flow (for Phase 2 — apply)

1. Navigate to `indeed.com/account/login`.
2. Fill email and password from config (`.env`).
3. Save `BrowserContext` to `BROWSER_CONTEXT_PATH` (absolute path) — reuse on next run.

### Rate Limiting

- 1500ms wait between pages.
- No parallel requests.
- Playwright's default realistic user-agent.

---

## 6. Future Phases (hooks, no code yet)

### Phase 2 — Indeed Apply

```python
async def apply_job_indeed(
    job_url: str,
    profile: CandidateProfile,
    mode: Literal["auto", "copilot"]
) -> ApplicationLog
```

Flow:
1. Open job URL with logged-in BrowserContext.
2. Click "Apply now" / "Indeed Apply".
3. Fill form fields from `CandidateProfile`.
4. Upload PDF via `page.set_input_files()`.
5. Match `profile.answers` keys against form field labels; fill matched fields.
6. If `mode="copilot"` → pause before Submit, wait for human.
7. If `mode="auto"` → submit, take screenshot to `SCREENSHOT_DIR`, write `ApplicationLog`.

### Phase 3 — Match & Score

- Embedding-based similarity between job description and candidate profile.
- Score threshold to skip low-match jobs automatically.
- LLM-generated cover letter / custom answer per vaga.

---

## 7. Configuration (`.env.example`)

```env
INDEED_EMAIL=you@example.com
INDEED_PASSWORD=yourpassword        # NEVER commit .env — it is gitignored
BROWSER_CONTEXT_PATH=.browser_context  # resolved to absolute path at startup via pathlib.Path
SCREENSHOT_DIR=./screenshots           # resolved to absolute path at startup via pathlib.Path
PROFILE_PATH=./profile.json            # resolved to absolute path at startup
DATABASE_URL=sqlite:///./jobs.db       # SQLite path is resolved to absolute at startup
```

**Important:** All relative paths in config are resolved to absolute at startup time using `pathlib.Path(__file__).parent / relative_path`. This prevents path drift when uvicorn is started from a different working directory on Windows.

**Gitignored files:** `.env`, `profile.json`, `jobs.db`, `.browser_context/`, `screenshots/`

---

## 8. Dependencies (`requirements.txt`)

```
fastapi>=0.110,<1
uvicorn[standard]>=0.29,<1
playwright>=1.43,<2
sqlalchemy>=2.0,<3
pydantic>=2.0,<3
pydantic-settings>=2.0,<3     # required for BaseSettings with Pydantic v2
python-dotenv>=1.0,<2
```

Post-install: `playwright install chromium`
