"use client";
import React, { useEffect, useState } from "react";
import { DeleteButton } from "../components/deleteButton";
import { CopyButton } from "../components/copyButton";

interface Blob {
    url: string;
    pathname: string;
}

export default function AllFilesPage() {
    const [blobs, setBlobs] = useState<Blob[]>([]);
    const [error, setError] = useState<string | null>(null);

    const fetchBlobs = async () => {
        try {
            const response = await fetch("/api/getBlobs");
            if (!response.ok) throw new Error("Error al obtener archivos");

            const data = await response.json();
            setBlobs(data.blobs || []);
            setError(null);
        } catch (err) {
            console.error("Error al obtener archivos:", err);
            setError(err instanceof Error ? err.message : "Ocurrió un error desconocido");
        }
    };

    useEffect(() => {
        fetchBlobs();
    }, []);

    return (
        <div>
            <h1 className="text-2xl font-bold mb-4 text-center">Archivos</h1>
            <div className="mt-4 text-center">
                <button
                    onClick={fetchBlobs}
                    className="bg-blue-500 text-white mx-4 px-4 py-2 rounded hover:bg-blue-600"
                >
                    Refrescar archivos
                </button>
            </div>
            {error && <div className="text-red-500">{error}</div>}
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
                                <DeleteButton url={blob.url} onBlobChange={fetchBlobs} />
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
