import { NextResponse, NextRequest } from "next/server";
import { put } from "@vercel/blob";

export async function POST(request: NextRequest): Promise<NextResponse> {
    try {
        const body = await request.json();

        // Verifica si es una subida desde una URL
        if (body.imageUrl) {
            const imageUrl = body.imageUrl as string;

            // Validar la URL
            try {
                new URL(imageUrl);
            } catch {
                return NextResponse.json({ message: "Invalid image URL format" }, { status: 400 });
            }

            // Descargar la imagen desde la URL proporcionada
            const imageResponse = await fetch(imageUrl);

            if (!imageResponse.ok) {
                return NextResponse.json(
                    { message: `Failed to fetch image from URL: ${imageResponse.status} ${imageResponse.statusText}` },
                    { status: imageResponse.status }
                );
            }

            if (!imageResponse.body) {
                return NextResponse.json({ message: "Image response body is empty" }, { status: 500 });
            }

            const contentType = imageResponse.headers.get("content-type") || "application/octet-stream";

            // Generar un nombre de archivo único
            const filename = `uploaded-from-url-${Date.now()}.${contentType.split("/")[1] || "tmp"}`;

            // Subir la imagen a Vercel Blob
            const blobResult = await put(filename, imageResponse.body, {
                access: "public",
                contentType: contentType,
            });

            return NextResponse.json(blobResult, { status: 200 });
        }

        // Si no es una subida desde una URL, manejar como un archivo normal
        const file = body.file;

        if (!file) {
            return NextResponse.json({ message: "No file or image URL provided" }, { status: 400 });
        }

        // Aquí puedes manejar la subida de archivos si es necesario
        return NextResponse.json({ message: "File upload not implemented yet" }, { status: 501 });
    } catch (error) {
        console.error("Error uploading file or image from URL:", error);
        const message = error instanceof Error ? error.message : "Internal server error";
        return NextResponse.json({ message }, { status: 500 });
    }
}