import { useState } from "react";
import { mockApplications } from "@/mockData";
import { KanbanBoard } from "@/components/kanban/KanbanBoard";
import { useApplicationMutations } from "@/hooks/useApplicationMutations";

export default function KanbanView() {
  const [applications, setApplications] = useState(mockApplications);
  const { updateApplicationStatus } = useApplicationMutations(
    applications,
    setApplications,
  );

  return (
    <div className="flex flex-1 flex-col gap-8 p-8 relative">
      {/* Background gradient mesh */}
      <div className="absolute inset-0 -z-10 gradient-mesh-2 opacity-20" />

      {/* Page header */}
      <div className="space-y-2">
        <h1 className="text-4xl tracking-tight">Kanban Board</h1>
        <p className="text-lg font-light text-muted-foreground">
          Drag and drop to manage your application pipeline
        </p>
      </div>

      {/* Main content */}
      <KanbanBoard
        applications={applications}
        onStatusUpdate={updateApplicationStatus}
      />
    </div>
  );
}
