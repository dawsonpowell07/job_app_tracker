import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import './index.css'; // Importing the main CSS file
import '@copilotkit/react-ui/styles.css'; // CopilotKit styles
import App from './App.tsx';
import { Auth0Provider } from '@auth0/auth0-react';
import { CopilotKit } from '@copilotkit/react-core';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <Auth0Provider
      domain={import.meta.env.VITE_AUTH0_DOMAIN}
      clientId={import.meta.env.VITE_AUTH0_CLIENT_ID}
      authorizationParams={{
        redirect_uri: window.location.origin,
        audience: "https://htnpjvh1wh.execute-api.us-east-1.amazonaws.com"
      }}
      cacheLocation="localstorage"
      useRefreshTokens={true}
    >
      <CopilotKit runtimeUrl="http://localhost:4000/copilotkit" agent="applyflow_agent">
        <App />
      </CopilotKit>
    </Auth0Provider>
  </StrictMode>
);

