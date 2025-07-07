"use client";
import React, { useState } from 'react';
import { Mic, Plus, Send, ToolCase } from 'lucide-react';
import ToolsMenu from '../../app/(home)/ToolsMenu';
import UploadMenu from '../../app/(home)/UploadMenu';
import UploadedFilesRow from './UploadedFilesRow';
import { askQuestion, askQuestionWithChat } from '../../lib/api';
import { useClickOutside } from '../../hooks/useClickOutside';
import { useRouter } from 'next/navigation';

/**
 * Props interface for the InputBox component
 */
interface InputBoxProps {
  /** Placeholder text for the input field */
  placeholder?: string;
  /** Initial value for the input field */
  initialValue?: string;
  /** Callback function called when the input value changes */
  onInputChange?: (value: string) => void;
  /** Callback function called when the send button is clicked */
  onSend?: (value: string) => void;
  /** Callback function called when the microphone button is clicked */
  onMicClick?: () => void;
  /** Callback function called when the tools button is clicked */
  onToolsClick?: () => void;
  /** Callback function called when the plus button is clicked */
  onPlusClick?: () => void;
  /** Whether the input is disabled */
  disabled?: boolean;
  /** Custom CSS classes for the container */
  className?: string;
  /** Whether to show the tools menu */
  showTools?: boolean;
  /** Whether to show the upload menu */
  showUpload?: boolean;
  /** Array of uploaded files to display */
  uploadedFiles?: Array<{
    id: string;
    file: File;
    name: string;
    size: number;
    type: string;
    preview?: string;
  }>;
  /** Callback when files are uploaded */
  onFilesUpload?: (files: Array<{
    id: string;
    file: File;
    name: string;
    size: number;
    type: string;
    preview?: string;
  }>) => void;
  /** Callback when a file is removed */
  onFileRemove?: (fileId: string) => void;
  /** Optional chat ID for chat functionality */
  chatId?: string;
  /** Whether to use chat mode */
  useChatMode?: boolean;
}

/**
 * InputBox component that provides a chat-like input interface
 * with various action buttons and menus
 */
