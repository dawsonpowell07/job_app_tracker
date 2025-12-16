# Request/Response Models
from pydantic import BaseModel
from typing import Any


class CreateSessionRequest(BaseModel):
    user_id: str


class CreateSessionResponse(BaseModel):
    session_id: str
    user_id: str
    app_name: str


class SendMessageRequest(BaseModel):
    session_id: str
    user_id: str
    message: str


class SendMessageResponse(BaseModel):
    response: str
    session_id: str


class Session(BaseModel):
    session_id: str
    user_id: str
    app_name: str
    events: list
    state: dict[str, Any]
    timestamp: float
