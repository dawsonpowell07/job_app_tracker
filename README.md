# ApplyFlow: AI-Powered Job Application Tracker

ApplyFlow is a modern, AI-powered job application tracking system designed to streamline and enhance your job search process. It features a rich user interface, a powerful backend built with Google's ADK (Agent Development Kit), and an integrated AI chat assistant to help you manage applications, get resume advice, and gain insights into your job hunt.

## Features

- **Comprehensive Application Tracking**: Manage your job applications through a Kanban board, table view, or card view.
- **AI-Powered Chat Assistant**: Interact with an AI to add, update, and query your applications, get resume advice, and analyze your application history.
- **Multi-Agent System**: Specialized agents for managing applications, resumes, and providing insights.
- **Secure Authentication**: User authentication handled by Auth0.
- **Rich Frontend**: A responsive and modern UI built with React, TypeScript, and Tailwind CSS.

## Architecture

The application is composed of three main services that run concurrently:

1.  **Frontend (Vite Dev Server)**: The React-based user interface that runs on port `5173`.
2.  **Frontend Runtime Server (Express)**: A CopilotKit runtime server on port `4000` that acts as a bridge between the frontend and the AI agents.
3.  **ADK Agent Server (FastAPI)**: A Python server on port `8000` that hosts the specialized ADK agents.

### Data Flow
1. The user interacts with the React frontend.
2. For AI-related actions, the frontend communicates with the CopilotKit runtime server.
3. The runtime server routes requests to the appropriate specialized agent on the ADK server (e.g., applications, resumes, insights).
4. The ADK agent processes the request, potentially using its tools, and sends a response back.
5. The response is streamed back through the runtime to the frontend and displayed to the user.

## Technology Stack

- **Backend**:
  - Python, FastAPI
  - Google Agent Development Kit (ADK)
  - `uv` for package management
- **Frontend**:
  - React 19, TypeScript
  - Vite
  - Tailwind CSS v4
  - Auth0 for Authentication
  - CopilotKit for AI chat integration
  - shadcn/ui for components
- **Development**:
  - `npm` for frontend package management
  - `concurrently` to run multiple services

## Getting Started

### Prerequisites

- Python 3.11+ and `uv` (`pip install uv`)
- Node.js and `npm`

### Installation

1.  **Install Python dependencies:**
    ```bash
    uv sync
    ```

2.  **Install frontend dependencies:**
    ```bash
    cd frontend
    npm install
    ```

### Environment Variables

The application requires environment variables to be set up.

1.  **Frontend (`frontend/.env`):**
    Create a `.env.local` (preferred) or `.env` file in the `frontend` directory by copying the example:
    ```bash
    cp frontend/.env.example frontend/.env.local
    ```
    Populate it with your Clerk credentials:
    ```
    VITE_CLERK_PUBLISHABLE_KEY=YOUR_CLERK_PUBLISHABLE_KEY
    ```

2.  **Backend (`applyflow_agents/.env`):**
    The backend agents require Google Cloud credentials for Vertex AI. While not needed for all local development, they are required for full agent functionality.

### Running the Application

To run the application, you need to start all three services.

1.  **Start the ADK Agent Server:**
    ```bash
    cd applyflow_agents
    uvicron main:app --reload
    ```
    This will start the agent server on `http://127.0.0.1:8000`.

2.  **Start the Frontend Runtime and Dev Server:**
    In a separate terminal, navigate to the `frontend` directory and run:
    ```bash
    cd frontend
    npm run dev:all
    ```
    This will start:
    - The frontend dev server on `http://localhost:5173`.
    - The CopilotKit runtime on `http://localhost:4000`.

You can now access the application at `http://localhost:5173`.

## Project Structure

```
.
├── applyflow_agents/ # Python ADK Agent Backend
│   ├── agent/        # Specialized agent definitions
│   ├── main.py       # FastAPI server for agents
│   └── pyproject.toml
├── backend/          # IGNORED - Not part of the main application
├── frontend/         # React/TypeScript Frontend
│   ├── src/
│   ├── server.ts     # CopilotKit runtime server
│   ├── package.json
│   └── vite.config.ts
└── README.md
```
