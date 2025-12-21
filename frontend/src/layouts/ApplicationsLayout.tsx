// src/layouts/ApplicationsLayout.tsx
import { Outlet } from "react-router-dom";
import { CopilotKit } from "@copilotkit/react-core";
import { useAuth0 } from "@auth0/auth0-react";

export default function ApplicationsLayout() {
  const { user } = useAuth0();

  return (
    <CopilotKit
      runtimeUrl="http://localhost:4000/copilotkit"
      agent="applications"
      enableInspector={false}
      headers={{ "x-user-id": user?.sub || "" }}
    >
      <Outlet />
    </CopilotKit>
  );
}
