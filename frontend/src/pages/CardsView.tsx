import { useState, useEffect } from "react";
import { mockApplications } from "@/mockData";
import type { Application, ApplicationStatus } from "@/types";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  MapPin,
  DollarSign,
  Calendar,
  Briefcase,
  ExternalLink,
  FileText,
  Save,
  MousePointerClick,
} from "lucide-react";
import { useCopilotAction } from "@copilotkit/react-core";
import { CopilotKit } from "@copilotkit/react-core";
import { CopilotSidebar } from "@copilotkit/react-ui";
import { useAuth0 } from "@auth0/auth0-react";

interface AddApplicationInterface {
  job_title: string;
  company: string;
  status?: ApplicationStatus;
  pay?: number;
  location?: string;
  job_url?: string;
  resume_used?: string;
}

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

interface ApplicationCardProps {
  application: Application;
  onClick: () => void;
  index: number;
  isSelected: boolean;
}

function ApplicationCard({
  application,
  onClick,
  index,
  isSelected,
}: ApplicationCardProps) {
  const statusInfo = statusConfig[application.status];

  return (
    <div
      className={`relative bg-card border rounded-2xl p-5 cursor-pointer transition-all duration-300 overflow-hidden ${
        isSelected
          ? "border-primary shadow-lg ring-2 ring-primary/20"
          : "border-border/60 hover:shadow-md hover:border-primary/40"
      }`}
      onClick={onClick}
      style={{
        animationDelay: `${index * 60}ms`,
        opacity: 0,
        animation: "fade-in-up 0.5s ease-out forwards",
      }}
    >
      {/* Status badge */}
      <div className="absolute top-4 right-4">
        <Badge className={`${statusInfo.className} text-xs`}>
          {statusInfo.label}
        </Badge>
      </div>

      {/* Main content */}
      <div className="space-y-3 pr-16">
        {/* Job title */}
        <h3 className="text-xl font-light leading-tight text-foreground line-clamp-2">
          {application.job_title || "Untitled Position"}
        </h3>

        {/* Company */}
        <div className="flex items-center gap-2 text-muted-foreground">
          <Briefcase className="size-3.5 shrink-0" />
          <span className="font-light text-xs truncate">
            {application.company || "Company not specified"}
          </span>
        </div>

        {/* Metadata */}
        <div className="space-y-2 pt-2 border-t border-border/40">
          {/* Pay & Location */}
          <div className="flex items-center justify-between gap-2 text-xs">
            {application.pay && (
              <div className="flex items-center gap-1.5">
                <DollarSign className="size-3.5 text-primary/60" />
                <span className="font-medium text-foreground">
                  ${application.pay.toLocaleString()}
                </span>
              </div>
            )}
            {application.location && (
              <div className="flex items-center gap-1.5">
                <MapPin className="size-3.5 text-primary/60" />
                <span className="text-muted-foreground truncate">
                  {application.location}
                </span>
              </div>
            )}
          </div>

          {/* Date */}
          {application.created_at && (
            <div className="flex items-center gap-1.5 text-xs">
              <Calendar className="size-3.5 text-primary/60" />
              <span className="text-muted-foreground">
                {new Date(application.created_at).toLocaleDateString()}
              </span>
            </div>
          )}
        </div>
      </div>

      {/* Selected indicator */}
      {isSelected && (
        <div className="absolute bottom-0 left-0 right-0 h-1 bg-linear-to-r from-primary/0 via-primary to-primary/0" />
      )}
    </div>
  );
}

interface ApplicationDetailPanelProps {
  application: Application | null;
  onSave: (updated: Application) => void;
}

