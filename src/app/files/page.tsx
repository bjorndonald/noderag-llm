"use client";
import UploadedFilesRow from '@/components/ui/UploadedFilesRow';
import { useFiles } from '@/hooks/useFiles';
import React from 'react'

const FilesPage = () => {
    const { 
        uploadedFiles, 
        isLoading: filesLoading, 
        error: filesError, 
        handleFilesUpload, 
        handleFileRemove,
        refreshFiles
    } = useFiles();
    return (
        <div>
            {/* Chat title */}
            <div className="w-full mt-5 max-w-4xl mx-auto text-center">
               <h1>Files</h1> 
            </div>

            {/* Loading indicator for files */}
            {filesLoading && (
                <div className="w-full max-w-4xl mx-auto text-center">
                    <p className="text-gray-500">Loading files...</p>
                </div>
            )}

            {/* Error display for files */}
            {filesError && (
                <div className="w-full max-w-4xl mx-auto text-center">
                    <p className="text-red-500">Error loading files: {filesError}</p>
                </div>
            )}

            {/* Sticky Uploaded Files Row */}
            <div className=" w-full max-w-4xl mx-auto">
                <UploadedFilesRow 
                    files={uploadedFiles} 
                    onFileRemove={handleFileRemove}
                    onRefresh={refreshFiles}
                    isLoading={filesLoading}
                />
            </div>
        </div>
    )
}

export default FilesPage;