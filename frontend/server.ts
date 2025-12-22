import "dotenv/config";
import express from "express";
import cors from "cors";
import {
  CopilotRuntime,
  copilotRuntimeNodeHttpEndpoint,
  // EmptyAdapter,
  GoogleGenerativeAIAdapter
} from "@copilotkit/runtime";
import { HttpAgent } from "@ag-ui/client";

const app = express();
const PORT = 4000;

// Request logging middleware
app.use((req, _res, next) => {
  console.log(`\n[${new Date().toISOString()}] ${req.method} ${req.url}`);
  console.log("Headers:", JSON.stringify(req.headers, null, 2));
  if (req.body && Object.keys(req.body).length > 0) {
    console.log("Body:", JSON.stringify(req.body, null, 2));
  }
  next();
});

// Enable JSON body parsing
app.use(express.json());

// Enable CORS for your Vite dev server
app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
  }),
);

console.log("Initializing CopilotRuntime...");
console.log("Configuring HttpAgents for multiple specialized agents");

// HttpAgent will automatically forward headers from the request
// The headers x-user-id and x-tenant-id will be passed through to the ADK agents
const runtime = new CopilotRuntime({
  agents: {
    applications: new HttpAgent({
      url: "http://127.0.0.1:8000/agents/applications",
    }),
    resumes: new HttpAgent({
      url: "http://127.0.0.1:8000/agents/resumes",
    }),
    insights: new HttpAgent({
      url: "http://127.0.0.1:8000/agents/insights",
    }),
  },
});

console.log("Creating EmptyAdapter...");
// const serviceAdapter = new EmptyAdapter();

const serviceAdapter = new GoogleGenerativeAIAdapter({ model: "gemini-2.5-flash" });


console.log("CopilotRuntime initialized successfully");

app.use("/copilotkit", (req, res, next) => {
  console.log("CopilotKit endpoint hit - creating handler...");
  (async () => {
    const handler = copilotRuntimeNodeHttpEndpoint({
      endpoint: "/copilotkit",
      runtime,
      serviceAdapter,
      logLevel: "debug",
    });
    console.log("Handler created, processing request...");
    return handler(req, res);
  })().catch((error) => {
    console.error("Error in CopilotKit handler:", error);
    console.error("Error stack:", error.stack);
    next(error);
  });
});

app.listen(PORT, () => {
  console.log(`\n=================================`);
  console.log(`CopilotKit runtime server started`);
  console.log(`Listening at http://localhost:${PORT}/copilotkit`);
  console.log(`CORS enabled for http://localhost:5173`);
  console.log(`\nConnected Agents:`);
  console.log(`  - Applications: http://127.0.0.1:8000/agents/applications`);
  console.log(`  - Resumes: http://127.0.0.1:8000/agents/resumes`);
  console.log(`  - Insights: http://127.0.0.1:8000/agents/insights`);
  console.log(`=================================\n`);
});
