"use client"

import { useState, useRef } from "react"
import { Button } from "@/components/atoms/button"
import { Icon } from "@/components/atoms/icon"

// Types for the upload modal
interface Document {
  filename: string
  size: number
  type: string
}

interface UploadModalProps {
  isOpen: boolean
  onClose: () => void
  onUploadSuccess: (filename: string) => void
  onDocumentsChange: (documents: Document[]) => void
  apiBaseUrl: string
}

// Icon paths for the upload modal
const ICONS = {
  upload: "M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4M17 8l-5-5-5 5M12 3v12",
  trash: "M3 6h18M8 6V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2m3 0v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6h14z",
  close: "M18 6L6 18M6 6l12 12",
  check: "M20 6L9 17l-5-5",
  alert: "M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0zM12 9v4m0 4h.01"
}

export default function UploadModal({
  isOpen,
  onClose,
  onUploadSuccess,
  onDocumentsChange,
  apiBaseUrl
}: UploadModalProps) {
  const [uploadingFile, setUploadingFile] = useState(false)
  const [uploadProgress, setUploadProgress] = useState<string>('')
  const [documents, setDocuments] = useState<Document[]>([])
  const [dragActive, setDragActive] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)

  // Load existing documents when modal opens
  const fetchDocuments = async () => {
    try {
      const response = await fetch(`${apiBaseUrl}/documents`)
      if (response.ok) {
        const data = await response.json()
        const docs = data.documents || []
        setDocuments(docs)
        onDocumentsChange(docs)
      }
    } catch (error) {
      console.error('Error fetching documents:', error)
    }
  }

  // Fetch documents when modal opens
  if (isOpen && documents.length === 0) {
    fetchDocuments()
  }

  /**
   * Handles file upload to the NodeRAG API
   * @param file - The file to upload
   */
  const handleFileUpload = async (file: File) => {
    if (!file) return

    setUploadingFile(true)
    setUploadProgress('Uploading file...')

    const formData = new FormData()
    formData.append('file', file)

    try {
      const response = await fetch(`${apiBaseUrl}/upload`, {
        method: 'POST',
        body: formData,
      })

      if (response.ok) {
        const data = await response.json()
        setUploadProgress(`File uploaded successfully: ${data.filename}`)
        onUploadSuccess(data.filename)
        
        // Refresh documents list
        await fetchDocuments()
        
        // Clear the file input
        if (fileInputRef.current) {
          fileInputRef.current.value = ''
        }
      } else {
        const errorData = await response.json()
        setUploadProgress(`Upload failed: ${errorData.error}`)
      }
    } catch (error) {
      setUploadProgress('Upload failed: Network error')
      console.error('Upload error:', error)
    } finally {
      setUploadingFile(false)
      setTimeout(() => setUploadProgress(''), 3000)
    }
  }

  /**
   * Deletes a document from the NodeRAG API
   * @param filename - The filename to delete
   */
  const deleteDocument = async (filename: string) => {
    try {
      const response = await fetch(`${apiBaseUrl}/documents/${filename}`, {
        method: 'DELETE',
      })

      if (response.ok) {
        await fetchDocuments()
      }
    } catch (error) {
      console.error('Error deleting document:', error)
    }
  }

  /**
   * Formats file size for display
   * @param bytes - File size in bytes
   * @returns Formatted file size string
   */
  const formatFileSize = (bytes: number): string => {
    if (bytes === 0) return '0 Bytes'
    const k = 1024
    const sizes = ['Bytes', 'KB', 'MB', 'GB']
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
  }

  /**
   * Handles drag and drop events
   */
  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true)
    } else if (e.type === "dragleave") {
      setDragActive(false)
    }
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setDragActive(false)
    
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFileUpload(e.dataTransfer.files[0])
    }
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white dark:bg-slate-800 rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-slate-200 dark:border-slate-700">
          <h2 className="text-xl font-semibold text-slate-900 dark:text-white">
            Upload Documents
          </h2>
          <Button
            title="Close Modal"
            onClick={onClose}
            className="p-2 text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200"
          >
            <Icon path={ICONS.close} className="w-5 h-5" />
          </Button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6 max-h-[calc(90vh-140px)] overflow-y-auto">
          {/* Upload Area */}
          <div className="space-y-4">
            <div
              className={`border-2 border-dashed rounded-lg p-8 text-center transition-colors ${
                dragActive
                  ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20'
                  : 'border-slate-300 dark:border-slate-600 hover:border-slate-400 dark:hover:border-slate-500'
              }`}
              onDragEnter={handleDrag}
              onDragLeave={handleDrag}
              onDragOver={handleDrag}
              onDrop={handleDrop}
            >
              <input
                ref={fileInputRef}
                type="file"
                accept=".txt,.pdf,.docx,.md"
                onChange={(e) => {
                  const file = e.target.files?.[0]
                  if (file) handleFileUpload(file)
                }}
                className="hidden"
              />
              
              <Icon path={ICONS.upload} className="w-12 h-12 mx-auto mb-4 text-slate-400" />
              <p className="text-lg font-medium text-slate-900 dark:text-white mb-2">
                Drop files here or click to upload
              </p>
              <p className="text-sm text-slate-600 dark:text-slate-400 mb-4">
                Supported formats: .txt, .pdf, .docx, .md (max 16MB)
              </p>
              
              <Button
                title="Select File"
                onClick={() => fileInputRef.current?.click()}
                disabled={uploadingFile}
                className="px-6"
              >
                <Icon path={ICONS.upload} className="w-4 h-4 mr-2" />
                {uploadingFile ? 'Uploading...' : 'Select File'}
              </Button>
            </div>

            {/* Upload Progress */}
            {uploadProgress && (
              <div className={`p-3 rounded-lg text-sm ${
                uploadProgress.includes('successfully') 
                  ? 'bg-green-50 dark:bg-green-900/20 text-green-700 dark:text-green-300'
                  : uploadProgress.includes('failed')
                  ? 'bg-red-50 dark:bg-red-900/20 text-red-700 dark:text-red-300'
                  : 'bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-300'
              }`}>
                <div className="flex items-center gap-2">
                  {uploadProgress.includes('successfully') && (
                    <Icon path={ICONS.check} className="w-4 h-4" />
                  )}
                  {uploadProgress.includes('failed') && (
                    <Icon path={ICONS.alert} className="w-4 h-4" />
                  )}
                  {uploadProgress}
                </div>
              </div>
            )}
          </div>

          {/* Document List */}
          <div className="space-y-3">
            <h3 className="text-lg font-medium text-slate-900 dark:text-white">
              Uploaded Documents ({documents.length})
            </h3>
            
            {documents.length === 0 ? (
              <div className="text-center py-8 text-slate-500 dark:text-slate-400">
                <p>No documents uploaded yet</p>
                <p className="text-sm mt-1">Upload a document to get started</p>
              </div>
            ) : (
              <div className="space-y-2 max-h-64 overflow-y-auto">
                {documents.map((doc) => (
                  <div
                    key={doc.filename}
                    className="flex items-center justify-between p-3 bg-slate-50 dark:bg-slate-700 rounded-lg"
                  >
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-slate-900 dark:text-white truncate">
                        {doc.filename}
                      </p>
                      <p className="text-xs text-slate-500 dark:text-slate-400">
                        {formatFileSize(doc.size)} • {doc.type.toUpperCase()}
                      </p>
                    </div>
                    <Button
                      title={`Delete ${doc.filename}`}
                      onClick={() => deleteDocument(doc.filename)}
                      className="text-red-600 hover:text-red-700 dark:text-red-400 dark:hover:text-red-300 p-1"
                    >
                      <Icon path={ICONS.trash} className="w-4 h-4" />
                    </Button>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="flex justify-end p-6 border-t border-slate-200 dark:border-slate-700">
          <Button
            title="Close"
            onClick={onClose}
            className="px-6"
          >
            Close
          </Button>
        </div>
      </div>
    </div>
  )
} 