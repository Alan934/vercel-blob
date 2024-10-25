// deleteButton.tsx
import React from "react";

interface DeleteButtonProps {
    url: string;
    onBlobChange: () => void; // Incluye esta propiedad
}

export const DeleteButton: React.FC<DeleteButtonProps> = ({ url, onBlobChange }) => {
    const handleDelete = async () => {
        try {
            const response = await fetch(url, {
                method: 'DELETE', // Método HTTP para eliminar
                headers: {
                    'Authorization': `Bearer ${process.env.NEXT_PUBLIC_BLOB_READ_WRITE_TOKEN}`, // Asegúrate de que el token esté correcto
                },
            });

            if (!response.ok) {
                throw new Error(`Error al eliminar el blob: ${response.statusText}`);
            }

            onBlobChange(); // Llama a la función para actualizar la lista de blobs
        } catch (error) {
            console.error("Error deleting blob:", error);
            // Aquí puedes manejar el error si lo deseas
        }
    };

    return (
        <button onClick={handleDelete} className="bg-red-500 text-white px-2 py-1 rounded">
            Delete
        </button>
    );
};
