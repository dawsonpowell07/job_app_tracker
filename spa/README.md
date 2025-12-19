# ApplyFlow - Job Application Tracker

A React + TypeScript + Vite SPA with Auth0 authentication and CopilotKit integration.

## Getting Started

### Prerequisites
- Node.js 18+ and npm
- Auth0 account with configured application
- (Optional) [Copilot Cloud API key](https://cloud.copilotkit.ai) for enhanced features

### Installation
```bash
npm install
```

### Environment Variables
Copy `.env.example` to `.env` and fill in your values:
```bash
cp .env.example .env
```

### Running the Application

**Development (Frontend + CopilotKit Runtime):**
```bash
npm run dev:all
```
This runs both the Vite dev server (port 5173) and the CopilotKit runtime server (port 4000).

**Run individually:**
```bash
npm run dev      # Vite dev server only
npm run server   # CopilotKit runtime server only
```

## CopilotKit Setup

This project uses CopilotKit with a Node.js Express runtime. The runtime server is configured in `server.ts` and runs on port 4000.

- **Runtime endpoint:** `http://localhost:4000/copilotkit`
- **Adapter:** EmptyAdapter (for CoAgents only, agent-lock mode)
- **Health check:** `http://localhost:4000/health`

**Note:** The EmptyAdapter is designed for use with LangGraph agents in agent-lock mode. Features like `useCopilotChatSuggestions`, `CopilotTextarea`, and `CopilotTask` require an LLM adapter.

## About This Template

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react) uses [Babel](https://babeljs.io/) (or [oxc](https://oxc.rs) when used in [rolldown-vite](https://vite.dev/guide/rolldown)) for Fast Refresh
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react-swc) uses [SWC](https://swc.rs/) for Fast Refresh

## React Compiler

The React Compiler is not enabled on this template because of its impact on dev & build performances. To add it, see [this documentation](https://react.dev/learn/react-compiler/installation).

## Expanding the ESLint configuration

If you are developing a production application, we recommend updating the configuration to enable type-aware lint rules:

```js
export default defineConfig([
  globalIgnores(['dist']),
  {
    files: ['**/*.{ts,tsx}'],
    extends: [
      // Other configs...

      // Remove tseslint.configs.recommended and replace with this
      tseslint.configs.recommendedTypeChecked,
      // Alternatively, use this for stricter rules
      tseslint.configs.strictTypeChecked,
      // Optionally, add this for stylistic rules
      tseslint.configs.stylisticTypeChecked,

      // Other configs...
    ],
    languageOptions: {
      parserOptions: {
        project: ['./tsconfig.node.json', './tsconfig.app.json'],
        tsconfigRootDir: import.meta.dirname,
      },
      // other options...
    },
  },
])
```

You can also install [eslint-plugin-react-x](https://github.com/Rel1cx/eslint-react/tree/main/packages/plugins/eslint-plugin-react-x) and [eslint-plugin-react-dom](https://github.com/Rel1cx/eslint-react/tree/main/packages/plugins/eslint-plugin-react-dom) for React-specific lint rules:

```js
// eslint.config.js
import reactX from 'eslint-plugin-react-x'
import reactDom from 'eslint-plugin-react-dom'

export default defineConfig([
  globalIgnores(['dist']),
  {
    files: ['**/*.{ts,tsx}'],
    extends: [
      // Other configs...
      // Enable lint rules for React
      reactX.configs['recommended-typescript'],
      // Enable lint rules for React DOM
      reactDom.configs.recommended,
    ],
    languageOptions: {
      parserOptions: {
        project: ['./tsconfig.node.json', './tsconfig.app.json'],
        tsconfigRootDir: import.meta.dirname,
      },
      // other options...
    },
  },
])
```
