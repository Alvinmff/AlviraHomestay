import { v2 as cloudinary } from "cloudinary";
import path from "path";
import dotenv from "dotenv";
import fs from "fs";

dotenv.config();

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
  secure: true,
});

async function main() {
  const assets = ["Background.png", "backgroundmobile.png", "logo.png", "upload-1773135068512-112765190.jpg"];
  const results: Record<string, string> = {};

  for (const asset of assets) {
    const localPath = path.join(process.cwd(), "public", "uploads", asset);
    if (fs.existsSync(localPath)) {
      console.log(`Uploading ${asset}...`);
      const result = await cloudinary.uploader.upload(localPath, {
        public_id: asset.split(".")[0],
        folder: "alvira-static",
      });
      results[asset] = result.secure_url;
      console.log(`${asset} uploaded to: ${result.secure_url}`);
    }
  }

  console.log("\nStatic assets migration results:");
  console.log(JSON.stringify(results, null, 2));
}

main().catch(console.error);
