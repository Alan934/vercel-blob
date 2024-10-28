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
            setIsLoading(false);
            router.refresh();
        } catch (error) {
            console.error('Error deleting file:', error);
            setIsLoading(false);
        }
    };

    return (
        <button onClick={handleClick} className="bg-red-500 text-white p-2 rounded hover:bg-red-600" disabled={isLoading}>
            {isLoading ? 'Deleting...' : 'Delete'}
        </button>
    );
}
