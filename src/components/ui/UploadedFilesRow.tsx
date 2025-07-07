import React from 'react';
import { X, FileText, FileImage, File, RefreshCw } from 'lucide-react';

/**
 * Interface for uploaded file data
 */
interface UploadedFile {
  id: string;
  file: File;
  name: string;
  size: number;
  type: string;
  preview?: string;
}

/**
 * Props interface for the UploadedFilesRow component
 */
interface UploadedFilesRowProps {
  /** Array of uploaded files */
  files: UploadedFile[];
  /** Callback when a file is removed */
  onFileRemove?: (fileId: string) => void;
  /** Callback to refresh files from backend */
  onRefresh?: () => void;
  /** Whether files are currently loading */
  isLoading?: boolean;
  /** Custom CSS classes */
  className?: string;
}

/**
 * UploadedFilesRow component that displays uploaded files as a horizontal list
 */
const UploadedFilesRow: React.FC<UploadedFilesRowProps> = ({
  files,
  onFileRemove,
  onRefresh,
  isLoading = false,
  className = '',
}) => {
  /**
   * Get the appropriate icon for a file type
   * @param fileType - The MIME type of the file
   * @returns React component for the file icon
   */
  const getFileIcon = (fileType: string): React.ReactNode => {
    if (fileType.startsWith('image/')) {
      return <FileImage size={16} className="text-blue-500" />;
    } else if (fileType.includes('pdf')) {
      return <File size={16} className="text-red-500" />;
    } else if (fileType.includes('text') || fileType.includes('document')) {
      return <FileText size={16} className="text-green-500" />;
    } else {
      return <File size={16} className="text-gray-500" />;
    }
  };

  /**
   * Format file size for display
   * @param bytes - File size in bytes
   * @returns Formatted file size string
   */
  const formatFileSize = (bytes: number): string => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  /**
   * Handle file removal
   * @param fileId - The ID of the file to remove
   */
  const handleFileRemove = (fileId: string) => {
    onFileRemove?.(fileId);
  };

  if (files.length === 0) {
    return null;
  }

  return (
    <div className={`flex flex-wrap gap-2 p-3 bg-gray-50 dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 ${className}`}>
      {/* Refresh button */}
      {onRefresh && (
        <button
          onClick={onRefresh}
          disabled={isLoading}
          className="flex items-center gap-2 bg-blue-500 hover:bg-blue-600 disabled:bg-blue-300 text-white rounded-lg px-3 py-2 transition-colors duration-200"
          title="Refresh files from backend"
        >
          <RefreshCw size={16} className={isLoading ? 'animate-spin' : ''} />
          <span className="text-sm">Refresh</span>
        </button>
      )}
      
      {files.map((file) => (
        <div
          key={file.id}
          className="relative group flex items-center gap-2 bg-white dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg px-3 py-2 hover:shadow-md transition-shadow duration-200"
        >
          {/* Remove button */}
          <button
            onClick={() => handleFileRemove(file.id)}
            className="absolute -top-1 -right-1 bg-red-500 hover:bg-red-600 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity duration-200 z-10"
            title="Remove file"
          >
            <X size={10} />
          </button>

          {/* File preview or icon */}
          <div className="flex items-center gap-2">
            {file.preview ? (
              <img
                src={file.preview}
                alt={file.name}
                className="w-8 h-8 object-cover rounded border"
              />
            ) : (
              <div className="w-8 h-8 flex items-center justify-center bg-gray-100 dark:bg-gray-600 rounded border">
                {getFileIcon(file.type)}
              </div>
            )}
            
            {/* File info */}
            <div className="flex flex-col">
              <p className="text-sm font-medium text-gray-900 dark:text-gray-100 truncate max-w-[120px]">
                {file.name}
              </p>
              <p className="text-xs text-gray-500 dark:text-gray-400">
                {formatFileSize(file.size)}
              </p>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default UploadedFilesRow; 