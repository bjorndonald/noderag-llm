"use client"

import { useState, useRef, useEffect } from "react"
import Link from "next/link"
import { Button } from "@/components/atoms/button"
import { Icon } from "@/components/atoms/icon"
import { Main } from "@/components/atoms/main"
import { Section } from "@/components/atoms/section"
import UploadModal from "@/components/ui/noderag/upload-modal"

// Types for the chat interface
interface Message {
  id: string
  content: string
  role: 'user' | 'assistant'
  timestamp: Date
}

interface Document {
  filename: string
  size: number
  type: string
}

// Graph visualization types
interface GraphNode {
  id: string
  label: string
  title: string
  color: string
  size: number
  type: string
  weight: number
}

interface GraphEdge {
  from: string
  to: string
  id: string
}

interface GraphData {
  nodes: GraphNode[]
  edges: GraphEdge[]
  metadata: {
    total_nodes: number
    total_edges: number
    requested_nodes: number
    graph_type: string
  }
}

// NodeRAG API configuration - replace with your actual API URL
const NODERAG_API_BASE = 'https://noderag-chat-production.up.railway.app'

// Icon paths for the interface
const ICONS = {
  arrowLeft: "M19 12H5M12 19l-7-7 7-7",
  upload: "M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4M17 8l-5-5-5 5M12 3v12",
  trash: "M3 6h18M8 6V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2m3 0v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6h14z",
  messageCircle: "M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z",
  send: "M22 2L11 13M22 2l-7 20-4-9-9-4 20-7z",
  network: "M8 3H5a2 2 0 0 0-2 2v3m18 0V5a2 2 0 0 0-2-2h-3m0 18h3a2 2 0 0 0 2-2v-3M3 16v3a2 2 0 0 0 2 2h3",
  eye: "M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8zM12 9a3 3 0 1 0 0 6 3 3 0 0 0 0-6z",
  refresh: "M1 4v6h6M23 20v-6h-6M20.49 9A9 9 0 0 0 5.64 5.64L1 10m22 4l-4.64 4.36A9 9 0 0 1 3.51 15"
}

