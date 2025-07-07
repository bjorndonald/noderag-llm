/**
 * NodeRAG API Client
 * Handles communication with the Railway-deployed NodeRAG API
 */

import { API_CONFIG, getApiUrl, validateFile } from '../config/api';

/**
 * Upload a PDF file to the NodeRAG API
 * @param file - The PDF file to upload
 * @returns Promise with upload response
 */
export const uploadFile = async (file: File): Promise<any> => {
  // Validate file before upload
  const validation = validateFile(file);
  if (!validation.valid) {
    throw new Error(validation.error);
  }

  const formData = new FormData();
  formData.append('file', file);

  try {
    const response = await fetch(getApiUrl(API_CONFIG.ENDPOINTS.UPLOAD), {
      method: 'POST',
      body: formData,
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || 'Upload failed');
    }

    return await response.json();
  } catch (error) {
    console.error('Upload error:', error);
    throw error;
  }
};

/**
 * Send a question to the NodeRAG API
 * @param question - The question to ask
 * @returns Promise with answer response
 */
export const askQuestion = async (question: string): Promise<any> => {
  try {
    const response = await fetch(getApiUrl(API_CONFIG.ENDPOINTS.ANSWER), {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ question }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || 'Failed to get answer');
    }

    return await response.json();
  } catch (error) {
    console.error('Ask question error:', error);
    throw error;
  }
};

/**
 * Get list of uploaded documents
 * @returns Promise with documents list
 */
export const getDocuments = async (): Promise<any> => {
  try {
    const response = await fetch(getApiUrl(API_CONFIG.ENDPOINTS.DOCUMENTS), {
      method: 'GET',
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || 'Failed to get documents');
    }

    return await response.json();
  } catch (error) {
    console.error('Get documents error:', error);
    throw error;
  }
};

/**
 * Delete a document
 * @param filename - The filename to delete
 * @returns Promise with deletion response
 */
export const deleteDocument = async (filename: string): Promise<any> => {
  try {
    const response = await fetch(getApiUrl(`${API_CONFIG.ENDPOINTS.DOCUMENTS}/${filename}`), {
      method: 'DELETE',
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || 'Failed to delete document');
    }

    return await response.json();
  } catch (error) {
    console.error('Delete document error:', error);
    throw error;
  }
};

/**
 * Health check for the API
 * @returns Promise with health status
 */
export const healthCheck = async (): Promise<any> => {
  try {
    const response = await fetch(getApiUrl(API_CONFIG.ENDPOINTS.HEALTH), {
      method: 'GET',
    });

    if (!response.ok) {
      throw new Error('Health check failed');
    }

    return await response.json();
  } catch (error) {
    console.error('Health check error:', error);
    throw error;
  }
};

/**
 * Ask a question with chat support
 * @param question - The question to ask
 * @param chatId - Optional chat ID to continue conversation
 * @returns Promise with chat response
 */
export const askQuestionWithChat = async (question: string, chatId?: string): Promise<any> => {
  try {
    console.info("question", question)
    const body: any = { question };
    if (chatId) {
      body.chat_id = chatId;
    }

    const response = await fetch(getApiUrl(API_CONFIG.ENDPOINTS.CHAT_ASK), {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(body),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || 'Failed to get chat response');
    }

    return await response.json();
  } catch (error) {
    console.error('Ask question with chat error:', error);
    throw error;
  }
};

/**
 * Create a new chat
 * @param title - Chat title
 * @param metadata - Optional metadata
 * @returns Promise with chat creation response
 */
export const createChat = async (title: string, metadata?: any): Promise<any> => {
  try {
    const response = await fetch(getApiUrl(API_CONFIG.ENDPOINTS.CHATS), {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ title, metadata }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || 'Failed to create chat');
    }

    return await response.json();
  } catch (error) {
    console.error('Create chat error:', error);
    throw error;
  }
};

/**
 * Get list of chats
 * @param limit - Number of chats to get
 * @param offset - Offset for pagination
 * @returns Promise with chats list
 */
export const getChats = async (limit: number = 50, offset: number = 0): Promise<any> => {
  try {
    const response = await fetch(getApiUrl(`${API_CONFIG.ENDPOINTS.CHATS}?limit=${limit}&offset=${offset}`), {
      method: 'GET',
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || 'Failed to get chats');
    }

    return await response.json();
  } catch (error) {
    console.error('Get chats error:', error);
    throw error;
  }
};

/**
 * Get chat messages
 * @param chatId - Chat ID
 * @param limit - Number of messages to get
 * @param offset - Offset for pagination
 * @returns Promise with messages list
 */
export const getChatMessages = async (chatId: string, limit: number = 100, offset: number = 0): Promise<any> => {
  try {
    const response = await fetch(getApiUrl(`${API_CONFIG.ENDPOINTS.CHATS}/${chatId}/messages?limit=${limit}&offset=${offset}`), {
      method: 'GET',
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || 'Failed to get chat messages');
    }

    return await response.json();
  } catch (error) {
    console.error('Get chat messages error:', error);
    throw error;
  }
};

/**
 * Delete a chat
 * @param chatId - Chat ID to delete
 * @returns Promise with deletion response
 */
export const deleteChat = async (chatId: string): Promise<any> => {
  try {
    const response = await fetch(getApiUrl(`${API_CONFIG.ENDPOINTS.CHATS}/${chatId}`), {
      method: 'DELETE',
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || 'Failed to delete chat');
    }

    return await response.json();
  } catch (error) {
    console.error('Delete chat error:', error);
    throw error;
  }
};

/**
 * Get chat details by ID
 * @param chatId - Chat ID
 * @returns Promise with chat details
 */
export const getChat = async (chatId: string): Promise<any> => {
  try {
    const response = await fetch(getApiUrl(`${API_CONFIG.ENDPOINTS.CHATS}/${chatId}`), {
      method: 'GET',
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || 'Failed to get chat details');
    }

    return await response.json();
  } catch (error) {
    console.error('Get chat error:', error);
    throw error;
  }
};

/**
 * Get chat statistics
 * @returns Promise with chat statistics
 */
export const getChatStats = async (): Promise<any> => {
  try {
    const response = await fetch(getApiUrl(API_CONFIG.ENDPOINTS.CHAT_STATS), {
      method: 'GET',
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || 'Failed to get chat statistics');
    }

    return await response.json();
  } catch (error) {
    console.error('Get chat stats error:', error);
    throw error;
  }
}; 