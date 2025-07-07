"use client"
/**
 * WebSocket Service for NodeRAG Chat System
 * Handles real-time communication with the Railway-deployed NodeRAG API
 */

import { API_CONFIG, getApiUrl } from '../config/api';

// WebSocket event types
export interface WebSocketEvents {
  // Client to Server Events
  connect: () => void;
  disconnect: () => void;
  join_chat: (data: { chat_id: string }) => void;
  leave_chat: (data: { chat_id: string }) => void;
  subscribe_to_chat: (data: { chat_id: string }) => void;
  unsubscribe_from_chat: (data: { chat_id: string }) => void;
  get_chat_messages: (data: { chat_id: string; limit?: number; offset?: number }) => void;
  get_chat_stats: () => void;
}

// Server to Client Events
export interface ServerEvents {
  connected: (data: { message: string }) => void;
  disconnected: (data: { code: number; reason: string }) => void;
  chat_created: (data: { id: string; title: string; [key: string]: any }) => void;
  message_added: (data: { 
    id: string; 
    chat_id: string; 
    role: 'user' | 'assistant'; 
    content: string; 
    [key: string]: any 
  }) => void;
  status_update: (data: { chat_id: string; status: 'processing' | 'completed' | 'error'; message: string }) => void;
  chat_messages: (data: { chat_id: string; messages: any[]; total: number }) => void;
  chat_stats: (data: { total_chats: number; total_messages: number; average_messages_per_chat: number }) => void;
  error: (data: { error: string }) => void;
}

/**
 * WebSocket Service Class
 * Manages WebSocket connections and event handling
 */
class WebSocketService {
  private socket: WebSocket | null = null;
  private eventListeners: Map<string, Set<Function>> = new Map();
  private reconnectAttempts = 0;
  private maxReconnectAttempts = 5;
  private reconnectDelay = 1000; // Start with 1 second
  private isConnecting = false;
  private _isConnected = false;

  /**
   * Get WebSocket URL from API configuration
   * @returns WebSocket URL
   */
  private getWebSocketUrl(): string {
    const baseUrl = API_CONFIG.BASE_URL.replace('https://', 'wss://').replace('http://', 'ws://');
    return `${baseUrl}/socket.io/?EIO=4&transport=websocket`;
  }

  /**
   * Connect to WebSocket server
   * @returns Promise that resolves when connected
   */
  public async connect(): Promise<void> {
    if (this.isConnecting || this._isConnected) {
      return;
    }

    this.isConnecting = true;

    return new Promise((resolve, reject) => {
      try {
        const wsUrl = this.getWebSocketUrl();
        console.info('Connecting to WebSocket:', wsUrl);
        
        this.socket = new WebSocket(wsUrl);

        this.socket.onopen = () => {
          console.info('WebSocket connected');
          this._isConnected = true;
          this.isConnecting = false;
          this.reconnectAttempts = 0;
          this.reconnectDelay = 1000;
          this.emitToListeners('connected', { message: 'Connected to NodeRAG WebSocket' });
          resolve();
        };

        this.socket.onmessage = (event) => {
          console.info("event", event.data)
          this.handleMessage(event.data);
        };

        this.socket.onclose = (event) => {
          console.info('WebSocket disconnected:', event.code, event.reason);
          this._isConnected = false;
          this.isConnecting = false;
          this.emitToListeners('disconnected', { code: event.code, reason: event.reason });
          
          // Attempt to reconnect if not a normal closure
          if (event.code !== 1000 && this.reconnectAttempts < this.maxReconnectAttempts) {
            this.scheduleReconnect();
          }
        };

        this.socket.onerror = (error) => {
          console.error('WebSocket error:', error);
          this.isConnecting = false;
          reject(error);
        };

      } catch (error) {
        this.isConnecting = false;
        reject(error);
      }
    });
  }

