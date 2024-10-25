"use client";
import { useRouter } from "next/navigation";
import { useState } from "react";
import Image from "next/image";
import { CopyButton } from "../components/copyButton";

interface UploadResponse {
    url: string;
}

export default function UploadForm() {
    const [file, setFile] = useState<File | null>(null);
    const [preview, setPreview] = useState<string | null>(null);
    const [uploadData, setUploadData] = useState<UploadResponse | null>(null);
    const [inProgress, setInProgress] = useState(false);
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

            const data: UploadResponse = await response.json();
            setPreview(data.url);
            setUploadData(data);
        } catch (error) {
            console.error("Error uploading file:", error);
        } finally {
            setInProgress(false);
        }
    };

    const handleGoToAllFiles = () => {
        router.push('/all-files');
    };

    const styles = {
        form: "bg-gray-800 p-6 rounded-lg shadow-lg",
        input: "border p-2 mb-4 w-full border-gray-600 rounded cursor-pointer bg-gray-700 text-white",
    };

    return (
        <form onSubmit={handleSubmit} className={styles.form}>
            <div className="flex items-center mb-4">
                <button
                    className="bg-gray-500 text-white p-2 rounded mr-2 hover:bg-gray-600 cursor-pointer transition duration-200"
                    type="button"
                    onClick={handleGoToAllFiles}
                >
                    Go to All Files
                </button>
                <label htmlFor="fileUpload" className="text-white cursor-pointer">Choose a file to upload:</label>
            </div>
            <input
                className={styles.input}
                id="fileUpload"
                type="file"
                onChange={(e) => setFile(e.target.files?.[0] || null)}
            />
            
            {preview && (
                <div className="mb-4">
                    <CopyButton url={preview} />
                </div>
            )}

            <div className="flex items-center">
                <button
                    className="bg-blue-500 text-white p-2 rounded w-full hover:bg-blue-600 cursor-pointer transition duration-200"
                    type="submit"
                >
                    {inProgress ? "Uploading..." : "Upload"}
                </button>
            </div>

            {preview && (
                <div className="mt-4">
                    <Image src={preview} alt="Uploaded preview" width={1200} height={1200} className="rounded-lg shadow-md" />
                </div>
            )}

            {uploadData && (
                <div className="mt-4 p-4 border border-gray-600 rounded bg-gray-700">
                    <h2 className="text-lg font-semibold text-white">Upload Data:</h2>
                    <pre className="text-gray-300">{JSON.stringify(uploadData, null, 2)}</pre>
                </div>
            )}
        </form>
    );
}
