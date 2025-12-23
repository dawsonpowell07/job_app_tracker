from datetime import datetime
from sqlmodel import select
from models.models import Application, ApplicationStatus
from typing import Any
from uuid import UUID
from sqlalchemy.ext.asyncio import AsyncSession


class ApplicationService:
    @staticmethod
    async def get_application_by_id(
        session: AsyncSession,
        application_id: UUID,
        user_id: str | None = None,
    ):
        statement = select(Application).where(Application.id == application_id)
        if user_id is not None:
            statement = statement.where(Application.user_id == user_id)
        results = await session.execute(statement)
        return results.scalar_one_or_none()

    @staticmethod
    async def get_applications(
        session: AsyncSession,
        user_id: str | None = None,
        status: ApplicationStatus | None = None,
        limit: int | None = None,
        offset: int | None = None
    ):
        statement = select(Application)
        if user_id is not None:
            statement = statement.where(Application.user_id == user_id)
        if status is not None:
            statement = statement.where(Application.status == status)
        if offset is not None:
            statement = statement.offset(offset)
        if limit is not None:
            statement = statement.limit(limit)
        results = await session.execute(statement)
        return results.scalars().all()

    @staticmethod
    async def create_application(
        session: AsyncSession,
        application_data: dict[str, Any],
    ):
        application = Application(**application_data)
        if application.status_changed_at is None and application.status is not None:
            application.status_changed_at = datetime.utcnow()
        session.add(application)
        await session.commit()
        await session.refresh(application)
        return application

    @staticmethod
    async def update_application(
        session: AsyncSession,
        application_id: UUID,
        application_data: dict[str, Any],
        user_id: str | None = None,
    ):
        application = await ApplicationService.get_application_by_id(
            session,
            application_id,
            user_id,
        )
        if application is None:
            return None
        excluded_fields = {"id", "user_id", "created_at"}
        original_status = application.status
        for key, value in application_data.items():
            if key in excluded_fields:
                continue
            if hasattr(application, key):
                setattr(application, key, value)
        application.updated_at = datetime.utcnow()
        if "status" in application_data and application.status != original_status:
            application.status_changed_at = datetime.utcnow()
        await session.commit()
        await session.refresh(application)
        return application

    @staticmethod
    async def delete_application(
        session: AsyncSession,
        application_id: UUID,
        user_id: str | None = None,
    ) -> bool:
        application = await ApplicationService.get_application_by_id(
            session,
            application_id,
            user_id,
        )
        if application is None:
            return False
        await session.delete(application)
        await session.commit()
        return True
