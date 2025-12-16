"use client";

import { CopilotSidebar } from "@copilotkit/react-ui";
import { useRenderToolCall } from "@copilotkit/react-core";
import { useState } from "react";

export default function Page() {
  const [companies, setCompanies] = useState<string[]>([]);

  // Render the add_application tool call in the UI
  useRenderToolCall({
    name: "add_application",
    render: ({ status, args }) => {
      const company = args?.company || "Unknown Company";

      // Update companies list when application is successfully added
      // Using a ref to track if we've already added this company
      if (status === "complete" && company && !companies.includes(company)) {
        // Add new company and keep only the 5 most recent
        setTimeout(() => {
          setCompanies((prev) => {
            if (!prev.includes(company)) {
              const updated = [...prev, company].slice(-5);
              return updated;
            }
            return prev;
          });
        }, 0);
      }

      if (status !== "complete") {
        return (
          <div className="flex items-center gap-2 p-3 bg-blue-50 border border-blue-200 rounded-lg">
            <div className="animate-spin rounded-full h-4 w-4 border-2 border-blue-500 border-t-transparent"></div>
            <span className="text-sm text-blue-700">Adding your application...</span>
          </div>
        );
      }

      return (
        <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
          <div className="flex items-center gap-2">
            <svg
              className="h-5 w-5 text-green-600"
              fill="none"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path d="M5 13l4 4L19 7"></path>
            </svg>
            <span className="text-sm font-medium text-green-800">
              Application to <strong>{company}</strong> added
            </span>
          </div>
        </div>
      );
    },
  });

  return (
    <main className="min-h-screen bg-gray-50">
      <div className="container mx-auto py-8">
        <div className="mb-8 text-center">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Job Application Tracker
          </h1>
          <p className="text-gray-600">
            Manage your job applications with AI assistance
          </p>
        </div>
      </div>

      <CopilotSidebar />
    </main>
  );
}