const InputBox: React.FC<InputBoxProps> = ({
  placeholder = 'Ask Anything',
  initialValue = '',
  onInputChange,
  onSend,
  onMicClick,
  onToolsClick,
  onPlusClick,
  disabled = false,
  className = '',
  showTools = true,
  showUpload = true,
  uploadedFiles = [],
  onFilesUpload,
  onFileRemove,
  chatId,
  useChatMode = false,
}) => {
  const router = useRouter();
  // State for input value
  const [inputValue, setInputValue] = useState(initialValue);

  // State for tools menu visibility
  const [isToolsMenuOpen, setIsToolsMenuOpen] = useState(false);

  // State for upload menu visibility
  const [isUploadMenuOpen, setIsUploadMenuOpen] = useState(false);

  // Ref for upload menu to handle click-outside
  const uploadMenuRef = useClickOutside(() => {
    setIsUploadMenuOpen(false);
  });

  // Ref for tools menu to handle click-outside
  const toolsMenuRef = useClickOutside(() => {
    setIsToolsMenuOpen(false);
  });

  /**
   * Handles input value changes
   * @param e - Input change event
   */
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setInputValue(value);
    onInputChange?.(value);
  };

  const formatTime = (timestamp: Date): string => {
    return timestamp.toLocaleTimeString([], {
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  /**
   * Handles form submission (Enter key or send button)
   * @param e - Form submission event
   */
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    console.error("Input value", inputValue)
    if (inputValue.trim()) {
      const question = inputValue.trim();
      setInputValue(''); // Clear input after sending

      // Call the onSend callback if provided
      onSend?.(question);

      // Send question to API and log response
      try {
        console.error('Sending question to API:', question);

        // const response = await askQuestionWithChat(question, chatId);
       
       
       
      } catch (error) {
        console.error('Failed to get answer from API:', error);
      }
    }
  };

  /**
   * Handles send button click
   */
  const handleSendClick = async () => {
    console.error("handleSendClick")
    console.error("Input value", inputValue)
    if (inputValue.trim()) {
      const question = inputValue.trim();
      setInputValue(''); // Clear input after sending
      console.error("question", question)
      // Call the onSend callback if provided
      onSend?.(question);

      // Send question to API and log response
      try {
        console.error('Sending question to API:', question);

        // const response = await askQuestionWithChat(question, chatId);
        // console.error('Chat API Response:', response);
        // if (!useChatMode)
        
      } catch (error) {
        console.error('Failed to get answer from API:', error);
      }
    }
  };

  /**
   * Handles microphone button click
   */
  const handleMicClick = () => {
    onMicClick?.();
  };

  /**
   * Handles tools button click
   */
  const handleToolsClick = () => {
    setIsToolsMenuOpen(!isToolsMenuOpen);
    onToolsClick?.();
  };

  /**
   * Handles plus button click
   */
  const handlePlusClick = () => {
    setIsUploadMenuOpen(!isUploadMenuOpen);
    onPlusClick?.();
  };

  /**
   * Handles tools checkbox change
   */
  const handleToolsCheckboxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setIsToolsMenuOpen(e.target.checked);
  };

  /**
   * Handles upload checkbox change
   */
  const handleUploadCheckboxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setIsUploadMenuOpen(e.target.checked);
  };

  /**
   * Handle files upload from UploadMenu
   */
  const handleFilesUpload = (files: Array<{
    id: string;
    file: File;
    name: string;
    size: number;
    type: string;
    preview?: string;
  }>) => {
    // Generate previews for image files
    const filesWithPreviews = files.map(async (file) => {
      if (file.file.type.startsWith('image/')) {
        const reader = new FileReader();
        return new Promise<typeof file>((resolve) => {
          reader.onload = (e) => {
            resolve({
              ...file,
              preview: e.target?.result as string,
            });
          };
          reader.readAsDataURL(file.file);
        });
      }
      return file;
    });

    Promise.all(filesWithPreviews).then((filesWithPreviews) => {
      onFilesUpload?.(filesWithPreviews);
      // Close upload menu after successful upload
      setIsUploadMenuOpen(false);
    });
  };

  return (
    <div className={`flex  w-full flex-col shadow border border-divider bg-background h-fit rounded-8 group ${className}`}>
      <div className="px-2 py-4 gap-2 flex flex-col">
        {/* Input field */}
        <input
          type="text"
          value={inputValue}
          onChange={handleInputChange}
          placeholder={placeholder}
          disabled={disabled}
          className="px-2 break-words whitespace-break-spaces placeholder:text-tertiary-txt !border-none !outline-none !ring-0 bg-transparent"
          onKeyDown={(e) => {
            if (e.key === 'Enter' && !e.shiftKey) {
              e.preventDefault();
              console.info("dnksjndjksnjk")
              handleSubmit(e);
            }
          }}
        />

        {/* Action buttons */}
        <div className="flex justify-between gap-2">
          {/* Left side - Tools and Upload */}
          <div className="flex relative items-center gap-2">
            {/* Upload menu trigger (Plus button) */}

            <>
              <input
                type="checkbox"
                name="upload"
                id="upload"
                className="peer cursor-pointer opacity-0 w-9 h-9 rounded-3 absolute z-10 left-0 top-1/2 -translate-y-1/2"
                onChange={handleUploadCheckboxChange}
                checked={isUploadMenuOpen}
              />
              <div
                className="w-9 h-9 peer-hover:bg-toolbar-highlight cursor-pointer  opacity-100 flex items-center justify-center rounded-3 hover:bg-toolbar-highlight transition-all duration-300"
                onClick={handlePlusClick}
              >
                <Plus size={16} />
              </div>

              {/* Upload menu dropdown */}
              {isUploadMenuOpen && (
                <div
                  ref={uploadMenuRef}
                  className="fixed hidden peer-checked:block z-10 top-[calc(50%+110px)] left-[calc(80px+238px)] w-fit h-fit flex items-center justify-center"
                >
                  <UploadMenu onFilesUpload={handleFilesUpload} onFileRemove={onFileRemove} />
                </div>
              )}
            </>


            {/* Tools button */}

            <>
              <input
                type="checkbox"
                name="tools"
                id="tools"
                className="peer cursor-pointer opacity-0 w-fit h-9 rounded-3 absolute z-10 left-0 top-1/2 -translate-y-1/2"
                onChange={handleToolsCheckboxChange}
                checked={isToolsMenuOpen}
              />
              <div
                className="flex py-2.5 px-1.5 opacity-50 items-center gap-1  opacity-100 flex items-center justify-center rounded-3 hover:bg-toolbar-highlight transition-all duration-300 cursor-pointer"
                onClick={handleToolsClick}
              >
                <ToolCase size={16} />
                <span className="text-sm text-secondary-txt">Tools</span>
              </div>

              {/* Tools menu dropdown */}
              {isToolsMenuOpen && (
                <div
                  ref={toolsMenuRef}
                  className="fixed z-10 top-[calc(50%+80px)] left-[calc(80px+238px)] w-fit h-fit flex items-center justify-center"
                >
                  <ToolsMenu />
                </div>
              )}
            </>

          </div>

          {/* Right side - Mic and Send */}
          <div className="flex items-center gap-2">
            {/* Microphone button */}
            <div
              className="w-9 h-9 opacity-50  opacity-100 flex items-center justify-center rounded-3 hover:bg-toolbar-highlight transition-all duration-300 cursor-pointer"
              onClick={handleMicClick}
            >
              <Mic size={16} />
            </div>

            {/* Send button */}
            <div
              className="w-9 h-9  opacity-100 flex items-center justify-center rounded-3 hover:bg-toolbar-highlight transition-all duration-300 cursor-pointer"
              onClick={handleSendClick}
            >
              <Send size={16} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default InputBox; 