export default function NodeRAGChatPage() {
  // State management for chat functionality
  const [messages, setMessages] = useState<Message[]>([])
  const [inputValue, setInputValue] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [documents, setDocuments] = useState<Document[]>([])
  
  // Upload modal state
  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false)
  
  // Graph visualization state
  const [graphData, setGraphData] = useState<GraphData | null>(null)
  const [loadingGraph, setLoadingGraph] = useState(false)
  const [showGraph, setShowGraph] = useState(false)
  const [nodeCount, setNodeCount] = useState(1000)
  const [graphError, setGraphError] = useState<string>('')
  
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const graphContainerRef = useRef<HTMLDivElement>(null)

  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  // Load existing documents on component mount
  useEffect(() => {
    fetchDocuments()
  }, [])

  /**
   * Fetches the list of uploaded documents from the NodeRAG API
   */
  const fetchDocuments = async () => {
    try {
      const response = await fetch(`${NODERAG_API_BASE}/documents`)
      if (response.ok) {
        const data = await response.json()
        setDocuments(data.documents || [])
      }
    } catch (error) {
      console.error('Error fetching documents:', error)
    }
  }

  /**
   * Fetches graph visualization data from the NodeRAG API
   * @param nodes - Number of nodes to include in the visualization
   */
  const fetchGraphData = async (nodes: number = 1000) => {
    setLoadingGraph(true)
    setGraphError('')
    
    try {
      const response = await fetch(`${NODERAG_API_BASE}/graph?nodes=${nodes}`)
      const data = await response.json()
      
      if (response.ok) {
        setGraphData(data)
        setShowGraph(true)
      } else {
        setGraphError(data.error || 'Failed to load graph data')
      }
    } catch (error) {
      setGraphError('Network error: Unable to connect to NodeRAG API')
      console.error('Graph fetch error:', error)
    } finally {
      setLoadingGraph(false)
    }
  }

  /**
   * Handles successful file upload
   * @param filename - The uploaded filename
   */
  const handleUploadSuccess = (filename: string) => {
    // Add a system message about the upload
    const uploadMessage: Message = {
      id: Date.now().toString(),
      content: `📄 Document "${filename}" has been uploaded and processed. You can now ask questions about it!`,
      role: 'assistant',
      timestamp: new Date(),
    }
    setMessages((prev: Message[]) => [...prev, uploadMessage])
  }

  /**
   * Sends a message to the NodeRAG API and handles the response
   * @param content - The message content to send
   */
  const sendMessage = async (content: string) => {
    if (!content.trim() || isLoading) return

    // Add user message to chat
    const userMessage: Message = {
      id: Date.now().toString(),
      content: content.trim(),
      role: 'user',
      timestamp: new Date(),
    }
    setMessages((prev: Message[]) => [...prev, userMessage])
    setInputValue('')
    setIsLoading(true)

    try {
      const response = await fetch(`${NODERAG_API_BASE}/answer`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ question: content.trim() }),
      })

      if (response.ok) {
        const data = await response.json()
        const assistantMessage: Message = {
          id: (Date.now() + 1).toString(),
          content: data.answer,
          role: 'assistant',
          timestamp: new Date(),
        }
        setMessages((prev: Message[]) => [...prev, assistantMessage])
      } else {
        const errorData = await response.json()
        const errorMessage: Message = {
          id: (Date.now() + 1).toString(),
          content: `❌ Error: ${errorData.error || 'Failed to get response'}`,
          role: 'assistant',
          timestamp: new Date(),
        }
        setMessages((prev: Message[]) => [...prev, errorMessage])
      }
    } catch (error) {
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        content: '❌ Network error: Unable to connect to NodeRAG API',
        role: 'assistant',
        timestamp: new Date(),
      }
      setMessages((prev: Message[]) => [...prev, errorMessage])
    } finally {
      setIsLoading(false)
    }
  }

  /**
   * Handles form submission for sending messages
   * @param e - Form submission event
   */
  const handleSubmit = (e: any) => {
    e.preventDefault()
    sendMessage(inputValue)
  }

  /**
   * Renders a simple graph visualization using SVG
   * This is a basic implementation - for production, consider using libraries like vis.js or D3.js
   */
  const renderGraph = () => {
    if (!graphData || !graphContainerRef.current) return null

    const container = graphContainerRef.current
    const width = container.clientWidth
    const height = 600

    // Simple force-directed layout simulation
    const nodes = graphData.nodes.slice(0, Math.min(50, graphData.nodes.length)) // Limit for performance
    const edges = graphData.edges.filter(edge => 
      nodes.some(node => node.id === edge.from) && 
      nodes.some(node => node.id === edge.to)
    )

    return (
      <div className="w-full h-[600px] bg-slate-50 dark:bg-slate-900 rounded-lg border border-slate-200 dark:border-slate-700 overflow-hidden">
        <div className="p-4 border-b border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold text-slate-900 dark:text-white">
              Knowledge Graph Visualization
            </h3>
            <div className="flex items-center gap-2">
              <span className="text-sm text-slate-600 dark:text-slate-400">
                {graphData.metadata.requested_nodes} nodes, {graphData.metadata.total_edges} edges
              </span>
              <Button
                title="Refresh Graph"
                onClick={() => fetchGraphData(nodeCount)}
                className="px-3 py-1 text-xs"
              >
                <Icon path={ICONS.refresh} className="w-3 h-3" />
              </Button>
            </div>
          </div>
        </div>
        
        <div className="p-4 text-center text-slate-600 dark:text-slate-400">
          <Icon path={ICONS.network} className="w-16 h-16 mx-auto mb-4 opacity-50" />
          <p className="text-lg font-medium mb-2">Graph Visualization</p>
          <p className="text-sm mb-4">
            This is a preview of the knowledge graph. For full interactive visualization, 
            consider integrating with libraries like vis.js, D3.js, or Cytoscape.js.
          </p>
          
          <div className="grid grid-cols-2 md:grid-cols-5 gap-4 text-xs">
            {graphData.nodes.slice(0, 5).map((node) => (
              <div key={node.id} className="p-2 bg-white dark:bg-slate-800 rounded border">
                <div className="font-medium truncate">{node.type}</div>
                <div className="text-slate-500 truncate">{node.label}</div>
              </div>
            ))}
          </div>
          
          <div className="mt-4 text-xs text-slate-500">
            Showing {nodes.length} of {graphData.metadata.total_nodes} nodes for performance
          </div>
        </div>
      </div>
    )
  }

  return (
    <Main>
      <Section className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800">
        <div className="container mx-auto px-4 py-8 max-w-7xl">
          {/* Header */}
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold text-slate-900 dark:text-white mb-4">
              NodeRAG Chat & Graph
            </h1>
            <p className="text-lg text-slate-600 dark:text-slate-300 max-w-2xl mx-auto">
              Upload documents, chat with your data, and visualize the knowledge graph using AI-powered retrieval and generation.
            </p>
            <Link 
              href="/node-rag"
              className="inline-flex items-center gap-2 text-blue-600 dark:text-blue-400 hover:underline mt-4"
            >
              <Icon path={ICONS.arrowLeft} className="w-4 h-4" />
              Back to NodeRAG Documentation
            </Link>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 h-[calc(100vh-200px)]">
            {/* Sidebar - Graph Controls */}
            <div className="lg:col-span-1 bg-white dark:bg-slate-800 rounded-lg shadow-lg p-6">
              <h2 className="text-xl font-semibold text-slate-900 dark:text-white mb-4">
                Graph Visualization
              </h2>

              {/* Graph Controls */}
              <div className="mb-6 p-4 bg-slate-50 dark:bg-slate-700 rounded-lg">
                <h3 className="text-sm font-semibold text-slate-900 dark:text-white mb-3">
                  Knowledge Graph
                </h3>
                <div className="space-y-3">
                  <div>
                    <label className="block text-xs text-slate-600 dark:text-slate-400 mb-1">
                      Node Count
                    </label>
                    <select
                      value={nodeCount}
                      onChange={(e) => setNodeCount(Number(e.target.value))}
                      className="w-full px-2 py-1 text-sm border border-slate-300 dark:border-slate-600 rounded bg-white dark:bg-slate-700 text-slate-900 dark:text-white"
                    >
                      <option value={500}>500 nodes</option>
                      <option value={1000}>1000 nodes</option>
                      <option value={2000}>2000 nodes</option>
                      <option value={5000}>5000 nodes (max)</option>
                    </select>
                  </div>
                  <Button
                    title="Load Graph"
                    onClick={() => fetchGraphData(nodeCount)}
                    disabled={loadingGraph}
                    className="w-full"
                  >
                    <Icon path={ICONS.eye} className="w-4 h-4 mr-2" />
                    {loadingGraph ? 'Loading...' : 'Load Graph'}
                  </Button>
                </div>
              </div>

              {/* Document Count */}
              <div className="p-4 bg-slate-50 dark:bg-slate-700 rounded-lg">
                <h3 className="text-sm font-semibold text-slate-900 dark:text-white mb-2">
                  Documents ({documents.length})
                </h3>
                {documents.length === 0 ? (
                  <p className="text-sm text-slate-500 dark:text-slate-400">
                    No documents uploaded yet
                  </p>
                ) : (
                  <div className="space-y-2">
                    {documents.slice(0, 3).map((doc) => (
                      <div key={doc.filename} className="text-xs text-slate-600 dark:text-slate-400 truncate">
                        📄 {doc.filename}
                      </div>
                    ))}
                    {documents.length > 3 && (
                      <p className="text-xs text-slate-500 dark:text-slate-400">
                        +{documents.length - 3} more documents
                      </p>
                    )}
                  </div>
                )}
              </div>
            </div>

            {/* Main Content Area */}
            <div className="lg:col-span-3 space-y-6">
              {/* Graph Visualization */}
              {showGraph && (
                <div className="bg-white dark:bg-slate-800 rounded-lg shadow-lg">
                  {loadingGraph ? (
                    <div className="p-8 text-center">
                      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
                      <p className="text-slate-600 dark:text-slate-400">Loading graph data...</p>
                    </div>
                  ) : graphError ? (
                    <div className="p-8 text-center">
                      <p className="text-red-600 dark:text-red-400 mb-4">{graphError}</p>
                      <Button
                        title="Try Again"
                        onClick={() => fetchGraphData(nodeCount)}
                        className="px-4"
                      >
                        Try Again
                      </Button>
                    </div>
                  ) : (
                    <div ref={graphContainerRef}>
                      {renderGraph()}
                    </div>
                  )}
                </div>
              )}

              {/* Chat Interface */}
              <div className="bg-white dark:bg-slate-800 rounded-lg shadow-lg flex flex-col h-[500px]">
                {/* Messages Area */}
                <div className="flex-1 overflow-y-auto p-6 space-y-4">
                  {messages.length === 0 ? (
                    <div className="text-center text-slate-500 dark:text-slate-400 mt-8">
                      <Icon path={ICONS.messageCircle} className="w-12 h-12 mx-auto mb-4 opacity-50" />
                      <p className="text-lg font-medium mb-2">Start a conversation</p>
                      <p className="text-sm">
                        Upload a document and ask questions about it!
                      </p>
                    </div>
                  ) : (
                    messages.map((message) => (
                      <div
                        key={message.id}
                        className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
                      >
                        <div
                          className={`max-w-[80%] rounded-lg px-4 py-3 ${
                            message.role === 'user'
                              ? 'bg-blue-600 text-white'
                              : 'bg-slate-100 dark:bg-slate-700 text-slate-900 dark:text-white'
                          }`}
                        >
                          <p className="whitespace-pre-wrap">{message.content}</p>
                          <p className="text-xs opacity-70 mt-2">
                            {message.timestamp.toLocaleTimeString()}
                          </p>
                        </div>
                      </div>
                    ))
                  )}
                  
                  {/* Loading indicator */}
                  {isLoading && (
                    <div className="flex justify-start">
                      <div className="bg-slate-100 dark:bg-slate-700 rounded-lg px-4 py-3">
                        <div className="flex items-center space-x-2">
                          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600"></div>
                          <span className="text-slate-600 dark:text-slate-300">Thinking...</span>
                        </div>
                      </div>
                    </div>
                  )}
                  
                  <div ref={messagesEndRef} />
                </div>

                {/* Input Area */}
                <div className="border-t border-slate-200 dark:border-slate-700 p-4">
                  <form onSubmit={handleSubmit} className="flex gap-2">
                    <input
                      type="text"
                      value={inputValue}
                      onChange={(e) => setInputValue(e.target.value)}
                      placeholder="Ask a question about your documents..."
                      disabled={isLoading}
                      className="flex-1 px-4 py-2 border border-slate-300 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-slate-700 text-slate-900 dark:text-white placeholder-slate-500 dark:placeholder-slate-400"
                    />
                    <Button
                      title="Upload Documents"
                      onClick={() => setIsUploadModalOpen(true)}
                      className="px-3"
                    >
                      <Icon path={ICONS.upload} className="w-4 h-4" />
                    </Button>
                    <Button
                      title="Send Message"
                      type="submit"
                      disabled={isLoading || !inputValue.trim()}
                      className="px-6"
                    >
                      <Icon path={ICONS.send} className="w-4 h-4" />
                    </Button>
                  </form>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Upload Modal */}
        <UploadModal
          isOpen={isUploadModalOpen}
          onClose={() => setIsUploadModalOpen(false)}
          onUploadSuccess={handleUploadSuccess}
          onDocumentsChange={setDocuments}
          apiBaseUrl={NODERAG_API_BASE}
        />
      </Section>
    </Main>
  )
}
