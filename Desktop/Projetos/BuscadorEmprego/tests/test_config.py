import os
from pathlib import Path


def test_settings_resolves_paths_to_absolute(monkeypatch, tmp_path):
    monkeypatch.setenv("INDEED_EMAIL", "test@test.com")
    monkeypatch.setenv("INDEED_PASSWORD", "secret")
    monkeypatch.setenv("DATABASE_URL", "sqlite:///jobs.db")
    monkeypatch.setenv("BROWSER_CONTEXT_PATH", ".browser_context")
    monkeypatch.setenv("SCREENSHOT_DIR", "screenshots")
    monkeypatch.setenv("PROFILE_PATH", "profile.json")

    # Force reimport to pick up monkeypatched env
    import importlib
    import config
    importlib.reload(config)

    assert config.settings.browser_context_path.is_absolute()
    assert config.settings.screenshot_dir.is_absolute()
    assert config.settings.profile_path.is_absolute()


def test_database_url_uses_absolute_path(monkeypatch):
    monkeypatch.setenv("INDEED_EMAIL", "test@test.com")
    monkeypatch.setenv("INDEED_PASSWORD", "secret")
    monkeypatch.setenv("DATABASE_URL", "sqlite:///jobs.db")
    monkeypatch.setenv("BROWSER_CONTEXT_PATH", ".browser_context")
    monkeypatch.setenv("SCREENSHOT_DIR", "screenshots")
    monkeypatch.setenv("PROFILE_PATH", "profile.json")

    import importlib
    import config
    importlib.reload(config)

    # On Windows the URL looks like sqlite:///C:\abs\path\jobs.db (3 slashes + drive letter)
    # On POSIX it looks like sqlite:////abs/path/jobs.db (4 slashes)
    # Either way, the portion after sqlite:/// must be an absolute path.
    url = config.settings.database_url
    assert url.startswith("sqlite:///")
    db_path = Path(url[len("sqlite:///"):])
    assert db_path.is_absolute(), f"Expected absolute path in URL, got: {url}"
