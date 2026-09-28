"use client";

import React, { useRef, useEffect } from "react";
import { Message, MessageAction, Project } from "@/lib/types";
import { ChatMessage } from "./ChatMessage";
import { ThinkingIndicator } from "./ThinkingIndicator";

export interface ChatMessageListProps {
  project: Project;
  messages: Message[];
  isThinking: boolean;
  onSelectPrompt: (prompt: string) => void;
  onActionClick?: (action: MessageAction) => void;
}

export function ChatMessageList({
  messages,
  isThinking,
  onActionClick,
}: ChatMessageListProps) {
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Smoothly scroll down when messages or thinking state changes
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages.length, isThinking]);

  return (
    <div className="flex-1 overflow-y-auto px-3 sm:px-6 py-5 space-y-4">
      <div className="max-w-3xl mx-auto space-y-4">
        {messages.map((msg) => (
          <ChatMessage
            key={msg.id}
            message={msg}
            onActionClick={onActionClick}
          />
        ))}

        {isThinking && (
          <div className="max-w-3xl mx-auto">
            <ThinkingIndicator />
          </div>
        )}

        <div ref={bottomRef} className="h-1" />
      </div>
    </div>
  );
}
