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
    className:
      "bg-muted text-muted-foreground border-border hover:bg-muted/80",
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

  // Update form data when application changes
  useEffect(() => {
    setFormData(application);
  }, [application]);

  const handleSave = () => {
    if (!formData) return;
    setIsSaving(true);
    setTimeout(() => {
      onSave(formData);
      setIsSaving(false);
    }, 500);
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
      {/* Header */}
      <div className="border-b border-border/60 p-6">
        <div className="space-y-1">
          <h2 className="text-2xl font-light leading-tight">
            {formData.job_title || "Application Details"}
          </h2>
          <p className="text-sm text-muted-foreground font-light">
            {formData.company || "Edit application information"}
          </p>
        </div>
      </div>

      {/* Content - scrollable */}
      <div className="flex-1 overflow-y-auto p-6 space-y-6">
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
        <div className="rounded-xl bg-muted/30 p-4 space-y-2 text-xs">
          <div className="flex justify-between">
            <span className="text-muted-foreground">Application ID</span>
            <span className="font-mono text-[10px]">{formData.id}</span>
          </div>
          {formData.created_at && (
            <div className="flex justify-between">
              <span className="text-muted-foreground">Created</span>
              <span className="text-foreground">
                {new Date(formData.created_at).toLocaleDateString("en-US", {
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                })}
              </span>
            </div>
          )}
          {formData.updated_at && (
            <div className="flex justify-between">
              <span className="text-muted-foreground">Last Updated</span>
              <span className="text-foreground">
                {new Date(formData.updated_at).toLocaleDateString("en-US", {
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                })}
              </span>
            </div>
          )}
        </div>
      </div>

      {/* Footer */}
      <div className="border-t border-border/60 p-4">
        <Button
          onClick={handleSave}
          disabled={isSaving}
          className="w-full h-10"
        >
          <Save className="size-4" />
          {isSaving ? "Saving..." : "Save Changes"}
        </Button>
      </div>
    </div>
  );
}

export default function CardsView() {
  const [applications, setApplications] = useState(mockApplications);
  const [selectedApplication, setSelectedApplication] =
    useState<Application | null>(null);

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
            ["applied", "interviewing", "offer", "rejected", "ghosted"] as ApplicationStatus[]
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
