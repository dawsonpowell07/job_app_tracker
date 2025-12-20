import { useState } from "react";
import type { Application, ApplicationStatus } from "@/types";

export function useApplicationMutations(
  applications: Application[],
  setApplications: (apps: Application[]) => void
) {
  const [isUpdating, setIsUpdating] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const updateApplicationStatus = async (
    applicationId: string,
    newStatus: ApplicationStatus
  ) => {
    setIsUpdating(true);
    setError(null);

    // Store original applications for potential rollback
    const originalApplications = [...applications];

    // Optimistic update
    setApplications(
      applications.map((app) =>
        app.id === applicationId
          ? { ...app, status: newStatus, updated_at: new Date() }
          : app
      )
    );

    try {
      // TODO: When backend is integrated, replace with API call:
      // const { getAccessTokenSilently } = useAuth0();
      // const token = await getAccessTokenSilently();
      //
      // await fetch(`http://localhost:8000/api/applications/${applicationId}`, {
      //   method: 'PATCH',
      //   headers: {
      //     'Authorization': `Bearer ${token}`,
      //     'Content-Type': 'application/json',
      //   },
      //   body: JSON.stringify({ status: newStatus }),
      // });

      // Simulate API delay for now
      await new Promise((resolve) => setTimeout(resolve, 300));

      console.log(`Updated application ${applicationId} to status: ${newStatus}`);
    } catch (err) {
      // Rollback on error
      console.error("Failed to update application status:", err);
      setError(err instanceof Error ? err : new Error("Update failed"));
      setApplications(originalApplications);
    } finally {
      setIsUpdating(false);
    }
  };

  const retry = () => {
    setError(null);
  };

  return {
    updateApplicationStatus,
    isUpdating,
    error,
    retry,
  };
}
