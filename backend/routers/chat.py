import json
from sse_starlette.sse import EventSourceResponse
from fastapi import APIRouter, HTTPException
import vertexai

from settings import settings
from models.models import (
    CreateSessionRequest,
    CreateSessionResponse,
    SendMessageRequest,
    SendMessageResponse,
    Session,
)

router = APIRouter(prefix="/chat", tags=["chat"])

# Initialize Vertex AI
vertexai.init(
    project=settings.vertex_project_id,
    location=settings.vertex_location,
    staging_bucket=settings.staging_bucket,
)

client = vertexai.Client(
    project=settings.vertex_project_id,
    location=settings.vertex_location,
)

adk_app = client.agent_engines.get(
    name=f"projects/{settings.vertex_project_id}/locations/{settings.vertex_location}/reasoningEngines/{settings.vertex_resource_id}"
)


# API Endpoints


@router.post("/sessions", response_model=CreateSessionResponse)
async def create_session(request: CreateSessionRequest):
    """
    Create a new chat session for a user.

    Args:
        request: Contains user_id for the session

    Returns:
        Session details including session_id
    """
    try:
        session = await adk_app.async_create_session(user_id=request.user_id)
        return CreateSessionResponse(
            session_id=session["id"],
            user_id=session["userId"],
            app_name=session["appName"]
        )
    except Exception as e:
        raise HTTPException(
            status_code=500, detail=f"Failed to create session: {str(e)}")


@router.post("/messages", response_model=SendMessageResponse)
async def send_message(request: SendMessageRequest):
    """
    Send a message to the agent and return the final response.
    This endpoint collects all streamed messages and returns only the final text response.

    Args:
        request: Contains session_id, user_id, and message

    Returns:
        Agent's final response
    """
    try:
        # Collect all streamed messages
        messages = []
        async for message in adk_app.async_stream_query(
            session_id=request.session_id,
            user_id=request.user_id,
            message=request.message
        ):
            messages.append(message)

        # Extract the final text response from the last message
        final_response = ""
        for message in reversed(messages):
            content = message.get('content', {})
            parts = content.get('parts', [])
            for part in parts:
                if 'text' in part:
                    final_response = part['text']
                    break
            if final_response:
                break

        return SendMessageResponse(
            response=final_response,
            session_id=request.session_id
        )
    except Exception as e:
        raise HTTPException(
            status_code=500, detail=f"Failed to send message: {str(e)}")


@router.post("/messages/stream")
async def send_message_stream(request: SendMessageRequest):
    """
    Send a message to the agent and stream the response in real-time.
    This endpoint streams messages as Server-Sent Events (SSE) as they're generated.

    Args:
        request: Contains session_id, user_id, and message

    Returns:
        Streaming response with messages as newline-delimited JSON
    """
    async def generate_stream():
        try:
            async for event in adk_app.async_stream_query(
                session_id=request.session_id,
                user_id=request.user_id,
                message=request.message
            ):
                # 1. Serialize the event object to a JSON string
                json_data = json.dumps(event)

                # 2. Format as a Server-Sent Event (SSE)
                # Format: data: <json_payload>\n\n
                yield f"{json_data}\n\n"

            # Send completion event
            completion_event = json.dumps(
                {"type": "done", "status": "completed"})
            yield f"{completion_event}\n\n"
            print("DONE STREAMING")

        except Exception as e:
            # Send error information as a structured SSE message
            error_message = {"error": str(e), "status": "failed"}
            json_data = json.dumps(error_message)
            yield f"data: {json_data}\n\n"
            print(f"ERROR STREAMING: {str(e)}")

    return EventSourceResponse(generate_stream())


@router.get("/sessions", response_model=list[Session])
async def get_sessions(user_id: str):
    """
    Retrieve all sessions for a user.

    Args:
        user_id: The user identifier

    Returns:
        user sessions
    """
    try:
        response = await adk_app.async_list_sessions(user_id=user_id)
        sessions = response["sessions"]

        return [
            Session(
                session_id=session["id"],
                user_id=session["userId"],
                state=session["state"],
                app_name=session["appName"],
                events=session["events"],
                timestamp=session["lastUpdateTime"]
            )
            for session in sessions
        ]

    except Exception as e:
        raise HTTPException(
            status_code=500, detail=f"Failed to retrieve history: {str(e)}")


@router.get("/sessions/{session_id}", response_model=Session)
async def get_session(session_id: str, user_id: str):
    """
    Retrieve the conversation history for a session.

    Args:
        session_id: The session identifier
        user_id: The user identifier

    Returns:
        Conversation history
    """
    try:
        history = await adk_app.async_get_session(
            session_id=session_id,
            user_id=user_id
        )

        return Session(
            session_id=history["id"],
            user_id=history["userId"],
            state=history["state"],
            app_name=history["appName"],
            events=history["events"],
            timestamp=history["lastUpdateTime"]
        )
    except Exception as e:
        raise HTTPException(
            status_code=500, detail=f"Failed to retrieve history: {str(e)}")


@router.delete("/sessions/{session_id}")
async def delete_session(session_id: str, user_id: str):
    """
    Delete a chat session.

    Args:
        session_id: The session identifier
        user_id: The user identifier

    Returns:
        Confirmation message
    """
    try:
        await adk_app.async_delete_session(
            session_id=session_id,
            user_id=user_id
        )

        return {
            "message": "Session deleted successfully",
            "session_id": session_id
        }
    except Exception as e:
        raise HTTPException(
            status_code=500, detail=f"Failed to delete session: {str(e)}")
