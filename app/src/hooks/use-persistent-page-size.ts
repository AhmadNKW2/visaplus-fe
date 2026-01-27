import { useState, useEffect } from 'react';

/**
 * Hook to persist page size in localStorage
 * @param key Unique key for localStorage
 * @param initialSize Default page size (default: 10)
 */
export function usePersistentPageSize(key: string, initialSize: number = 10) {
    const [pageSize, setPageSize] = useState(initialSize);
    const [isInitialized, setIsInitialized] = useState(false);

    // Load from local storage on mount
    useEffect(() => {
        if (typeof window !== 'undefined') {
            const stored = localStorage.getItem(key);
            if (stored) {
                const parsed = Number(stored);
                if (!isNaN(parsed) && parsed > 0) {
                    setPageSize(parsed);
                }
            }
        }
        setIsInitialized(true);
    }, [key]);

    // Wrapper to update state and storage
    const handlePageSizeChange = (size: number) => {
        setPageSize(size);
        if (typeof window !== 'undefined') {
            localStorage.setItem(key, String(size));
        }
    };

    return { 
        pageSize, 
        setPageSize: handlePageSizeChange,
        isInitialized 
    };
}
