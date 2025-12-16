from pydantic import BaseModel, Field, ConfigDict
from typing import Optional, List, Dict, Any
from datetime import datetime, timezone
from enum import Enum


class ApplicationStatus(str, Enum):
    APPLIED = "applied"
    INTERVIEW = "interview"
    OFFER = "offer"
    REJECTED = "rejected"
    ACCEPTED = "accepted"


class CompensationType(str, Enum):
    SALARY = "salary"
    HOURLY = "hourly"


class Compensation(BaseModel):
    min: Optional[float] = None
    max: Optional[float] = None
    currency: str = "USD"
    type: CompensationType = CompensationType.SALARY


class TimelineEvent(BaseModel):
    date: datetime
    event: str
    notes: Optional[str] = None
    next_steps: Optional[str] = None


class Application(BaseModel):
    # Mandatory
    company: str
    applied_date: datetime = Field(alias="appliedDate")
    status: ApplicationStatus

    # Optional
    location: Optional[str] = None
    compensation: Optional[Compensation] = None
    notes: Optional[str] = None

    # Additional
    job_title: Optional[str] = Field(None, alias="jobTitle")
    job_description: Optional[str] = Field(None, alias="jobDescription")
    job_url: Optional[str] = Field(None, alias="jobUrl")
    resume_used: Optional[str] = Field(None, alias="resumeUsed")
    timeline: List[TimelineEvent] = Field(default_factory=list)

    # Metadata
    created_at: datetime = Field(
        default_factory=lambda: datetime.now(timezone.utc),
        alias="createdAt")
    updated_at: datetime = Field(
        default_factory=lambda: datetime.now(timezone.utc), alias="updatedAt")
    last_activity_date: datetime = Field(
        default_factory=lambda: datetime.now(timezone.utc), alias="lastActivityDate")

    class Config:
        populate_by_name = True
        use_enum_values = True


class ApplicationPublic(Application):
    """Public application model with ID included for API responses."""
    id: str


class DeleteApplicationResponse(BaseModel):
    """Response model for application deletion."""
    message: str
    application_id: str = Field(alias="applicationId")

    class Config:
        populate_by_name = True


class ApplicationStats(BaseModel):
    """Summary statistics for user's applications."""
    total: int
    by_status: Dict[str, int] = Field(alias="byStatus")
    recent_activity: List[Dict[str, Any]] = Field(alias="recentActivity")

    class Config:
        populate_by_name = True


class Experience(BaseModel):
    company: str
    title: str
    start_date: str = Field(alias="startDate")
    end_date: Optional[str] = Field(None, alias="endDate")
    description: str


class Education(BaseModel):
    institution: str
    degree: str
    field: str
    graduation_date: str = Field(alias="graduationDate")


class Project(BaseModel):
    name: str
    description: str
    technologies: List[str]


class ResumeContent(BaseModel):
    raw_text: str = Field(alias="rawText")
    sections: Dict[str, Any]


class Resume(BaseModel):
    name: str
    version: str
    created_at: datetime = Field(
        default_factory=lambda: datetime.now(timezone.utc),
        alias="createdAt")
    updated_at: datetime = Field(
        default_factory=lambda: datetime.now(timezone.utc),
        alias="updatedAt")
    is_default: bool = Field(False, alias="isDefault")

    storage_url: str = Field(alias="storageUrl")
    file_type: str = Field(alias="fileType")
    file_size: int = Field(alias="fileSize")

    content: ResumeContent
    keywords: List[str] = Field(default_factory=list)
    embedding_id: Optional[str] = Field(None, alias="embeddingId")

    class Config:
        populate_by_name = True
