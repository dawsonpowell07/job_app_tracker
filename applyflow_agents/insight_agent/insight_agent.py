"""Insights Agent - Provides analytics and insights on application data."""

from google.adk.agents import LlmAgent
from tools.analysis_tools import (get_application_stats, get_success_rate,
                                  get_timeline_insights, get_pay_analysis, get_recommendations)
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
