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
│
├── models/
│   ├── job.py                 # SQLAlchemy ORM model + Pydantic schema
│   ├── profile.py             # CandidateProfile dataclass (loaded from JSON)
│   └── application_log.py    # audit record per submitted application
│
├── db/
│   └── database.py            # SQLite engine, Session factory, create_all
│
├── connectors/
│   ├── base.py                # Protocol defining fetch_jobs() and apply_job()
│   └── indeed.py              # Indeed implementation
│
├── services/
│   ├── job_service.py         # DB operations: upsert, query, status update
│   └── apply_service.py       # orchestrates apply flow (future phase, stub now)
│
├── api/
│   ├── routes_jobs.py         # GET /jobs, POST /indeed/fetch_jobs, PATCH /jobs/{id}/status
│   └── routes_apply.py        # POST /apply/{job_id} (stub — 501 now)
│
└── profile.json               # candidate data (gitignored)
```

### Layer Rules

- `connectors/` knows only Playwright and returns DTOs.
- `services/` knows only models and DB — no HTTP, no Playwright.
- `api/` knows only HTTP — delegates everything to services.
- No layer imports from a layer above it.

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
| `status` | str | `"new"` \| `"applied"` \| `"skipped"` |

### `ApplicationLog` (audit trail for auto mode)

| Field | Type | Notes |
|---|---|---|
| `id` | int PK | |
| `job_id` | FK → Job | |
| `applied_at` | datetime | |
| `mode` | str | `"auto"` \| `"copilot"` |
| `success` | bool | |
| `error_msg` | str \| None | |
| `screenshot` | str \| None | path to PNG saved locally |

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
    answers: dict[str, str]   # custom Indeed questions
```

Loaded from `profile.json` at startup. File is `.gitignore`d (personal data).

---

## 4. API Endpoints

### `POST /indeed/fetch_jobs`
```
Body:   { "search_url": str, "max_results": int = 20 }
Action: open Indeed, scrape listing, upsert jobs in SQLite
Return: { "found": int, "new": int, "jobs": list[Job] }
```

### `GET /jobs`
```
Query: ?status=new&source=indeed&limit=50
Return: paginated list of Job
```

### `PATCH /jobs/{id}/status`
```
Body:   { "status": "skipped" | "new" | "applied" }
Action: update Job.status manually
```

### `POST /apply/{job_id}` *(stub — 501 Not Implemented)*
```
Body:   { "mode": "auto" | "copilot" }
Return: ApplicationLog (future)
```

### `GET /applications` *(stub — 501 Not Implemented)*
```
Return: list of ApplicationLog (audit history)
```

**Upsert semantics:** `fetch_jobs` uses `Job.url` as the unique key. Re-running the same search never duplicates jobs and preserves existing `status` values.

---

## 5. Indeed Connector — Scraping Strategy

### `fetch_jobs_indeed(search_url, max_results)` flow

1. Launch Chromium headless via Playwright with a persistent `BrowserContext` (cookies saved to `~/.buscador_context/`).
2. Navigate to `search_url`.
3. For each job card on the page, extract: title, company, location, job URL, summary snippet, `is_easy_apply`.
4. If `len(jobs) < max_results` and a "Next page" button exists → paginate (max 3 pages).
5. Apply `await page.wait_for_timeout(1500)` between pages.
6. Return `list[JobDTO]`.

### Expected Selectors *(must be validated against live DOM)*

```
Job cards:      [data-testid="slider_container"]  or  .job_seen_beacon
Title:          h2.jobTitle a
Company:        [data-testid="company-name"]
Location:       [data-testid="text-location"]
Summary:        .job-snippet
Easy Apply:     .iaLabel  or  span containing "Easily apply"
Next page:      [data-testid="pagination-page-next"]
```

> These selectors are best-effort guesses. Indeed frequently updates its DOM. Inspect the real page and adjust before running.

### Login Flow (for future apply phase)

1. Navigate to `indeed.com/account/login`.
2. Fill email and password from `.env`.
3. Save `BrowserContext` to disk — reuse on next run.

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
5. Answer custom questions using `profile.answers`.
6. If `mode="copilot"` → pause before Submit, wait for human.
7. If `mode="auto"` → submit, take screenshot, write `ApplicationLog`.

### Phase 3 — Match & Score

- Embedding-based similarity between job description and candidate profile.
- Score threshold to skip low-match jobs automatically.
- LLM-generated cover letter / custom answer per vaga.

---

## 7. Configuration (`.env.example`)

```env
INDEED_EMAIL=you@example.com
INDEED_PASSWORD=yourpassword
BROWSER_CONTEXT_PATH=./.browser_context
PROFILE_PATH=./profile.json
DATABASE_URL=sqlite:///./jobs.db
```

---

## 8. Dependencies (`requirements.txt`)

```
fastapi
uvicorn[standard]
playwright
sqlalchemy
pydantic
python-dotenv
```

Post-install: `playwright install chromium`
