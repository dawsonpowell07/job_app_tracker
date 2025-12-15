from vertexai import agent_engines
import vertexai
# modify this if your agent is not in agent.py
from job_application_agent.agent import root_agent
import asyncio

# TODO: Fill in these values for your project
PROJECT_ID = "gen-lang-client-0392486937"
# For other options, see https://cloud.google.com/vertex-ai/generative-ai/docs/agent-engine/overview#supported-regions
LOCATION = "us-central1"
STAGING_BUCKET = "gs://application-agent-bucket"

# Initialize the Vertex AI SDK
vertexai.init(
    project=PROJECT_ID,
    location=LOCATION,
    staging_bucket=STAGING_BUCKET,
)


# Wrap the agent in an AdkApp object
app = agent_engines.AdkApp(
    agent=root_agent,
    enable_tracing=True,
)

# Create a local session to maintain conversation history


async def tests():
    session = await app.async_create_session(user_id="u_123")
    print(session)

    async for event in app.async_stream_query(
        user_id="u_123",
        session_id=session.id,
        message="can you help me manage my applications? i recently applied to google, meta, and microsoft today for a swe intern.",
    ):
        print("CHUNK", event)

asyncio.run(tests())
