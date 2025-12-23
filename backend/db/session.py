from sqlalchemy.ext.asyncio import create_async_engine, AsyncSession
from sqlalchemy.orm import sessionmaker
from core.settings import get_settings

settings = get_settings()
# Replace with your actual Postgres credentials
DATABASE_URL = settings.database_url

engine = create_async_engine(DATABASE_URL, echo=True)

# Dependency to get a DB session for each request


async def get_session():
    async_session = sessionmaker(
        engine, class_=AsyncSession, expire_on_commit=False
    )
    async with async_session() as session:
        yield session
