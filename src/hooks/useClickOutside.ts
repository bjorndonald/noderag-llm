import { useEffect, useRef } from 'react';

/**
 * Custom hook to handle click-outside behavior
 * @param callback - Function to call when clicking outside
 * @returns ref object to attach to the element that should not trigger the callback
 */
export const useClickOutside = (callback: () => void) => {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    /**
     * Handle click events on the document
     * @param event - Click event
     */
    const handleClickOutside = (event: MouseEvent) => {
      if (ref.current && !ref.current.contains(event.target as Node)) {
        callback();
      }
    };

    // Add event listener for clicks
    document.addEventListener('mousedown', handleClickOutside);
    
    // Cleanup function to remove event listener
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [callback]);

  return ref;
}; 