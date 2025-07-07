import { ArrowDown, ChevronDown, MoreVertical, Share } from 'lucide-react';
import Image from 'next/image';
import React from 'react';
import DotMenu from './DotMenu';

/**
 * Header component for the top of the page.
 * Displays the app title and a placeholder for user/profile actions.
 */
const Header: React.FC = () => {
  return (
    <header id="page-header" className="draggable border-divider border-b no-draggable-children sticky top-0 p-2 touch:p-2.5 flex items-center justify-between z-20 h-[52px] bg-token-main-surface-primary pointer-events-none select-none [view-transition-name:var(--vt-page-header)] *:pointer-events-auto motion-safe:transition max-md:hidden @[84rem]/thread:absolute @[84rem]/thread:start-0 @[84rem]/thread:end-0 @[84rem]/thread:shadow-none! @[84rem]/thread:bg-transparent [box-shadow:var(--sharp-edge-top-shadow-placeholder)]">
      <div className="flex py-2.5 px-1.5 rounded-2 items-center gap-1 cursor-pointer">
        <h4 className="text-secondary-txt">GPT-4</h4>
        <ChevronDown className="text-secondary-txt" size={14} />
      </div>
      
      <div className="flex items-center gap-2">
        <div className="flex items-center gap-1 cursor-pointer hover:bg-toolbar-highlight transition-all duration-300 rounded-2 py-1.5 px-1.5">
          <Share className="text-secondary-txt" size={14} />
          <span className="text-secondary-txt">Share</span>
        </div>

        <input type="checkbox" name="dot-menu" id="dot-menu" className="peer cursor-pointer z-10 opacity-0 w-4 h-full h-3.5 absolute top-1/2 -translate-y-1/2 right-[130px]" />
        <label htmlFor="dot-menu" className="flex relative items-center gap-1 cursor-pointer hover:bg-toolbar-highlight transition-all duration-300 rounded-2 py-1.5 px-1.5 z-10">
          <MoreVertical className="text-secondary-txt" size={14} />
        </label>
        
        <div className="fixed top-[52px] right-4 w-fit bg-background rounded-2 peer-checked:block hidden">
          <DotMenu />
        </div>
       

        <div className="flex items-center gap-1 cursor-pointer hover:bg-toolbar-highlight transition-all duration-300 rounded-2 py-1.5 px-1.5">
          Back to home
        </div>
      </div>
    </header>
  );
};

export default Header; 