"use client"; 
import { useState } from "react";
import Image from "next/image";

export default function UploadForm(){
    const [ file, setFile] = useState<File | null>(null);
    const [ preview, setPreview ] = useState<string | null>(null);
    const [ inProgess, setInProgesss ] = useState(false);

    const handleSubmit = async ( e: React.FormEvent ) => {
        setInProgesss(true);
        e.preventDefault();

        const formData = new FormData();
        formData.append('file', file as Blob);

        const response = await fetch('/api/file', {
            method: 'POST',
            body: formData
        });

        const data = await response.json();
        setPreview(data.url);
        setInProgesss(false);
    };

    const styles = {
        form: "bg-gray-100 p-4 rounded-lg",
        input: "border p-2 mb-4 w-full border-gray-300 rounded"
    }

    return (
        <form onSubmit={handleSubmit}>
            <label htmlFor="fileUpload">Choose a file to upload: </label>
            <input className={styles.input} id="fileUpload" type="file" onChange={(e) => setFile(e.target.files?.item(0) || null )} />
            <button className="
            bg-blue-500 text-white p-2 rounded w-full hover:bg-blue-600" 
            type="submit">{ inProgess ? "Uploading..." : "Upload" }</button
            >

            {preview && (
                <div>
                    <Image src={preview} alt="test" width={1200} height={1200} />
                </div>
            )}
        </form>
    );
}