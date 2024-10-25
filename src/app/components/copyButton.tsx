"use client";
import { useState } from "react";

export function CopyButton({ url }: { url: string }) {
    const [isLoading, setIsLoading] = useState(false);

    const handleClick = async () => {
        setIsLoading(true);
        try {
            await navigator.clipboard.writeText(url);
            //alert("URL copiada al portapapeles!");
        } catch (error) {
            console.error("Error al copiar la URL:", error);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <button 
            onClick={handleClick} 
            className="bg-green-500 text-white p-2 w-full rounded hover:bg-green-600"
            disabled={isLoading}
        >
            {isLoading ? 'Copying...' : 'Copy URL'}
        </button>
    );
}
