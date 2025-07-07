import { useState, useEffect } from 'react';
import { getDocuments, deleteDocument } from '../lib/api';

/**
 * File object structure
 */
export interface FileItem {
  id: string;
  file: File;
  name: string;
  size: number;
  type: string;
  preview?: string;
  apiResponse?: any;
}

/**
 * Custom hook to manage files from backend and local state
 * @returns Object with files state and management functions
 */
export const useFiles = () => {
  // State for uploaded files
  const [uploadedFiles, setUploadedFiles] = useState<FileItem[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  /**
   * Load files from the backend
   */
  const loadFilesFromBackend = async () => {
    setIsLoading(true);
    setError(null);
    
    try {
      console.info('Loading files from backend...');
      const response = await getDocuments();
      console.info('Backend files response:', response);
      
      // Transform backend response to match our FileItem structure
      if (response.documents && Array.isArray(response.documents)) {
        const transformedFiles: FileItem[] = response.documents.map((doc: any, index: number) => ({
          id: doc.filename || `file-${index}`,
          file: new File([], doc.filename || 'unknown.pdf'), // Create a placeholder File object
          name: doc.filename || 'unknown.pdf',
          size: doc.size || 0,
          type: 'application/pdf',
          apiResponse: doc,
        }));
        
        setUploadedFiles(transformedFiles);
        console.info('Files loaded from backend:', transformedFiles);
      } else {
        console.info('No documents found or invalid response format');
        setUploadedFiles([]);
      }
    } catch (err) {
      console.error('Failed to load files from backend:', err);
      setError(err instanceof Error ? err.message : 'Failed to load files');
    } finally {
      setIsLoading(false);
    }
  };

  /**
   * Handle files upload
   * @param files - Array of uploaded files
   */
  const handleFilesUpload = (files: FileItem[]) => {
    setUploadedFiles(prev => [...prev, ...files]);
    console.info('Files uploaded:', files);
    
    // Log API responses for uploaded files
    files.forEach(file => {
      if (file.apiResponse) {
        console.info(`File ${file.name} API response:`, file.apiResponse);
      }
    });
  };

  /**
   * Handle file removal
   * @param fileId - ID of the file to remove
   */
  const handleFileRemove = async (fileId: string) => {
    try {
      // Find the file to get its name for backend deletion
      const fileToRemove = uploadedFiles.find(file => file.id === fileId);
      
      if (fileToRemove) {
        // Try to delete from backend if it has a filename
        if (fileToRemove.name && fileToRemove.name !== 'unknown.pdf') {
          try {
            await deleteDocument(fileToRemove.name);
            console.info('File deleted from backend:', fileToRemove.name);
          } catch (err) {
            console.error('Failed to delete file from backend:', err);
            // Continue with local removal even if backend deletion fails
          }
        }
      }
      
      // Remove from local state
      setUploadedFiles(prev => prev.filter(file => file.id !== fileId));
      console.info('File removed:', fileId);
    } catch (err) {
      console.error('Error removing file:', err);
      setError(err instanceof Error ? err.message : 'Failed to remove file');
    }
  };

  /**
   * Refresh files from backend
   */
  const refreshFiles = () => {
    loadFilesFromBackend();
  };

  // Load files on mount
  useEffect(() => {
    loadFilesFromBackend();
  }, []);

  return {
    uploadedFiles,
    isLoading,
    error,
    handleFilesUpload,
    handleFileRemove,
    refreshFiles,
    loadFilesFromBackend,
  };
}; 