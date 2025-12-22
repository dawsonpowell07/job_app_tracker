from datetime import datetime
from enum import Enum
from typing import Optional
from uuid import UUID, uuid4

from sqlmodel import SQLModel, Field, Relationship
from sqlalchemy import Column, JSON, Enum as SAEnum, Text
from sqlalchemy.dialects.postgresql import ARRAY


class ApplicationStatus(str, Enum):
    draft = "draft"
    applied = "applied"
    interviewing = "interviewing"
    offer = "offer"
    rejected = "rejected"
    ghosted = "ghosted"
    withdrawn = "withdrawn"


class CompensationType(str, Enum):
    salary = "salary"
    hourly = "hourly"


class User(SQLModel, table=True):
    __tablename__ = "users"

    id: UUID = Field(default_factory=uuid4, primary_key=True)

    auth0_user_id: str = Field(index=True, unique=True, nullable=False)
    email: Optional[str] = None
    name: Optional[str] = None
    avatar_url: Optional[str] = None

    preferences: dict = Field(
        default_factory=dict,
        sa_column=Column(JSON, nullable=False),
    )

    created_at: datetime = Field(default_factory=datetime.utcnow)
    updated_at: datetime = Field(default_factory=datetime.utcnow)

    resumes: list["Resume"] = Relationship(back_populates="user")
    applications: list["Application"] = Relationship(back_populates="user")
    labels: list["Label"] = Relationship(back_populates="user")


class Application(SQLModel, table=True):
    __tablename__ = "applications"

    id: UUID = Field(default_factory=uuid4, primary_key=True)
    user_id: UUID = Field(foreign_key="users.id", nullable=False)

    company: str
    job_title: str
    location: Optional[str] = None
    job_url: Optional[str] = None
    job_description: Optional[str] = Field(sa_column=Column(Text))

    compensation_type: Optional[CompensationType] = Field(
        sa_column=Column(SAEnum(CompensationType))
    )
    pay_min: Optional[int] = None
    pay_max: Optional[int] = None
    currency: str = Field(default="USD")

    status: ApplicationStatus = Field(
        default=ApplicationStatus.draft,
        sa_column=Column(SAEnum(ApplicationStatus), nullable=False),
    )
    status_changed_at: Optional[datetime] = None

    ai_labels: list[str] = Field(
        default_factory=list,
        sa_column=Column(ARRAY(Text), nullable=False),
    )
    ai_match_score: Optional[float] = None
    ai_notes: Optional[str] = Field(sa_column=Column(Text))
    ai_metadata: dict = Field(
        default_factory=dict,
        sa_column=Column(JSON, nullable=False),
    )

    resume_used_id: Optional[UUID] = Field(foreign_key="resumes.id")
    source: str = Field(default="manual")

    applied_at: Optional[datetime] = None
    created_at: datetime = Field(default_factory=datetime.utcnow)
    updated_at: datetime = Field(default_factory=datetime.utcnow)

    user: "User" = Relationship(back_populates="applications")
    resume_used: Optional["Resume"] = Relationship(
        back_populates="applications")
    labels: list["ApplicationLabel"] = Relationship(
        back_populates="application")
    events: list["ApplicationEvent"] = Relationship(
        back_populates="application")


class Resume(SQLModel, table=True):
    __tablename__ = "resumes"

    id: UUID = Field(default_factory=uuid4, primary_key=True)
    user_id: UUID = Field(foreign_key="users.id", nullable=False)

    file_name: str
    file_type: Optional[str] = None
    file_size_bytes: Optional[int] = None

    r2_key: str = Field(unique=True, nullable=False)
    r2_bucket: Optional[str] = None

    parsed_text: Optional[str] = Field(sa_column=Column(Text))
    ai_summary: Optional[str] = Field(sa_column=Column(Text))
    ai_tags: list[str] = Field(
        default_factory=list,
        sa_column=Column(ARRAY(Text), nullable=False),
    )

    created_at: datetime = Field(default_factory=datetime.utcnow)
    uploaded_at: datetime = Field(default_factory=datetime.utcnow)

    user: "User" = Relationship(back_populates="resumes")
    applications: list["Application"] = Relationship(
        back_populates="resume_used")


class Label(SQLModel, table=True):
    __tablename__ = "labels"

    id: UUID = Field(default_factory=uuid4, primary_key=True)
    user_id: UUID = Field(foreign_key="users.id", nullable=False)

    name: str
    color: Optional[str] = None
    source: str = Field(default="user")

    created_at: datetime = Field(default_factory=datetime.utcnow)

    user: "User" = Relationship(back_populates="labels")
    applications: list["ApplicationLabel"] = Relationship(
        back_populates="label")


class ApplicationLabel(SQLModel, table=True):
    __tablename__ = "application_labels"

    application_id: UUID = Field(
        foreign_key="applications.id", primary_key=True)
    label_id: UUID = Field(foreign_key="labels.id", primary_key=True)

    application: "Application" = Relationship(back_populates="labels")
    label: "Label" = Relationship(back_populates="applications")


class ApplicationEvent(SQLModel, table=True):
    __tablename__ = "application_events"

    id: UUID = Field(default_factory=uuid4, primary_key=True)
    application_id: UUID = Field(foreign_key="applications.id", nullable=False)

    event_type: str
    payload: dict = Field(
        default_factory=dict,
        sa_column=Column(JSON, nullable=False),
    )
    created_by: str = Field(default="user")

    created_at: datetime = Field(default_factory=datetime.utcnow)

    application: "Application" = Relationship(back_populates="events")
