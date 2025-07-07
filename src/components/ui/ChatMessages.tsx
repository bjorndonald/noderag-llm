/**
 * ChatMessages Component
 * Displays chat messages with proper styling and layout
 */

import React from 'react';
import type { ChatMessage } from '../../hooks/useWebSocket';

/**
 * Props interface for ChatMessages component
 */
interface ChatMessagesProps {
  /** Array of chat messages to display */
  messages: ChatMessage[];
  /** Whether messages are currently loading */
  isLoading?: boolean;
  /** Custom CSS classes for the container */
  className?: string;
}

/**
 * ChatMessages component that displays chat messages in a conversation format
 */
const ChatMessages: React.FC<ChatMessagesProps> = ({
  messages,
  isLoading = false,
  className = '',
}) => {
  /**
   * Format timestamp for display
   * @param timestamp - Message timestamp
   * @returns Formatted time string
   */
  const formatTime = (timestamp: Date): string => {
    return timestamp.toLocaleTimeString([], { 
      hour: '2-digit', 
      minute: '2-digit' 
    });
  };

  return (
    <div id='messages' className={`flex pb-10 flex-col gap-4 w-full max-w-4xl mx-auto overflow-y-auto ${className}`}>
      {/* Empty state */}
      {messages.length === 0 && !isLoading && (
        <div className="text-center text-gray-500 dark:text-gray-400 mt-8">
          <div className="w-16 h-16 mx-auto mb-4 bg-gray-200 dark:bg-gray-700 rounded-full flex items-center justify-center">
            <svg 
              className="w-8 h-8 text-gray-400" 
              fill="none" 
              stroke="currentColor" 
              viewBox="0 0 24 24"
            >
              <path 
                strokeLinecap="round" 
                strokeLinejoin="round" 
                strokeWidth={2} 
                d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" 
              />
            </svg>
          </div>
          <p className="text-lg font-medium mb-2">Start a conversation</p>
          <p className="text-sm">Ask questions about your uploaded documents!</p>
        </div>
      )}

      {/* Messages */}
      {messages.map((message: ChatMessage) => (
        <div
          key={message.id}
          className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
        >
          <div
            className={`max-w-[80%] rounded-lg px-4 py-3 shadow-sm ${
              message.role === 'user'
                ? 'bg-blue-600 text-white'
                : 'bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-white'
            }`}
          >
            <p className="whitespace-pre-wrap leading-relaxed">{message.content}</p>
            <p className={`text-xs mt-2 ${
              message.role === 'user' 
                ? 'text-blue-100' 
                : 'text-gray-500 dark:text-gray-400'
            }`}>
              {formatTime(message.timestamp)}
            </p>
          </div>
        </div>
      ))}
      
      {/* Loading indicator */}
      {isLoading && (
        <div className="flex justify-start">
          <div className="bg-gray-100 dark:bg-gray-700 rounded-lg px-4 py-3 shadow-sm">
            <div className="flex items-center space-x-2">
              <div className="flex space-x-1">
                <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
              </div>
              <span className="text-gray-500 dark:text-gray-400 text-sm">Thinking...</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ChatMessages; 