function ApplicationDetailPanel({
  application,
  onSave,
}: ApplicationDetailPanelProps) {
  const [formData, setFormData] = useState<Application | null>(application);
  const [isSaving, setIsSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);

  // Update form data when application changes
  useEffect(() => {
    setFormData(application);
    setSaveSuccess(false);
  }, [application]);

  const handleSave = () => {
    if (!formData) return;
    setIsSaving(true);
    setSaveSuccess(false);

    // Simulate save delay
    setTimeout(() => {
      onSave(formData);
      setIsSaving(false);
      setSaveSuccess(true);

      // Clear success message after 2 seconds
      setTimeout(() => {
        setSaveSuccess(false);
      }, 2000);
    }, 300);
  };

  const updateField = (
    field: keyof Application,
    value: string | number | ApplicationStatus
  ) => {
    if (!formData) return;
    setFormData((prev) => (prev ? { ...prev, [field]: value } : null));
  };

  // Empty state
  if (!application || !formData) {
    return (
      <div className="flex flex-col h-full bg-card/40 border border-border/40 rounded-2xl">
        <div className="flex-1 flex flex-col items-center justify-center p-8 text-center space-y-4">
          <div className="size-16 rounded-full bg-muted/50 flex items-center justify-center">
            <MousePointerClick className="size-8 text-muted-foreground/50" />
          </div>
          <div className="space-y-2">
            <h3 className="text-2xl font-light text-muted-foreground">
              No Application Selected
            </h3>
            <p className="text-sm text-muted-foreground/70 font-light max-w-xs">
              Click on any application card to view and edit its details here
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full bg-card border border-border/60 rounded-2xl overflow-hidden">
      {/* Content wrapper with key to trigger transition on selection change */}
      <div
        key={formData.id}
        className="flex flex-col h-full animate-in fade-in slide-in-from-right-4 duration-300"
      >
        {/* Header with Save Button */}
        <div className="border-b border-border/60 p-6">
          <div className="flex items-start justify-between gap-4">
            <div className="space-y-1 flex-1">
              <h2 className="text-2xl font-light leading-tight">
                {formData.job_title || "Application Details"}
              </h2>
              <p className="text-sm text-muted-foreground font-light">
                {formData.company || "Edit application information"}
              </p>
            </div>
            <div className="flex flex-col items-end gap-2">
              <Button
                onClick={handleSave}
                disabled={isSaving}
                className="h-9 px-4"
                size="sm"
              >
                <Save className="size-3.5" />
                {isSaving ? "Saving..." : "Save"}
              </Button>
              {saveSuccess && (
                <div className="text-xs text-emerald-600 dark:text-emerald-400 font-medium animate-in fade-in duration-200">
                  ✓ Saved
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Content - scrollable */}
        <div className="flex-1 overflow-y-auto p-6 pb-4 space-y-5">
          {/* Status Section */}
          <div className="space-y-3">
            <label className="text-sm font-medium text-foreground">
              Application Status
            </label>
            <div className="flex flex-wrap gap-2">
              {(Object.keys(statusConfig) as ApplicationStatus[]).map(
                (status) => (
                  <button
                    key={status}
                    onClick={() => updateField("status", status)}
                    className={`px-3 py-1.5 rounded-full text-xs font-medium border-2 transition-all ${
                      formData.status === status
                        ? statusConfig[status].className + " scale-105"
                        : "border-border/40 text-muted-foreground hover:border-border bg-background"
                    }`}
                  >
                    {statusConfig[status].label}
                  </button>
                )
              )}
            </div>
          </div>

          {/* Job Details */}
          <div className="space-y-4">
            <h3 className="text-base font-medium border-b border-border/40 pb-2">
              Position Information
            </h3>

            <div className="space-y-2">
              <label className="text-xs font-medium text-foreground">
                Job Title
              </label>
              <Input
                value={formData.job_title || ""}
                onChange={(e) => updateField("job_title", e.target.value)}
                placeholder="e.g., Senior Software Engineer"
                className="text-sm"
              />
            </div>

            <div className="space-y-2">
              <label className="text-xs font-medium text-foreground">
                Company
              </label>
              <Input
                value={formData.company || ""}
                onChange={(e) => updateField("company", e.target.value)}
                placeholder="e.g., Tech Corp Inc."
                className="text-sm"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-2">
                <label className="text-xs font-medium text-foreground">
                  Salary
                </label>
                <div className="relative">
                  <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 size-3.5 text-muted-foreground" />
                  <Input
                    type="number"
                    value={formData.pay || ""}
                    onChange={(e) =>
                      updateField("pay", parseInt(e.target.value) || 0)
                    }
                    placeholder="120000"
                    className="pl-8 text-sm"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-xs font-medium text-foreground">
                  Location
                </label>
                <div className="relative">
                  <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 size-3.5 text-muted-foreground" />
                  <Input
                    value={formData.location || ""}
                    onChange={(e) => updateField("location", e.target.value)}
                    placeholder="San Francisco, CA"
                    className="pl-8 text-sm"
                  />
                </div>
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-xs font-medium text-foreground">
                Job URL
              </label>
              <div className="relative">
                <ExternalLink className="absolute left-3 top-1/2 -translate-y-1/2 size-3.5 text-muted-foreground" />
                <Input
                  value={formData.job_url || ""}
                  onChange={(e) => updateField("job_url", e.target.value)}
                  placeholder="https://example.com/job/12345"
                  className="pl-8 text-sm"
                />
              </div>
            </div>
          </div>

          {/* Resume Section */}
          <div className="space-y-4">
            <h3 className="text-base font-medium border-b border-border/40 pb-2">
              Resume Information
            </h3>

            <div className="space-y-2">
              <label className="text-xs font-medium text-foreground">
                Resume Used
              </label>
              <div className="relative">
                <FileText className="absolute left-3 top-1/2 -translate-y-1/2 size-3.5 text-muted-foreground" />
                <Input
                  value={formData.resume_used || ""}
                  onChange={(e) => updateField("resume_used", e.target.value)}
                  placeholder="Resume_2024.pdf"
                  className="pl-8 text-sm"
                />
              </div>
            </div>
          </div>

          {/* Metadata */}
          <div className="space-y-4">
            <h3 className="text-base font-medium border-b border-border/40 pb-2">
              Application Metadata
            </h3>
            <div className="rounded-xl bg-muted/30 p-5 space-y-3 text-sm">
              <div className="flex justify-between items-center py-1">
                <span className="text-muted-foreground">Application ID</span>
                <span className="font-mono text-xs text-foreground/70">
                  {formData.id}
                </span>
              </div>
              {formData.created_at && (
                <div className="flex justify-between items-center py-1 border-t border-border/20 pt-3">
                  <span className="text-muted-foreground">Created</span>
                  <span className="text-foreground font-medium">
                    {new Date(formData.created_at).toLocaleDateString("en-US", {
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                    })}
                  </span>
                </div>
              )}
              {formData.updated_at && (
                <div className="flex justify-between items-center py-1 border-t border-border/20 pt-3">
                  <span className="text-muted-foreground">Last Updated</span>
                  <span className="text-foreground font-medium">
                    {new Date(formData.updated_at).toLocaleDateString("en-US", {
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                    })}
                  </span>
                </div>
              )}
              <div className="flex justify-between items-center py-1 border-t border-border/20 pt-3">
                <span className="text-muted-foreground">Current Status</span>
                <Badge
                  className={`${
                    statusConfig[formData.status].className
                  } text-xs`}
                >
                  {statusConfig[formData.status].label}
                </Badge>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function CardsViewContent() {
  const [applications, setApplications] = useState(mockApplications);
  const [selectedApplication, setSelectedApplication] =
    useState<Application | null>(null);

  // Frontend action for AI agent to set active application
  useCopilotAction({
    name: "setActiveApplication",
    description:
      "Set the active application in the detail panel by application ID. Use this to show application details to the user.",
    parameters: [
      {
        name: "applicationId",
        type: "string",
        description: "The ID of the application to display in the detail panel",
        required: true,
      },
    ],
    handler: async ({ applicationId }) => {
      const application = applications.find((app) => app.id === applicationId);
      if (application) {
        setSelectedApplication(application);
        return `Successfully opened application: ${application.job_title} at ${application.company}`;
      } else {
        return `Application with ID ${applicationId} not found`;
      }
    },
  });

  useCopilotAction({
    name: "add_application",
    available: "disabled",
    parameters: [
      { name: "job_title", type: "string", required: true },
      { name: "company", type: "string", required: true },
      { name: "status", type: "string", required: false },
      { name: "pay", type: "number", required: false },
      { name: "location", type: "string", required: false },
      { name: "job_url", type: "string", required: false },
      { name: "resume_used", type: "string", required: false },
    ],
    render: ({ args, result, status }) => {
      if (status !== "complete") {
        return (
          <div className="p-5 bg-card border border-border/60 rounded-xl space-y-4 animate-in fade-in slide-in-from-bottom-2 duration-300">
            <span className="text-lg font-medium">
              Adding your application...
            </span>
          </div>
        );
      }

      const newApp: AddApplicationInterface = {
        job_title: args.job_title,
        company: args.company,
        status: args.status || "applied",
        pay: args.pay || 0,
        location: args.location || "",
        job_url: args.job_url || "",
        resume_used: args.resume_used || "",
      };

      return (
        <div className="p-5 bg-card border border-border/60 rounded-xl space-y-4 animate-in fade-in slide-in-from-bottom-2 duration-300">
          <div className="space-y-1">
            <h3 className="text-lg font-medium">Add New Application</h3>
          </div>

          <div className="bg-muted/30 rounded-lg p-4 space-y-3">
            <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
              Application Details
            </p>
            {newApp.job_title && (
              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">Position</span>
                <span className="font-medium text-foreground">
                  {newApp.job_title}
                </span>
              </div>
            )}
            {newApp.company && (
              <div className="flex items-center justify-between text-sm border-t border-border/20 pt-3">
                <span className="text-muted-foreground">Company</span>
                <span className="font-medium text-foreground">
                  {newApp.company}
                </span>
              </div>
            )}
            {newApp.pay && (
              <div className="flex items-center justify-between text-sm border-t border-border/20 pt-3">
                <span className="text-muted-foreground">Salary</span>
                <span className="font-medium text-foreground">
                  ${newApp.pay.toLocaleString()}
                </span>
              </div>
            )}
            {newApp.location && (
              <div className="flex items-center justify-between text-sm border-t border-border/20 pt-3">
                <span className="text-muted-foreground">Location</span>
                <span className="font-medium text-foreground">
                  {newApp.location}
                </span>
              </div>
            )}
            {newApp.status && (
              <div className="flex items-center justify-between text-sm border-t border-border/20 pt-3">
                <span className="text-muted-foreground">Status</span>
                <Badge
                  className={`${
                    statusConfig[newApp.status as ApplicationStatus].className
                  } text-xs`}
                >
                  {statusConfig[newApp.status as ApplicationStatus].label}
                </Badge>
              </div>
            )}
            {newApp.job_url && (
              <div className="flex items-center justify-between text-sm border-t border-border/20 pt-3">
                <span className="text-muted-foreground">Job URL</span>
                <a
                  href={newApp.job_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-primary hover:underline text-xs truncate max-w-50"
                >
                  {newApp.job_url}
                </a>
              </div>
            )}
          </div>
        </div>
      );
    },
  });

  useCopilotAction({
    name: "update_application",
    available: "disabled",
    parameters: [
      { name: "application_id", type: "string", required: true },
      { name: "job_title", type: "string", required: false },
      { name: "company", type: "string", required: false },
      { name: "pay", type: "number", required: false },
      { name: "location", type: "string", required: false },
      { name: "status", type: "string", required: false },
      { name: "resume_id", type: "string", required: false },
      { name: "job_url", type: "string", required: false },
    ],
    render: ({ args, status }) => {
      if (status !== "complete") {
        return (
          <div className="p-5 bg-card border border-border/60 rounded-xl space-y-4 animate-in fade-in slide-in-from-bottom-2 duration-300">
            <span className="text-lg font-medium">Updating application...</span>
          </div>
        );
      }
      return (
        <div className="p-5 bg-card border border-border/60 rounded-xl space-y-4 animate-in fade-in slide-in-from-bottom-2 duration-300">
          <div className="space-y-1">
            <h3 className="text-lg font-medium">Update Application</h3>
          </div>
          <div className="bg-muted/30 rounded-lg p-4 space-y-3">
            <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
              Updated Details
            </p>
            <div className="flex items-center justify-between text-sm">
              <span className="text-muted-foreground">Application ID</span>
              <span className="font-medium text-foreground">
                {args.application_id}
              </span>
            </div>
            {Object.entries(args)
              .filter(([key]) => key !== "application_id")
              .map(
                ([key, value]) =>
                  value && (
                    <div
                      key={key}
                      className="flex items-center justify-between text-sm border-t border-border/20 pt-3"
                    >
                      <span className="text-muted-foreground capitalize">
                        {key.replace(/_/g, " ")}
                      </span>
                      <span className="font-medium text-foreground">
                        {String(value)}
                      </span>
                    </div>
                  )
              )}
          </div>
        </div>
      );
    },
  });

  useCopilotAction({
    name: "delete_application",
    available: "disabled",
    parameters: [{ name: "application_id", type: "string", required: true }],
    render: ({ args, status }) => {
      if (status !== "complete") {
        return (
          <div className="p-5 bg-card border border-border/60 rounded-xl space-y-4 animate-in fade-in slide-in-from-bottom-2 duration-300">
            <span className="text-lg font-medium">Deleting application...</span>
          </div>
        );
      }
      return (
        <div className="p-5 bg-card border border-border/60 rounded-xl space-y-4 animate-in fade-in slide-in-from-bottom-2 duration-300">
          <div className="space-y-1">
            <h3 className="text-lg font-medium">Delete Application</h3>
          </div>
          <div className="bg-muted/30 rounded-lg p-4 space-y-3">
            <p className="text-sm font-medium text-foreground">
              Application{" "}
              <span className="font-mono text-primary">
                {args.application_id}
              </span>{" "}
              has been deleted.
            </p>
          </div>
        </div>
      );
    },
  });

  useCopilotAction({
    name: "get_applications",
    available: "disabled",
    parameters: [{ name: "status", type: "string", required: false }],
    render: ({ args, status, result }) => {
      if (status !== "complete") {
        return (
          <div className="p-5 bg-card border border-border/60 rounded-xl space-y-4 animate-in fade-in slide-in-from-bottom-2 duration-300">
            <span className="text-lg font-medium">Getting applications...</span>
          </div>
        );
      }

      const applications = result?.data || [];

      return (
        <div className="p-5 bg-card border border-border/60 rounded-xl space-y-4 animate-in fade-in slide-in-from-bottom-2 duration-300">
          <div className="space-y-1">
            <h3 className="text-lg font-medium">
              {applications.length} Applications Found
            </h3>
          </div>
          <div className="bg-muted/30 rounded-lg p-4 space-y-3">
            {args.status && (
              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">Filtered by</span>
                <Badge
                  className={`${
                    statusConfig[args.status as ApplicationStatus]?.className ||
                    "bg-muted text-muted-foreground"
                  } text-xs`}
                >
                  {statusConfig[args.status as ApplicationStatus]?.label ||
                    args.status}
                </Badge>
              </div>
            )}
            {applications.length === 0 ? (
              <p className="text-sm text-muted-foreground text-center py-4">
                No applications match your criteria.
              </p>
            ) : (
              <div className="space-y-2">
                {applications.map((app: any, index: number) => (
                  <div
                    key={index}
                    className="flex items-center justify-between text-sm border-t border-border/20 pt-2"
                  >
                    <span className="font-medium text-foreground">
                      {app.job_title}
                    </span>
                    <span className="text-muted-foreground">{app.company}</span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      );
    },
  });

  const handleCardClick = (app: Application) => {
    setSelectedApplication(app);
  };

  const handleSaveApplication = (updated: Application) => {
    setApplications((prev) =>
      prev.map((app) => (app.id === updated.id ? updated : app))
    );
    setSelectedApplication(updated);
  };

  return (
    <div className="flex flex-1 gap-6 p-6 min-h-0 relative">
      {/* Background gradient mesh */}
      <div className="absolute inset-0 -z-10 gradient-mesh-1 opacity-20" />

      {/* Left Column: Application Cards */}
      <div className="w-1/3 flex flex-col gap-4 min-h-0">
        {/* Header */}
        <div className="space-y-1">
          <h1 className="text-3xl tracking-tight">Applications</h1>
          <p className="text-sm font-light text-muted-foreground">
            {applications.length} total applications
          </p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 gap-2">
          {(
            [
              "applied",
              "interviewing",
              "offer",
              "rejected",
              "ghosted",
            ] as ApplicationStatus[]
          )
            .slice(0, 4)
            .map((status) => {
              const count = applications.filter(
                (app) => app.status === status
              ).length;
              return (
                <div
                  key={status}
                  className="flex items-center gap-2 px-3 py-2 rounded-xl bg-card/60 border border-border/40"
                >
                  <Badge
                    className={`${statusConfig[status].className} text-[10px] px-2 py-0`}
                  >
                    {count}
                  </Badge>
                  <span className="text-xs text-muted-foreground capitalize truncate">
                    {status}
                  </span>
                </div>
              );
            })}
        </div>

        {/* Cards - scrollable */}
        <div className="flex-1 overflow-y-auto space-y-3 pr-2">
          {applications.map((app, index) => (
            <ApplicationCard
              key={app.id}
              application={app}
              onClick={() => handleCardClick(app)}
              index={index}
              isSelected={selectedApplication?.id === app.id}
            />
          ))}
        </div>
      </div>

      {/* Right Column: Active Application */}
      <div className="flex-1 flex flex-col min-h-0">
        <ApplicationDetailPanel
          application={selectedApplication}
          onSave={handleSaveApplication}
        />
      </div>
    </div>
  );
}

export default function CardsView() {
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
        <CardsViewContent />
      </CopilotSidebar>
    </CopilotKit>
  );
}
