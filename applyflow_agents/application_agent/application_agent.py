"""Application Tracking Agent - Handles CRUD operations for job applications."""

from google.adk.agents import LlmAgent


def add_application(
    job_title: str,
    company: str,
    pay: int | None = None,
    location: str | None = None,
    job_url: str | None = None,
    resume_id: str | None = None,
) -> dict:
    """Add a new job application."""
    return {
        "status": "success",
        "message": f"Added application for {job_title} at {company}",
        "data": {
            "job_title": job_title,
            "company": company,
            "pay": pay,
            "location": location,
            "job_url": job_url,
            "resume_id": resume_id,
            "status": "applied",
        },
    }


def update_application(
    application_id: str,
    job_title: str | None = None,
    company: str | None = None,
    pay: int | None = None,
    location: str | None = None,
    status: str | None = None,
    resume_id: str | None = None,
    job_url: str | None = None,
) -> dict:
    """Update an existing job application."""
    return {
        "status": "success",
        "message": f"Updated application {application_id}",
        "data": {
            "id": application_id,
            "job_title": job_title,
            "company": company,
            "pay": pay,
            "location": location,
            "status": status,
            "resume_id": resume_id,
            "job_url": job_url,
        },
    }


def delete_application(application_id: str) -> dict:
    """Delete a job application."""
    return {
        "status": "success",
        "message": f"Deleted application {application_id}",
    }


def get_applications(status: str | None = None) -> dict:
    """Get all job applications, optionally filtered by status."""
    return {
        "status": "success",
        "message": "Retrieved applications",
        "data": [],  # Will be replaced with actual database query
    }


def set_active_application(application_id: str) -> dict:
    """Set the active application in the UI."""
    return {
        "status": "success",
        "message": f"Set active application to {application_id}",
        "application_id": application_id,
    }


application_tracking_agent = LlmAgent(
    name="ApplicationTracking",
    model="gemini-2.5-flash",
    description="Manages job applications - add, update, delete, and retrieve applications.",
    instruction="""You are an application tracking assistant. Help users manage their job applications.

Key capabilities:
- Add new job applications with details like job title, company, pay, location, and resume used
- Update existing applications (status, details, etc.)
- Delete applications
- Retrieve applications (all or filtered by status)
- Set the active application in the UI for viewing

When adding or updating applications, try to extract as much information as possible from the user's input.
Be conversational and helpful in guiding users through managing their applications.""",
    tools=[
        add_application,
        update_application,
        delete_application,
        get_applications,
        set_active_application,
    ],
)


root_agent = application_tracking_agent
