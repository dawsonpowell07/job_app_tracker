"""Application Tracking Agent - Handles CRUD operations for job applications."""

from google.adk.agents import LlmAgent
from google.adk.agents.callback_context import CallbackContext
from application_agent.tools.application_tools import (
    add_application, delete_application, get_applications, set_active_application, update_application
)


def on_before_agent(callback_context: CallbackContext):
    """
    Initialize recipe state if it doesn't exist.
    """

    if "currentView" not in callback_context.state:
        # Initialize with default recipe
        currentView = "unknown"
        callback_context.state["currentView"] = currentView

    return None


application_tracking_agent = LlmAgent(
    name="ApplicationTracking",
    model="gemini-2.5-flash",
    description="Manages job applications - add, update, delete, and retrieve applications.",
    before_agent_callback=on_before_agent,
    instruction="""You are an application tracking assistant. Help users manage their job applications.

Key capabilities:
- Add new job applications with details like job title, company, pay, location, and resume used
- Update existing applications (status, details, etc.)
- Delete applications
- Retrieve applications (all or filtered by status)
- Set the active application in the UI for viewing

- FRONTEND TOOLS:
- highlightApplicationCells(application id) -> takes in an application id and highlights the corresponding row in the UI
- use when you want to highlight a specific application(s) in the UI
- setActiveApplication(application id) -> takes in an application id and sets it as the active application in the UI
- use when you want to set a specific application as the active one in the UI

When adding or updating applications, try to extract as much information as possible from the user's input.
Be conversational and helpful in guiding users through managing their applications.

The current view is: {{currentView}}. This determines the context of the user's request and the actions you should take.
Some tools will onlu be available based on the current view. For example, if the user is in the "cardsView" view, you can use the setActiveApplication tool to set the active application in the UI.

ALWAYS check the current view before calling any tools.
Available tools based on the current view: 
- cardsView: setActiveApplication(application id) -> sets the active application in the UI
- excelView: highlightApplicationCells(application id) -> highlights the application(s) in the UI

NEVER call tools that are not available in the current view. For example, if the user is in the "tableView" view, do not call the setActiveApplication tool.
This is against our company policy and guidelines and will result in penalties and errors for the user. 
ALWAYS check the current view before calling any tools.

applications = [{
    id: "app1",
    user_id: "user123",
    job_title: "Software Engineer",
    company: "Tech Solutions Inc.",
    pay: 120000,
    location: "San Francisco, CA",
    resume_used: "Software_Engineer_Resume.pdf",
    resume_id: "res1",
    job_url: "https://example.com/job/app1",
    status: "applied",
    created_at: new Date("2024-10-26T10:00:00Z"),
    updated_at: new Date("2024-10-26T10:00:00Z"),
  },
  {
    id: "app2",
    user_id: "user123",
    job_title: "Senior Product Manager",
    company: "Innovate Co.",
    pay: 160000,
    location: "New York, NY",
    resume_used: "Product_Manager_Resume.pdf",
    resume_id: "res2",
    job_url: "https://example.com/job/app2",
    status: "interviewing",
    created_at: new Date("2024-10-20T11:30:00Z"),
    updated_at: new Date("2024-10-28T14:00:00Z"),
  },
  {
    id: "app3",
    user_id: "user123",
    job_title: "Data Scientist",
    company: "Data Insights LLC",
    pay: 135000,
    location: "Seattle, WA",
    resume_used: "Data_Scientist_Resume.pdf",
    resume_id: "res3",
    job_url: "https://example.com/job/app3",
    status: "rejected",
    created_at: new Date("2024-10-15T09:15:00Z"),
    updated_at: new Date("2024-11-01T16:00:00Z"),
  },
  {
    id: "app4",
    user_id: "user123",
    job_title: "Frontend Developer",
    company: "WebCrafters",
    pay: 110000,
    location: "Remote",
    resume_used: "Frontend_Resume.pdf",
    resume_id: "res4",
    job_url: "https://example.com/job/app4",
    status: "offer",
    created_at: new Date("2024-11-01T13:00:00Z"),
    updated_at: new Date("2024-11-05T10:00:00Z"),
  },
  {
    id: "app5",
    user_id: "user123",
    job_title: "DevOps Engineer",
    company: "CloudOps Inc.",
    pay: 145000,
    location: "Austin, TX",
    resume_used: "DevOps_Resume.pdf",
    resume_id: "res5",
    job_url: "https://example.com/job/app5",
    status: "applied",
    created_at: new Date("2024-11-05T08:45:00Z"),
    updated_at: new Date("2024-11-05T08:45:00Z"),
  },
  {
    id: "app6",
    user_id: "user123",
    job_title: "Full Stack Engineer",
    company: "StartupXYZ",
    pay: 130000,
    location: "Boston, MA",
    resume_used: "Software_Engineer_Resume.pdf",
    resume_id: "res1",
    job_url: "https://example.com/job/app6",
    status: "ghosted",
    created_at: new Date("2024-10-01T14:30:00Z"),
    updated_at: new Date("2024-10-01T14:30:00Z"),
  },
  {
    id: "app7",
    user_id: "user123",
    job_title: "Backend Developer",
    company: "Enterprise Corp",
    pay: 125000,
    location: "Chicago, IL",
    resume_used: "Software_Engineer_Resume.pdf",
    resume_id: "res1",
    job_url: "https://example.com/job/app7",
    status: "ghosted",
    created_at: new Date("2024-09-25T09:00:00Z"),
    updated_at: new Date("2024-09-25T09:00:00Z"),
  },
];

resumes = [
  {
    id: "res1",
    user_id: "user123",
    file_name: "Software_Engineer_Resume.pdf",
    s3_key: "user123/resumes/Software_Engineer_Resume.pdf",
    upload_status: "completed",
    created_at: new Date("2024-10-01T09:00:00Z"),
    updated_at: new Date("2024-10-01T09:00:00Z"),
  },
  {
    id: "res2",
    user_id: "user123",
    file_name: "Product_Manager_Resume.pdf",
    s3_key: "user123/resumes/Product_Manager_Resume.pdf",
    upload_status: "completed",
    created_at: new Date("2024-09-15T14:00:00Z"),
    updated_at: new Date("2024-09-15T14:00:00Z"),
  },
  {
    id: "res3",
    user_id: "user123",
    file_name: "Data_Scientist_Resume.pdf",
    s3_key: "user123/resumes/Data_Scientist_Resume.pdf",
    upload_status: "completed",
    created_at: new Date("2024-10-10T10:30:00Z"),
    updated_at: new Date("2024-10-10T10:30:00Z"),
  },
  {
    id: "res4",
    user_id: "user123",
    file_name: "Frontend_Resume.pdf",
    s3_key: "user123/resumes/Frontend_Resume.pdf",
    upload_status: "completed",
    created_at: new Date("2024-09-20T11:00:00Z"),
    updated_at: new Date("2024-09-20T11:00:00Z"),
  },
  {
    id: "res5",
    user_id: "user123",
    file_name: "DevOps_Resume.pdf",
    s3_key: "user123/resumes/DevOps_Resume.pdf",
    upload_status: "completed",
    created_at: new Date("2024-11-01T16:00:00Z"),
    updated_at: new Date("2024-11-01T16:00:00Z"),
  },
""",
    tools=[
        add_application,
        update_application,
        delete_application,
        get_applications,
        set_active_application,
    ],
)


root_agent = application_tracking_agent
