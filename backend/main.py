from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from routers import chat
from settings import settings

app = FastAPI(
    title=settings.app_title,
    description=settings.app_description,
    version=settings.app_version
)

# CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.cors_origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include routers
app.include_router(chat.router)


@app.get("/")
def hello(name: str = "World"):
    """Return a friendly HTTP greeting."""
    return {
        "message": f"Hello {name}!"
    }


@app.get("/health")
def health_check():
    """Health check endpoint."""
    return {"status": "healthy"}
