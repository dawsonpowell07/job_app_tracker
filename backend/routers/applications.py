from fastapi import APIRouter, HTTPException, Query
from typing import Optional, List
from datetime import datetime, timezone
from models.data_models import (
    Application,
    ApplicationPublic,
    DeleteApplicationResponse,
    ApplicationStats,
    ApplicationStatus
)
from db import get_user_applications_collection
from firebase_admin import firestore

router = APIRouter(prefix="/applications", tags=["applications"])


def application_to_dict(app: Application) -> dict:
    """Convert Application model to Firestore-compatible dict."""
    data = app.model_dump(by_alias=True, exclude_none=False)
    # Convert datetime objects to Firestore timestamps
    for key in ["appliedDate", "createdAt", "updatedAt", "lastActivityDate"]:
        if key in data and isinstance(data[key], datetime):
            data[key] = data[key]
    # Convert timeline events
    if "timeline" in data:
        for event in data["timeline"]:
            if "date" in event and isinstance(event["date"], datetime):
                event["date"] = event["date"]
    return data


def dict_to_application_public(doc_id: str, data: dict) -> ApplicationPublic:
    """Convert Firestore document to ApplicationPublic model."""
    data["id"] = doc_id
    return ApplicationPublic(**data)


@router.post("", response_model=ApplicationPublic, status_code=201)
async def create_application(
    application: Application,
    user_id: str = Query(..., description="User ID from Firebase Auth")
):
    """Create a new job application for a user."""
    try:
        # Set timestamps
        now = datetime.now(timezone.utc)
        application.created_at = now
        application.updated_at = now
        application.last_activity_date = now

        # Convert to dict and store in Firestore
        app_dict = application_to_dict(application)

        # Add to user's applications subcollection
        collection_ref = get_user_applications_collection(user_id)
        doc_ref = collection_ref.add(app_dict)[1]

        # Return the created application with ID
        return dict_to_application_public(doc_ref.id, app_dict)
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to create application: {str(e)}")


@router.get("", response_model=List[ApplicationPublic])
async def list_applications(
    user_id: str = Query(..., description="User ID from Firebase Auth"),
    status: Optional[ApplicationStatus] = Query(None, description="Filter by application status"),
    limit: int = Query(100, ge=1, le=500, description="Maximum number of applications to return"),
    offset: int = Query(0, ge=0, description="Number of applications to skip")
):
    """List all job applications for a user with optional filtering."""
    try:
        collection_ref = get_user_applications_collection(user_id)
        query = collection_ref

        # Apply status filter if provided
        if status:
            query = query.where("status", "==", status.value)

        # Order by last activity date (most recent first)
        query = query.order_by("lastActivityDate", direction=firestore.Query.DESCENDING)

        # Apply pagination
        query = query.offset(offset).limit(limit)

        # Execute query
        docs = query.stream()

        applications = []
        for doc in docs:
            app_data = doc.to_dict()
            applications.append(dict_to_application_public(doc.id, app_data))

        return applications
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to list applications: {str(e)}")


@router.get("/stats", response_model=ApplicationStats)
async def get_application_stats(
    user_id: str = Query(..., description="User ID from Firebase Auth")
):
    """Get summary statistics for a user's job applications."""
    try:
        collection_ref = get_user_applications_collection(user_id)
        docs = collection_ref.stream()

        total = 0
        by_status = {}
        recent_activity = []

        for doc in docs:
            total += 1
            app_data = doc.to_dict()

            # Count by status
            status = app_data.get("status", "unknown")
            by_status[status] = by_status.get(status, 0) + 1

            # Collect recent activity (we'll sort later)
            recent_activity.append({
                "id": doc.id,
                "company": app_data.get("company", ""),
                "jobTitle": app_data.get("jobTitle", ""),
                "status": status,
                "lastActivityDate": app_data.get("lastActivityDate", datetime.now(timezone.utc))
            })

        # Sort by last activity date and take top 10
        recent_activity.sort(key=lambda x: x["lastActivityDate"], reverse=True)
        recent_activity = recent_activity[:10]

        # Convert datetime to ISO string for JSON serialization
        for item in recent_activity:
            if isinstance(item["lastActivityDate"], datetime):
                item["lastActivityDate"] = item["lastActivityDate"].isoformat()

        return ApplicationStats(
            total=total,
            byStatus=by_status,
            recentActivity=recent_activity
        )
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to get application stats: {str(e)}")


@router.get("/{application_id}", response_model=ApplicationPublic)
async def get_application(
    application_id: str,
    user_id: str = Query(..., description="User ID from Firebase Auth")
):
    """Get a specific job application by ID."""
    try:
        collection_ref = get_user_applications_collection(user_id)
        doc_ref = collection_ref.document(application_id)
        doc = doc_ref.get()

        if not doc.exists:
            raise HTTPException(status_code=404, detail="Application not found")

        app_data = doc.to_dict()
        return dict_to_application_public(doc.id, app_data)
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to get application: {str(e)}")


@router.put("/{application_id}", response_model=ApplicationPublic)
async def update_application(
    application_id: str,
    application: Application,
    user_id: str = Query(..., description="User ID from Firebase Auth")
):
    """Update an existing job application."""
    try:
        collection_ref = get_user_applications_collection(user_id)
        doc_ref = collection_ref.document(application_id)

        # Check if document exists
        if not doc_ref.get().exists:
            raise HTTPException(status_code=404, detail="Application not found")

        # Update the updated_at and last_activity_date timestamps
        now = datetime.now(timezone.utc)
        application.updated_at = now
        application.last_activity_date = now

        # Convert to dict and update in Firestore
        app_dict = application_to_dict(application)
        doc_ref.set(app_dict)

        # Return the updated application with ID
        return dict_to_application_public(application_id, app_dict)
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to update application: {str(e)}")


@router.delete("/{application_id}", response_model=DeleteApplicationResponse)
async def delete_application(
    application_id: str,
    user_id: str = Query(..., description="User ID from Firebase Auth")
):
    """Delete a job application."""
    try:
        collection_ref = get_user_applications_collection(user_id)
        doc_ref = collection_ref.document(application_id)

        # Check if document exists
        if not doc_ref.get().exists:
            raise HTTPException(status_code=404, detail="Application not found")

        # Delete the document
        doc_ref.delete()

        return DeleteApplicationResponse(
            message="Application deleted successfully",
            applicationId=application_id
        )
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to delete application: {str(e)}")
