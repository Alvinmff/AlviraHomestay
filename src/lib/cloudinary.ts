import { v2 as cloudinary } from 'cloudinary';

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
  secure: true,
});

export async function uploadToCloudinary(file: File | string): Promise<string> {
  // If it's a file object (from form data)
  if (file instanceof File) {
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);
    
    return new Promise((resolve, reject) => {
      const uploadStream = cloudinary.uploader.upload_stream(
        {
          folder: 'alvira-homestay',
          resource_type: 'auto',
        },
        (error, result) => {
          if (error) return reject(error);
          resolve(result?.secure_url || '');
        }
      );
      
      uploadStream.end(buffer);
    });
  }
  
  // If it's a base64 string or local path (for migration)
  return new Promise((resolve, reject) => {
    cloudinary.uploader.upload(
      file,
      {
        folder: 'alvira-homestay',
        resource_type: 'auto',
      },
      (error, result) => {
        if (error) return reject(error);
        resolve(result?.secure_url || '');
      }
    );
  });
}

export default cloudinary;
