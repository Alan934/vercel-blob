import { NextResponse, NextRequest } from "next/server";
import { put } from "@vercel/blob";

export async function POST(request: NextRequest): Promise<NextResponse> {
    const contentType = request.headers.get("content-type") || "";

    try {
        // Caso 1: Subida desde URL (payload JSON)
        if (contentType.includes("application/json")) {
            const body = await request.json();
            const imageUrl = body.imageUrl as string;

            if (!imageUrl) {
                return NextResponse.json({ message: "La URL de la imagen (imageUrl) es requerida en el cuerpo JSON." }, { status: 400 });
            }

            // Validar la URL
            try {
                new URL(imageUrl);
            } catch {
                return NextResponse.json({ message: "Formato de URL de imagen inválido." }, { status: 400 });
            }

            // Descargar la imagen desde la URL proporcionada
            const imageResponse = await fetch(imageUrl);

            if (!imageResponse.ok) {
                return NextResponse.json(
                    { message: `Fallo al obtener la imagen desde la URL: ${imageResponse.status} ${imageResponse.statusText}` },
                    { status: imageResponse.status }
                );
            }

            if (!imageResponse.body) {
                return NextResponse.json({ message: "El cuerpo de la respuesta de la imagen está vacío." }, { status: 500 });
            }

            const imageFileContentType = imageResponse.headers.get("content-type") || "application/octet-stream";
            
            // Generar un nombre de archivo (puedes mejorar esta lógica si es necesario)
            // Vercel Blob añadirá un sufijo único al pathname por defecto.
            const filename = `url-upload-${Date.now()}.${imageFileContentType.split("/")[1] || "tmp"}`;

            // Subir la imagen a Vercel Blob
            const blobResult = await put(filename, imageResponse.body, {
                access: "public",
                contentType: imageFileContentType, // Importante para que el blob se sirva correctamente
                // addRandomSuffix: true, // Es true por defecto, lo que asegura URLs únicas
            });

            return NextResponse.json(blobResult, { status: 200 });

        // Caso 2: Subida directa de archivo (payload multipart/form-data)
        } else if (contentType.includes("multipart/form-data")) {
            const formData = await request.formData();
            const file = formData.get("file") as File | null; // El frontend envía el archivo bajo la clave "file"

            if (!file) {
                return NextResponse.json({ message: "Archivo no encontrado en el FormData. Asegúrate de que se envía bajo la clave 'file'." }, { status: 400 });
            }

            if (!file.name) {
                return NextResponse.json({ message: "El nombre del archivo es requerido." }, { status: 400 });
            }

            // Subir el archivo a Vercel Blob
            // Vercel Blob añadirá un sufijo único al pathname por defecto usando file.name.
            const blobResult = await put(file.name, file, {
                access: "public",
                // contentType: file.type, // `put` puede inferirlo desde el objeto File
                // addRandomSuffix: true, // Es true por defecto
            });

            return NextResponse.json(blobResult, { status: 200 });

        // Caso 3: Content-Type no soportado
        } else {
            return NextResponse.json({ message: `Content-Type no soportado: ${contentType}. Use application/json o multipart/form-data.` }, { status: 415 });
        }

    } catch (error) {
        console.error("Error en POST /api/file:", error);
        let message = "Error interno del servidor.";
        if (error instanceof Error) {
            message = error.message;
            // Si el error es por parseo JSON de un FormData, podría ser más específico,
            // pero la lógica de Content-Type debería prevenir esto.
        }
        return NextResponse.json({ message }, { status: 500 });
    }
}