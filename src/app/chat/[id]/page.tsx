"use client";
// Main page layout using Sidebar and Header components
import React, { useEffect } from 'react';
import { useParams } from 'next/navigation';
import Sidebar from '../../../components/layout/Sidebar';
import Header from '../../../components/layout/Header';

import { InputBox, UploadedFilesRow } from '../../../components/ui';
import { useWebSocket } from '../../../hooks/useWebSocket';
import { useFiles } from '../../../hooks/useFiles';
import { useChats } from '../../../hooks/useChats';
import type { ChatMessage } from '../../../hooks/useWebSocket';

/**
 * Main page component that composes the Sidebar, Header, and main content area.
 */
const ChatPage: React.FC = () => {
    const params = useParams();
    const chatId = params.id as string;
    
    // Files management hook
    const { 
        uploadedFiles, 
        isLoading: filesLoading, 
        error: filesError, 
        handleFilesUpload, 
        handleFileRemove,
        refreshFiles
    } = useFiles();

    // Chat management hook
    const { addChat } = useChats();

    // WebSocket hook for chat functionality
    const { 
        sendMessage, 
        messages, 
        isConnected, 
        isLoading, 
        isLoadingMessages,
        isLoadingChat,
        error, 
        currentChat 
    } = useWebSocket(chatId, addChat);
    return (
        <div className="flex flex-col gap-14 relative items-center w-full h-full px-4">
            {/* Messages Area */}
            <div id="messages" className="pb-14 flex mt-5 max-h-[calc(100vh-186px)] flex-col grow gap-4 w-full max-w-4xl mx-auto overflow-y-auto no-scrollbar">
           
                {/* Loading indicator for initial messages */}
                {isLoadingMessages && messages.length === 0 && (
                    <div className="flex justify-center items-center py-8">
                        <div className="text-center">
                            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
                            <p className="text-gray-500">Loading chat messages...</p>
                        </div>
                    </div>
                )}

                {/* Empty state when no messages and not loading */}
                {!isLoadingMessages && messages.length === 0 && (
                    <div className="text-center text-gray-500 mt-8">
                        <p className="text-lg font-medium mb-2">Start a conversation</p>
                        <p className="text-sm">Ask questions about your uploaded documents!</p>
                    </div>
                )}

                {/* Display messages */}
                {messages.length > 0 && (
                    messages.map((message: ChatMessage) => (
                        <div
                            key={message.id}
                            className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
                        >
                            <div
                                className={`max-w-[80%] rounded-lg px-4 py-3 ${
                                    message.role === 'user'
                                        ? 'bg-blue-600 text-white'
                                        : 'bg-[#f4f4f4] dark:bg-gray-700 text-gray-900 dark:text-white'
                                }`}
                            >
                                <p className="whitespace-pre-wrap">{message.content}</p>
                                
                            </div>
                        </div>
                    ))
                )}
                
                {/* Loading indicator for new messages */}
                {isLoading && (
                    <div className="flex justify-start">
                        <div className="bg-gray-100 dark:bg-gray-700 rounded-lg px-4 py-3">
                            <div className="flex items-center space-x-2">
                                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600"></div>
                                <p className="text-gray-500">Thinking...</p>
                            </div>
                        </div>
                    </div>
                )}
            </div>

            {/* Input Box */}
            <InputBox
                className='w-[calc(100%-32px)] absolute -bottom-4'
                placeholder="Ask Anything"
                uploadedFiles={uploadedFiles}
                onFilesUpload={handleFilesUpload}
                onFileRemove={handleFileRemove}
                useChatMode={true}
                chatId={chatId}
                onSend={(value: string) => {
                    console.info('Message sent from chat page:', value);
                    // Send message via WebSocket
                    sendMessage(value);
                }}
                onMicClick={() => {
                    console.info('Microphone clicked');
                    // Add your microphone logic here
                }}
                onToolsClick={() => {
                    console.info('Tools clicked');
                    // Add your tools logic here
                }}
                onPlusClick={() => {
                    console.info('Plus clicked');
                    // Add your plus logic here
                }}
            />
        </div>
    );
};

export default ChatPage;
