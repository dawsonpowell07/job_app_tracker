import { Briefcase } from "lucide-react";

export function EmptyColumnPlaceholder() {
  return (
    <div className="flex flex-col items-center justify-center py-12 px-4 text-center">
      <div className="w-16 h-16 rounded-full bg-muted/40 flex items-center justify-center mb-4">
        <Briefcase className="w-8 h-8 text-muted-foreground/60" />
      </div>
      <p className="text-sm font-light text-muted-foreground">
        No applications yet
      </p>
      <p className="text-xs text-muted-foreground/60 mt-1">
        Drag cards here to update status
      </p>
    </div>
  );
}
