from sqlmodel import select
from models.models import Application
from uuid import UUID
from sqlalchemy.ext.asyncio import AsyncSession


class ApplicationService:
    @staticmethod
    async def get_application_by_id(session: AsyncSession, application_id: UUID, user_id: UUID):
        statement = select(Application).where(
            Application.id == application_id).where(Application.user_id == user_id)
        results = await session.execute(statement)
        return results.scalar_one_or_none()
