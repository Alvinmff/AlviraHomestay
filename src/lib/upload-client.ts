/**
 * Client-side direct upload to Cloudinary.
 * Bypasses Vercel's 4.5MB body size limit by uploading directly from the browser.
 */
export async function uploadToCloudinaryClient(file: File): Promise<string> {
  try {
    // Step 1: Get a signed upload signature from our API
    const sigRes = await fetch("/api/upload/signature", { method: "POST" });
    if (!sigRes.ok) throw new Error("Gagal mendapatkan izin upload");
    
    const { signature, timestamp, folder, cloudName, apiKey } = await sigRes.json();

    // Step 2: Upload directly to Cloudinary (no Vercel size limit!)
    const formData = new FormData();
    formData.append("file", file);
    formData.append("api_key", apiKey);
    formData.append("timestamp", timestamp.toString());
    formData.append("signature", signature);
    formData.append("folder", folder);

    const uploadRes = await fetch(
      `https://api.cloudinary.com/v1_1/${cloudName}/image/upload`,
      { method: "POST", body: formData }
    );

    if (!uploadRes.ok) {
      const err = await uploadRes.json();
      throw new Error(err.error?.message || "Gagal mengunggah gambar ke cloud");
    }

    const result = await uploadRes.json();
    return result.secure_url;
  } catch (directError: any) {
    console.warn("Direct Cloudinary upload failed, using server fallback:", directError);
    
    // Fallback: Upload to local server /api/upload
    const fallbackFormData = new FormData();
    fallbackFormData.append("file", file);

    const serverRes = await fetch("/api/upload", {
      method: "POST",
      body: fallbackFormData,
    });

    if (!serverRes.ok) {
      const serverErr = await serverRes.json();
      throw new Error(serverErr.error || "Gagal mengunggah gambar");
    }

    const serverResult = await serverRes.json();
    return serverResult.url;
  }
}
