// Backend API types
export interface CreateSessionRequest {
  user_id: string;
}

export interface CreateSessionResponse {
  session_id: string;
  user_id: string;
  app_name: string;
}

export interface SendMessageRequest {
  session_id: string;
  user_id: string;
  message: string;
}

export interface SendMessageResponse {
  response: string;
  session_id: string;
}

export interface Session {
  session_id: string;
  user_id: string;
  app_name: string;
  events: unknown[];
  state: Record<string, unknown>;
  timestamp: number;
}

// Message types for the chat UI
export interface Message {
  id: string;
  role: "user" | "assistant";
  content: string;
  timestamp: number;
  isStreaming?: boolean;
}

// SSE Event structure (from Vertex AI ADK)
// Note: Backend uses snake_case, not camelCase
export interface SSEEvent {
  model_version?: string;
  content?: {
    role?: string;
    parts?: Array<{
      text?: string;
      thought_signature?: string;
      function_call?: {
        id?: string;
        name: string;
        args: Record<string, unknown>;
      };
      function_response?: {
        id?: string;
        name: string;
        response: Record<string, unknown>;
      };
    }>;
  };
  actions?: {
    state_delta?: Record<string, unknown>;
    artifact_delta?: Record<string, unknown>;
    transfer_to_agent?: string;
    requested_auth_configs?: Record<string, unknown>;
    requested_tool_confirmations?: Record<string, unknown>;
  };
  author?: string;
  invocation_id?: string;
  finish_reason?: string;
  usage_metadata?: Record<string, unknown>;
  error?: string;
  status?: string;
  id?: string;
  timestamp?: number;
}

// Timeline event for tracking agent activities
export interface TimelineEvent {
  type: "tool_call" | "tool_response" | "agent_transfer" | "text";
  name?: string;
  args?: Record<string, unknown>;
  response?: Record<string, unknown>;
  text?: string;
  agent?: string;
  author?: string;
  timestamp: number;
}
