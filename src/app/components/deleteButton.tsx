"use client";
import { useRouter } from "next/navigation";
import { useState } from "react";

interface DeleteButtonProps {
    url: string;
    onBlobChange: () => Promise<void>;
}

export function DeleteButton({ url, onBlobChange }: DeleteButtonProps) {
    const [isLoading, setIsLoading] = useState(false);
    const router = useRouter();

    const handleClick = async () => {
        // Optional: Add a confirmation dialog for a better UX
        // if (!confirm("Are you sure you want to delete this file?")) {
        //     return;
        // }

        setIsLoading(true);
        try {
            const response = await fetch('/api/file/' + encodeURIComponent(url), {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json',
                },
            });

            if (!response.ok) {
                throw new Error('Failed to delete file.');
            }

            await onBlobChange();
            // No need to set isLoading to false here if router.refresh() will unmount or re-render significantly
            router.refresh(); 
        } catch (error) {
            console.error('Error deleting file:', error);
            // TODO: Show user-facing error message
            setIsLoading(false); // Ensure loading is false on error
        }
        // setIsLoading(false); // Moved into try/catch/finally if preferred
    };

    return (
        <button 
            onClick={handleClick} 
            className="px-4 py-2 text-sm font-medium text-white bg-red-600 hover:bg-red-700 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 focus:ring-offset-slate-800 disabled:opacity-60 disabled:cursor-not-allowed transition duration-200 flex items-center justify-center"
            disabled={isLoading}
        >
            {isLoading ? (
                <>
                    <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Deleting...
                </>
            ) : (
                'Delete' // Optional: Add a trash icon here
            )}
        </button>
    );
}