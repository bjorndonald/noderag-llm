import { Archive, ChevronRight, Edit, Share, Trash, Upload } from "lucide-react";
import React, { useRef, useState } from "react";
import { uploadFile } from "../../../lib/api";
import { validateFile } from "../../../config/api";

/**
 * Props interface for the UploadMenu component
 */
interface UploadMenuProps {
  /** Callback when files are uploaded */
  onFilesUpload?: (files: any[]) => void;
  /** Callback when a file is removed */
  onFileRemove?: (fileId: string) => void;
}

const UploadMenu: React.FC<UploadMenuProps> = ({ onFilesUpload, onFileRemove }) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isUploading, setIsUploading] = useState(false);

  /**
   * Handle upload button click
   */
  const handleUploadClick = () => {
    fileInputRef.current?.click();
  };

  /**
   * Handle file selection and upload to API
   * @param event - File input change event
   */
  const handleFileSelect = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(event.target.files || []);
    if (files.length === 0) return;

    setIsUploading(true);

    try {
      for (const file of files) {
        // Validate file using config
        const validation = validateFile(file);
        if (!validation.valid) {
          console.error(validation.error);
          alert(validation.error);
          continue;
        }

        console.info('Uploading file:', file.name);
        
        // Upload to API
        const uploadResponse = await uploadFile(file);
        console.info('Upload response:', uploadResponse);

        // Convert to the format expected by parent components
        const uploadedFile = {
          id: `${Date.now()}-${Math.random()}`,
          file,
          name: file.name,
          size: file.size,
          type: file.type,
          apiResponse: uploadResponse,
        };
        
        onFilesUpload?.([uploadedFile]);
      }
    } catch (error) {
      console.error('Upload failed:', error);
      alert('Upload failed. Please try again.');
    } finally {
      setIsUploading(false);
    }
    
    // Reset file input
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  return (
    <div className="flex gap-1 border-divider border flex-col w-[130px] bg-background rounded-2 p-1.5">
      {/* Hidden file input */}
      <input
        ref={fileInputRef}
        type="file"
        multiple
        accept=".pdf"
        onChange={handleFileSelect}
        className="hidden"
      />
      
      {/* Upload button */}
      <div 
        className={`flex cursor-pointer text-sm text-secondary-txt items-center gap-2 py-2.5 px-1.5 rounded-2 hover:bg-toolbar-highlight transition-all duration-300 ${isUploading ? 'opacity-50 cursor-not-allowed' : ''}`}
        onClick={!isUploading ? handleUploadClick : undefined}
      >
        <Upload size={14} /> {isUploading ? 'Uploading...' : 'Upload'}
      </div>
      
      {/* Apps button */}
      <div className="flex cursor-pointer text-sm text-secondary-txt items-center gap-2 py-2.5 px-1.5 rounded-2 hover:bg-toolbar-highlight transition-all duration-300">
        <Trash size={14} /> Apps <div className="grow"></div>
        <ChevronRight size={14} />
      </div>
    </div>
  )
}

export default UploadMenu;