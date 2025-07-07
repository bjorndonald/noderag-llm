# NodeRAG API Integration

This document describes how the chat interface integrates with the NodeRAG Railway API for file uploads and question answering.

## Overview

The chat interface now integrates with the NodeRAG Railway API to:
- Upload PDF files to the NodeRAG system
- Send questions and receive AI-generated answers
- Display uploaded files in the interface
- Log all API responses to the console

## API Configuration

### Environment Variables

Set the following environment variable in your `.env.local` file:

```bash
NEXT_PUBLIC_RAILWAY_API_URL=https://your-app-name.railway.app
```

Replace `your-app-name` with your actual Railway app name.

### API Configuration File

The API configuration is centralized in `src/config/api.ts`:

```typescript
export const API_CONFIG = {
  BASE_URL: process.env.NEXT_PUBLIC_RAILWAY_API_URL || 'https://your-app-name.railway.app',
  
  ENDPOINTS: {
    HEALTH: '/health',
    UPLOAD: '/upload',
    ANSWER: '/answer',
    DOCUMENTS: '/documents',
    ANSWER_RETRIEVAL: '/answer_retrieval',
    RETRIEVAL: '/retrieval',
  },
  
  UPLOAD: {
    MAX_FILE_SIZE: 16 * 1024 * 1024, // 16MB
    ACCEPTED_TYPES: ['.pdf'],
    ACCEPTED_MIME_TYPES: ['application/pdf'],
  },
};
```

## File Upload Integration

### Upload Flow

1. **User clicks Plus button** → UploadMenu dropdown appears
2. **User clicks Upload** → File dialog opens (PDF only)
3. **User selects PDF files** → Files are validated and uploaded
4. **API upload** → Files sent to `/upload` endpoint
5. **Response logged** → Upload response logged to console
6. **Files displayed** → Uploaded files shown in image list row

### File Validation

Files are validated before upload:
- **File type**: Only PDF files accepted
- **File size**: Maximum 16MB per file
- **Error handling**: User-friendly error messages

### Upload Response

The upload response is logged to the console and includes:
```json
{
  "message": "Document uploaded and processed successfully",
  "filename": "document.pdf",
  "file_path": "./main_folder/input/document.pdf",
  "status": "completed"
}
```

## Question Answering Integration

### Question Flow

1. **User types question** → Text entered in input field
2. **User presses Enter or clicks Send** → Question sent to API
3. **API call** → Question sent to `/answer` endpoint
4. **Response logged** → Answer logged to console
5. **Input cleared** → Input field is cleared for next question

### Question Request

```json
{
  "question": "What is this document about?"
}
```

### Answer Response

The answer response is logged to the console:
```json
{
  "answer": "This document discusses the implementation of NodeRAG..."
}
```

## API Client Functions

### Core Functions

```typescript
// Upload a PDF file
uploadFile(file: File): Promise<any>

// Send a question
askQuestion(question: string): Promise<any>

// Get list of documents
getDocuments(): Promise<any>

// Delete a document
deleteDocument(filename: string): Promise<any>

// Health check
healthCheck(): Promise<any>
```

### Error Handling

All API functions include comprehensive error handling:
- Network errors
- API errors
- Validation errors
- Timeout handling

## Console Logging

### Upload Logs

When files are uploaded, you'll see logs like:
```
Uploading file: document.pdf
Upload response: { message: "Document uploaded and processed successfully", ... }
File document.pdf API response: { message: "Document uploaded and processed successfully", ... }
```

### Question Logs

When questions are sent, you'll see logs like:
```
Sending question to API: What is this document about?
API Response: { answer: "This document discusses..." }
```

## Component Integration

### UploadMenu Component

- **File input**: Hidden input with PDF-only accept
- **Upload state**: Shows "Uploading..." during upload
- **Validation**: Uses centralized validation
- **API integration**: Calls uploadFile function

### InputBox Component

- **Question handling**: Sends questions to askQuestion function
- **Response logging**: Logs all API responses to console
- **Error handling**: Catches and logs API errors
- **State management**: Clears input after sending

### Home Page

- **File state**: Manages uploaded files state
- **API responses**: Logs file upload responses
- **Integration**: Coordinates between components

## Testing the Integration

### 1. Set Up Environment

Create `.env.local` file:
```bash
NEXT_PUBLIC_RAILWAY_API_URL=https://your-railway-app.railway.app
```

### 2. Test File Upload

1. Click the Plus button
2. Click Upload in the dropdown
3. Select a PDF file
4. Check console for upload logs

### 3. Test Question Answering

1. Type a question in the input field
2. Press Enter or click Send
3. Check console for answer logs

### 4. Verify API Health

The health endpoint can be tested:
```bash
curl https://your-railway-app.railway.app/health
```

## Troubleshooting

### Common Issues

1. **API URL not set**: Check `.env.local` file
2. **CORS errors**: Ensure Railway app allows your domain
3. **Upload failures**: Check file type and size
4. **Network errors**: Verify Railway app is running

### Debug Steps

1. Check browser console for error logs
2. Verify environment variables are loaded
3. Test API endpoints directly with curl
4. Check Railway logs for server-side issues

## Future Enhancements

### Planned Features

1. **Real-time responses**: Stream answers as they're generated
2. **File progress**: Show upload progress indicators
3. **Error recovery**: Retry failed uploads automatically
4. **Response display**: Show answers in the chat interface
5. **File management**: Delete files from the interface

### Technical Improvements

1. **Caching**: Cache API responses for better performance
2. **Offline support**: Queue requests when offline
3. **Rate limiting**: Handle API rate limits gracefully
4. **Authentication**: Add API key authentication if needed 