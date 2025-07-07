import React from "react";

const Modal = ({ children }: { children: React.ReactNode }) => {
    return (
        <div className="absolute inset-0" data-testid="modal-sharing" data-ignore-for-page-load="true">
            <div data-state="open" className="fixed inset-0 z-50 before:starting:backdrop-blur-0 before:absolute before:inset-0 before:bg-gray-200/50 before:backdrop-blur-[1px] before:transition before:duration-250 dark:before:bg-black/50 before:starting:opacity-0" style={{ pointerEvents: "auto" }}>
                <div className="z-50 h-full w-full overflow-y-auto grid grid-cols-[10px_1fr_10px] grid-rows-[minmax(10px,1fr)_auto_minmax(10px,1fr)] md:grid-rows-[minmax(20px,0.8fr)_auto_minmax(20px,1fr)]">
                    <div className="col-start-2 row-start-2">
                        <div className="relative h-full w-full">
                            <div className="absolute inset-0">
                                {children}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Modal