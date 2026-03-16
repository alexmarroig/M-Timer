import enum
from datetime import datetime, timezone
from typing import Literal

from pydantic import BaseModel
from sqlalchemy import Boolean, DateTime, Enum, Integer, String, Text
from sqlalchemy.orm import DeclarativeBase, Mapped, mapped_column


class Base(DeclarativeBase):
    pass


class JobStatus(str, enum.Enum):
    new = "new"
    applied = "applied"
    skipped = "skipped"


class Job(Base):
    __tablename__ = "jobs"

    id: Mapped[int] = mapped_column(Integer, primary_key=True, autoincrement=True)
    source: Mapped[str] = mapped_column(String(50), nullable=False)
    title: Mapped[str] = mapped_column(String(255), nullable=False)
    company: Mapped[str] = mapped_column(String(255), nullable=False)
    location: Mapped[str] = mapped_column(String(255), nullable=False)
    url: Mapped[str] = mapped_column(String(2048), unique=True, nullable=False)
    summary: Mapped[str | None] = mapped_column(Text, nullable=True)
    is_easy_apply: Mapped[bool] = mapped_column(Boolean, default=False)
    collected_at: Mapped[datetime] = mapped_column(
        DateTime, nullable=False, default=lambda: datetime.now(timezone.utc)
    )
    status: Mapped[str] = mapped_column(
        Enum("new", "applied", "skipped", name="job_status"),
        default="new",
        nullable=False,
    )
    # Filter & match metadata
    salary_raw: Mapped[str | None] = mapped_column(Text, nullable=True)
    salary_flagged: Mapped[bool] = mapped_column(Boolean, nullable=False, default=False)
    skill_match_pct: Mapped[int | None] = mapped_column(Integer, nullable=True)
    filter_reason: Mapped[str | None] = mapped_column(String(255), nullable=True)


class JobSchema(BaseModel):
    model_config = {"from_attributes": True}

    id: int
    source: str
    title: str
    company: str
    location: str
    url: str
    summary: str | None
    is_easy_apply: bool
    collected_at: datetime
    status: Literal["new", "applied", "skipped"]
    salary_raw: str | None = None
    salary_flagged: bool = False
    skill_match_pct: int | None = None
    filter_reason: str | None = None
