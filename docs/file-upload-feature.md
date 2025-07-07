# File Upload Feature

This document describes the file upload functionality that allows users to upload multiple files (PDF, text, images) and displays them as an image list row above the input box.

## Overview

The file upload feature consists of several components working together:

1. **UploadMenu** - Dropdown menu with upload button
2. **InputBox** - Main input component with file display
3. **UploadedFilesRow** - Horizontal list of uploaded files
4. **FileUpload** - Standalone file upload component (optional)

## How It Works

### 1. User Interaction Flow

1. User clicks the **Plus** button in the InputBox
2. UploadMenu dropdown appears
3. User clicks **Upload** in the dropdown
4. File dialog opens allowing multiple file selection
5. Selected files are processed and displayed above the input
6. Files can be removed individually by clicking the X button

### 2. File Processing

- **File Validation**: Checks file type and size limits
- **Preview Generation**: Creates image previews for image files
- **Icon Assignment**: Assigns appropriate icons for different file types
- **Size Formatting**: Displays file sizes in human-readable format

### 3. Supported File Types

- **Documents**: `.pdf`, `.txt`, `.doc`, `.docx`, `.md`
- **Images**: All image types (`.jpg`, `.png`, `.gif`, etc.)
- **Size Limit**: 16MB per file (configurable)
- **Count Limit**: 10 files maximum (configurable)

## Components

### UploadMenu Component

Located at: `src/app/(home)/UploadMenu.tsx`

**Features:**
- Hidden file input with multiple file selection
- Accepts PDF, text, document, and image files
- Triggers file upload callbacks

**Props:**
```tsx
interface UploadMenuProps {
  onFilesUpload?: (files: any[]) => void;
  onFileRemove?: (fileId: string) => void;
}
```

### InputBox Component

Located at: `src/components/ui/InputBox.tsx`

**Features:**
- Integrated file upload functionality
- Displays uploaded files row above input
- Handles file preview generation
- Manages file state

**New Props:**
```tsx
uploadedFiles?: Array<{
  id: string;
  file: File;
  name: string;
  size: number;
  type: string;
  preview?: string;
}>;
onFilesUpload?: (files: Array<...>) => void;
onFileRemove?: (fileId: string) => void;
```

### UploadedFilesRow Component

Located at: `src/components/ui/UploadedFilesRow.tsx`

**Features:**
- Horizontal list of uploaded files
- File previews for images
- File type icons for documents
- Remove functionality
- Responsive design

**Props:**
```tsx
interface UploadedFilesRowProps {
  files: UploadedFile[];
  onFileRemove?: (fileId: string) => void;
  className?: string;
}
```

## Usage Example

### Basic Implementation

```tsx
import React, { useState } from 'react';
import { InputBox } from '@/components/ui';

function ChatComponent() {
  const [uploadedFiles, setUploadedFiles] = useState([]);

  const handleFilesUpload = (files) => {
    setUploadedFiles(files);
    console.info('Files uploaded:', files);
  };

  const handleFileRemove = (fileId) => {
    setUploadedFiles(prev => prev.filter(file => file.id !== fileId));
  };

  return (
    <InputBox
      placeholder="Ask Anything"
      uploadedFiles={uploadedFiles}
      onFilesUpload={handleFilesUpload}
      onFileRemove={handleFileRemove}
      onSend={(message) => {
        console.info('Sending message with files:', message, uploadedFiles);
      }}
    />
  );
}
```

### Advanced Implementation

```tsx
import React, { useState } from 'react';
import { InputBox } from '@/components/ui';

function AdvancedChatComponent() {
  const [uploadedFiles, setUploadedFiles] = useState([]);
  const [isUploading, setIsUploading] = useState(false);

  const handleFilesUpload = async (files) => {
    setIsUploading(true);
    
    try {
      // Upload files to server
      const uploadedFileIds = await uploadFilesToServer(files);
      
      // Update local state
      setUploadedFiles(prev => [...prev, ...files]);
      
      console.info('Files uploaded successfully:', uploadedFileIds);
    } catch (error) {
      console.error('Upload failed:', error);
      alert('File upload failed. Please try again.');
    } finally {
      setIsUploading(false);
    }
  };

  const handleFileRemove = (fileId) => {
    setUploadedFiles(prev => prev.filter(file => file.id !== fileId));
  };

  const handleSend = async (message) => {
    if (uploadedFiles.length > 0) {
      // Send message with file references
      await sendMessageWithFiles(message, uploadedFiles);
    } else {
      // Send regular message
      await sendMessage(message);
    }
  };

  return (
    <InputBox
      placeholder="Ask me anything..."
      uploadedFiles={uploadedFiles}
      onFilesUpload={handleFilesUpload}
      onFileRemove={handleFileRemove}
      onSend={handleSend}
      disabled={isUploading}
    />
  );
}
```

## File Display Features

### Visual Elements

1. **File Previews**: Image files show actual previews
2. **File Icons**: Document files show type-specific icons
3. **File Information**: Name and size displayed
4. **Remove Buttons**: Hover to reveal remove functionality
5. **Responsive Layout**: Adapts to different screen sizes

### File Type Icons

- **Images**: Blue image icon
- **PDFs**: Red file icon
- **Text/Documents**: Green text icon
- **Other**: Gray generic file icon

### Styling

The component uses Tailwind CSS classes and follows the design system:

```css
/* File container */
bg-white dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg

/* Hover effects */
hover:shadow-md transition-shadow duration-200

/* Remove button */
bg-red-500 hover:bg-red-600 opacity-0 group-hover:opacity-100
```

## Error Handling

### File Validation

- **Size Limit**: Files over 16MB are rejected
- **Type Validation**: Only supported file types are accepted
- **Count Limit**: Maximum 10 files enforced
- **User Feedback**: Alert messages for validation errors

### Error Messages

- "File is too large. Maximum size is 16MB."
- "File is not a supported type."
- "You can only upload up to 10 files."

## Performance Considerations

### File Processing

- **Async Processing**: File previews generated asynchronously
- **Memory Management**: File objects stored efficiently
- **Cleanup**: File input reset after selection

### Optimization

- **Lazy Loading**: Components load only when needed
- **Efficient Rendering**: Only re-renders when files change
- **Memory Cleanup**: Proper disposal of file objects

## Future Enhancements

### Planned Features

1. **Drag & Drop**: Direct file dropping onto the input area
2. **Progress Indicators**: Upload progress for large files
3. **File Compression**: Automatic image compression
4. **Batch Operations**: Select multiple files for removal
5. **File Categories**: Group files by type

### Technical Improvements

1. **Virtual Scrolling**: For large numbers of files
2. **Caching**: File preview caching
3. **Offline Support**: Local file storage
4. **Accessibility**: Enhanced screen reader support

## Troubleshooting

### Common Issues

1. **Files not displaying**: Check file type and size limits
2. **Upload menu not appearing**: Verify click handlers are connected
3. **Remove button not working**: Check onFileRemove callback
4. **Preview not generating**: Ensure file is an image type

### Debug Steps

1. Check browser console for errors
2. Verify file input accept attribute
3. Test with different file types
4. Check component prop passing

## API Reference

### File Object Structure

```tsx
interface UploadedFile {
  id: string;           // Unique identifier
  file: File;           // Original File object
  name: string;         // File name
  size: number;         // File size in bytes
  type: string;         // MIME type
  preview?: string;     // Base64 preview (images only)
}
```

### Callback Functions

```tsx
// File upload callback
onFilesUpload: (files: UploadedFile[]) => void

// File removal callback
onFileRemove: (fileId: string) => void
``` 