"use client";

import { useState } from "react";
import { Dialog, DialogContent, DialogTrigger, DialogTitle } from "@/components/ui/dialog";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";

interface ImageGalleryProps {
  images: { url: string; alt: string }[];
}

export function ImageGallery({ images }: ImageGalleryProps) {
  const [currentIndex, setCurrentIndex] = useState(0);

  if (!images || images.length === 0) {
    return (
      <div className="w-full h-64 bg-muted flex items-center justify-center rounded-xl border border-border border-dashed">
        <span className="text-muted-foreground font-serif italic">No images available</span>
      </div>
    );
  }

  const handleNext = () => {
    setCurrentIndex((prev) => (prev + 1) % images.length);
  };

  const handlePrev = () => {
    setCurrentIndex((prev) => (prev - 1 + images.length) % images.length);
  };

  return (
    <div className="space-y-4 w-full">
      {/* Main Feature Image Container */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {/* Large Feature */}
        <div className="md:col-span-3 rounded-xl overflow-hidden relative h-[400px] border">
          <Dialog>
            <DialogTrigger 
              className="w-full h-full relative cursor-pointer group block text-left p-0 border-0 bg-transparent"
              onClick={() => setCurrentIndex(0)}
            >
              <div className="absolute inset-0 bg-gradient-to-br from-primary/10 to-primary/5 z-0" />
              <div className="absolute inset-0 flex items-center justify-center z-10 text-muted-foreground font-serif italic opacity-50 transition-opacity group-hover:opacity-100 bg-black/5">
                {images[0].alt}
              </div>
            </DialogTrigger>
            
            <DialogContent className="max-w-7xl w-full h-[90vh] bg-black/95 border-none p-0 flex flex-col justify-center">
              <DialogTitle className="sr-only">Galeri Foto</DialogTitle>
              <div className="relative w-full h-full flex items-center justify-center">
                <div className="absolute inset-x-4 flex justify-between z-50">
                  <button 
                    onClick={handlePrev}
                    className="p-3 rounded-full bg-black/50 text-white hover:bg-black/70 backdrop-blur-sm transition-all focus:outline-none"
                    aria-label="Previous Image"
                  >
                    <ChevronLeft className="w-8 h-8" />
                  </button>
                  <button 
                    onClick={handleNext}
                    className="p-3 rounded-full bg-black/50 text-white hover:bg-black/70 backdrop-blur-sm transition-all focus:outline-none"
                    aria-label="Next Image"
                  >
                    <ChevronRight className="w-8 h-8" />
                  </button>
                </div>
                
                {/* Lightbox Placeholder Image */}
                <div className="w-full h-full relative flex items-center justify-center">
                    <div className="text-white font-serif italic text-2xl animate-pulse">
                        {images[currentIndex].alt} - Preview Mode
                    </div>
                </div>

                <div className="absolute bottom-4 inset-x-0 flex justify-center gap-2">
                  {images.map((_, idx) => (
                    <div 
                      key={idx}
                      className={cn(
                        "w-2 h-2 rounded-full transition-all",
                        idx === currentIndex ? "bg-white w-4" : "bg-white/40"
                      )}
                    />
                  ))}
                </div>
              </div>
            </DialogContent>
          </Dialog>
        </div>

        {/* Thumbnails Column */}
        <div className="grid grid-cols-3 md:grid-cols-1 gap-4 h-[400px]">
          {images.slice(1, 4).map((img, idx) => (
            <div 
              key={idx + 1} 
              className="rounded-xl overflow-hidden relative cursor-pointer group border flex-1"
            >
              <div className="absolute inset-0 bg-gradient-to-br from-primary/20 to-primary/10 z-0" />
              <div className="absolute inset-0 flex items-center justify-center text-center p-2 z-10 text-muted-foreground/80 font-serif text-sm italic opacity-70 transition-opacity group-hover:opacity-100 bg-black/5">
                {img.alt}
              </div>
              
              {/* Overlay for remaining images if > 4 */}
              {idx === 2 && images.length > 4 && (
                <div className="absolute inset-0 bg-black/60 flex items-center justify-center z-20">
                  <span className="text-white font-semibold text-xl">+{images.length - 4}</span>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
