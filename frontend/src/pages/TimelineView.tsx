import { CopilotKit } from "@copilotkit/react-core";
import { CopilotSidebar } from "@copilotkit/react-ui";
import { useAuth0 } from "@auth0/auth0-react";

function TimelineViewContent() {
  return (
    <div className="flex flex-1 flex-col gap-8 p-8">
      <div className="space-y-2">
        <h1 className="text-4xl font-light tracking-tight">Timeline View</h1>
        <p className="text-lg font-light text-gray-500">
          Chronological view of your application journey
        </p>
      </div>

      <div className="flex-1 flex items-center justify-center">
        <p className="text-gray-400 font-light">Coming soon...</p>
      </div>
    </div>
  );
}

export default function TimelineView() {
  const { user } = useAuth0();

  return (
    <CopilotKit
      runtimeUrl="http://localhost:4000/copilotkit"
      agent="applications"
      enableInspector={false}
      headers={{ "x-user-id": user?.sub || "" }}
    >
      <CopilotSidebar
        defaultOpen={false}
        clickOutsideToClose={false}
        instructions="You are an AI assistant for ApplyFlow's application tracking system. Help users manage their job applications, track application status, update application details, and organize their job search."
        labels={{
          title: "Applications Assistant",
          initial: "Hi! How can I help you manage your job applications today?",
          placeholder: "Ask about your applications...",
        }}
      >
        <TimelineViewContent />
      </CopilotSidebar>
    </CopilotKit>
  );
}
