import { del } from "@vercel/blob";
import { NextResponse } from "next/server";

export async function DELETE(req: Request) {
    const url = req.url.split('/api/file/')[1]; // Obtén la URL después de '/api/file/'

    if (!url) {
        return NextResponse.json({ error: "No URL provided" }, { status: 400 });
    }

    const decodedUrl = decodeURIComponent(url);

    await del(decodedUrl);
    return NextResponse.json({ message: "File deleted successfully" });
}