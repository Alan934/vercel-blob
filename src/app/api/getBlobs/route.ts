// src/app/api/getBlobs/route.ts
import { list } from "@vercel/blob";
import { NextResponse } from "next/server";

export async function GET() {
    try {
        const blobs = await list({
            token: process.env.BLOB_READ_WRITE_TOKEN,
        });
        return NextResponse.json(blobs);
    } catch (error) {
        console.error("Error al obtener blobs:", error);
        return NextResponse.json({ error: "Error al obtener archivos" }, { status: 500 });
    }
}
