"""Resume Support Agent - Handles resume advice and tailoring."""

from google.adk.agents import LlmAgent
from google.adk.tools.tool_context import ToolContext
from resume_agent.tools.resume_tools import (
    get_resume_advice,
    upload_resume,
    get_resumes,
    delete_resume,
    tailor_resume,
)
from typing import Dict, List
from pydantic import BaseModel
from dotenv import load_dotenv
load_dotenv()


def step_progress(tool_context: ToolContext, steps: List[str]) -> Dict[str, str]:
    """Reports the current progress steps.
    Args:
        tool_context (ToolContext): The tool context for accessing state.
        steps (List[str]): The list of steps completed so far.
    Returns:
        Dict[str, str]: A dictionary indicating the progress was received.
    """
    tool_context.state["observed_steps"] = steps
    return {"status": "success", "message": "Progress received."}


class AgentState(BaseModel):
    """State for the agent."""
    observed_steps: List[str] = []


resume_support_agent = LlmAgent(
    name="ResumeSupport",
    model="gemini-2.5-flash",
    description="Provides resume advice, tailoring, and management.",
    instruction="""You are a resume assistant helping users optimize their resumes for job applications.

Key capabilities:
- Provide advice on how to tailor resumes for specific jobs
- Upload and manage resume files
- Generate tailored versions of resumes for specific job descriptions
- Delete resumes

When giving resume advice:
- Be specific and actionable
- Focus on highlighting relevant skills and experience
- Suggest keyword optimization for ATS systems
- Recommend formatting improvements when appropriate
- When given a task break it down into steps and report your progress using the step_progress tool after completing each step.

Always be encouraging and constructive in your feedback.""",
    tools=[
        get_resume_advice,
        upload_resume,
        get_resumes,
        delete_resume,
        tailor_resume,
        step_progress,
    ],
)

root_agent = resume_support_agent
