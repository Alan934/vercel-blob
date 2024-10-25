"use client";

import { list } from "@vercel/blob";
import React, { useEffect, useState } from "react";
import { DeleteButton } from "../components/deleteButton";
import { CopyButton } from "../components/copyButton";

interface Blob {
    url: string;
    pathname: string;
}

export default function AllFilesPage() {
    const [blobs, setBlobs] = useState<Blob[]>([]);
    const [error, setError] = useState<string | null>(null); // Manejo de errores

    const fetchBlobs = async () => {
        try {
            const response = await list({
                token: process.env.NEXT_PUBLIC_BLOB_READ_WRITE_TOKEN, // Asegúrate de que la variable de entorno esté disponible aquí
            });
            console.log("Blobs response:", response); // Log para depuración
            if (response && response.blobs) {
                setBlobs(response.blobs as Blob[]);
                setError(null); // Restablece el error
            } else {
                setError("No blobs found.");
            }
        } catch (err) {
            console.error("Error fetching blobs:", err);
            if (err instanceof Error) {
                setError(err.message); // Muestra el mensaje de error detallado
            } else {
                setError("Unknown error occurred.");
            }
        }
    };

    useEffect(() => {
        fetchBlobs(); // Cargar blobs al montar el componente
    }, []);

    const handleBlobChange = () => {
        fetchBlobs(); // Función para actualizar la lista de blobs
    };

    return (
        <div>
            <h1 className="text-2xl font-bold mb-4 text-center">Files</h1>
            {error && <div className="text-red-500">{error}</div>} {/* Mostrar error */}
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4 justify-items-center">
                {blobs.length > 0 ? (
                    blobs.map((blob, i) => (
                        <div
                            key={blob.pathname + i}
                            className="flex flex-col items-center bg-gray-900 p-4 rounded shadow-md"
                        >
                            <a href={blob.url} target="_blank" rel="noopener noreferrer">
                                <img 
                                    src={`${blob.url}?timestamp=${new Date().getTime()}`} 
                                    alt={blob.pathname} 
                                    width={150} 
                                    height={150} 
                                    className="rounded mb-2" 
                                />
                            </a>
                            <div className="flex space-x-2">
                                <CopyButton url={blob.url} />
                                <DeleteButton url={blob.url} onBlobChange={handleBlobChange} />
                            </div>
                        </div>
                    ))
                ) : (
                    <div>No Files</div>
                )}
            </div>
        </div>
    );
}
