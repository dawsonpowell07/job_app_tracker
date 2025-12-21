from asyncio import sleep
import requests
from bs4 import BeautifulSoup


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


async def add_job_from_url(job_url: str) -> dict:
    """Add a new job application from a job URL."""
    await sleep(5)
    return {
        "status": "success",
        "message": f"Added job from URL {job_url}",
        "data": {
            "job_title": "Software Engineer",
            "company": "Tech Corp",
            "pay": 85000,
            "location": "San Francisco, CA",
            "job_url": job_url,
            "status": "applied",
        },
    }


def fetch_job_posting(url: str) -> dict:
    response = requests.get(
        url,
        headers={"User-Agent": "ApplyFlowBot/1.0"},
        timeout=10,
    )
    response.raise_for_status()

    soup = BeautifulSoup(response.text, "html.parser")

    for tag in soup(["script", "style", "nav", "footer"]):
        tag.decompose()

    main = soup.find("main") or soup.find("article") or soup.body
    if not main:
        return {"status": "error",
                "message": "Could not find job posting content",
                "instructions": "Advise the user to provide the job description directly or add the application themeselves and explain you cannot access the job posting"
                }

    text = main.get_text(separator="\n", strip=True)

    return {
        "url": url,
        "content": text[:12000],
        "source": "job_posting"
    }
