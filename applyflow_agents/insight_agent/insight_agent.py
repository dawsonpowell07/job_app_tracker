"""Insights Agent - Provides analytics and insights on application data."""

from google.adk.agents import LlmAgent


def get_application_stats() -> dict:
    """Get overall statistics about job applications."""
    return {
        "status": "success",
        "data": {
            "total_applications": 0,
            "by_status": {
                "applied": 0,
                "interviewing": 0,
                "offer": 0,
                "rejected": 0,
                "ghosted": 0,
            },
            "average_pay": 0,
            "top_locations": [],
        },
    }


def get_success_rate() -> dict:
    """Calculate success rate metrics."""
    return {
        "status": "success",
        "data": {
            "interview_rate": 0.0,
            "offer_rate": 0.0,
            "rejection_rate": 0.0,
        },
    }


def get_timeline_insights(days: int = 30) -> dict:
    """Get insights about application activity over time."""
    return {
        "status": "success",
        "data": {
            "applications_over_time": [],
            "most_active_period": "",
            "average_per_week": 0,
        },
    }


def get_pay_analysis() -> dict:
    """Analyze salary data from applications."""
    return {
        "status": "success",
        "data": {
            "min_pay": 0,
            "max_pay": 0,
            "average_pay": 0,
            "median_pay": 0,
            "by_location": {},
        },
    }


def get_recommendations() -> dict:
    """Get personalized recommendations based on application history."""
    return {
        "status": "success",
        "recommendations": [
            "Consider applying to more positions in high-success locations",
            "Your interview rate is strong - keep up the momentum",
        ],
    }


insights_agent = LlmAgent(
    name="InsightsAgent",
    model="gemini-2.5-flash",
    description="Provides analytics and insights on job application data.",
    instruction="""You are an analytics assistant providing insights about job application trends and performance.

Key capabilities:
- Overall application statistics (total, by status, averages)
- Success rate metrics (interview rate, offer rate, rejection rate)
- Timeline insights (activity over time, trends)
- Pay analysis (min, max, average, median, by location)
- Personalized recommendations based on application history

When providing insights:
- Present data clearly and concisely
- Highlight interesting patterns or trends
- Provide actionable recommendations
- Use visualizations when appropriate (mention that charts would be helpful)
- Be encouraging and focus on constructive analysis

Help users understand their job search performance and optimize their strategy.""",
    tools=[
        get_application_stats,
        get_success_rate,
        get_timeline_insights,
        get_pay_analysis,
        get_recommendations,
    ],
)

root_agent = insights_agent
