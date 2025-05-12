"use client";
import { useRouter } from "next/navigation";
import { useState } from "react"; // useEffect added for potential future use, not strictly for this fix
import Image from "next/image";
import { CopyButton } from "../components/copyButton"; // Asegúrate que la ruta sea correcta

interface UploadResponse {
    url: string;
    // podrías añadir más campos si tu API los devuelve, ej: path, filename
}

export default function UploadForm() {
    const [file, setFile] = useState<File | null>(null);
    const [imageUrl, setImageUrl] = useState<string>("");
    const [preview, setPreview] = useState<string | null>(null);
    const [uploadData, setUploadData] = useState<UploadResponse | null>(null);
    const [inProgress, setInProgress] = useState(false);
    const [error, setError] = useState<string | null>(null); // Estado para mensajes de error
    const router = useRouter();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!file && !imageUrl) return;

        setInProgress(true);
        setError(null); // Limpiar errores anteriores
        setUploadData(null); // Limpiar datos de subida anteriores

        if (file) {
            const formData = new FormData();
            formData.append("file", file);
            try {
                const response = await fetch("/api/file", { // Endpoint para subida directa de archivos
                    method: "POST",
                    body: formData,
                });
                if (!response.ok) {
                    const errorData = await response.json().catch(() => ({ message: "Failed to upload file. Server returned " + response.status }));
                    throw new Error(errorData.message || "Failed to upload file.");
                }
                const data: UploadResponse = await response.json();
                setPreview(data.url); // Esta URL ya debería ser la de Vercel Blob
                setUploadData(data);
            } catch (err) {
                console.error("Error uploading file:", err);
                setError(err instanceof Error ? err.message : "An unknown error occurred during file upload.");
                setPreview(null); // Limpiar vista previa en caso de error
            } finally {
                setInProgress(false);
            }
        } else if (imageUrl) {
            try {
                const response = await fetch("/api/file", {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({ imageUrl: imageUrl }),
                });

                if (!response.ok) {
                    const errorData = await response.json().catch(() => ({ message: "Failed to upload image from URL. Server returned " + response.status }));
                    throw new Error(errorData.message || "Failed to upload image from URL.");
                }
                const data: UploadResponse = await response.json();
                setPreview(data.url); // Esta 'data.url' ahora será la URL de Vercel Blob
                setUploadData(data);
            } catch (err) {
                console.error("Error uploading image from URL:", err);
                setError(err instanceof Error ? err.message : "An unknown error occurred during URL upload.");
                setPreview(null); // Limpiar vista previa en caso de error
            } finally {
                setInProgress(false);
            }
        }
    };

    const handleGoToAllFiles = () => {
        router.push('/all-files');
    };

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const selectedFile = e.target.files?.[0] || null;
        setFile(selectedFile);
        setImageUrl(""); // Limpiar URL de imagen si se selecciona un archivo
        setError(null); // Limpiar error
        setUploadData(null); // Limpiar datos de subida anteriores

        if (selectedFile) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setPreview(reader.result as string); // Vista previa local con Data URL
            };
            reader.readAsDataURL(selectedFile);
        } else {
            setPreview(null);
        }
    };

    const handleUrlInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const newImageUrl = e.target.value;
        setImageUrl(newImageUrl);
        setFile(null); // Limpiar archivo si se está escribiendo una URL
        setError(null); // Limpiar error
        setUploadData(null); // Limpiar datos de subida anteriores

        if (newImageUrl) {
            setPreview(newImageUrl); // Muestra la vista previa de la URL que se va a subir
        } else {
            setPreview(null); // Limpiar vista previa si la URL está vacía
        }
    }

    return (
        <div className="min-h-screen flex flex-col items-center justify-center bg-slate-900 p-4">
            <form
                onSubmit={handleSubmit}
                className="bg-slate-800 p-8 rounded-xl shadow-2xl w-full max-w-lg space-y-6"
            >
                <div className="flex justify-between items-center">
                    <h1 className="text-2xl font-semibold text-white">Upload Image</h1>
                    <button
                        type="button"
                        onClick={handleGoToAllFiles}
                        className="px-4 py-2 text-sm font-medium text-slate-300 bg-slate-700 hover:bg-slate-600 rounded-md transition duration-200 focus:outline-none focus:ring-2 focus:ring-sky-500 focus:ring-offset-2 focus:ring-offset-slate-800"
                    >
                        View All Files
                    </button>
                </div>

                {/* Sección de subida de archivo */}
                <div>
                    <label htmlFor="fileUpload" className="block text-sm font-medium text-slate-300 mb-1">
                        Choose a file to upload:
                    </label>
                    <input
                        id="fileUpload"
                        type="file"
                        accept="image/*"
                        onChange={handleFileChange}
                        className="block w-full text-sm text-slate-400
                                   file:mr-4 file:py-2 file:px-4
                                   file:rounded-md file:border-0
                                   file:text-sm file:font-semibold
                                   file:bg-sky-600 file:text-sky-50
                                   hover:file:bg-sky-700
                                   cursor-pointer focus:outline-none focus:ring-2 focus:ring-sky-500 focus:ring-offset-2 focus:ring-offset-slate-800 rounded-md"
                    />
                </div>

                <div className="relative">
                    <div className="absolute inset-0 flex items-center" aria-hidden="true">
                        <div className="w-full border-t border-slate-700" />
                    </div>
                    <div className="relative flex justify-center">
                        <span className="bg-slate-800 px-2 text-sm text-slate-500">Or</span>
                    </div>
                </div>

                {/* Sección de URL de imagen */}
                <div>
                    <label htmlFor="imageUrl" className="block text-sm font-medium text-slate-300 mb-1">
                        Enter an image URL:
                    </label>
                    <input
                        id="imageUrl"
                        type="text"
                        placeholder="https://example.com/image.jpg"
                        value={imageUrl}
                        onChange={handleUrlInputChange}
                        className="mt-1 block w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded-md text-sm shadow-sm placeholder-slate-500 text-white
                                   focus:outline-none focus:border-sky-500 focus:ring-1 focus:ring-sky-500"
                    />
                </div>

                {/* Mensaje de error */}
                {error && (
                    <div className="p-3 bg-red-500/20 border border-red-700 rounded-md">
                        <p className="text-sm text-red-400">{error}</p>
                    </div>
                )}

                {/* Botón de subida condicional */}
                {(file || imageUrl) && ( // Mostrar botón si hay archivo o URL
                     <button
                        type="submit"
                        disabled={inProgress || (!file && !imageUrl)}
                        className="w-full flex justify-center py-2.5 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-sky-600 hover:bg-sky-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-sky-500 focus:ring-offset-slate-800 disabled:opacity-50 disabled:cursor-not-allowed transition duration-200"
                    >
                        {inProgress ? (
                            <>
                                <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                </svg>
                                Uploading...
                            </>
                        ) : "Upload Image"}
                    </button>
                )}

                {/* Vista previa y botón de copiar */}
                {preview && !inProgress && !error && ( // No mostrar vista previa si hay error o está en progreso
                    <div className="mt-6 space-y-4">
                        <div className="border-t border-slate-700 pt-4">
                             <h3 className="text-md font-medium text-slate-200 mb-2">Preview & Actions:</h3>
                             <CopyButton url={preview} /> {/* 'preview' aquí será la URL de Vercel Blob después de la subida exitosa */}
                        </div>
                       
                        <div className="rounded-lg overflow-hidden shadow-md bg-slate-700 p-2">
                            <Image
                                src={preview}
                                alt="Uploaded preview"
                                width={500}
                                height={500}
                                style={{ objectFit: 'contain', maxHeight: '300px', width: '100%', height: 'auto' }}
                                className="rounded"
                                unoptimized={preview.startsWith('data:')} // Evitar optimización para data URLs locales
                            />
                        </div>
                    </div>
                )}

                {/* Datos de la subida */}
                {uploadData && !inProgress && !error && (
                    <div className="mt-6 p-4 border border-slate-700 rounded-lg bg-slate-700/50">
                        <h2 className="text-lg font-semibold text-slate-100">Upload Successful:</h2>
                        <pre className="text-xs text-slate-300 bg-slate-800 p-3 rounded-md overflow-x-auto mt-2">{JSON.stringify(uploadData, null, 2)}</pre>
                    </div>
                )}
            </form>
        </div>
    );
}