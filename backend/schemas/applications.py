from datetime import datetime
from typing import Optional
from uuid import UUID

from pydantic import BaseModel, ConfigDict, Field

from models.models import ApplicationStatus, CompensationType


class ApplicationCreate(BaseModel):
    model_config = ConfigDict(extra="forbid")

    company: str
    job_title: str
    location: Optional[str] = None
    job_url: Optional[str] = None
    job_description: Optional[str] = None

    compensation_type: Optional[CompensationType] = None
    pay_min: Optional[int] = None
    pay_max: Optional[int] = None
    pay: Optional[int] = None
    currency: str = "USD"

    status: ApplicationStatus = ApplicationStatus.draft
    status_changed_at: Optional[datetime] = None

    ai_labels: list[str] = Field(default_factory=list)
    ai_metadata: dict = Field(default_factory=dict)

    resume_used_id: Optional[UUID] = None
    source: str = "manual"
    applied_at: Optional[datetime] = None


class ApplicationUpdate(BaseModel):
    model_config = ConfigDict(extra="forbid")

    company: Optional[str] = None
    job_title: Optional[str] = None
    location: Optional[str] = None
    job_url: Optional[str] = None
    job_description: Optional[str] = None

    compensation_type: Optional[CompensationType] = None
    pay_min: Optional[int] = None
    pay_max: Optional[int] = None
    pay: Optional[int] = None
    currency: Optional[str] = None

    status: Optional[ApplicationStatus] = None
    status_changed_at: Optional[datetime] = None

    ai_labels: Optional[list[str]] = None
    ai_metadata: Optional[dict] = None

    resume_used_id: Optional[UUID] = None
    source: Optional[str] = None
    applied_at: Optional[datetime] = None


class ApplicationQueryParams(BaseModel):
    model_config = ConfigDict(extra="forbid")

    status: Optional[ApplicationStatus] = None
    limit: Optional[int] = Field(default=None, ge=1, le=200)
    offset: Optional[int] = Field(default=None, ge=0)
