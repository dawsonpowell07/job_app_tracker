"use client";

import { useState } from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { Copy, CopyCheck } from "lucide-react";
import { TimelineEvent } from "@/types/chat";
import { ActivityTimeline } from "./ActivityTimeline";

interface UserMessageBubbleProps {
  content: string;
}

export function UserMessageBubble({ content }: UserMessageBubbleProps) {
  return (
    <div className="flex justify-end mb-4">
      <div className="max-w-3xl bg-gray-100 dark:bg-gray-800 rounded-lg px-4 py-3 prose prose-sm dark:prose-invert">
        <ReactMarkdown remarkPlugins={[remarkGfm]}>{content}</ReactMarkdown>
      </div>
    </div>
  );
}

interface AiMessageBubbleProps {
  content: string;
  timelineEvents?: TimelineEvent[];
  isStreaming?: boolean;
}

export function AiMessageBubble({
  content,
  timelineEvents,
  isStreaming,
}: AiMessageBubbleProps) {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(content);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="flex justify-start mb-4">
      <div className="max-w-3xl w-full">
        {/* Show timeline events if present */}
        {timelineEvents && timelineEvents.length > 0 && (
          <div className="mb-3">
            <ActivityTimeline events={timelineEvents} isLoading={isStreaming} />
          </div>
        )}

        {/* Show content if present */}
        {content && (
          <div className="bg-blue-50 dark:bg-blue-950 rounded-lg px-4 py-3 relative group prose prose-sm dark:prose-invert max-w-none">
            <ReactMarkdown remarkPlugins={[remarkGfm]}>{content}</ReactMarkdown>

            {/* Copy button */}
            <button
              onClick={handleCopy}
              className="absolute top-2 right-2 p-2 bg-white dark:bg-gray-800 rounded opacity-0 group-hover:opacity-100 transition-opacity hover:bg-gray-100 dark:hover:bg-gray-700"
              title="Copy to clipboard"
            >
              {copied ? (
                <CopyCheck className="w-4 h-4 text-green-600" />
              ) : (
                <Copy className="w-4 h-4 text-gray-600 dark:text-gray-400" />
              )}
            </button>
          </div>
        )}

        {/* Show loading indicator if streaming and no content */}
        {isStreaming && !content && !timelineEvents?.length && (
          <div className="flex items-center gap-2 text-gray-500 dark:text-gray-400">
            <div className="animate-spin h-4 w-4 border-2 border-gray-300 border-t-blue-600 rounded-full"></div>
            <span>Thinking...</span>
          </div>
        )}
      </div>
    </div>
  );
}
