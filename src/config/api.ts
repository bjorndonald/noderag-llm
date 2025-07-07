/**
 * API Configuration for NodeRAG Railway API
 */

// Base URL for the Railway API
// Replace this with your actual Railway app URL
export const API_CONFIG = {
  BASE_URL: process.env.NEXT_PUBLIC_RAILWAY_API_URL || 'https://your-app-name.railway.app',
  
  // API Endpoints
  ENDPOINTS: {
    HEALTH: '/health',
    UPLOAD: '/upload',
    ANSWER: '/answer',
    DOCUMENTS: '/documents',
    ANSWER_RETRIEVAL: '/answer_retrieval',
    RETRIEVAL: '/retrieval',
    // Chat system endpoints
    CHAT_ASK: '/chat/ask',
    CHATS: '/chats',
    CHAT_STATS: '/chat/stats',
  },
  
  // File upload settings
  UPLOAD: {
    MAX_FILE_SIZE: 16 * 1024 * 1024, // 16MB
    ACCEPTED_TYPES: ['.pdf'],
    ACCEPTED_MIME_TYPES: ['application/pdf'],
  },
  
  // Request settings
  REQUEST: {
    TIMEOUT: 30000, // 30 seconds
    RETRY_ATTEMPTS: 3,
  },
};

/**
 * Get the full URL for an API endpoint
 * @param endpoint - The endpoint path
 * @returns Full URL for the endpoint
 */
export const getApiUrl = (endpoint: string): string => {
  return `${API_CONFIG.BASE_URL}${endpoint}`;
};

/**
 * Validate if a file is acceptable for upload
 * @param file - The file to validate
 * @returns Validation result
 */
export const validateFile = (file: File): { valid: boolean; error?: string } => {
  // Check file size
  if (file.size > API_CONFIG.UPLOAD.MAX_FILE_SIZE) {
    return {
      valid: false,
      error: `File too large. Maximum size is ${API_CONFIG.UPLOAD.MAX_FILE_SIZE / (1024 * 1024)}MB`,
    };
  }

  // Check file type
  if (!API_CONFIG.UPLOAD.ACCEPTED_MIME_TYPES.includes(file.type)) {
    return {
      valid: false,
      error: 'Only PDF files are supported',
    };
  }

  return { valid: true };
}; 