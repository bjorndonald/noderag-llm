import React from 'react';
import Link from 'next/link';
import { Trash } from 'lucide-react';
import type { Chat } from '../../hooks/useChats';

interface ChatItemProps {
  chat: Chat;
  isActive?: boolean;
  onDelete?: (chatId: string) => void;
  isDeleting?: boolean;
}

/**
 * Chat item component for displaying individual chats in the sidebar
 */
const ChatItem: React.FC<ChatItemProps> = ({ 
  chat, 
  isActive = false, 
  onDelete, 
  isDeleting = false 
}) => {
  const handleDelete = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (onDelete && !isDeleting) {
      onDelete(chat.id);
    }
  };

  return (
    <Link 
      href={`/chat/${chat.id}`}
      className={`group relative cursor-pointer flex items-center justify-between gap-2 py-2.5 px-1.5 rounded-2 hover:bg-toolbar-highlight transition-all duration-300 ${
        isActive ? 'bg-toolbar-highlight' : ''
      }`}
    >
      <div className="flex min-w-0 grow items-center gap-2.5">
        <div className="truncate">
          <span className="text-secondary-txt" dir="auto">
            {chat.title || 'Untitled Chat'}
          </span>
        </div>
      </div>
      
      {onDelete && (
        <button
          onClick={handleDelete}
          disabled={isDeleting}
          className="flex cursor-pointer items-center justify-center rounded-3 hover:bg-toolbar-highlight transition-all duration-300 opacity-0 group-hover:opacity-100"
          aria-label="Delete chat"
        >
          {isDeleting ? (
            <div className="animate-spin rounded-full h-3.5 w-3.5 border-b-2 border-red-500"></div>
          ) : (
            <Trash className="text-secondary-txt" size={14} />
          )}
        </button>
      )}
    </Link>
  );
};

export default ChatItem;