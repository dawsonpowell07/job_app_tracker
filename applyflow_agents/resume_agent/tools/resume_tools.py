def get_resume_advice(job_description: str, current_resume: str | None = None) -> dict:
    """Get advice on how to tailor a resume for a specific job."""
    return {
        "status": "success",
        "message": "Generated resume advice",
        "advice": f"Based on the job description, consider highlighting these key areas...",
    }


def upload_resume(file_name: str, file_content: str) -> dict:
    """Upload a new resume."""
    return {
        "status": "success",
        "message": f"Uploaded resume: {file_name}",
        "resume_id": "res_new_123",
        "file_name": file_name,
    }


def get_resumes() -> dict:
    """Get all uploaded resumes for the user."""
    return {
        "status": "success",
        "message": "Retrieved resumes",
        "data": [],  # Will be replaced with actual database query
    }


def delete_resume(resume_id: str) -> dict:
    """Delete a resume."""
    return {
        "status": "success",
        "message": f"Deleted resume {resume_id}",
    }


def tailor_resume(resume_id: str, job_description: str) -> dict:
    """Generate a tailored version of a resume for a specific job."""
    return {
        "status": "success",
        "message": "Generated tailored resume",
        "tailored_resume_id": f"{resume_id}_tailored",
    }
