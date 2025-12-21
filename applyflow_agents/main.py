from fastapi import FastAPI
from ag_ui_adk import ADKAgent, add_adk_fastapi_endpoint
from application_agent.application_agent import root_agent as application_tracking_agent
from resume_agent.resume_agent import root_agent as resume_support_agent
from insight_agent.insight_agent import root_agent as insights_agent
from fastapi.middleware.cors import CORSMiddleware


# Create ADK agent instances for each specialized agent
applications_adk = ADKAgent(
    adk_agent=application_tracking_agent,
    app_name="application_agent",
    user_id_extractor=lambda input: input.state.get(
        "headers", {}).get("user_id", "anonymous"),
)

resumes_adk = ADKAgent(
    adk_agent=resume_support_agent,
    app_name="resume_agent",
    user_id_extractor=lambda input: input.state.get(
        "headers", {}).get("user_id", "anonymous"),
)

insights_adk = ADKAgent(
    adk_agent=insights_agent,
    app_name="insights_agent",
    user_id_extractor=lambda input: input.state.get(
        "headers", {}).get("user_id", "anonymous"),
)

app = FastAPI()
origins = [
    "http://127.0.0.1:8000",
    "http://localhost:4000",
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Expose each agent at its own endpoint
add_adk_fastapi_endpoint(
    app, applications_adk, "/agents/applications", extract_headers=["x-user-id"]
)

add_adk_fastapi_endpoint(
    app, resumes_adk, "/agents/resumes", extract_headers=["x-user-id"]
)

add_adk_fastapi_endpoint(
    app, insights_adk, "/agents/insights", extract_headers=["x-user-id"]
)


@app.get("/")
async def get_status():
    """Basic status endpoint"""
    return {
        "status": "healthy",
        "service": "ApplyFlow Agents Service",
        "endpoints": {
            "status": "/",
            "applications": "/agents/applications",
            "resumes": "/agents/resumes",
            "insights": "/agents/insights",
        },
    }


if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="localhost", port=8000)
