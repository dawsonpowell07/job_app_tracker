import type { Application, ApplicationStatus } from "@/types";

export interface KanbanColumn {
  id: ApplicationStatus;
  title: string;
  applications: Application[];
  color: string;
  bgColor: string;
}
