import { useState } from "react";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import type { Application } from "@/types";
import {
  AlertDialog,
  AlertDialogTrigger,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogCancel, // Import AlertDialogCancel
} from "@/components/ui/alert-dialog";
import { Separator } from "@/components/ui/separator";
import { X } from "lucide-react"; // Import the X icon

interface KanbanCardProps {
  application: Application;
}

export function KanbanCard({ application }: KanbanCardProps) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({
    id: application.id!,
  });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  };

  const [isOpen, setIsOpen] = useState(false);

  return (
    <AlertDialog open={isOpen} onOpenChange={setIsOpen}>
      <AlertDialogTrigger asChild>
        <div
          ref={setNodeRef}
          style={style}
          {...attributes}
          {...listeners}
          className="rounded-3xl border border-border/60 bg-card/90 backdrop-blur-sm p-6 watercolor-shadow-sm hover:watercolor-shadow hover:-translate-y-1 transition-all duration-300 cursor-pointer active:cursor-grabbing group"
        >
          <div className="flex items-start justify-between gap-2 mb-3">
            <div className="flex-1">
              <h3 className="font-medium text-foreground mb-1">
                {application.company}
              </h3>
              <p className="text-sm text-muted-foreground font-light">
                {application.job_title}
              </p>
            </div>
          </div>
          <div className="text-xs text-muted-foreground/80 font-light">
            {application.created_at &&
              new Date(application.created_at).toLocaleDateString("en-US", {
                month: "short",
                day: "numeric",
                year: "numeric",
              })}
          </div>
        </div>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Application Details</AlertDialogTitle>
          <AlertDialogDescription className="space-y-4">
            <div>
              <span className="font-medium">Company:</span>{" "}
              {application.company}
            </div>
            <div>
              <span className="font-medium">Job Title:</span>{" "}
              {application.job_title}
            </div>
            {application.pay && (
              <div>
                <span className="font-medium">Pay:</span> ${application.pay}
              </div>
            )}
            {application.location && (
              <div>
                <span className="font-medium">Location:</span>{" "}
                {application.location}
              </div>
            )}
            {application.resume_used && (
              <div>
                <span className="font-medium">Resume Used:</span>{" "}
                {application.resume_used}
              </div>
            )}
            {application.job_url && (
              <div>
                <span className="font-medium">Job URL:</span>{" "}
                <a
                  href={application.job_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-500 hover:underline"
                >
                  {application.job_url}
                </a>
              </div>
            )}
            <div>
              <span className="font-medium">Status:</span> {application.status}
            </div>
            {application.created_at && (
              <div>
                <span className="font-medium">Applied On:</span>{" "}
                {new Date(application.created_at).toLocaleDateString("en-US", {
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                })}
              </div>
            )}
            {application.updated_at && (
              <div>
                <span className="font-medium">Last Updated:</span>{" "}
                {new Date(application.updated_at).toLocaleDateString("en-US", {
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                })}
              </div>
            )}
          </AlertDialogDescription>
          <AlertDialogCancel className="absolute right-4 top-4 rounded-sm opacity-70 ring-offset-background transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:pointer-events-none data-[state=open]:bg-accent data-[state=open]:text-muted-foreground">
            <X className="h-4 w-4" />
            <span className="sr-only">Close</span>
          </AlertDialogCancel>
        </AlertDialogHeader>
      </AlertDialogContent>
    </AlertDialog>
  );
}
