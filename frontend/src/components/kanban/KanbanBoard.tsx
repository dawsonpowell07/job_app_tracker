import { useState } from "react";
import {
  DndContext,
  DragOverlay,
  PointerSensor,
  KeyboardSensor,
  useSensor,
  useSensors,
  type DragEndEvent,
  type DragStartEvent,
} from "@dnd-kit/core";
import { sortableKeyboardCoordinates } from "@dnd-kit/sortable";
import type { Application, ApplicationStatus } from "@/types";
import { groupApplicationsByStatus } from "@/lib/kanban-utils";
import { KanbanColumn } from "./KanbanColumn";
import { KanbanCard } from "./KanbanCard";

interface KanbanBoardProps {
  applications: Application[];
  onStatusUpdate: (applicationId: string, newStatus: ApplicationStatus) => void;
}

export function KanbanBoard({ applications, onStatusUpdate }: KanbanBoardProps) {
  const [activeId, setActiveId] = useState<string | null>(null);
  const columns = groupApplicationsByStatus(applications);

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8, // Prevents accidental drags on click
      },
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const handleDragStart = (event: DragStartEvent) => {
    setActiveId(event.active.id as string);
  };

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;

    if (!over || active.id === over.id) {
      setActiveId(null);
      return;
    }

    // Check if dropped on a column (not another card)
    const validStatuses: ApplicationStatus[] = ["applied", "interviewing", "offer", "rejected", "ghosted"];
    if (validStatuses.includes(over.id as ApplicationStatus)) {
      const newStatus = over.id as ApplicationStatus;
      onStatusUpdate(active.id as string, newStatus);
    }

    setActiveId(null);
  };

  const handleDragCancel = () => {
    setActiveId(null);
  };

  const activeApp = applications.find((app) => app.id === activeId);

  return (
    <DndContext
      sensors={sensors}
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
      onDragCancel={handleDragCancel}
    >
      {/* Kanban Board Grid */}
      <div className="flex gap-6 overflow-x-auto pb-4">
        {columns.map((column) => (
          <KanbanColumn key={column.id} column={column} />
        ))}
      </div>

      {/* Drag Overlay */}
      <DragOverlay>
        {activeApp && (
          <div className="opacity-50 rotate-3 scale-105 transition-transform">
            <KanbanCard application={activeApp} />
          </div>
        )}
      </DragOverlay>
    </DndContext>
  );
}
