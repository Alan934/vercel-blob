"use client";
import { useState } from "react";
import Image from "next/image";

export default function UploadForm() {
    const [file, setFile] = useState<File | null>(null);
    const [preview, setPreview] = useState<string | null>(null);
    const [inProgress, setInProgress] = useState(false);

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

            const data = await response.json();
            setPreview(data.url);
        } catch (error) {
            console.error("Error uploading file:", error);
        } finally {
            setInProgress(false);
        }
    };

    const styles = {
        form: "bg-black-100 p-4 rounded-lg",
        input: "border p-2 mb-4 w-full border-gray-300 rounded cursor-pointer",
    };

    return (
        <form onSubmit={handleSubmit} className={styles.form}>
            <label htmlFor="fileUpload">Choose a file to upload:</label>
            <input
                className={styles.input}
                id="fileUpload"
                type="file"
                onChange={(e) => setFile(e.target.files?.[0] || null)}
            />
            <button
                className="bg-blue-500 text-white p-2 rounded w-full hover:bg-blue-600 cursor-pointer"
                type="submit"
            >
                {inProgress ? "Uploading..." : "Upload"}
            </button>

            {preview && (
                <div>
                    <Image src={preview} alt="Uploaded preview" width={1200} height={1200} />
                </div>
            )}
        </form>
    );
}
