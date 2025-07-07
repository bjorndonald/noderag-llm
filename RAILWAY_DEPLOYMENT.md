# NodeRAG Railway Deployment Guide

## Prerequisites

1. **Railway Account**: Sign up at [railway.app](https://railway.app)
2. **GitHub Repository**: Your NodeRAG project should be in a GitHub repository
3. **OpenAI API Key**: You'll need to set this as an environment variable

## Deployment Steps

### 1. Prepare Your Repository

Make sure your repository contains:
- `railway_start.py` - Railway startup script with upload functionality, CORS support, and chat system
- `Procfile` - Tells Railway how to start the app
- `requirements.txt` - Python dependencies (includes flask-cors and flask-socketio)
- `runtime.txt` - Python version specification
- `main_folder/` - Your processed data folder (optional, will be created automatically)
- `main_folder/Node_config.yaml` - Configuration file
- `API_DOCUMENTATION.md` - API documentation
- `test_cors.py` - CORS testing script (optional)
- `test_chat_system.py` - Chat system testing script (optional)

### 2. Deploy to Railway

1. **Connect to Railway**:
   - Go to [railway.app](https://railway.app)
   - Click "New Project"
   - Select "Deploy from GitHub repo"
   - Choose your NodeRAG repository

2. **Configure Environment Variables**:
   - In your Railway project dashboard, go to "Variables"
   - Add the following environment variables:
     ```
     OPENAI_API_KEY=your_openai_api_key_here
     MAIN_FOLDER=./main_folder
     ```

3. **Deploy**:
   - Railway will automatically detect the Python project
   - It will install dependencies from `requirements.txt`
   - The app will start using the `Procfile`

### 3. Verify Deployment

1. **Check Health Endpoint**:
   ```
   GET https://your-app-name.railway.app/health
   ```

2. **Test Upload Endpoint**:
   ```bash
   curl -X POST https://your-app-name.railway.app/upload \
     -F "file=@/path/to/your/document.pdf"
   ```

3. **Test Answer Endpoint**:
   ```bash
   curl -X POST https://your-app-name.railway.app/answer \
     -H "Content-Type: application/json" \
     -d '{"question": "What is this document about?"}'
   ```

## API Endpoints

### Health Check
- **URL**: `/health`
- **Method**: `GET`
- **Response**: `{"status": "healthy", "service": "NodeRAG"}`

### Document Upload
- **URL**: `/upload`
- **Method**: `POST`
- **Content-Type**: `multipart/form-data`
- **Body**: `file` (document file)
- **Supported Formats**: `.txt`, `.pdf`, `.docx`, `.md`
- **Max Size**: 16MB
- **Response**: Upload status and processing results

### List Documents
- **URL**: `/documents`
- **Method**: `GET`
- **Response**: List of uploaded documents with metadata

### Delete Document
- **URL**: `/documents/{filename}`
- **Method**: `DELETE`
- **Response**: Deletion confirmation

### Answer
- **URL**: `/answer`
- **Method**: `POST`
- **Body**: `{"question": "Your question here"}`
- **Response**: `{"answer": "Generated answer"}`

### Answer with Retrieval
- **URL**: `/answer_retrieval`
- **Method**: `POST`
- **Body**: `{"question": "Your question here"}`
- **Response**: `{"answer": "Generated answer", "retrieval": {...}}`

### Retrieval Only
- **URL**: `/retrieval`
- **Method**: `POST`
- **Body**: `{"question": "Your question here"}`
- **Response**: `{"retrieval": {...}}`

### Chat System Endpoints

#### Create Chat
- **URL**: `/chats`
- **Method**: `POST`
- **Body**: `{"title": "Chat Title", "metadata": {...}}`
- **Response**: `{"id": "chat_id", "title": "Chat Title", ...}`

#### List Chats
- **URL**: `/chats`
- **Method**: `GET`
- **Query Parameters**: `limit` (default: 50), `offset` (default: 0)
- **Response**: `{"chats": [...], "total": count}`

#### Get Chat
- **URL**: `/chats/{chat_id}`
- **Method**: `GET`
- **Response**: `{"id": "chat_id", "title": "Chat Title", ...}`

#### Delete Chat
- **URL**: `/chats/{chat_id}`
- **Method**: `DELETE`
- **Response**: `{"message": "Chat deleted successfully"}`

#### Get Chat Messages
- **URL**: `/chats/{chat_id}/messages`
- **Method**: `GET`
- **Query Parameters**: `limit` (default: 100), `offset` (default: 0)
- **Response**: `{"messages": [...], "total": count}`

#### Update Chat Title
- **URL**: `/chats/{chat_id}/title`
- **Method**: `PUT`
- **Body**: `{"title": "New Title"}`
- **Response**: `{"message": "Chat title updated successfully"}`

#### Ask Question (with Chat Support)
- **URL**: `/chat/ask`
- **Method**: `POST`
- **Body**: `{"question": "Your question", "chat_id": "optional_chat_id"}`
- **Response**: `{"chat_id": "chat_id", "answer": "Generated answer", "message_id": "message_id"}`

#### Chat Statistics
- **URL**: `/chat/stats`
- **Method**: `GET`
- **Response**: `{"total_chats": count, "total_messages": count, "average_messages_per_chat": avg}`

### WebSocket Events

#### Client to Server Events:
- `connect` - Connect to WebSocket
- `disconnect` - Disconnect from WebSocket
- `join_chat` - Join a chat room: `{"chat_id": "chat_id"}`
- `leave_chat` - Leave a chat room: `{"chat_id": "chat_id"}`
- `subscribe_to_chat` - Subscribe to chat updates: `{"chat_id": "chat_id"}`
- `unsubscribe_from_chat` - Unsubscribe from chat updates: `{"chat_id": "chat_id"}`
- `get_chat_messages` - Get chat messages: `{"chat_id": "chat_id", "limit": 100, "offset": 0}`
- `get_chat_stats` - Get chat statistics

#### Server to Client Events:
- `connected` - Connection established: `{"message": "Connected to NodeRAG WebSocket"}`
- `chat_created` - New chat created: `{"id": "chat_id", "title": "Chat Title", ...}`
- `message_added` - New message added: `{"id": "message_id", "chat_id": "chat_id", "role": "user|assistant", "content": "message", ...}`
- `status_update` - Status update: `{"chat_id": "chat_id", "status": "processing|completed|error", "message": "status message"}`
- `chat_messages` - Chat messages response: `{"chat_id": "chat_id", "messages": [...], "total": count}`
- `chat_stats` - Chat statistics: `{"total_chats": count, "total_messages": count, "average_messages_per_chat": avg}`
- `error` - Error message: `{"error": "error message"}`

## Complete Workflow Example

### 1. Upload a Document
```bash
curl -X POST https://your-app-name.railway.app/upload \
  -F "file=@document.pdf"
```

### 2. Wait for Processing
The upload endpoint will return when processing is complete:
```json
{
  "message": "Document uploaded and processed successfully",
  "filename": "document.pdf",
  "file_path": "./main_folder/input/document.pdf",
  "status": "completed"
}
```

### 3. Ask Questions
```bash
curl -X POST https://your-app-name.railway.app/answer \
  -H "Content-Type: application/json" \
  -d '{"question": "What are the main topics in this document?"}'
```

### 4. List Documents
```bash
curl -X GET https://your-app-name.railway.app/documents
```

### 5. Delete Documents (Optional)
```bash
curl -X DELETE https://your-app-name.railway.app/documents/document.pdf
```

### 6. Test CORS Support (Optional)
```bash
python test_cors.py https://your-app-name.railway.app
```

### 7. Test Chat System (Optional)
```bash
python test_chat_system.py https://your-app-name.railway.app
```

### 8. Test WebSocket Client (Optional)
Open `websocket_client_example.html` in a web browser and connect to your server URL to test real-time chat functionality.

## Important Notes

1. **Data Persistence**: Railway provides ephemeral storage. Your uploaded documents and processed data will be lost when the container restarts. Consider:
   - Using Railway's persistent storage
   - Storing data in a cloud database
   - Rebuilding the index on startup

2. **API Keys**: Never commit API keys to your repository. Use Railway's environment variables.

3. **Memory Usage**: NodeRAG can be memory-intensive, especially during document processing. Monitor your Railway usage and consider upgrading if needed.

4. **Processing Time**: Document upload and processing can take several minutes for large files. The upload endpoint will block until processing is complete.

5. **File Size Limits**: Maximum file size is 16MB. For larger documents, consider splitting them or using a different storage solution.

6. **Concurrent Uploads**: Only one upload/build process can run at a time. Multiple simultaneous uploads will queue.

7. **Cold Starts**: The first request after inactivity may be slow as the model loads.

8. **CORS Support**: The API now includes comprehensive CORS support to allow cross-origin requests from web browsers and other domains. This enables:
   - Frontend applications to communicate with the API
   - Browser-based tools to access the endpoints
   - Integration with web-based dashboards
   - Cross-domain API consumption

9. **Chat System**: The API now includes a complete chat system with:
   - Persistent chat storage using SQLite
   - Automatic chat ID generation for new conversations
   - Real-time WebSocket communication for live updates
   - Chat management (create, list, delete, update titles)
   - Message history and retrieval
   - Chat statistics and analytics

## Troubleshooting

### Common Issues

1. **Port Issues**: Railway automatically sets the `PORT` environment variable. The app reads this automatically.

2. **Import Errors**: Make sure all dependencies are in `requirements.txt`.

3. **Memory Issues**: If you get memory errors, consider:
   - Reducing batch sizes in config
   - Using smaller models
   - Upgrading Railway plan

4. **API Key Issues**: Ensure your OpenAI API key is set correctly in Railway environment variables.

5. **Upload Failures**: Check:
   - File size (max 16MB)
   - File format (only .txt, .pdf, .docx, .md)
   - Available memory on Railway

6. **CORS Issues**: If you encounter CORS errors:
   - The API now includes comprehensive CORS support
   - All endpoints allow cross-origin requests
   - CORS headers are automatically added to all responses
   - Preflight requests are handled automatically
   - If issues persist, check that `flask-cors` is properly installed

7. **Chat System Issues**: If you encounter chat system problems:
   - Ensure SQLite database is writable in the main_folder
   - Check that flask-socketio is properly installed
   - Verify WebSocket connections are working
   - Monitor chat storage database for corruption
   - Check chat statistics endpoint for system health

### Logs

Check Railway logs in the dashboard for detailed error information.

## Cost Optimization

1. **Auto-sleep**: Railway can sleep your app when not in use to save costs
2. **Resource limits**: Monitor CPU and memory usage
3. **Efficient queries**: Optimize your questions to reduce API calls
4. **Document management**: Delete unused documents to save storage

## Security Considerations

1. **API Key Protection**: Never expose API keys in client-side code
2. **Rate Limiting**: Consider implementing rate limiting for production use
3. **Input Validation**: Validate all user inputs
4. **HTTPS**: Railway provides HTTPS by default
5. **File Upload Security**: Only allowed file types are accepted

## Support

If you encounter issues:
1. Check Railway logs
2. Verify environment variables
3. Test locally first
4. Check the NodeRAG documentation
5. Review the API documentation in `API_DOCUMENTATION.md` 