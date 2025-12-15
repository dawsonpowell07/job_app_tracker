# Chat Interface Implementation

This document describes the streaming chat interface implementation for the Job Application Tracker.

## Overview

The chat interface is built with Next.js 16 and React 19, featuring real-time streaming of AI responses and tool call visualization. It integrates with the FastAPI backend that uses Google Vertex AI ADK (Agent Development Kit).

## Features

### Real-time Streaming
- Server-Sent Events (SSE) for streaming AI responses
- Live text updates as the AI generates content
- Streaming indicator during response generation

### Tool Call Visualization
- Timeline view showing agent activities
- Display of function/tool calls with expandable arguments
- Tool response tracking with collapsible details
- Visual differentiation between call types (tool call, response, text)

### Chat Experience
- Markdown rendering for rich text formatting (via react-markdown)
- GitHub-flavored markdown support (tables, code blocks, etc.)
- Message bubbles for user and assistant messages
- Copy-to-clipboard functionality for AI responses
- Auto-scrolling to latest messages
- Session management with unique session IDs

## Architecture

### Components

#### `src/app/page.tsx`
Main chat page component that manages:
- Chat session initialization
- Message state management
- SSE streaming coordination
- User input handling

#### `src/components/MessageBubble.tsx`
Message display components:
- `UserMessageBubble` - Displays user messages with markdown support
- `AiMessageBubble` - Displays AI responses with timeline and copy button

#### `src/components/ActivityTimeline.tsx`
Tool call visualization:
- `ActivityTimeline` - Container for timeline events
- `TimelineItem` - Individual event display (tool calls, responses, text)

### Utilities

#### `src/lib/streamingHandler.ts`
SSE processing and API communication:
- `processSSEStream()` - Parses SSE events and extracts content
- `createSession()` - Creates new chat session
- `sendMessageStream()` - Sends messages with streaming response

### Types

#### `src/types/chat.ts`
TypeScript definitions for:
- Backend API request/response models
- Message structures
- SSE event formats
- Timeline event types

## Data Flow

1. **Session Initialization**
   ```
   User loads page → createSession() → Backend creates session → Session ID stored
   ```

2. **Sending Messages**
   ```
   User types message → handleSendMessage() → sendMessageStream() → Backend processes
   ```

3. **Streaming Response**
   ```
   Backend SSE stream → processSSEStream() → Parse events → Update UI
   ```

4. **Event Processing**
   - Text content → Updates message content in real-time
   - Tool calls → Adds to timeline events
   - Tool responses → Adds to timeline events
   - Errors → Displays error banner

## SSE Event Format

The backend sends events in this format:
```
data: {"content": {...}, "role": "assistant"}\n\n
```

Event structure:
```typescript
{
  content?: {
    role?: string;
    parts?: Array<{
      text?: string;                    // AI-generated text
      functionCall?: {                  // Tool call
        name: string;
        args: Record<string, unknown>;
      };
      functionResponse?: {              // Tool response
        name: string;
        response: Record<string, unknown>;
      };
    }>;
  };
  error?: string;                       // Error message
  status?: string;                      // Status indicator
}
```

## Usage

### Running the Application

1. **Start the backend** (from `/backend` directory):
   ```bash
   cd ../backend
   uvicorn main:app --reload --port 8080
   ```

2. **Start the frontend** (from `/frontend` directory):
   ```bash
   npm run dev
   ```

3. **Open browser**:
   Navigate to `http://localhost:3000`

### Using the Chat Interface

1. The interface automatically creates a session on load
2. Type your message in the input field at the bottom
3. Press Enter or click "Send" to submit
4. Watch as the AI response streams in real-time
5. Tool calls and responses appear in the "Agent Activity" timeline
6. Copy AI responses using the copy button (appears on hover)

## Styling

The interface uses:
- Tailwind CSS v4 for styling
- `@tailwindcss/typography` for markdown prose styles
- Dark mode support (follows system preference)
- Lucide React icons for UI elements

## Dependencies

Key packages:
- `react-markdown` - Markdown rendering
- `remark-gfm` - GitHub-flavored markdown
- `lucide-react` - Icon library
- `clsx` - Conditional class names

## Future Enhancements

Potential improvements:
- [ ] Message editing and regeneration
- [ ] Session history sidebar
- [ ] Multi-turn conversation context
- [ ] File upload support
- [ ] Voice input
- [ ] Export conversation
- [ ] Custom system prompts
- [ ] User authentication
