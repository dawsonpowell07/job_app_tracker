"use client";

import { useState, useEffect, useRef } from "react";
import { Send, Loader2, User } from "lucide-react";
import { Message, TimelineEvent } from "@/types/chat";
import { UserMessageBubble, AiMessageBubble } from "@/components/MessageBubble";
import {
  createSession,
  sendMessageStream,
  processSSEStream,
} from "@/lib/streamingHandler";

export default function ChatPage() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [sessionId, setSessionId] = useState<string | null>(null);
  const [username, setUsername] = useState<string>("");
  const [usernameInput, setUsernameInput] = useState<string>("");
  const [isSettingUsername, setIsSettingUsername] = useState(true);
  const [timelineEvents, setTimelineEvents] = useState<
    Map<string, TimelineEvent[]>
  >(new Map());
  const [error, setError] = useState<string | null>(null);

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const accumulatedTextRef = useRef("");
  const currentMessageIdRef = useRef<string | null>(null);

  // Auto-scroll to bottom when messages change
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // Load username from localStorage on mount
  useEffect(() => {
    const storedUsername = localStorage.getItem("chat_username");
    if (storedUsername) {
      setUsername(storedUsername);
      setUsernameInput(storedUsername);
      setIsSettingUsername(false);
    }
  }, []);

  // Initialize session when username is set
  useEffect(() => {
    if (!username || sessionId) return;

    const initSession = async () => {
      try {
        const session = await createSession(username);
        setSessionId(session.session_id);
      } catch (err) {
        setError(
          err instanceof Error ? err.message : "Failed to create session"
        );
      }
    };

    initSession();
  }, [username, sessionId]);

  const handleSetUsername = () => {
    if (!usernameInput.trim()) return;

    const trimmedUsername = usernameInput.trim();
    setUsername(trimmedUsername);
    localStorage.setItem("chat_username", trimmedUsername);
    setIsSettingUsername(false);
  };

  const handleChangeUsername = () => {
    setIsSettingUsername(true);
    setSessionId(null);
    setMessages([]);
    setTimelineEvents(new Map());
  };

  const handleUsernameKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      e.preventDefault();
      handleSetUsername();
    }
  };

  const handleSendMessage = async () => {
    if (!input.trim() || !sessionId || isLoading) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      role: "user",
      content: input.trim(),
      timestamp: Date.now(),
    };

    const aiMessageId = (Date.now() + 1).toString();
    const aiMessage: Message = {
      id: aiMessageId,
      role: "assistant",
      content: "",
      timestamp: Date.now(),
      isStreaming: true,
    };

    setMessages((prev) => [...prev, userMessage, aiMessage]);
    setInput("");
    setIsLoading(true);
    setError(null);

    // Reset accumulated text for new message
    accumulatedTextRef.current = "";
    currentMessageIdRef.current = aiMessageId;

    try {
      const response = await sendMessageStream(sessionId, username, input.trim());

      await processSSEStream(
        response,
        // On text update
        (text) => {
          accumulatedTextRef.current = text;
          setMessages((prev) =>
            prev.map((msg) =>
              msg.id === currentMessageIdRef.current
                ? { ...msg, content: text, isStreaming: true }
                : msg
            )
          );
        },
        // On timeline event
        (event) => {
          setTimelineEvents((prev) => {
            const updated = new Map(prev);
            const existing = updated.get(aiMessageId) || [];
            updated.set(aiMessageId, [...existing, event]);
            return updated;
          });
        },
        // On error
        (errorMsg) => {
          setError(errorMsg);
          console.error("Stream error:", errorMsg);
        }
      );

      // Mark streaming as complete
      setMessages((prev) =>
        prev.map((msg) =>
          msg.id === currentMessageIdRef.current
            ? { ...msg, isStreaming: false }
            : msg
        )
      );
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to send message");
      console.error("Send message error:", err);

      // Remove the empty AI message on error
      setMessages((prev) => prev.filter((msg) => msg.id !== aiMessageId));
    } finally {
      setIsLoading(false);
      currentMessageIdRef.current = null;
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  // Show username input screen if username is not set
  if (isSettingUsername) {
    return (
      <div className="flex flex-col h-screen bg-gray-50 dark:bg-gray-950">
        <div className="flex items-center justify-center h-full">
          <div className="bg-white dark:bg-gray-900 rounded-lg shadow-lg p-8 max-w-md w-full mx-4">
            <div className="flex items-center justify-center mb-6">
              <div className="w-16 h-16 bg-blue-100 dark:bg-blue-900 rounded-full flex items-center justify-center">
                <User className="w-8 h-8 text-blue-600 dark:text-blue-400" />
              </div>
            </div>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100 text-center mb-2">
              Welcome to Job Application Assistant
            </h1>
            <p className="text-gray-600 dark:text-gray-400 text-center mb-6">
              Enter your name to get started
            </p>
            {error && (
              <div className="mb-4 p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg text-red-700 dark:text-red-400 text-sm">
                {error}
              </div>
            )}
            <div className="space-y-4">
              <input
                type="text"
                value={usernameInput}
                onChange={(e) => setUsernameInput(e.target.value)}
                onKeyPress={handleUsernameKeyPress}
                placeholder="Enter your username"
                className="w-full px-4 py-3 border border-gray-300 dark:border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-800 dark:text-gray-100"
                autoFocus
              />
              <button
                onClick={handleSetUsername}
                disabled={!usernameInput.trim()}
                className="w-full px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors font-medium"
              >
                Start Chatting
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-screen bg-gray-50 dark:bg-gray-950">
      {/* Header */}
      <header className="bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-800 px-6 py-4">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-xl font-semibold text-gray-900 dark:text-gray-100">
              Job Application Assistant
            </h1>
            <div className="flex items-center gap-3 mt-1">
              <p className="text-xs text-gray-500 dark:text-gray-400">
                User: {username}
              </p>
              {sessionId && (
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  Session: {sessionId}
                </p>
              )}
            </div>
          </div>
          <button
            onClick={handleChangeUsername}
            className="text-sm text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100 transition-colors"
          >
            Change User
          </button>
        </div>
      </header>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto px-6 py-4">
        {error && (
          <div className="mb-4 p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg text-red-700 dark:text-red-400 text-sm">
            {error}
          </div>
        )}

        {messages.length === 0 ? (
          <div className="flex items-center justify-center h-full">
            <div className="text-center max-w-md">
              <h2 className="text-2xl font-semibold text-gray-900 dark:text-gray-100 mb-2">
                Welcome to Job Application Assistant
              </h2>
              <p className="text-gray-600 dark:text-gray-400">
                Ask me anything about job applications, resumes, or career
                advice.
              </p>
            </div>
          </div>
        ) : (
          <div className="max-w-4xl mx-auto">
            {messages.map((message) => {
              if (message.role === "user") {
                return (
                  <UserMessageBubble
                    key={message.id}
                    content={message.content}
                  />
                );
              } else {
                return (
                  <AiMessageBubble
                    key={message.id}
                    content={message.content}
                    timelineEvents={timelineEvents.get(message.id)}
                    isStreaming={message.isStreaming}
                  />
                );
              }
            })}
            <div ref={messagesEndRef} />
          </div>
        )}
      </div>

      {/* Input */}
      <div className="bg-white dark:bg-gray-900 border-t border-gray-200 dark:border-gray-800 px-6 py-4">
        <div className="max-w-4xl mx-auto">
          <div className="flex gap-3 items-end">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder={
                sessionId
                  ? "Type your message..."
                  : "Initializing session..."
              }
              disabled={!sessionId || isLoading}
              className="flex-1 px-4 py-3 border border-gray-300 dark:border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-800 dark:text-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
            />
            <button
              onClick={handleSendMessage}
              disabled={!input.trim() || !sessionId || isLoading}
              className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center gap-2"
            >
              {isLoading ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  <span>Sending...</span>
                </>
              ) : (
                <>
                  <Send className="w-5 h-5" />
                  <span>Send</span>
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
