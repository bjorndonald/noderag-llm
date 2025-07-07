/**
 * Custom hook for managing WebSocket connections and chat state
 */
"use client";
import { useEffect, useState, useCallback, useRef } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import { websocketService } from '../lib/websocket';
import { askQuestionWithChat, getChatMessages, getChat } from '../lib/api';

// Types for chat messages
export interface ChatMessage {
  id: string;
  chat_id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
  [key: string]: any;
}

// Types for chat data
export interface Chat {
  id: string;
  title: string;
  created_at: string;
  updated_at: string;
  [key: string]: any;
}

/**
 * Custom hook for WebSocket chat functionality
 * @param chatId - Optional chat ID for existing chat
 * @param onChatCreated - Optional callback when a new chat is created
 * @returns Object with chat state and functions
 */
export const useWebSocket = (chatId?: string, onChatCreated?: (chat: Chat) => void) => {
  const router = useRouter();
  const pathname = usePathname()
  const [isConnected, setIsConnected] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [currentChat, setCurrentChat] = useState<Chat | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isLoadingMessages, setIsLoadingMessages] = useState(false);
  const [isLoadingChat, setIsLoadingChat] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Refs to track state
  const messagesRef = useRef<ChatMessage[]>([]);
  const currentChatRef = useRef<Chat | null>(null);
  const hasLoadedInitialMessages = useRef(false);

  // Update refs when state changes
  useEffect(() => {
    messagesRef.current = messages;
  }, [messages]);

  useEffect(() => {
    currentChatRef.current = currentChat;
  }, [currentChat]);

  /**
   * Connect to WebSocket and set up event listeners
   */
  const connect = useCallback(async () => {
    try {
      await websocketService.connect();
      setIsConnected(true);
      setError(null);
    } catch (err) {
      console.error('Failed to connect to WebSocket:', err);
      setError('Failed to connect to chat server');
    }
  }, []);

  /**
   * Disconnect from WebSocket
   */
  const disconnect = useCallback(() => {
    websocketService.disconnect();
    setIsConnected(false);
  }, []);

  /**
   * Load chat details via HTTP API
   * @param chatId - Chat ID to load details for
   */
  const loadChatDetails = useCallback(async (chatId: string) => {
    setIsLoadingChat(true);

    try {
      console.info('Loading chat details via HTTP API for chat:', chatId);
      const response = await getChat(chatId);

      if (response) {
        const chatData: Chat = {
          id: response.id,
          title: response.title,
          created_at: response.created_at,
          updated_at: response.updated_at,
          ...response,
        };

        setCurrentChat(chatData);
        console.info('Loaded chat details:', chatData.title);
      }
    } catch (err) {
      console.error('Failed to load chat details via HTTP API:', err);
      // Don't set error here as it's not critical for functionality
    } finally {
      setIsLoadingChat(false);
    }
  }, []);

  /**
   * Load chat messages via HTTP API as fallback
   * @param chatId - Chat ID to load messages for
   */
  const loadChatMessagesViaAPI = useCallback(async (chatId: string) => {
    if (hasLoadedInitialMessages.current) return;

    setIsLoadingMessages(true);
    setError(null);

    try {
      console.info('Loading chat messages via HTTP API for chat:', chatId);
      const response = await getChatMessages(chatId, 100, 0);

      if (response && response.messages) {
        const formattedMessages: ChatMessage[] = response.messages.map((msg: any) => ({
          id: msg.id,
          chat_id: msg.chat_id,
          role: msg.role,
          content: msg.content,
          timestamp: new Date(msg.timestamp || msg.created_at),
          ...msg,
        }));

        setMessages(formattedMessages);
        console.log("formatted messages", formattedMessages)
        const messages = document.getElementById("messages")
        messages?.scrollTo({
          top: messages.scrollHeight,
          behavior: "smooth"
        });
        hasLoadedInitialMessages.current = true;
        console.info('Loaded', formattedMessages, 'messages via HTTP API');
      }
    } catch (err) {
      console.error('Failed to load chat messages via HTTP API:', err);
      setError('Failed to load chat messages');
    } finally {
      setIsLoadingMessages(false);
    }
  }, []);

  const formatTime = (timestamp: Date): string => {
    return timestamp.toLocaleTimeString([], {
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  /**
   * Send a message and handle chat creation/updates
   * @param content - Message content
   */
  const sendMessage = useCallback(async (content: string) => {
    if (!content.trim() || isLoading) return;

    setIsLoading(true);
    setError(null);

    try {
      const messages = document.getElementById("messages");
      // // Add user message to local state immediately
      const userMessage: ChatMessage = {
        id: `temp-${Date.now()}`,
        chat_id: currentChatRef.current?.id || 'temp',
        role: 'user',
        content: content.trim(),
        timestamp: new Date(),
      };
      console.log("User ", userMessage)

      var umessage = document.createElement("div");
      umessage.innerHTML = `<div
          class="flex justify-end"
        >
          <div
          style="background-color: rgb(2,132,199);"
            class="max-w-[80%] rounded-lg px-4 py-3 shadow-sm 
           text-white"
          >
            <p class="whitespace-pre-wrap leading-relaxed">${userMessage.content}</p>
            <p class="text-xs mt-2 text-blue-100">
              ${formatTime(userMessage.timestamp)}
            </p>
          </div>
        </div>`;
      messages?.appendChild(umessage);
      messages?.scrollTo({
        top: messages.scrollHeight,
        behavior: "smooth"
      });

      // setMessages(prev => [...prev, userMessage]);

      // Send message to API
      const response = await askQuestionWithChat(content.trim(), currentChatRef.current?.id);
      if (!pathname.includes("chat"))
        router.push(`/chat/${response.chat_id}`);
      console.info('Chat API response:', response);
      console.log("Response ", response)
      var smessage = document.createElement("div");
      smessage.innerHTML = `<div
          style="background: #f2f2f2"
          class="flex justify-start"
        >
          <div
            class="max-w-[80%] rounded-lg px-4 py-3 shadow-sm bg-[#f2f2f2] dark:bg-[#555] text-[#222] dark:text-white
        "
          >
            <p class="whitespace-pre-wrap leading-relaxed">${response.answer}</p>
            <p class="text-xs mt-2 text-gray-500 dark:text-white
        }">
              ${formatTime(new Date())}
            </p>
          </div>
        </div>`;
      messages?.appendChild(smessage);

      messages?.scrollTo({
        top: messages.scrollHeight,
        behavior: "smooth"
      });

      // The WebSocket will handle the actual message updates
      // We just need to wait for the events to come through

    } catch (err) {
      console.error('Failed to send message:', err);
      setError('Failed to send message');

      // Remove the temporary user message on error
      setMessages(prev => prev.filter(msg => msg.id !== `temp-${Date.now()}`));
    } finally {
      setIsLoading(false);
    }
  }, [isLoading]);

  /**
   * Load existing chat messages
   * @param chatId - Chat ID to load messages for
   */
  const loadChatMessages = useCallback(async (chatId: string) => {
    try {
      // Load chat details first
      loadChatDetails(chatId);

      // Join the chat room via WebSocket
      websocketService.joinChat(chatId);
      websocketService.subscribeToChat(chatId);

      // Request chat messages via WebSocket
      websocketService.getChatMessages(chatId);

      // Also load messages via HTTP API as fallback
      loadChatMessagesViaAPI(chatId);
    } catch (err) {
      console.error('Failed to load chat messages:', err);
      setError('Failed to load chat messages');

      // Fallback to HTTP API if WebSocket fails
      loadChatMessagesViaAPI(chatId);
      loadChatDetails(chatId);
    }
  }, [loadChatMessagesViaAPI, loadChatDetails]);

  /**
   * Handle chat creation event
   */
  const handleChatCreated = useCallback((data: { id: string; title: string;[key: string]: any }) => {
    console.info('Chat created:', data);

    const newChat: Chat = {
      ...data,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };

    setCurrentChat(newChat);

    // Call the callback if provided
    if (onChatCreated) {
      onChatCreated(newChat);
    }

    // Navigate to the new chat
    router.push(`/chat/${data.id}`);
  }, [router, onChatCreated]);

  /**
   * Handle message added event
   */
  const handleMessageAdded = useCallback((data: {
    id: string;
    chat_id: string;
    role: 'user' | 'assistant';
    content: string;
    [key: string]: any;
  }) => {
    console.info('Message added:', data);

    // Only add message if it belongs to current chat
    if (data.chat_id === currentChatRef.current?.id) {
      const newMessage: ChatMessage = {
        ...data,
        timestamp: new Date(),
      };

      setMessages(prev => {
        // Remove any temporary messages with the same content
        const filtered = prev.filter(msg =>
          !(msg.id.startsWith('temp-') && msg.content === data.content)
        );
        return [...filtered, newMessage];
      });
    }
  }, []);

  /**
   * Handle status update event
   */
  const handleStatusUpdate = useCallback((data: {
    chat_id: string;
    status: 'processing' | 'completed' | 'error';
    message: string;
  }) => {
    console.info('Status update:', data);

    if (data.chat_id === currentChatRef.current?.id) {
      if (data.status === 'error') {
        setError(data.message);
      }
    }
  }, []);

  /**
   * Handle chat messages response
   */
  const handleChatMessages = useCallback((data: {
    chat_id: string;
    messages: any[];
    total: number;
  }) => {
    console.info('Chat messages received via WebSocket:', data);

    if (data.chat_id === currentChatRef.current?.id) {
      const formattedMessages: ChatMessage[] = data.messages.map(msg => ({
        id: msg.id,
        chat_id: msg.chat_id,
        role: msg.role,
        content: msg.content,
        timestamp: new Date(msg.timestamp || msg.created_at),
        ...msg,
      }));

      // Only update messages if we haven't loaded them via HTTP API yet
      // or if the WebSocket response has more messages
      if (!hasLoadedInitialMessages.current || formattedMessages.length > messagesRef.current.length) {
        // setMessages(formattedMessages);
        hasLoadedInitialMessages.current = true;
        console.info('Updated messages via WebSocket:', formattedMessages.length, 'messages');
      }
    }
  }, []);

  /**
   * Handle WebSocket connection events
   */
  const handleConnected = useCallback((data: { message: string }) => {
    console.info('WebSocket connected:', data.message);
    setIsConnected(true);
    setError(null);
  }, []);

  const handleDisconnected = useCallback((data: { code: number; reason: string }) => {
    console.info('WebSocket disconnected:', data);
    setIsConnected(false);
  }, []);

  const handleError = useCallback((data: { error: string }) => {
    console.error('WebSocket error:', data.error);
    setError(data.error);
  }, []);

  // Set up WebSocket event listeners
  useEffect(() => {
    // Connection events
    websocketService.on('connected', handleConnected);
    websocketService.on('disconnected', handleDisconnected);
    websocketService.on('error', handleError);

    // Chat events
    websocketService.on('chat_created', handleChatCreated);
    websocketService.on('message_added', handleMessageAdded);
    websocketService.on('status_update', handleStatusUpdate);
    websocketService.on('chat_messages', handleChatMessages);

    // Connect to WebSocket
    connect();

    // Cleanup on unmount
    return () => {
      websocketService.off('connected', handleConnected);
      websocketService.off('disconnected', handleDisconnected);
      websocketService.off('error', handleError);
      websocketService.off('chat_created', handleChatCreated);
      websocketService.off('message_added', handleMessageAdded);
      websocketService.off('status_update', handleStatusUpdate);
      websocketService.off('chat_messages', handleChatMessages);

      disconnect();
    };
  }, [connect, disconnect, handleConnected, handleDisconnected, handleError, handleChatCreated, handleMessageAdded, handleStatusUpdate, handleChatMessages]);

  // Load chat messages when chatId changes
  useEffect(() => {
    if (chatId) {
      // Reset the flag when chatId changes
      hasLoadedInitialMessages.current = false;

      if (isConnected) {
        loadChatMessages(chatId);
      } else {
        // If WebSocket is not connected, load messages and chat details via HTTP API immediately
        loadChatMessagesViaAPI(chatId);
        loadChatDetails(chatId);
      }
    }
  }, [chatId, isConnected, loadChatMessages, loadChatMessagesViaAPI, loadChatDetails]);

  return {
    // State
    isConnected,
    messages,
    currentChat,
    isLoading,
    isLoadingMessages,
    isLoadingChat,
    error,

    // Functions
    sendMessage,
    connect,
    disconnect,
    loadChatMessages,
    loadChatMessagesViaAPI,
    loadChatDetails,
  };
}; 