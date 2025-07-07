import { create } from "zustand";


export interface AppStore {
    isSidebarCollapsed: boolean;
    toggleSidebar: () => void;
}

export interface IUploadedFile {
    id: string;
    file: File;
    name: string;
    size: number;
}

const useAppStore = create<AppStore>((set) => ({
    isSidebarCollapsed: false,
    toggleSidebar: () => set((state) => ({ isSidebarCollapsed: !state.isSidebarCollapsed })),
}))

export default useAppStore; 