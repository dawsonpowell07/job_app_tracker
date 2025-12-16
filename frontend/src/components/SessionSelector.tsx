"use client";

import { useState, useEffect } from "react";
import { MessageSquare, Plus, Trash2, Loader2, LogOut } from "lucide-react";
import { getUserSessions, createSession, deleteSession } from "@/lib/streamingHandler";
import { useAuth } from "@/contexts/AuthContext";

interface Session {
  session_id: string;
  user_id: string;
  app_name: string;
}

interface SessionSelectorProps {
  username: string;
  onSessionSelect: (sessionId: string) => void;
  onBack: () => void;
}

export function SessionSelector({ username, onSessionSelect, onBack }: SessionSelectorProps) {
  const { signOut } = useAuth();
  const [sessions, setSessions] = useState<Session[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isCreating, setIsCreating] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [deletingSessionId, setDeletingSessionId] = useState<string | null>(null);

  useEffect(() => {
    loadSessions();
  }, [username]);

  const loadSessions = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const userSessions = await getUserSessions(username);
      setSessions(userSessions);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load sessions");
    } finally {
      setIsLoading(false);
    }
  };

  const handleCreateSession = async () => {
    setIsCreating(true);
    setError(null);
    try {
      const newSession = await createSession(username);
      setSessions((prev) => [newSession, ...prev]);
      onSessionSelect(newSession.session_id);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to create session");
    } finally {
      setIsCreating(false);
    }
  };

  const handleDeleteSession = async (sessionId: string, e: React.MouseEvent) => {
    e.stopPropagation();

    if (!confirm("Are you sure you want to delete this session?")) {
      return;
    }

    setDeletingSessionId(sessionId);
    setError(null);
    try {
      await deleteSession(sessionId, username);
      setSessions((prev) => prev.filter((s) => s.session_id !== sessionId));
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to delete session");
    } finally {
      setDeletingSessionId(null);
    }
  };

  return (
    <div className="flex flex-col h-screen bg-gray-50 dark:bg-gray-950">
      <div className="flex items-center justify-center h-full">
        <div className="bg-white dark:bg-gray-900 rounded-lg shadow-lg p-8 max-w-2xl w-full mx-4">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">
                Select or Create a Session
              </h1>
              <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                User: {username}
              </p>
            </div>
            <button
              onClick={signOut}
              className="text-sm text-red-600 dark:text-red-400 hover:text-red-700 dark:hover:text-red-300 transition-colors flex items-center gap-1"
            >
              <LogOut className="w-4 h-4" />
              Sign Out
            </button>
          </div>

          {error && (
            <div className="mb-4 p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg text-red-700 dark:text-red-400 text-sm">
              {error}
            </div>
          )}

          <button
            onClick={handleCreateSession}
            disabled={isCreating}
            className="w-full px-4 py-3 mb-4 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center justify-center gap-2 font-medium"
          >
            {isCreating ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin" />
                <span>Creating Session...</span>
              </>
            ) : (
              <>
                <Plus className="w-5 h-5" />
                <span>Create New Session</span>
              </>
            )}
          </button>

          <div className="border-t border-gray-200 dark:border-gray-700 pt-4">
            <h2 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3">
              Existing Sessions
            </h2>

            {isLoading ? (
              <div className="flex items-center justify-center py-8">
                <Loader2 className="w-6 h-6 animate-spin text-gray-400" />
              </div>
            ) : sessions.length === 0 ? (
              <div className="text-center py-8 text-gray-500 dark:text-gray-400">
                <MessageSquare className="w-12 h-12 mx-auto mb-2 opacity-50" />
                <p className="text-sm">No sessions yet. Create one to get started!</p>
              </div>
            ) : (
              <div className="space-y-2 max-h-96 overflow-y-auto">
                {sessions.map((session) => (
                  <div
                    key={session.session_id}
                    onClick={() => onSessionSelect(session.session_id)}
                    className="group flex items-center justify-between p-4 border border-gray-200 dark:border-gray-700 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 cursor-pointer transition-colors"
                  >
                    <div className="flex items-center gap-3 flex-1">
                      <MessageSquare className="w-5 h-5 text-gray-400" />
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-gray-900 dark:text-gray-100">
                          {session.app_name || "Chat Session"}
                        </p>
                        <p className="text-xs text-gray-500 dark:text-gray-400 truncate">
                          ID: {session.session_id}
                        </p>
                      </div>
                    </div>
                    <button
                      onClick={(e) => handleDeleteSession(session.session_id, e)}
                      disabled={deletingSessionId === session.session_id}
                      className="p-2 text-gray-400 hover:text-red-600 dark:hover:text-red-400 opacity-0 group-hover:opacity-100 transition-all disabled:opacity-50"
                      title="Delete session"
                    >
                      {deletingSessionId === session.session_id ? (
                        <Loader2 className="w-4 h-4 animate-spin" />
                      ) : (
                        <Trash2 className="w-4 h-4" />
                      )}
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
