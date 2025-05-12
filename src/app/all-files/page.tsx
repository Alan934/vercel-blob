"use client";
import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { DeleteButton } from "../components/deleteButton"; // Asegúrate que esta ruta es correcta
import { CopyButton } from "../components/copyButton";   // Asegúrate que esta ruta es correcta

interface Blob {
    url: string;
    pathname: string;
    // Podrías añadir más campos si tu API los devuelve, ej: uploadedAt, size, contentType
}

export default function AllFilesPage() {
    const [blobs, setBlobs] = useState<Blob[]>([]);
    const [error, setError] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(true); // Estado para la carga inicial
    const router = useRouter();

    const fetchBlobs = async () => {
        setIsLoading(true);
        setError(null);
        try {
            const response = await fetch("/api/getBlobs"); // Asegúrate que este endpoint existe y funciona
            if (!response.ok) {
                const errorData = await response.json().catch(() => null);
                throw new Error(errorData?.message || `Error al obtener archivos: ${response.statusText}`);
            }
            const data = await response.json();
            setBlobs(data.blobs || []);
        } catch (err) {
            console.error("Error al obtener archivos:", err);
            setError(err instanceof Error ? err.message : "Ocurrió un error desconocido al cargar los archivos.");
            setBlobs([]); // Limpiar blobs en caso de error
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchBlobs();
    }, []);

    const handleGoHome = () => {
        router.push('/upload'); // Asumiendo que '/upload' es la página del formulario de subida
    };

    return (
        <div className="min-h-screen bg-slate-900 text-slate-100 p-4 md:p-8">
            <div className="max-w-7xl mx-auto">
                <div className="text-center mb-8">
                    <h1 className="text-3xl font-bold text-sky-100">
                        Archivos Almacenados
                    </h1>
                </div>

                <div className="flex flex-col sm:flex-row justify-center items-center gap-4 mb-8">
                    <button
                        onClick={handleGoHome}
                        className="w-full sm:w-auto px-6 py-2.5 text-sm font-medium bg-slate-600 hover:bg-slate-700 text-white rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-sky-500 focus:ring-offset-slate-900 transition duration-200"
                    >
                        Ir a Subir Archivo
                    </button>
                    <button
                        onClick={fetchBlobs}
                        disabled={isLoading}
                        className="w-full sm:w-auto px-6 py-2.5 text-sm font-medium bg-sky-600 hover:bg-sky-700 text-white rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-sky-500 focus:ring-offset-slate-900 transition duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
                    >
                        {isLoading && !error ? ( // Mostrar spinner solo si está cargando y no hay error previo de esa carga
                            <svg className="animate-spin -ml-1 mr-2 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                            </svg>
                        ) : null}
                        {isLoading && !error ? "Refrescando..." : "Refrescar Archivos"}
                    </button>
                </div>

                {error && (
                    <div className="mb-6 p-4 bg-red-500/20 border border-red-700 rounded-md text-sm text-red-300 text-center">
                        {error}
                    </div>
                )}

                {isLoading && blobs.length === 0 && !error ? ( // Mostrar skeleton o mensaje de carga solo en la carga inicial sin errores
                    <div className="text-center py-10 text-slate-400 text-xl">
                        Cargando archivos...
                    </div>
                ) : !isLoading && blobs.length === 0 && !error ? ( // Mensaje si no hay blobs y no está cargando y no hay error
                     <div className="text-center py-10 text-slate-400 text-xl">
                        No hay archivos para mostrar. Sube algunos primero.
                    </div>
                ) : blobs.length > 0 ? (
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6 justify-items-center">
                        {blobs.map((blob) => (
                            <div
                                key={blob.url} // Usar blob.url o blob.pathname si son únicos
                                className="flex flex-col w-full items-center bg-slate-800 p-4 rounded-lg shadow-lg transition-all duration-300 ease-in-out hover:shadow-sky-500/30 hover:scale-[1.03]"
                            >
                                <a href={blob.url} target="_blank" rel="noopener noreferrer" className="block w-full aspect-square mb-3 overflow-hidden rounded-md bg-slate-700">
                                    <img
                                        src={`${blob.url}?timestamp=${new Date().getTime()}`} // El timestamp es para evitar caché si sobreescribes blobs con la misma URL
                                        alt={`Vista previa de ${blob.pathname}`}
                                        width={200} // Ajusta según necesidad, pero el aspect-square y object-cover ayudarán
                                        height={200}
                                        className="w-full h-full object-cover " // object-cover para llenar el contenedor manteniendo el aspect ratio
                                    />
                                </a>
                                <p className="text-xs text-slate-400 mb-3 truncate w-full text-center" title={blob.pathname}>
                                    {blob.pathname.length > 30 ? `${blob.pathname.substring(0, 27)}...` : blob.pathname}
                                </p>
                                <div className="w-full flex flex-col space-y-2 sm:space-y-0 sm:flex-row sm:space-x-2">
                                    <CopyButton url={blob.url} />
                                    <DeleteButton url={blob.url} onBlobChange={fetchBlobs} />
                                </div>
                            </div>
                        ))}
                    </div>
                ) : null} {/* Si hay error y no hay blobs, el mensaje de error ya se muestra arriba */}
            </div>
        </div>
    );
}