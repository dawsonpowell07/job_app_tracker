"use client";
import React from "react";
import "@copilotkit/react-ui/styles.css";
import { CopilotKit } from "@copilotkit/react-core";
import { CopilotSidebar } from "@copilotkit/react-ui";

export default function JobTrackerPage() {
  return (
    <CopilotKit
      runtimeUrl="/api/copilotkit"
      showDevConsole={false}
      agent="adk_agent"
    >
      <CopilotSidebar
        defaultOpen={true}
        instructions="You are a helpful job application tracking assistant. Help users manage their job applications, track application status, and provide insights."
        labels={{
          title: "Job Assistant",
          initial: "Hi! I'm here to help you track and manage your job applications.",
        }}
      >
        <MainContent />
      </CopilotSidebar>
    </CopilotKit>
  );
}

function MainContent() {
  return (
    <div className="h-screen w-full bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800">
      <div className="max-w-7xl mx-auto px-6 py-12">
        {/* Header */}
        <div className="mb-12">
          <h1 className="text-4xl font-bold text-slate-900 dark:text-white mb-3">
            Job Application Tracker
          </h1>
          <p className="text-lg text-slate-600 dark:text-slate-400">
            Manage your job search journey with AI-powered assistance
          </p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          <StatCard
            title="Total Applications"
            value="0"
            subtitle="Track all your applications"
            icon="📝"
          />
          <StatCard
            title="In Progress"
            value="0"
            subtitle="Active conversations"
            icon="🔄"
          />
          <StatCard
            title="Interviews"
            value="0"
            subtitle="Upcoming opportunities"
            icon="🎯"
          />
        </div>

        {/* Quick Actions */}
        <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-700 p-8">
          <h2 className="text-xl font-semibold text-slate-900 dark:text-white mb-6">
            Quick Actions
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <ActionButton
              icon="➕"
              title="Add Application"
              description="Log a new job application"
            />
            <ActionButton
              icon="📊"
              title="View Analytics"
              description="See your application insights"
            />
            <ActionButton
              icon="🔍"
              title="Search Jobs"
              description="Find new opportunities"
            />
            <ActionButton
              icon="📅"
              title="Schedule Follow-up"
              description="Set reminders for next steps"
            />
          </div>
        </div>

        {/* Getting Started */}
        <div className="mt-12 bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-950/30 dark:to-indigo-950/30 rounded-2xl p-8 border border-blue-100 dark:border-blue-900">
          <h2 className="text-xl font-semibold text-slate-900 dark:text-white mb-3">
            Get Started
          </h2>
          <p className="text-slate-600 dark:text-slate-400 mb-4">
            Use the AI assistant in the sidebar to help you:
          </p>
          <ul className="space-y-2 text-slate-600 dark:text-slate-400">
            <li className="flex items-start gap-2">
              <span className="text-blue-500 mt-1">•</span>
              <span>Add and track job applications</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-blue-500 mt-1">•</span>
              <span>Get reminders for follow-ups and interviews</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-blue-500 mt-1">•</span>
              <span>Analyze your application success rate</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-blue-500 mt-1">•</span>
              <span>Receive personalized job search advice</span>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
}

function StatCard({
  title,
  value,
  subtitle,
  icon,
}: {
  title: string;
  value: string;
  subtitle: string;
  icon: string;
}) {
  return (
    <div className="bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700 p-6 hover:shadow-md transition-shadow">
      <div className="flex items-start justify-between mb-3">
        <div className="text-3xl">{icon}</div>
        <div className="text-3xl font-bold text-slate-900 dark:text-white">
          {value}
        </div>
      </div>
      <h3 className="text-sm font-semibold text-slate-900 dark:text-white mb-1">
        {title}
      </h3>
      <p className="text-xs text-slate-500 dark:text-slate-400">{subtitle}</p>
    </div>
  );
}

function ActionButton({
  icon,
  title,
  description,
}: {
  icon: string;
  title: string;
  description: string;
}) {
  return (
    <button className="flex items-start gap-4 p-4 rounded-xl border border-slate-200 dark:border-slate-700 hover:border-slate-300 dark:hover:border-slate-600 hover:bg-slate-50 dark:hover:bg-slate-700/50 transition-all text-left group">
      <div className="text-2xl mt-0.5 group-hover:scale-110 transition-transform">
        {icon}
      </div>
      <div>
        <h3 className="font-semibold text-slate-900 dark:text-white mb-1">
          {title}
        </h3>
        <p className="text-sm text-slate-500 dark:text-slate-400">
          {description}
        </p>
      </div>
    </button>
  );
}
