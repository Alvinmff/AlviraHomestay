"use client";

import { useState } from "react";
import Image from "next/image";
import { Grid2X2 } from "lucide-react";
import Lightbox from "yet-another-react-lightbox";
import "yet-another-react-lightbox/styles.css";
import Thumbnails from "yet-another-react-lightbox/plugins/thumbnails";
import "yet-another-react-lightbox/plugins/thumbnails.css";
import Zoom from "yet-another-react-lightbox/plugins/zoom";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface RoomGalleryModalProps {
  photos: string[];
  thumbnail: string;
  roomName: string;
}

export function RoomGalleryModal({ photos, thumbnail, roomName }: RoomGalleryModalProps) {
  const [open, setOpen] = useState(false);
  const [index, setIndex] = useState(0);

  // Fallback if no photos provided (should have thumbnail at least)
  const galleryPhotos = photos.length > 0 ? photos : [thumbnail];
  
  // Format slides for Lightbox
  const slides = galleryPhotos.map((src) => ({ src }));

  const openLightbox = (idx: number) => {
    setIndex(idx);
    setOpen(true);
  };

  return (
    <>
      {/* Inline Preview Grid (3.1 Ratio Style) */}
      <div className="relative rounded-2xl overflow-hidden grid grid-cols-4 gap-2 h-[400px] md:h-[500px] mb-8 group">
        
        {/* Main Hero Shot */}
        <div 
          className={cn(
            "col-span-4 md:col-span-3 relative cursor-pointer overflow-hidden",
            galleryPhotos.length > 1 ? "h-[280px] md:h-full" : "h-full"
          )}
          onClick={() => openLightbox(0)}
        >
           <Image 
             src={galleryPhotos[0]} 
             alt={`${roomName} - View 1`} 
             fill 
             className="object-cover transition-transform duration-700 hover:scale-105" 
             priority
           />
           <div className="absolute inset-0 bg-black/10 opacity-0 hover:opacity-100 transition-opacity" />
        </div>

        {/* Side Stack Thumbnail Previews */}
        <div className="col-span-4 md:col-span-1 h-[112px] md:h-full grid grid-cols-2 md:grid-cols-1 md:flex md:flex-col gap-2">
           {galleryPhotos.slice(1, 3).map((photo, i) => (
             <div 
                key={i} 
                className="relative h-full md:h-1/2 w-full overflow-hidden cursor-pointer"
                onClick={() => openLightbox(i + 1)}
             >
                <Image 
                  src={photo} 
                  alt={`${roomName} - View ${i + 2}`} 
                  fill 
                  className="object-cover transition-transform duration-700 hover:scale-105" 
                />
                <div className="absolute inset-0 bg-black/10 opacity-0 hover:opacity-100 transition-opacity" />
             </div>
           ))}

           {/* Empty Block Handle if < 3 Photos */}
           {galleryPhotos.length <= 1 && (
             <div className="hidden md:flex relative h-full w-full bg-muted flex items-center justify-center">
               <span className="text-muted-foreground text-sm flex flex-col items-center">
                 <Grid2X2 className="w-6 h-6 mb-2 opacity-50" />
                 1 Foto
               </span>
             </div>
           )}
        </div>

        {/* Floating "Lihat Lebih Detail" Trigger */}
        <Button 
          variant="secondary"
          className="absolute bottom-4 right-4 z-10 shadow-lg font-semibold bg-white/95 hover:bg-white text-foreground flex text-xs sm:text-sm"
          onClick={() => openLightbox(0)}
        >
          <Grid2X2 className="w-4 h-4 mr-2" />
          Lihat Semua {galleryPhotos.length} Foto
        </Button>
      </div>

      {/* Fullscreen Swipeable Lightbox Modal */}
      <Lightbox
        open={open}
        close={() => setOpen(false)}
        index={index}
        slides={slides}
        plugins={[Thumbnails, Zoom]}
        controller={{ closeOnBackdropClick: true }}
        thumbnails={{
          position: "bottom",
          width: 120,
          height: 80,
          border: 2,
          borderRadius: 8,
          padding: 4,
          gap: 16,
        }}
        zoom={{
          maxZoomPixelRatio: 3,
          zoomInMultiplier: 2,
          doubleTapDelay: 300,
          keyboardMoveDistance: 50,
          wheelZoomDistanceFactor: 100,
        }}
        styles={{
            root: { backgroundColor: "rgba(0, 0, 0, .95)" }
        }}
      />
    </>
  );
}
