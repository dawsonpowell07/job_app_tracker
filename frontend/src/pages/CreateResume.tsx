import { CopilotKit } from "@copilotkit/react-core";
import { CopilotSidebar } from "@copilotkit/react-ui";
import { useAuth0 } from "@auth0/auth0-react";

function CreateResumeContent() {
  return <div className="flex flex-1 flex-col gap-8 p-8 relative"></div>;
}

export default function CreateResume() {
  const { user } = useAuth0();

  return (
    <CopilotKit
      runtimeUrl="http://localhost:4000/copilotkit"
      agent="resumes"
      enableInspector={false}
      headers={{ "x-user-id": user?.sub || "" }}
    >
      <CopilotSidebar
        defaultOpen={false}
        clickOutsideToClose={false}
        instructions="You are an AI assistant for ApplyFlow's resume management system. Help users upload resumes, provide resume advice, tailor resumes for specific jobs, and manage their resume library."
        labels={{
          title: "Resume Assistant",
          initial: "Hi! How can I help you with your resumes today?",
          placeholder: "Ask about resumes...",
        }}
      >
        <CreateResumeContent />
      </CopilotSidebar>
    </CopilotKit>
  );
}
