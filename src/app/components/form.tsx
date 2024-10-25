"use client"; 
import { useState } from "react";

export default function UploadForm(){
    const [ file, setFile] = useState<File | null>(null);

    const handleSubmit = async ( e: React.FormEvent ) => {
        e.preventDefault();

        const formData = new FormData();
        formData.append('file', file as Blob);

        const response = await fetch('/api/file', {
            method: 'POST',
            body: formData
        });
    };

    const styles = {
        form: "bg-gray-100 p-4 rounded-lg",
        input: "border p-2 mb-4 w-full border-gray-300 rounded"
    }

    return (
        <form onSubmit={handleSubmit}>
            <label htmlFor="fileUpload">Choose a file to upload: </label>
            <input className={styles.input} id="fileUpload" type="file" onChange={(e) => setFile(e.target.files?.item(0) || null )} />
            <button type="submit">Upload</button>
        </form>
    );
}