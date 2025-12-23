import { useEffect, useMemo, useState } from "react";
import { columns } from "@/components/columns";
import { DataTable } from "@/components/data-table.tsx";
import type { Application, ApplicationAgentState } from "@/types";
import { useCoAgent } from "@copilotkit/react-core";
import { CopilotSidebar } from "@copilotkit/react-ui";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Filter, Sparkles } from "lucide-react";
import type { ApplicationStatus } from "@/types";
import { mockApplications } from "@/mockData";
// Your mock data
const mockData = mockApplications;

const statusConfig: Record<
  ApplicationStatus,
  { label: string; className: string }
> = {
  applied: {
    label: "Applied",
    className:
      "bg-primary/10 text-primary border-primary/20 hover:bg-primary/15",
  },
  interviewing: {
    label: "Interviewing",
    className:
      "bg-secondary/20 text-secondary-foreground border-secondary/30 hover:bg-secondary/25",
  },
  offer: {
    label: "Offer",
    className:
      "bg-emerald-100 text-emerald-700 border-emerald-200 hover:bg-emerald-150 dark:bg-emerald-900/30 dark:text-emerald-300 dark:border-emerald-800",
  },
  rejected: {
    label: "Rejected",
    className:
      "bg-destructive/10 text-destructive border-destructive/20 hover:bg-destructive/15",
  },
  ghosted: {
    label: "Ghosted",
    className: "bg-muted text-muted-foreground border-border hover:bg-muted/80",
  },
};

function ExcelViewContent({ onNudge }: { onNudge: () => void }) {
  const [statusFilter, setStatusFilter] = useState<ApplicationStatus | "all">(
    "all"
  );

  const filteredData = useMemo(() => {
    if (statusFilter === "all") return mockData;
    return mockData.filter((app) => app.status === statusFilter);
  }, [statusFilter]);

  const statusCounts = useMemo(() => {
    const counts: Record<ApplicationStatus, number> = {
      applied: 0,
      interviewing: 0,
      offer: 0,
      rejected: 0,
      ghosted: 0,
    };
    mockData.forEach((app) => {
      counts[app.status] = (counts[app.status] || 0) + 1;
    });
    return counts;
  }, []);

  return (
    <div className="flex flex-1 flex-col gap-6 p-8 relative">
      <div className="absolute inset-0 -z-10 gradient-mesh-2 opacity-20" />
      <div className="space-y-2">
        <div className="flex items-center gap-3">
          <h1 className="text-4xl tracking-tight">Spreadsheet view</h1>
          <Badge variant="outline" className="rounded-full border-border/60">
            {filteredData.length} rows
          </Badge>
        </div>
        <p className="text-lg font-light text-muted-foreground">
          Manage and track all your applications with table tools and filters.
        </p>
      </div>
      <div className="rounded-2xl border border-border/60 bg-card/60 p-4 space-y-3 backdrop-blur-sm">
        <div className="flex items-center justify-between gap-3">
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Filter className="size-4" />
            Quick filters
          </div>
          <Badge variant="outline" className="text-[10px]">
            {filteredData.length} visible
          </Badge>
        </div>
        <div className="flex flex-wrap gap-2">
          {(
            [
              "all",
              "applied",
              "interviewing",
              "offer",
              "rejected",
              "ghosted",
            ] as const
          ).map((status) => (
            <button
              key={status}
              onClick={() => setStatusFilter(status)}
              className={`px-3 py-1.5 rounded-full text-xs border transition ${
                statusFilter === status
                  ? "border-primary/60 text-primary bg-primary/10"
                  : "border-border/60 text-muted-foreground hover:border-primary/30"
              }`}
            >
              {status === "all"
                ? "All"
                : statusConfig[status as ApplicationStatus].label}
            </button>
          ))}
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-5 gap-2">
          {(Object.keys(statusCounts) as ApplicationStatus[]).map((status) => (
            <div
              key={status}
              className="flex items-center gap-2 px-3 py-2 rounded-xl bg-card/60 border border-border/40"
            >
              <Badge
                className={`${statusConfig[status].className} text-[10px] px-2 py-0`}
              >
                {statusCounts[status]}
              </Badge>
              <span className="text-xs text-muted-foreground capitalize truncate">
                {status}
              </span>
            </div>
          ))}
        </div>
      </div>
      <div className="flex items-center justify-between text-sm text-muted-foreground">
        <div className="flex items-center gap-2">
          <Sparkles className="size-4 text-primary" />
          Ask the agent to filter, summarize, or draft outreach from selected
          rows.
        </div>
        <Button variant="outline" size="sm" className="gap-2" onClick={onNudge}>
          <Sparkles className="size-4" />
          Nudge agent
        </Button>
      </div>
      <DataTable columns={columns} data={filteredData} />
    </div>
  );
}

export default function ExcelView() {
  const { state, setState } = useCoAgent<ApplicationAgentState>({
    name: "applications",
    initialState: { currentView: "excelView" },
  });

  // Update agent state when component mounts to reflect current view
  useEffect(() => {
    setState({ currentView: "excelView" });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); // Run only once on mount

  return (
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
      <ExcelViewContent
        onNudge={() =>
          setState({
            ...state,
            currentView: "excelView",
          })
        }
      />
    </CopilotSidebar>
  );
}
