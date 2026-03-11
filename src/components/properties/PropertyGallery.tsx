"use client";

import { useState } from "react";
import Image from "next/image";
import { X, ZoomIn, Image as ImageIcon } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

interface GalleryItem {
  url: string;
  description?: string;
}

export function PropertyGallery({ images }: { images: GalleryItem[] }) {
  const [selectedImage, setSelectedImage] = useState<GalleryItem | null>(null);

  if (!images || images.length === 0) {
    return (
      <div className="container mx-auto px-4 mt-8 pb-24 text-center">
        <div className="py-20 bg-card border rounded-2xl flex flex-col items-center">
          <ImageIcon className="w-16 h-16 text-muted-foreground opacity-20 mb-4" />
          <h3 className="text-xl font-bold mb-2">Galeri Belum Tersedia</h3>
          <p className="text-muted-foreground">Belum ada foto fasilitas yang diunggah untuk properti ini.</p>
        </div>
      </div>
    );
  }

  return (
    <section className="container mx-auto px-4 mt-8 md:mt-12 pb-24">
      <div className="columns-1 sm:columns-2 md:columns-3 lg:columns-4 gap-4">
        {images.map((item, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1, duration: 0.5 }}
            className="relative group cursor-pointer overflow-hidden rounded-xl border border-border shadow-sm break-inside-avoid bg-muted mb-4"
            onClick={() => setSelectedImage(item)}
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={item.url}
              alt={item.description || `Fasilitas ${i + 1}`}
              className="w-full h-auto object-cover transition-transform duration-700 group-hover:scale-105"
            />
            {item.description && (
              <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent p-4 pt-12 transform translate-y-2 group-hover:translate-y-0 transition-transform duration-300">
                <p className="text-white font-medium text-sm drop-shadow-md">{item.description}</p>
              </div>
            )}
            <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center backdrop-blur-[2px]">
              <ZoomIn className="w-8 h-8 text-white drop-shadow-lg" />
            </div>
          </motion.div>
        ))}
      </div>

      {/* Lightbox Modal */}
      <AnimatePresence>
        {selectedImage && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] flex items-center justify-center bg-black/90 p-4 md:p-8 backdrop-blur-md"
            onClick={() => setSelectedImage(null)}
          >
            <button
              className="absolute top-6 right-6 w-12 h-12 flex items-center justify-center bg-white/10 hover:bg-white/20 rounded-full text-white transition-colors"
              onClick={() => setSelectedImage(null)}
            >
              <X className="w-6 h-6" />
            </button>
            <motion.div
              initial={{ scale: 0.95 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.95 }}
              className="relative w-full max-w-5xl flex flex-col items-center justify-center"
              onClick={(e) => e.stopPropagation()} // Prevent close on image click
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={selectedImage.url}
                alt={selectedImage.description || "Enlarged view"}
                className="max-w-full max-h-[85vh] object-contain rounded-lg shadow-2xl"
              />
              {selectedImage.description && (
                <div className="mt-4 bg-black/50 backdrop-blur-md px-6 py-3 rounded-full border border-white/10">
                  <p className="text-white/90 text-sm md:text-base font-medium">{selectedImage.description}</p>
                </div>
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}
