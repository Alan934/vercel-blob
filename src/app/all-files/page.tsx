import { list } from "@vercel/blob";
import React from "react";
import Image from "next/image";

export default async function AllFilesPage() {
    const blobs = await list();
    console.log(blobs);

    if (!blobs || !blobs.blobs || blobs.blobs.length === 0) {
        return <div>No Files</div>;
    }else {
        return (
            <div>
                <h1>Files</h1>
                <ul>
                    {blobs.blobs.map((blob) => (
                        <li key={blob.pathname}>
                            <a href={blob.url} target="_blank">
                                <Image 
                                    src={blob.url}
                                    alt={blob.pathname}
                                    width={100}
                                    height={100}
                                />
                                {blob.pathname}
                            </a>
                        </li>
                    ))}
                </ul>
            </div>
        );
    }


}
