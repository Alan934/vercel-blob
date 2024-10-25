import { NextResponse } from "next/server";
import { put } from "@vercel/blob";

export async function POST( req: { body: FormData }){
    const form = await req.formData();
    const file = form.get("file") as File;
    //const fileName = file.get("file")?.toString() || "file";

    if(!file.name){
        return NextResponse.json({ error: "No file Provided" }), { status: 400 };
    }
    const blob = await put(file.name, file, {
        access: "public",
    })

    return Response.json(blob)
}