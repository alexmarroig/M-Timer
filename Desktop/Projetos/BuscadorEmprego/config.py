from pathlib import Path
from pydantic_settings import BaseSettings, SettingsConfigDict

_BASE = Path(__file__).parent


def _abs(p: str) -> Path:
    """Resolve a possibly-relative path to absolute, anchored at project root."""
    path = Path(p)
    return path if path.is_absolute() else (_BASE / path).resolve()


class Settings(BaseSettings):
    model_config = SettingsConfigDict(env_file=".env", env_file_encoding="utf-8")

    # Credentials — optional so tests and CI work without .env
    indeed_email: str = ""
    indeed_password: str = ""
    serp_api_key: str = ""

    database_url: str = "sqlite:///jobs.db"
    browser_context_path: Path = Path(".browser_context")
    screenshot_dir: Path = Path("screenshots")
    profile_path: Path = Path("profile.json")

    def model_post_init(self, __context) -> None:
        object.__setattr__(self, "browser_context_path", _abs(str(self.browser_context_path)))
        object.__setattr__(self, "screenshot_dir", _abs(str(self.screenshot_dir)))
        object.__setattr__(self, "profile_path", _abs(str(self.profile_path)))

        url = self.database_url
        if url.startswith("sqlite:///"):
            db_file = url[len("sqlite:///"):]
            db_path = Path(db_file)
            if not db_path.is_absolute():
                abs_db = (_BASE / db_file).resolve()
                object.__setattr__(self, "database_url", f"sqlite:///{abs_db}")


settings = Settings()
