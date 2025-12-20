import type { ApplicationStatus, Application } from "@/types";
import type { KanbanColumn } from "@/components/kanban/types";

export const COLUMN_CONFIG: Record<
  ApplicationStatus,
  {
    title: string;
    color: string;
    bgColor: string;
    order: number;
  }
> = {
  applied: {
    title: "Applied",
    color: "#134074", // Yale Blue
    bgColor: "bg-blue-50/60 dark:bg-blue-950/20",
    order: 1,
  },
  interviewing: {
    title: "Interviewing",
    color: "#5a8ab8", // Medium Blue
    bgColor: "bg-cyan-50/60 dark:bg-cyan-950/20",
    order: 2,
  },
  offer: {
    title: "Offer",
    color: "#2d6e5d", // Academic Green
    bgColor: "bg-emerald-50/60 dark:bg-emerald-950/20",
    order: 3,
  },
  rejected: {
    title: "Rejected",
    color: "#8b5a5f", // Muted Red
    bgColor: "bg-rose-50/60 dark:bg-rose-950/20",
    order: 4,
  },
  ghosted: {
    title: "Ghosted",
    color: "#666666", // Medium Gray
    bgColor: "bg-gray-50/60 dark:bg-gray-950/20",
    order: 5,
  },
};

export function groupApplicationsByStatus(
  applications: Application[]
): KanbanColumn[] {
  const groups = Object.entries(COLUMN_CONFIG)
    .sort(([, a], [, b]) => a.order - b.order)
    .map(([status, config]) => ({
      id: status as ApplicationStatus,
      title: config.title,
      color: config.color,
      bgColor: config.bgColor,
      applications: applications.filter((app) => app.status === status),
    }));

  return groups;
}
