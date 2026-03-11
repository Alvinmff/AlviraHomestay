"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  MapPin, 
  ShoppingBag, 
  GraduationCap, 
  Stethoscope, 
  Train, 
  Map as MapIcon, 
  Navigation,
  ZoomIn,
  X
} from "lucide-react";

interface NearbyPlace {
  name: string;
  distance: string;
  type: string;
  imageUrl?: string;
}

export function PropertyNearby({ places }: { places: any }) {
  const [selectedImage, setSelectedImage] = useState<NearbyPlace | null>(null);
  // Parse the JSON if it's a string, or use directly if it's already an array
  const nearbyPlaces: NearbyPlace[] = (() => {
    if (!places) return [];
    try {
      return typeof places === "string" ? JSON.parse(places) : places;
    } catch {
      return [];
    }
  })();

  if (!nearbyPlaces || nearbyPlaces.length === 0) {
    return null;
  }

  const getIconForType = (type: string) => {
    switch (type) {
      case "Wisata": return <MapIcon className="w-5 h-5" />;
      case "Belanja": return <ShoppingBag className="w-5 h-5" />;
      case "Pendidikan": return <GraduationCap className="w-5 h-5" />;
      case "Kesehatan": return <Stethoscope className="w-5 h-5" />;
      case "Transportasi": return <Train className="w-5 h-5" />;
      default: return <MapPin className="w-5 h-5" />;
    }
  };

  const getColorForType = (type: string) => {
    switch (type) {
      case "Wisata": return "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400";
      case "Belanja": return "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400";
      case "Pendidikan": return "bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400";
      case "Kesehatan": return "bg-rose-100 text-rose-700 dark:bg-rose-900/30 dark:text-rose-400";
      case "Transportasi": return "bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400";
      default: return "bg-slate-100 text-slate-700 dark:bg-slate-900/30 dark:text-slate-400";
    }
  };

  return (
    <section className="container mx-auto px-4 mt-8 md:mt-12 pb-24">
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
        {nearbyPlaces.map((place, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: i * 0.1, duration: 0.5 }}
            className={`flex flex-col rounded-2xl border bg-card shadow-sm hover:shadow-md transition-all duration-300 overflow-hidden ${place.imageUrl ? '' : 'p-5 justify-center'}`}
          >
            {place.imageUrl && (
              <div 
                className="relative aspect-video group cursor-pointer overflow-hidden bg-muted"
                onClick={() => setSelectedImage(place)}
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img 
                  src={place.imageUrl} 
                  alt={place.name} 
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center backdrop-blur-[2px]">
                  <ZoomIn className="w-8 h-8 text-white drop-shadow-lg" />
                </div>
              </div>
            )}
            
            <div className={`flex items-center gap-4 ${place.imageUrl ? 'p-5' : ''}`}>
              <div className={`p-3 rounded-xl flex-shrink-0 ${getColorForType(place.type)}`}>
                {getIconForType(place.type)}
              </div>
              <div className="flex-1 min-w-0">
                <h4 className="font-semibold text-foreground truncate">{place.name}</h4>
                <div className="flex items-center gap-2 mt-1 text-sm text-muted-foreground">
                  <Navigation className="w-3.5 h-3.5" />
                  <span>{place.distance}</span>
                  <span className="w-1 h-1 rounded-full bg-border mx-1"></span>
                  <span className="truncate">{place.type}</span>
                </div>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Lightbox Modal */}
      <AnimatePresence>
        {selectedImage && selectedImage.imageUrl && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-8 overflow-hidden"
            onClick={() => setSelectedImage(null)}
          >
            {/* Backdrop */}
            <div className="absolute inset-0 bg-black/90 backdrop-blur-sm" />

            {/* Close button */}
            <button
              className="absolute top-4 right-4 sm:top-8 sm:right-8 z-50 p-2 text-white/70 hover:text-white transition-colors rounded-full hover:bg-white/10"
              onClick={(e) => {
                e.stopPropagation();
                setSelectedImage(null);
              }}
            >
              <X className="w-8 h-8" />
            </button>

            {/* Image Container */}
            <motion.div
              initial={{ scale: 0.95 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.95 }}
              className="relative w-full max-w-5xl flex flex-col items-center justify-center"
              onClick={(e) => e.stopPropagation()}
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={selectedImage.imageUrl}
                alt={selectedImage.name}
                className="max-w-full max-h-[85vh] object-contain rounded-lg shadow-2xl"
              />
              <div className="mt-4 bg-black/50 backdrop-blur-md px-6 py-4 rounded-2xl border border-white/10 flex items-center gap-4">
                <div className="text-white">
                  <h4 className="font-semibold text-lg">{selectedImage.name}</h4>
                  <div className="flex items-center gap-2 text-white/70 text-sm mt-1">
                    <Navigation className="w-3.5 h-3.5" />
                    <span>{selectedImage.distance}</span>
                    <span className="w-1 h-1 rounded-full bg-white/20 mx-1"></span>
                    <span>{selectedImage.type}</span>
                  </div>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}
