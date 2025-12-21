import { columns } from "@/components/columns";
import { DataTable } from "@/components/data-table.tsx";
import type { Application } from "@/types";
import { CopilotKit } from "@copilotkit/react-core";
import { CopilotSidebar } from "@copilotkit/react-ui";
import { useAuth0 } from "@auth0/auth0-react";

// Your mock data
const mockData: Application[] = [
  {
    id: "app1",
    user_id: "user123",
    job_title: "Software Engineer",
    company: "Tech Solutions Inc.",
    pay: 120000,
    location: "San Francisco, CA",
    resume_used: "Software_Engineer_Resume.pdf",
    resume_id: "res1",
    job_url: "https://example.com/job/app1",
    status: "applied",
    created_at: new Date("2024-10-26T10:00:00Z"),
    updated_at: new Date("2024-10-26T10:00:00Z"),
  },
  {
    id: "app2",
    user_id: "user123",
    job_title: "Senior Product Manager",
    company: "Innovate Co.",
    pay: 160000,
    location: "New York, NY",
    resume_used: "Product_Manager_Resume.pdf",
    resume_id: "res2",
    job_url: "https://example.com/job/app2",
    status: "interviewing",
    created_at: new Date("2024-10-20T11:30:00Z"),
    updated_at: new Date("2024-10-28T14:00:00Z"),
  },
  {
    id: "app3",
    user_id: "user123",
    job_title: "Data Scientist",
    company: "Data Insights LLC",
    pay: 135000,
    location: "Seattle, WA",
    resume_used: "Data_Scientist_Resume.pdf",
    resume_id: "res3",
    job_url: "https://example.com/job/app3",
    status: "rejected",
    created_at: new Date("2024-10-15T09:15:00Z"),
    updated_at: new Date("2024-11-01T16:00:00Z"),
  },
  {
    id: "app4",
    user_id: "user123",
    job_title: "Frontend Developer",
    company: "WebCrafters",
    pay: 110000,
    location: "Remote",
    resume_used: "Frontend_Resume.pdf",
    resume_id: "res4",
    job_url: "https://example.com/job/app4",
    status: "offer",
    created_at: new Date("2024-11-01T13:00:00Z"),
    updated_at: new Date("2024-11-05T10:00:00Z"),
  },
  {
    id: "app5",
    user_id: "user123",
    job_title: "DevOps Engineer",
    company: "CloudOps Inc.",
    pay: 145000,
    location: "Austin, TX",
    resume_used: "DevOps_Resume.pdf",
    resume_id: "res5",
    job_url: "https://example.com/job/app5",
    status: "applied",
    created_at: new Date("2024-11-05T08:45:00Z"),
    updated_at: new Date("2024-11-05T08:45:00Z"),
  },
];

function ExcelViewContent() {
  // Since we're using static mock data, no need for async loading
  // Just use the data directly — it's immediately available
  return (
    <div className="flex flex-1 flex-col gap-6 p-8 relative">
      <div className="absolute inset-0 -z-10 gradient-mesh-2 opacity-20" />
      <div className="space-y-2">
        <h1 className="text-4xl tracking-tight">Job Applications</h1>
        <p className="text-lg font-light text-muted-foreground">
          Manage and track all your applications
        </p>
      </div>
      <DataTable columns={columns} data={mockData} />
    </div>
  );
}

export default function ExcelView() {
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
        <ExcelViewContent />
      </CopilotSidebar>
    </CopilotKit>
  );
}
