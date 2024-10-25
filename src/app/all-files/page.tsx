import { list } from "@vercel/blob";
import React from "react";
import Image from "next/image";
import { DeleteButton } from "../components/deleteButton";

export default async function AllFilesPage() {
    const blobs = await list();

    if (!blobs || !blobs.blobs || blobs.blobs.length === 0) {
        return <div>No Files</div>;
    }else {
        return (
            <div>
                <h1>Files</h1>
                <ul>
                    {blobs.blobs.map((blob, i) => (
                        <li key={blob.pathname + i}>
                            <a href={blob.url} target="_blank">
                                <Image 
                                    src={blob.url}
                                    alt={blob.pathname}
                                    width={100}
                                    height={100}
                                />
                                {blob.pathname}
                            </a>
                            <DeleteButton url={blob.url} />
                        </li>
                    ))}
                </ul>
            </div>
        );
    }


}
