

from google.adk.agents import LlmAgent
from google.adk.tools.tool_context import ToolContext
# Mock tool implementation


def add_application(company: str, tool_context: ToolContext) -> dict:
    """Add application for a user"""
    recent_applications = tool_context.state.get(
        "user:most_recent_applications", [])
    recent_applications.append(company)
    tool_context.state["user:most_recent_applications"] = recent_applications[-5:]

    return {"status": "success", "company": company}
# Conceptual Code: Coordinator using LLM Transfer


application_tracking_agent = LlmAgent(
    name="ApplicationTracking", description="Handles CRUD operations for application management", tools=[add_application])
resume_agent = LlmAgent(
    name="ResumeSupport", description="Handles requests related to resume advice and tailoring."
)
insights_agent = LlmAgent(
    name="InsightsAgent", description="Handles insights and data analytics of application stats."
)

coordinator = LlmAgent(
    name="JobApplicationHelpCoordinator",
    model="gemini-2.5-flash",
    instruction="Route user requests: Use application_tracking_agent to add or make updates to applications, resume_agent for resume advice and tailoring, and insights_agent for user requests for insights and analytics of their application process .",
    description="Main router.",
    # allow_transfer=True is often implicit with sub_agents in AutoFlow
    sub_agents=[application_tracking_agent, resume_agent, insights_agent],
)


root_agent = coordinator
