import React, { useRef, useState } from 'react';
import { X, FileText, FileImage, File, Upload } from 'lucide-react';

/**
 * Interface for uploaded file data
 */
interface UploadedFile {
  id: string;
  file: File;
  name: string;
  size: number;
  type: string;
  preview?: string; // For image previews
  icon: React.ReactNode; // Icon component for the file type
}

/**
 * Props interface for the FileUpload component
 */
interface FileUploadProps {
  /** Callback when files are uploaded */
  onFilesUpload?: (files: UploadedFile[]) => void;
  /** Callback when a file is removed */
  onFileRemove?: (fileId: string) => void;
  /** Maximum number of files allowed */
  maxFiles?: number;
  /** Maximum file size in bytes */
  maxFileSize?: number;
  /** Accepted file types */
  acceptedTypes?: string[];
  /** Custom CSS classes */
  className?: string;
  /** Whether to show the upload button */
  showUploadButton?: boolean;
}

/**
 * FileUpload component that handles file selection and displays uploaded files
 */
const FileUpload: React.FC<FileUploadProps> = ({
  onFilesUpload,
  onFileRemove,
  maxFiles = 10,
  maxFileSize = 16 * 1024 * 1024, // 16MB default
  acceptedTypes = ['.pdf', '.txt', '.doc', '.docx', '.md'],
  className = '',
  showUploadButton = true,
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [uploadedFiles, setUploadedFiles] = useState<UploadedFile[]>([]);

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
   * Generate a preview URL for image files
   * @param file - The file to generate preview for
   * @returns Promise that resolves to the preview URL
   */
  const generatePreview = (file: File): Promise<string> => {
    return new Promise((resolve) => {
      if (file.type.startsWith('image/')) {
        const reader = new FileReader();
        reader.onload = (e) => {
          resolve(e.target?.result as string);
        };
        reader.readAsDataURL(file);
      } else {
        resolve('');
      }
    });
  };

  /**
   * Handle file selection from the file input
   * @param event - File input change event
   */
  const handleFileSelect = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(event.target.files || []);
    
    if (files.length === 0) return;

    // Check file count limit
    if (uploadedFiles.length + files.length > maxFiles) {
      alert(`You can only upload up to ${maxFiles} files.`);
      return;
    }

    const newUploadedFiles: UploadedFile[] = [];

    for (const file of files) {
      // Check file size
      if (file.size > maxFileSize) {
        alert(`File "${file.name}" is too large. Maximum size is ${formatFileSize(maxFileSize)}.`);
        continue;
      }

      // Check file type
      const fileExtension = '.' + file.name.split('.').pop()?.toLowerCase();
      if (!acceptedTypes.some(type => fileExtension === type.toLowerCase())) {
        alert(`File "${file.name}" is not a supported type.`);
        continue;
      }

      // Generate preview for images
      const preview = await generatePreview(file);

      const uploadedFile: UploadedFile = {
        id: `${Date.now()}-${Math.random()}`,
        file,
        name: file.name,
        size: file.size,
        type: file.type,
        preview,
        icon: getFileIcon(file.type),
      };

      newUploadedFiles.push(uploadedFile);
    }

    if (newUploadedFiles.length > 0) {
      const updatedFiles = [...uploadedFiles, ...newUploadedFiles];
      setUploadedFiles(updatedFiles);
      onFilesUpload?.(updatedFiles);
    }

    // Reset file input
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  /**
   * Remove a file from the uploaded files list
   * @param fileId - The ID of the file to remove
   */
  const handleFileRemove = (fileId: string) => {
    const updatedFiles = uploadedFiles.filter(file => file.id !== fileId);
    setUploadedFiles(updatedFiles);
    onFileRemove?.(fileId);
    onFilesUpload?.(updatedFiles);
  };

  /**
   * Trigger file input click
   */
  const handleUploadClick = () => {
    fileInputRef.current?.click();
  };

  return (
    <div className={`space-y-3 ${className}`}>
      {/* Hidden file input */}
      <input
        ref={fileInputRef}
        type="file"
        multiple
        accept={acceptedTypes.join(',')}
        onChange={handleFileSelect}
        className="hidden"
      />

      {/* Upload button */}
      {showUploadButton && (
        <button
          onClick={handleUploadClick}
          className="flex items-center gap-2 px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg transition-colors duration-200"
        >
          <Upload size={16} />
          <span>Upload Files</span>
        </button>
      )}

      {/* Uploaded files display */}
      {uploadedFiles.length > 0 && (
        <div className="space-y-2">
          <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300">
            Uploaded Files ({uploadedFiles.length}/{maxFiles})
          </h4>
          
          {/* Files grid */}
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3">
            {uploadedFiles.map((file) => (
              <div
                key={file.id}
                className="relative group bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-3 hover:shadow-md transition-shadow duration-200"
              >
                {/* Remove button */}
                <button
                  onClick={() => handleFileRemove(file.id)}
                  className="absolute -top-2 -right-2 bg-red-500 hover:bg-red-600 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity duration-200 z-10"
                >
                  <X size={12} />
                </button>

                {/* File preview or icon */}
                <div className="flex flex-col items-center space-y-2">
                  {file.preview ? (
                    <img
                      src={file.preview}
                      alt={file.name}
                      className="w-12 h-12 object-cover rounded border"
                    />
                  ) : (
                    <div className="w-12 h-12 flex items-center justify-center bg-gray-100 dark:bg-gray-700 rounded border">
                      {file.icon}
                    </div>
                  )}
                  
                  {/* File info */}
                  <div className="text-center">
                    <p className="text-xs font-medium text-gray-900 dark:text-gray-100 truncate max-w-[80px]">
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
        </div>
      )}
    </div>
  );
};

export default FileUpload; 