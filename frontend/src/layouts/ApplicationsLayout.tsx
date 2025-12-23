// src/layouts/ApplicationsLayout.tsx
import { Outlet } from "react-router-dom";
import { CopilotKit } from "@copilotkit/react-core";
import { useUser } from "@clerk/clerk-react";

export default function ApplicationsLayout() {
  const { user } = useUser();

  return (
    <CopilotKit
      runtimeUrl="http://localhost:4000/copilotkit"
      agent="applications"
      enableInspector={true}
      headers={{ "x-user-id": user?.id || "" }}
    >
      <Outlet />
    </CopilotKit>
  );
}
