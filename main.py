from fastapi import FastAPI
from ag_ui_adk import ADKAgent, add_adk_fastapi_endpoint
from job_application_agent.agent import root_agent
from ag_ui.core import RunAgentInput


def extract_app(input: RunAgentInput) -> str:
    """Extract app name from request context."""
    for ctx in input.context:
        if ctx.description == "app":
            return ctx.value
    return "default_app"


def extract_user(input: RunAgentInput) -> str:
    """Extract user ID from request context."""
    for ctx in input.context:
        if ctx.description == "user":
            return ctx.value
    return f"anonymous_{input.thread_id}"

# agent = ADKAgent(
#     adk_agent=my_agent,
# )

# adk_agent = ADKAgent(
#     adk_agent=root_agent,
#     app_name="application_agent",
#     user_id="dawson",
#     session_timeout_seconds=3600,
#     use_in_memory_services=True,
# )


adk_agent = ADKAgent(
    adk_agent=root_agent,
    app_name_extractor=extract_app,
    user_id_extractor=extract_user,
)

# Multiple agents on different endpoints
# add_adk_fastapi_endpoint(app, general_agent, path="/agents/general")
# add_adk_fastapi_endpoint(app, technical_agent, path="/agents/technical")

app = FastAPI()
add_adk_fastapi_endpoint(
    app, adk_agent, "/",
)
if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="localhost", port=8000)
