import { NextResponse } from "next/server";
import { uploadToCloudinary } from "@/lib/cloudinary";

export async function POST(req: Request) {
    try {
        const formData = await req.formData();
        const file = formData.get("file") as File;

        if (!file) {
            return NextResponse.json({ error: "No file received." }, { status: 400 });
        }

        // Upload directly to Cloudinary
        const imageUrl = await uploadToCloudinary(file);

        return NextResponse.json({ success: true, url: imageUrl });
    } catch (error) {
        console.error("Cloudinary Upload error:", error);
        return NextResponse.json({ error: "Failed to upload file to Cloudinary" }, { status: 500 });
    }
}
