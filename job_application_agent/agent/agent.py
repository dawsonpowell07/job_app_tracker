

from google.adk.agents import LlmAgent

# Mock tool implementation


def get_current_time(city: str) -> dict:
    """Returns the current time in a specified city."""
    return {"status": "success", "city": city, "time": "10:30 AM"}


def add_application(company: str) -> dict:
    """Add application for a user"""
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
# User asks "My payment failed" -> Coordinator's LLM should call transfer_to_agent(agent_name='Billing')
# User asks "I can't log in" -> Coordinator's LLM should call transfer_to_agent(agent_name='Support')

root_agent = coordinator
