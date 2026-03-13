from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker

from config import settings

# Import ApplicationLog to register it in Base.metadata even though
# nothing writes to it in v0 — ensures create_all creates the table.
from models.application_log import ApplicationLog  # noqa: F401
from models.job import Base, Job  # noqa: F401

engine = create_engine(
    settings.database_url,
    connect_args={"check_same_thread": False},  # required for SQLite + threading
)

Session = sessionmaker(engine, autoflush=False, autocommit=False)


def init_db() -> None:
    """Create all tables. Safe to call multiple times (no-op if tables exist)."""
    Base.metadata.create_all(engine)
