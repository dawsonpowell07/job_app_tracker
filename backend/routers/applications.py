from fastapi import APIRouter, Depends, HTTPException
from fastapi_clerk_auth import HTTPAuthorizationCredentials, ClerkHTTPBearer, ClerkConfig
from services.applications import ApplicationService
from db.session import get_session
from sqlalchemy.ext.asyncio import AsyncSession
from uuid import UUID
from core.settings import get_settings
from schemas.applications import (
    ApplicationCreate,
    ApplicationQueryParams,
    ApplicationUpdate,
)

router = APIRouter(prefix="/applications", tags=["applications"])
settings = get_settings()
clerk_config = ClerkConfig(
    jwks_url=settings.clerk_jwks_url)


clerk_auth_guard = ClerkHTTPBearer(config=clerk_config, debug_mode=False)


def _get_user_id(auth: HTTPAuthorizationCredentials) -> str:
    if not auth or not auth.decoded or "sub" not in auth.decoded:
        print("PENIS 1")
        raise HTTPException(status_code=401, detail="Unauthorized")
    return str(auth.decoded["sub"])


@router.get("/")
async def get_applications(
    params: ApplicationQueryParams = Depends(),
    session: AsyncSession = Depends(get_session),
    auth: HTTPAuthorizationCredentials = Depends(clerk_auth_guard),
):
    user_id = _get_user_id(auth)
    applications = await ApplicationService.get_applications(
        session=session,
        user_id=user_id,
        status=params.status,
        limit=params.limit,
        offset=params.offset,
    )
    return applications


@router.get("/{app_id}")
async def get_application_by_id(
    app_id: UUID,
    session: AsyncSession = Depends(get_session),
    auth: HTTPAuthorizationCredentials = Depends(clerk_auth_guard),
):
    user_id = _get_user_id(auth)
    application = await ApplicationService.get_application_by_id(
        session,
        app_id,
        user_id,
    )
    if not application:
        raise HTTPException(status_code=404, detail="Application not found")
    return application


@router.post("/", status_code=201)
async def create_application(
    app_data: ApplicationCreate,
    session: AsyncSession = Depends(get_session),
    auth: HTTPAuthorizationCredentials = Depends(clerk_auth_guard),
):
    user_id = _get_user_id(auth)
    payload = app_data.model_dump()
    payload["user_id"] = user_id
    application = await ApplicationService.create_application(session, payload)
    return application


@router.patch("/{app_id}")
async def update_application(
    app_id: UUID,
    app_data: ApplicationUpdate,
    session: AsyncSession = Depends(get_session),
    auth: HTTPAuthorizationCredentials = Depends(clerk_auth_guard),
):
    user_id = _get_user_id(auth)
    payload = app_data.model_dump(exclude_unset=True)
    application = await ApplicationService.update_application(
        session=session,
        application_id=app_id,
        application_data=payload,
        user_id=user_id,
    )
    if not application:
        raise HTTPException(status_code=404, detail="Application not found")
    return application


@router.delete("/{app_id}", status_code=204)
async def delete_application(
    app_id: UUID,
    session: AsyncSession = Depends(get_session),
    auth: HTTPAuthorizationCredentials = Depends(clerk_auth_guard),
):
    user_id = _get_user_id(auth)
    deleted = await ApplicationService.delete_application(
        session,
        app_id,
        user_id,
    )
    if not deleted:
        raise HTTPException(status_code=404, detail="Application not found")
