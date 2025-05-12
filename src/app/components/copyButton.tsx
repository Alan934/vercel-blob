"use client";
import { useState, useEffect } from "react";

export function CopyButton({ url }: { url: string }) {
    const [isCopied, setIsCopied] = useState(false);
    const [isLoading, setIsLoading] = useState(false); // Kept for the "Copying..." state if needed during a slow clipboard op

    const handleClick = async () => {
        setIsLoading(true);
        try {
            await navigator.clipboard.writeText(url);
            setIsCopied(true);
        } catch (error) {
            console.error("Error copying URL:", error);
            // TODO: Show user-facing error message
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        if (isCopied) {
            const timer = setTimeout(() => {
                setIsCopied(false);
            }, 2000); // Reset "Copied!" text after 2 seconds
            return () => clearTimeout(timer);
        }
    }, [isCopied]);

    return (
        <button  
            onClick={handleClick}  
            className="w-full px-4 py-2.5 text-sm font-medium text-white bg-emerald-600 hover:bg-emerald-700 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-emerald-500 focus:ring-offset-slate-800 disabled:opacity-60 disabled:cursor-not-allowed transition-all duration-200 flex items-center justify-center"
            disabled={isLoading || isCopied} // Disable while copying or after copied for a moment
        >
            {isCopied ? (
                <>
                    {/* Optional: Checkmark Icon */}
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5 mr-2">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75 11.25 15 15 9.75M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
                    </svg>
                    Copied!
                </>
            ) : isLoading ? (
                <>
                     <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Copying...
                </>
            ) : (
                 <>
                    {/* Optional: Copy Icon */}
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5 mr-2">
                     <path strokeLinecap="round" strokeLinejoin="round" d="M15.666 3.888A2.25 2.25 0 0 0 13.5 2.25h-3c-1.03 0-1.9.693-2.166 1.638m7.332 0c.055.194.084.4.084.612v0a.75.75 0 0 1-.75.75H9a.75.75 0 0 1-.75-.75v0c0-.212.03-.418.084-.612m7.332 0c.646.049 1.288.11 1.927.184 1.1.128 1.907 1.077 1.907 2.185V19.5a2.25 2.25 0 0 1-2.25 2.25H6.75A2.25 2.25 0 0 1 4.5 19.5V6.257c0-1.108.806-2.057 1.907-2.185a48.208 48.208 0 0 1 1.927-.184" />
                    </svg>
                    Copy URL
                 </>
            )}
        </button>
    );
}