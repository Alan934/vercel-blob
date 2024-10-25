import { list } from "@vercel/blob";
import React from "react";
import Image from "next/image";
import { DeleteButton } from "../components/deleteButton";
import { CopyButton } from "../components/copyButton";

export default async function AllFilesPage() {
    const blobs = await list();

    if (!blobs || !blobs.blobs || blobs.blobs.length === 0) {
        return <div>No Files</div>;
    } else {
        return (
            <div>
                <h1 className="text-2xl font-bold mb-4 text-center">Files</h1>
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4 justify-items-center">
                    {blobs.blobs.map((blob, i) => (
                        <div
                            key={blob.pathname + i}
                            className="flex flex-col items-center bg-gray-900 p-4 rounded shadow-md"
                        >
                            <a href={blob.url} target="_blank" rel="noopener noreferrer">
                                <Image 
                                    src={blob.url}
                                    alt={blob.pathname}
                                    width={150}
                                    height={150}
                                    className="rounded mb-2"
                                />
                            </a>
                            <div className="flex space-x-2">
                                <CopyButton url={blob.url} />
                                <DeleteButton url={blob.url} />
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        );
    }
}
