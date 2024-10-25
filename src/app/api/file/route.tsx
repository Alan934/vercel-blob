import { NextResponse } from "next/server";
import { put } from "@vercel/blob";

export async function POST(req: Request) {
    const form = await req.formData();
    const file = form.get("file") as File;

    if (!file || !file.name) {
        return NextResponse.json({ error: "No file provided" }, { status: 400 });
    }

    const blob = await put(file.name, file, {
        access: "public",
    });

    // Configurar los encabezados de respuesta para evitar la caché
    const response = NextResponse.json(blob);
    response.headers.set("Cache-Control", "no-store");

    return response;
}

