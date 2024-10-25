"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";

interface UploadResponse {
    url: string; // Asegúrate de agregar otros campos si los necesitas
}

export default function UploadForm() {
    const [file, setFile] = useState<File | null>(null);
    const [preview, setPreview] = useState<string | null>(null);
    const [uploadData, setUploadData] = useState<UploadResponse | null>(null);
    const [inProgress, setInProgress] = useState(false);
    const [copySuccess, setCopySuccess] = useState(false);
    const router = useRouter();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!file) return;

        setInProgress(true);
        const formData = new FormData();
        formData.append("file", file);

        try {
            const response = await fetch("/api/file", {
                method: "POST",
                body: formData,
            });

            if (!response.ok) {
                throw new Error("Failed to upload file.");
            }

            const data: UploadResponse = await response.json(); // Asegúrate de que la respuesta coincide con tu tipo
            setPreview(data.url);
            setUploadData(data);
            setCopySuccess(false);
        } catch (error) {
            console.error("Error uploading file:", error);
        } finally {
            setInProgress(false);
        }
    };

    const handleCopy = async () => {
        if (preview) {
            await navigator.clipboard.writeText(preview);
            setCopySuccess(true);
            setTimeout(() => setCopySuccess(false), 2000);
        }
    };

    const handleGoToAllFiles = () => {
        router.push('/all-files');
    };

    const styles = {
        form: "bg-black-100 p-4 rounded-lg",
        input: "border p-2 mb-4 w-full border-gray-300 rounded cursor-pointer",
    };

    return (
        <form onSubmit={handleSubmit} className={styles.form}>
            <div className="flex items-center mb-4">
                <button
                    className="bg-gray-500 text-white p-2 rounded mr-2 hover:bg-gray-600 cursor-pointer"
                    type="button"
                    onClick={handleGoToAllFiles}
                >
                    Go to All Files
                </button>
                <label htmlFor="fileUpload">Choose a file to upload:</label>
            </div>
            <input
                className={styles.input}
                id="fileUpload"
                type="file"
                onChange={(e) => setFile(e.target.files?.[0] || null)}
            />
            <div className="flex items-center">
                <button
                    className="bg-blue-500 text-white p-2 rounded w-full hover:bg-blue-600 cursor-pointer"
                    type="submit"
                >
                    {inProgress ? "Uploading..." : "Upload"}
                </button>
                {preview && (
                    <button
                        className="bg-green-500 text-white p-2 rounded ml-2 hover:bg-green-600 cursor-pointer"
                        type="button"
                        onClick={handleCopy}
                    >
                        {copySuccess ? "Copied!" : "Copy"}
                    </button>
                )}
            </div>

            {preview && (
                <div>
                    <Image src={preview} alt="Uploaded preview" width={1200} height={1200} />
                </div>
            )}

            {uploadData && (
                <div className="mt-4 p-4 border border-gray-300 rounded">
                    <h2 className="text-lg font-semibold">Upload Data:</h2>
                    <pre>{JSON.stringify(uploadData, null, 2)}</pre>
                </div>
            )}
        </form>
    );
}
