"use client";
import React, { useState } from "react"
import ExpandIcon from "./ExpandIcon"
import AppLogo from "./AppLogo"
import LibraryIcon from "./LibraryIcon"
import EditIcon from "./EditIcon"
import SearchIcon from "./SearchIcon"
import ChatItem from "./ChatItem"
import Logo from "../atoms/logo";
import Link from "next/link";
import { SearchCheck, DotSquareIcon, MoreVertical, Trash, File, Text } from "lucide-react";
import DotMenu from "./DotMenu";
import useAppStore from "@/app/store";
import { useChats } from "../../hooks/useChats";
import { useParams } from "next/navigation";

const Sidebar = () => {
  const { isSidebarCollapsed, toggleSidebar } = useAppStore();
  const params = useParams();
  const currentChatId = params.id as string;
  
  // Chat management hook
  const { chats, isLoading: chatsLoading, error: chatsError, deleteChatById } = useChats();

  return (
    <div style={{
      width: isSidebarCollapsed ? 'calc(0.25rem * 13)' : '260px',
    }} className="border-divider h-screen fixed top-0 left-0 bg-toolbar py-2.5 px-2 transition-all duration-300 z-21 h-full shrink-0 overflow-hidden border-e max-md:hidden dark:border-[#00000030]">
      <div className="flex mb-4 w-full group h-[52px] items-center relative">
        <Link className={`w-9 h-9 ${isSidebarCollapsed ? 'group-hover:opacity-0 opacity-100' : ''} flex items-center justify-center rounded-3 absolute top-0 left-0 hover:bg-toolbar-highlight transition-all duration-300`} href="/">
          <Logo />
        </Link>
        <a onClick={(e) => {
          e.preventDefault();
          toggleSidebar()
        }} className={`w-9 h-9 bg-toolbar ${isSidebarCollapsed ? 'group-hover:opacity-100 opacity-0' : ''} flex items-center justify-center absolute z-10 top-0 right-0 rounded-3 hover:bg-toolbar-highlight transition-all duration-300`}>
          <ExpandIcon />
        </a>
      </div>

      <div className={`flex flex-col `}>
        <Link href="/" className="mb-1 group no-underline relative cursor-pointer flex items-center justify-between gap-2 py-1.5 pr-1.5 rounded-2 hover:bg-toolbar-highlight transition-all duration-300">
          <div className="flex items-center">
              <div className={`w-9 h-9 ${isSidebarCollapsed ? 'group-hover:opacity-0 opacity-100' : ''} flex items-center justify-center rounded-3 hover:bg-toolbar-highlight transition-all duration-300 `}>
            <EditIcon />
            </div>
            
            <span className={`${isSidebarCollapsed ? 'hidden' : 'text-secondary-txt'}`}>New Chat</span>
          </div>

          <span className={`${isSidebarCollapsed ?'hidden':''} opacity-0 decoration-transparent !no-underline group-hover:opacity-100 transition-all duration-300 text-tertiary-txt text-xs`}>
            Ctrl+Shift+O
          </span>
        </Link>

        <Link href="/files" className=" mb-1 no-underline group relative cursor-pointer flex items-center justify-between gap-2 py-1.5 pr-1.5 rounded-2 hover:bg-toolbar-highlight transition-all duration-300">
          <div className="flex items-center">
            <div className={`w-9 h-9 ${isSidebarCollapsed ? 'group-hover:opacity-0 opacity-100' : ''} flex items-center justify-center rounded-3 hover:bg-toolbar-highlight transition-all duration-300`}>
            <Text />
            </div>
            
            <span className={`${isSidebarCollapsed ? 'hidden' : 'text-secondary-txt'}`}>Files</span>
          </div>

          <span className={`${isSidebarCollapsed ?'hidden':''} 'opacity-0 decoration-transparent !no-underline opacity-0 group-hover:opacity-100 transition-all duration-300 text-tertiary-txt text-xs`}>
            Ctrl+K
          </span>
        </Link>

        <Link href="/visualize" className=" mb-1 no-underline group relative cursor-pointer flex items-center justify-between gap-2 py-1.5 pr-1.5 rounded-2 hover:bg-toolbar-highlight transition-all duration-300">
          <div className="flex items-center">
            <div className={`w-9 h-9 ${isSidebarCollapsed ? 'group-hover:opacity-0 opacity-100' : ''} flex items-center justify-center rounded-3 hover:bg-toolbar-highlight transition-all duration-300 `}>
            <LibraryIcon />
            </div>
            
            <span className={`${isSidebarCollapsed ? 'hidden' : 'text-secondary-txt'}`}>Visualization</span>
          </div>
        </Link>
      </div>

      <div className={`flex flex-col mt-5 gap-1  ${isSidebarCollapsed ? 'hidden' : ''}`}>
        <span className="text-tertiary-txt mx-1.5 mb-0.5 text-xs font-medium">
          Chats
        </span>
        <div className="flex h-[calc(100vh-312px)] no-scrollbar overflow-y-auto flex-col gap-1">
        {/* Loading state for chats */}
        {chatsLoading && (
          <div className="flex items-center justify-center py-4">
            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600"></div>
            <span className="text-tertiary-txt text-xs ml-2">Loading chats...</span>
          </div>
        )}

        {/* Error state for chats */}
        {chatsError && (
          <div className="text-red-500 text-xs px-1.5 py-2">
            {chatsError}
          </div>
        )}

        {/* Chat items */}
        {!chatsLoading && chats.length === 0 && (
          <div className="text-tertiary-txt text-xs px-1.5 py-2">
            No chats yet. Start a new conversation!
          </div>
        )}

        {!chatsLoading && chats.map((chat) => (
          <ChatItem
            key={chat.id}
            chat={chat}
            isActive={chat.id === currentChatId}
            onDelete={deleteChatById}
            />
          ))}
        </div>
      </div>
    </div>
  )
}

export default Sidebar