"use client";
// Main page layout using Sidebar and Header components
import React from 'react';

import { InputBox, UploadedFilesRow } from '../../components/ui';
import { useWebSocket } from '../../hooks/useWebSocket';
import { useFiles } from '../../hooks/useFiles';
import { useChats } from '../../hooks/useChats';

/**
 * Main page component that composes the Sidebar, Header, and main content area.
 */
const HomePage: React.FC = () => {
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
    const { sendMessage, isConnected, error } = useWebSocket(undefined, addChat);

    return (
        <div className="flex relative flex-col gap-14 relative items-center justify-center w-full h-full  px-10">
            <h1>Where should we begin?</h1>

            

            {/* Input Box */}
            <InputBox
         
                placeholder="Ask Anything"
                uploadedFiles={uploadedFiles}
                onFilesUpload={handleFilesUpload}
                onFileRemove={handleFileRemove}
                useChatMode={true}
                onSend={(value: string) => {
                    console.info('Message sent from home page:', value);
                    // Send message via WebSocket to create new chat
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

export default HomePage;
