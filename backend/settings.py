from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    """Application settings loaded from environment variables."""

    # Vertex AI Configuration
    vertex_project_id: str
    vertex_location: str = "us-central1"
    vertex_resource_id: str
    staging_bucket: str

    # Firebase Configuration
    firebase_credentials_path: str = "credentials.json"
    firestore_collection_applications: str = "applications"
    firestore_collection_users: str = "users"

    # CORS Configuration
    cors_origins: list[str] = ["*"]

    # App Configuration
    app_title: str = "Job Application Tracker API"
    app_description: str = "API for managing job applications with AI chat assistant"
    app_version: str = "1.0.0"

    model_config = SettingsConfigDict(
        env_file=".env",
        env_file_encoding="utf-8",
        case_sensitive=False,
        extra="ignore"
    )


# Create a single instance to be imported throughout the app
settings = Settings()
