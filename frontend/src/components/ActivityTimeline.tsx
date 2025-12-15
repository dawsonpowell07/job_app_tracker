"use client";

import { TimelineEvent } from "@/types/chat";
import { Wrench, CheckCircle, MessageSquare, ArrowRightCircle } from "lucide-react";
import clsx from "clsx";

interface ActivityTimelineProps {
  events: TimelineEvent[];
  isLoading?: boolean;
}

export function ActivityTimeline({ events, isLoading }: ActivityTimelineProps) {
  if (!events || events.length === 0) return null;

  return (
    <div className="bg-white dark:bg-gray-900 rounded-lg border border-gray-200 dark:border-gray-700 p-4">
      <h3 className="text-sm font-semibold mb-3 text-gray-700 dark:text-gray-300">
        Agent Activity
      </h3>
      <div className="space-y-3">
        {events.map((event, index) => (
          <TimelineItem key={index} event={event} />
        ))}
        {isLoading && (
          <div className="flex items-center gap-2 text-gray-500 dark:text-gray-400 text-sm">
            <div className="animate-spin h-3 w-3 border-2 border-gray-300 border-t-blue-600 rounded-full"></div>
            <span>Processing...</span>
          </div>
        )}
      </div>
    </div>
  );
}

interface TimelineItemProps {
  event: TimelineEvent;
}

function TimelineItem({ event }: TimelineItemProps) {
  const renderIcon = () => {
    switch (event.type) {
      case "tool_call":
        return <Wrench className="w-4 h-4 text-blue-600" />;
      case "tool_response":
        return <CheckCircle className="w-4 h-4 text-green-600" />;
      case "agent_transfer":
        return <ArrowRightCircle className="w-4 h-4 text-purple-600" />;
      case "text":
        return <MessageSquare className="w-4 h-4 text-gray-600" />;
      default:
        return null;
    }
  };

  const renderContent = () => {
    switch (event.type) {
      case "tool_call":
        return (
          <div className="flex-1">
            <div className="flex flex-col gap-1">
              <span className="font-medium text-sm text-gray-900 dark:text-gray-100">
                Tool: {event.name}
              </span>
              {event.author && (
                <span className="text-xs text-gray-500 dark:text-gray-400">
                  Agent: {event.author}
                </span>
              )}
            </div>
            {event.args && Object.keys(event.args).length > 0 && (
              <details className="mt-1">
                <summary className="text-xs text-gray-600 dark:text-gray-400 cursor-pointer hover:text-gray-800 dark:hover:text-gray-200">
                  View arguments
                </summary>
                <pre className="mt-1 text-xs bg-gray-100 dark:bg-gray-800 p-2 rounded overflow-x-auto">
                  {JSON.stringify(event.args, null, 2)}
                </pre>
              </details>
            )}
          </div>
        );
      case "tool_response":
        return (
          <div className="flex-1">
            <div className="flex flex-col gap-1">
              <span className="font-medium text-sm text-gray-900 dark:text-gray-100">
                {event.name} completed
              </span>
              {event.author && (
                <span className="text-xs text-gray-500 dark:text-gray-400">
                  Agent: {event.author}
                </span>
              )}
            </div>
            {event.response && Object.keys(event.response).length > 0 && (
              <details className="mt-1">
                <summary className="text-xs text-gray-600 dark:text-gray-400 cursor-pointer hover:text-gray-800 dark:hover:text-gray-200">
                  View response
                </summary>
                <pre className="mt-1 text-xs bg-gray-100 dark:bg-gray-800 p-2 rounded overflow-x-auto">
                  {JSON.stringify(event.response, null, 2)}
                </pre>
              </details>
            )}
          </div>
        );
      case "agent_transfer":
        return (
          <div className="flex-1">
            <div className="flex flex-col gap-1">
              <span className="font-medium text-sm text-gray-900 dark:text-gray-100">
                Transferred to: {event.agent}
              </span>
              {event.author && (
                <span className="text-xs text-gray-500 dark:text-gray-400">
                  From: {event.author}
                </span>
              )}
            </div>
          </div>
        );
      case "text":
        return (
          <div className="flex-1">
            <p className="text-sm text-gray-700 dark:text-gray-300">
              {event.text}
            </p>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div
      className={clsx(
        "flex items-start gap-3 pb-3 border-l-2 pl-3",
        event.type === "tool_call" && "border-blue-300",
        event.type === "tool_response" && "border-green-300",
        event.type === "agent_transfer" && "border-purple-300",
        event.type === "text" && "border-gray-300"
      )}
    >
      <div className="mt-0.5">{renderIcon()}</div>
      {renderContent()}
    </div>
  );
}
