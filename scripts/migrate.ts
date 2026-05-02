import { PrismaClient } from "@prisma/client";
import { v2 as cloudinary } from "cloudinary";
import fs from "fs";
import path from "path";
import dotenv from "dotenv";

dotenv.config();

const prisma = new PrismaClient();

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
  secure: true,
});

async function uploadFile(localPath: string) {
  try {
    const result = await cloudinary.uploader.upload(localPath, {
      folder: "alvira-homestay",
    });
    return result.secure_url;
  } catch (error) {
    console.error(`Failed to upload ${localPath}:`, error);
    return null;
  }
}

async function main() {
  console.log("Starting migration to Cloudinary...");

  const uploadsDir = path.join(process.cwd(), "public", "uploads");
  if (!fs.existsSync(uploadsDir)) {
    console.log("No uploads directory found.");
    return;
  }

  // 1. Migrate Properties
  console.log("Migrating properties...");
  const properties = await prisma.property.findMany();
  for (const prop of properties) {
    if (prop.heroImage && prop.heroImage.startsWith("/uploads/")) {
      const localPath = path.join(process.cwd(), "public", prop.heroImage);
      if (fs.existsSync(localPath)) {
        const url = await uploadFile(localPath);
        if (url) {
          await prisma.property.update({
            where: { id: prop.id },
            data: { heroImage: url },
          });
          console.log(`Updated property ${prop.name} hero image.`);
        }
      }
    }

    // Handle gallery (JSON)
    if (prop.gallery) {
      const gallery = typeof prop.gallery === "string" ? JSON.parse(prop.gallery) : prop.gallery;
      if (Array.isArray(gallery)) {
        let updated = false;
        const newGallery = await Promise.all(
          gallery.map(async (item: any) => {
            const url = typeof item === "string" ? item : item.url;
            if (url && url.startsWith("/uploads/")) {
              const localPath = path.join(process.cwd(), "public", url);
              if (fs.existsSync(localPath)) {
                const cloudUrl = await uploadFile(localPath);
                if (cloudUrl) {
                  updated = true;
                  return typeof item === "string" ? cloudUrl : { ...item, url: cloudUrl };
                }
              }
            }
            return item;
          })
        );
        if (updated) {
          await prisma.property.update({
            where: { id: prop.id },
            data: { gallery: newGallery },
          });
          console.log(`Updated property ${prop.name} gallery.`);
        }
      }
    }
  }

  // 2. Migrate Rooms
  console.log("Migrating rooms...");
  const rooms = await prisma.room.findMany();
  for (const room of rooms) {
    // Thumbnail
    if (room.thumbnail && room.thumbnail.startsWith("/uploads/")) {
      const localPath = path.join(process.cwd(), "public", room.thumbnail);
      if (fs.existsSync(localPath)) {
        const url = await uploadFile(localPath);
        if (url) {
          await prisma.room.update({
            where: { id: room.id },
            data: { thumbnail: url },
          });
          console.log(`Updated room ${room.roomName} thumbnail.`);
        }
      }
    }

    // Photos (JSON)
    if (room.photos) {
      const photos = typeof room.photos === "string" ? JSON.parse(room.photos) : room.photos;
      if (Array.isArray(photos)) {
        let updated = false;
        const newPhotos = await Promise.all(
          photos.map(async (photo: any) => {
            if (photo && photo.startsWith("/uploads/")) {
              const localPath = path.join(process.cwd(), "public", photo);
              if (fs.existsSync(localPath)) {
                const cloudUrl = await uploadFile(localPath);
                if (cloudUrl) {
                  updated = true;
                  return cloudUrl;
                }
              }
            }
            return photo;
          })
        );
        if (updated) {
          await prisma.room.update({
            where: { id: room.id },
            data: { photos: newPhotos },
          });
          console.log(`Updated room ${room.roomName} photos.`);
        }
      }
    }
  }

  // 3. Migrate Reviews
  console.log("Migrating reviews...");
  const reviews = await prisma.review.findMany();
  for (const review of reviews) {
    if (review.authorPhoto && review.authorPhoto.startsWith("/uploads/")) {
      const localPath = path.join(process.cwd(), "public", review.authorPhoto);
      if (fs.existsSync(localPath)) {
        const url = await uploadFile(localPath);
        if (url) {
          await prisma.review.update({
            where: { id: review.id },
            data: { authorPhoto: url },
          });
          console.log(`Updated review by ${review.authorName} photo.`);
        }
      }
    }
  }

  console.log("Migration finished!");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
