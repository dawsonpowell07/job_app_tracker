import { useDroppable } from "@dnd-kit/core";
import {
  SortableContext,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import type { KanbanColumn as KanbanColumnType } from "./types";
import { KanbanCard } from "./KanbanCard";
import { EmptyColumnPlaceholder } from "./EmptyColumnPlaceholder";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

interface KanbanColumnProps {
  column: KanbanColumnType;
}

export function KanbanColumn({ column }: KanbanColumnProps) {
  const { setNodeRef, isOver } = useDroppable({ id: column.id });

  return (
    <div
      ref={setNodeRef}
      className={cn(
        "flex flex-col gap-4 min-h-[600px] w-full rounded-2xl border border-border/40 backdrop-blur-sm p-4 watercolor-shadow-sm transition-all",
        column.bgColor,
        isOver && "ring-2 ring-primary/50 bg-primary/5",
      )}
    >
      {/* Column Header */}
      <div className="flex items-center justify-between mb-2">
        <h2
          className="font-medium text-lg tracking-tight"
          style={{ color: column.color }}
        >
          {column.title}
        </h2>
        <Badge variant="secondary" className="text-xs font-light">
          {column.applications.length}
        </Badge>
      </div>

      {/* Cards Container */}
      <SortableContext
        items={column.applications.map((app) => app.id!)}
        strategy={verticalListSortingStrategy}
      >
        <div className="flex-1 space-y-3 overflow-y-auto">
          {column.applications.length === 0 ? (
            <EmptyColumnPlaceholder />
          ) : (
            column.applications.map((app, index) => (
              <div
                key={app.id}
                className="animate-fade-in-up"
                style={{ animationDelay: `${index * 50}ms` }}
              >
                <KanbanCard application={app} />
              </div>
            ))
          )}
        </div>
      </SortableContext>
    </div>
  );
}
