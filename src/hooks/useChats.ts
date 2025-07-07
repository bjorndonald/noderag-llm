/**
 * Custom hook for managing chats
 */

import { useState, useEffect, useCallback } from 'react';
import { getChats, deleteChat } from '../lib/api';

// Types for chat data
export interface Chat {
  id: string;
  title: string;
  created_at: string;
  updated_at: string;
  message_count?: number;
  [key: string]: any;
}

/**
 * Custom hook for chat management
 * @returns Object with chat state and functions
 */
export const useChats = () => {
  const [chats, setChats] = useState<Chat[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  /**
   * Load chats from the backend
   */
  const loadChats = useCallback(async () => {
    setIsLoading(true);
    setError(null);

    try {
      console.info('Loading chats from backend...');
      const response = await getChats(50, 0);
      
      if (response && response.chats) {
        const formattedChats: Chat[] = response.chats.map((chat: any) => ({
          id: chat.id,
          title: chat.title,
          created_at: chat.created_at,
          updated_at: chat.updated_at,
          message_count: chat.message_count || 0,
          ...chat,
        }));

        setChats(formattedChats);
        console.info('Loaded', formattedChats.length, 'chats');
      }
    } catch (err) {
      console.error('Failed to load chats:', err);
      setError('Failed to load chats');
    } finally {
      setIsLoading(false);
    }
  }, []);

  /**
   * Delete a chat
   * @param chatId - Chat ID to delete
   */
  const deleteChatById = useCallback(async (chatId: string) => {
    try {
      console.info('Deleting chat:', chatId);
      await deleteChat(chatId);
      
      // Remove chat from local state
      setChats(prev => prev.filter(chat => chat.id !== chatId));
      console.info('Chat deleted successfully');
    } catch (err) {
      console.error('Failed to delete chat:', err);
      setError('Failed to delete chat');
    }
  }, []);

  /**
   * Add a new chat to the list
   * @param chat - Chat data to add
   */
  const addChat = useCallback((chat: Chat) => {
    setChats(prev => [chat, ...prev]);
  }, []);

  /**
   * Update an existing chat
   * @param chatId - Chat ID to update
   * @param updates - Chat updates
   */
  const updateChat = useCallback((chatId: string, updates: Partial<Chat>) => {
    setChats(prev => prev.map(chat => 
      chat.id === chatId ? { ...chat, ...updates } : chat
    ));
  }, []);

  // Load chats on mount
  useEffect(() => {
    loadChats();
  }, [loadChats]);

  return {
    // State
    chats,
    isLoading,
    error,
    
    // Functions
    loadChats,
    deleteChatById,
    addChat,
    updateChat,
  };
}; 