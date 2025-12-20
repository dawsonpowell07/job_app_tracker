import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import "@copilotkit/react-ui/styles.css";

import App from "./App.tsx";
import { Auth0Provider } from "@auth0/auth0-react";
import { CopilotKit } from "@copilotkit/react-core";
import { ThemeProvider } from "@/components/theme-provider";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <ThemeProvider defaultTheme="system" storageKey="applyflow-theme">
      <Auth0Provider
        domain={import.meta.env.VITE_AUTH0_DOMAIN}
        clientId={import.meta.env.VITE_AUTH0_CLIENT_ID}
        authorizationParams={{
          redirect_uri: window.location.origin,
          audience: "https://htnpjvh1wh.execute-api.us-east-1.amazonaws.com",
        }}
        cacheLocation="localstorage"
        useRefreshTokens={true}
      >
        <CopilotKit
          runtimeUrl="http://localhost:4000/copilotkit"
          agent="applyflow_agent"
          enableInspector={false}
        >
          <App />
        </CopilotKit>
      </Auth0Provider>
    </ThemeProvider>
  </StrictMode>
);