  /**
   * Schedule reconnection attempt
   */
  private scheduleReconnect(): void {
    this.reconnectAttempts++;
    const delay = this.reconnectDelay * Math.pow(2, this.reconnectAttempts - 1); // Exponential backoff
    
    console.info(`Scheduling reconnection attempt ${this.reconnectAttempts} in ${delay}ms`);
    
    setTimeout(() => {
      if (!this.isConnected && !this.isConnecting) {
        this.connect().catch(error => {
          console.error('Reconnection failed:', error);
        });
      }
    }, delay);
  }

  /**
   * Disconnect from WebSocket server
   */
  public disconnect(): void {
    if (this.socket) {
      this.socket.close(1000, 'Client disconnect');
      this.socket = null;
    }
    this._isConnected = false;
    this.isConnecting = false;
  }

  /**
   * Send event to WebSocket server
   * @param event - Event name
   * @param data - Event data
   */
  public emit(event: string, data?: any): void {
    if (!this.socket || this.socket.readyState !== WebSocket.OPEN) {
      console.warn('WebSocket not connected, cannot emit event:', event);
      return;
    }

    const message = JSON.stringify({ event, data });
    console.info('Sending WebSocket event:', event, data);
    this.socket.send(message);
  }

  /**
   * Handle incoming WebSocket messages
   * @param data - Raw message data
   */
  private handleMessage(data: string): void {
    try {
      console.error("data", data)
      const message = JSON.parse(data);
      console.error('Received WebSocket event:', message.event, message.data);
      
      // Emit the event to all listeners
      this.emitToListeners(message.event, message.data);
    } catch (error) {
      console.log(error)
      console.error('Failed to parse WebSocket message:', error, data);
    }
  }

  /**
   * Add event listener
   * @param event - Event name
   * @param callback - Callback function
   */
  public on<T extends keyof ServerEvents>(event: T, callback: ServerEvents[T]): void {
    if (!this.eventListeners.has(event)) {
      this.eventListeners.set(event, new Set());
    }
    this.eventListeners.get(event)!.add(callback as Function);
  }

  /**
   * Remove event listener
   * @param event - Event name
   * @param callback - Callback function
   */
  public off<T extends keyof ServerEvents>(event: T, callback: ServerEvents[T]): void {
    const listeners = this.eventListeners.get(event);
    if (listeners) {
      listeners.delete(callback as Function);
    }
  }

  /**
   * Emit event to all listeners
   * @param event - Event name
   * @param data - Event data
   */
  private emitToListeners(event: string, data?: any): void {
    const listeners = this.eventListeners.get(event);
    if (listeners) {
      listeners.forEach(callback => {
        try {
          callback(data);
        } catch (error) {
          console.error(`Error in event listener for ${event}:`, error);
        }
      });
    }
  }

  /**
   * Check if WebSocket is connected
   * @returns True if connected
   */
  public isConnected(): boolean {
    return this._isConnected && this.socket?.readyState === WebSocket.OPEN;
  }

  /**
   * Join a chat room
   * @param chatId - Chat ID to join
   */
  public joinChat(chatId: string): void {
    this.emit('join_chat', { chat_id: chatId });
  }

  /**
   * Leave a chat room
   * @param chatId - Chat ID to leave
   */
  public leaveChat(chatId: string): void {
    this.emit('leave_chat', { chat_id: chatId });
  }

  /**
   * Subscribe to chat updates
   * @param chatId - Chat ID to subscribe to
   */
  public subscribeToChat(chatId: string): void {
    this.emit('subscribe_to_chat', { chat_id: chatId });
  }

  /**
   * Unsubscribe from chat updates
   * @param chatId - Chat ID to unsubscribe from
   */
  public unsubscribeFromChat(chatId: string): void {
    this.emit('unsubscribe_from_chat', { chat_id: chatId });
  }

  /**
   * Get chat messages
   * @param chatId - Chat ID
   * @param limit - Number of messages to get
   * @param offset - Offset for pagination
   */
  public getChatMessages(chatId: string, limit: number = 100, offset: number = 0): void {
    this.emit('get_chat_messages', { chat_id: chatId, limit, offset });
  }

  /**
   * Get chat statistics
   */
  public getChatStats(): void {
    this.emit('get_chat_stats');
  }
}

// Create singleton instance
export const websocketService = new WebSocketService(); 