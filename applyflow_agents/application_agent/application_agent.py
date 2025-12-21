"""Application Tracking Agent - Handles CRUD operations for job applications."""

from asyncio import sleep
from google.adk.agents import LlmAgent


async def add_application(
    job_title: str,
    company: str,
    pay: int | None = None,
    location: str | None = None,
    job_url: str | None = None,
    resume_id: str | None = None,
    status: str = "applied",
) -> dict:
    """Add a new job application. Always assume statu is "applied" if not provided."""
    await sleep(5)  # Simulate database operation delay
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
            "status": status,
        },
    }


async def update_application(
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
    await sleep(5)
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


async def delete_application(application_id: str) -> dict:
    """Delete a job application."""
    await sleep(5)
    return {
        "status": "success",
        "message": f"Deleted application {application_id}",
    }


async def get_applications(status: str | None = None) -> dict:
    """Get all job applications, optionally filtered by status."""
    await sleep(5)

    return {
        "status": "success",
        "message": "Retrieved applications",
        "data": [{
            "id": "1",
            "job_title": "Software Engineer",
            "company": "Tech Corp",
            "status": "applied",
            "pay": 85000,
            "location": "San Francisco, CA",
            "created_at": "2023-10-15T14:30:00Z"
        }],  # Will be replaced with actual database query
    }


async def set_active_application(application_id: str) -> dict:
    """Set the active application in the UI."""
    await sleep(5)
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
Be conversational and helpful in guiding users through managing their applications.

{
    id: "app1",
    user_id: "user123",
    job_title: "Software Engineer",
    company: "Tech Solutions Inc.",
    pay: 120000,
    location: "San Francisco, CA",
    resume_used: "Software_Engineer_Resume.pdf",
    resume_id: "res1",
    job_url: "https://example.com/job/app1",
    status: "applied",
    created_at: new Date("2024-10-26T10:00:00Z"),
    updated_at: new Date("2024-10-26T10:00:00Z"),
  },
  {
    id: "app2",
    user_id: "user123",
    job_title: "Senior Product Manager",
    company: "Innovate Co.",
    pay: 160000,
    location: "New York, NY",
    resume_used: "Product_Manager_Resume.pdf",
    resume_id: "res2",
    job_url: "https://example.com/job/app2",
    status: "interviewing",
    created_at: new Date("2024-10-20T11:30:00Z"),
    updated_at: new Date("2024-10-28T14:00:00Z"),
  },
  {
    id: "app3",
    user_id: "user123",
    job_title: "Data Scientist",
    company: "Data Insights LLC",
    pay: 135000,
    location: "Seattle, WA",
    resume_used: "Data_Scientist_Resume.pdf",
    resume_id: "res3",
    job_url: "https://example.com/job/app3",
    status: "rejected",
    created_at: new Date("2024-10-15T09:15:00Z"),
    updated_at: new Date("2024-11-01T16:00:00Z"),
  },
  {
    id: "app4",
    user_id: "user123",
    job_title: "Frontend Developer",
    company: "WebCrafters",
    pay: 110000,
    location: "Remote",
    resume_used: "Frontend_Resume.pdf",
    resume_id: "res4",
    job_url: "https://example.com/job/app4",
    status: "offer",
    created_at: new Date("2024-11-01T13:00:00Z"),
    updated_at: new Date("2024-11-05T10:00:00Z"),
  },
  {
    id: "app5",
    user_id: "user123",
    job_title: "DevOps Engineer",
    company: "CloudOps Inc.",
    pay: 145000,
    location: "Austin, TX",
    resume_used: "DevOps_Resume.pdf",
    resume_id: "res5",
    job_url: "https://example.com/job/app5",
    status: "applied",
    created_at: new Date("2024-11-05T08:45:00Z"),
    updated_at: new Date("2024-11-05T08:45:00Z"),
  },
  {
    id: "app6",
    user_id: "user123",
    job_title: "Full Stack Engineer",
    company: "StartupXYZ",
    pay: 130000,
    location: "Boston, MA",
    resume_used: "Software_Engineer_Resume.pdf",
    resume_id: "res1",
    job_url: "https://example.com/job/app6",
    status: "ghosted",
    created_at: new Date("2024-10-01T14:30:00Z"),
    updated_at: new Date("2024-10-01T14:30:00Z"),
  },
  {
    id: "app7",
    user_id: "user123",
    job_title: "Backend Developer",
    company: "Enterprise Corp",
    pay: 125000,
    location: "Chicago, IL",
    resume_used: "Software_Engineer_Resume.pdf",
    resume_id: "res1",
    job_url: "https://example.com/job/app7",
    status: "ghosted",
    created_at: new Date("2024-09-25T09:00:00Z"),
    updated_at: new Date("2024-09-25T09:00:00Z"),
  },
];

export const mockResumes: Resume[] = [
  {
    id: "res1",
    user_id: "user123",
    file_name: "Software_Engineer_Resume.pdf",
    s3_key: "user123/resumes/Software_Engineer_Resume.pdf",
    upload_status: "completed",
    created_at: new Date("2024-10-01T09:00:00Z"),
    updated_at: new Date("2024-10-01T09:00:00Z"),
  },
  {
    id: "res2",
    user_id: "user123",
    file_name: "Product_Manager_Resume.pdf",
    s3_key: "user123/resumes/Product_Manager_Resume.pdf",
    upload_status: "completed",
    created_at: new Date("2024-09-15T14:00:00Z"),
    updated_at: new Date("2024-09-15T14:00:00Z"),
  },
  {
    id: "res3",
    user_id: "user123",
    file_name: "Data_Scientist_Resume.pdf",
    s3_key: "user123/resumes/Data_Scientist_Resume.pdf",
    upload_status: "completed",
    created_at: new Date("2024-10-10T10:30:00Z"),
    updated_at: new Date("2024-10-10T10:30:00Z"),
  },
  {
    id: "res4",
    user_id: "user123",
    file_name: "Frontend_Resume.pdf",
    s3_key: "user123/resumes/Frontend_Resume.pdf",
    upload_status: "completed",
    created_at: new Date("2024-09-20T11:00:00Z"),
    updated_at: new Date("2024-09-20T11:00:00Z"),
  },
  {
    id: "res5",
    user_id: "user123",
    file_name: "DevOps_Resume.pdf",
    s3_key: "user123/resumes/DevOps_Resume.pdf",
    upload_status: "completed",
    created_at: new Date("2024-11-01T16:00:00Z"),
    updated_at: new Date("2024-11-01T16:00:00Z"),
  },
""",
    tools=[
        add_application,
        update_application,
        delete_application,
        get_applications,
        set_active_application,
    ],
)


root_agent = application_tracking_agent
