import { Archive, Edit, Share, Trash, Upload } from "lucide-react";
import React from "react";

const ToolsMenu = () => {
  return (
    <div className="flex gap-1 border-divider border flex-col w-[130px] bg-background rounded-2 p-1.5">
       
        <div className="flex text-sm text-secondary-txt items-center gap-2 py-2.5 px-1.5 rounded-2 hover:bg-toolbar-highlight transition-all duration-300">
            <Archive size={14} /> Archive
        </div>
        <div className="flex text-sm text-secondary-txt items-center gap-2 py-2.5 px-1.5 rounded-2 hover:bg-toolbar-highlight transition-all duration-300">
            <Trash size={14} /> Delete
        </div>
    </div>
  )
}

 export default ToolsMenu;