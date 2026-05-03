"use client";

import { useState } from "react";
import { PropertyRoomsClient } from "./PropertyRoomsClient";
import { PropertyGallery } from "./PropertyGallery";
import { PropertyNearby } from "./PropertyNearby";
import { LayoutGrid, ImageIcon, Map } from "lucide-react";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function PropertyContentTabs({ property, initialRooms }: { property: any, initialRooms: any }) {
  const [activeTab, setActiveTab] = useState<"kamar" | "fasilitas" | "kawasan">("kamar");

  const galleryImages = (() => {
    if (!property.gallery) return [];
    try {
      const parsed = typeof property.gallery === "string" ? JSON.parse(property.gallery) : property.gallery;
      if (Array.isArray(parsed)) {
        // Map string array to object array if legacy
        if (parsed.length > 0 && typeof parsed[0] === "string") {
          return parsed.map((url: string) => ({ url, description: "" }));
        }
        return parsed;
      }
    } catch {
      // ignore
    }
    return [];
  })();

  const hasGallery = property.slug === "surabaya" || galleryImages.length > 0;

  return (
    <div className="container mx-auto px-4 mt-8 md:mt-12">
      {/* Stylish Tabs */}
      <div className="flex justify-center mb-8">
        <div className="inline-flex items-center p-1.5 bg-muted/50 rounded-2xl border border-border/50 shadow-sm">
          <button
            onClick={() => setActiveTab("kamar")}
            className={`flex items-center gap-2 px-6 py-3 rounded-xl font-semibold text-sm transition-all duration-300 ${
              activeTab === "kamar"
                ? "bg-background text-primary shadow-md"
                : "text-muted-foreground hover:text-foreground hover:bg-background/50"
            }`}
          >
            <LayoutGrid className="w-4 h-4" />
            <span className="hidden sm:inline">Pilihan</span> Kamar
          </button>
          
          {hasGallery && (
            <button
              onClick={() => setActiveTab("fasilitas")}
              className={`flex items-center gap-2 px-4 sm:px-6 py-3 rounded-xl font-semibold text-sm transition-all duration-300 ${
                activeTab === "fasilitas"
                  ? "bg-background text-primary shadow-md"
                  : "text-muted-foreground hover:text-foreground hover:bg-background/50"
              }`}
            >
              <ImageIcon className="w-4 h-4" />
              <span className="hidden sm:inline">Galeri</span> Fasilitas
            </button>
          )}

          <button
            onClick={() => setActiveTab("kawasan")}
            className={`flex items-center gap-2 px-4 sm:px-6 py-3 rounded-xl font-semibold text-sm transition-all duration-300 ${
              activeTab === "kawasan"
                ? "bg-background text-primary shadow-md"
                : "text-muted-foreground hover:text-foreground hover:bg-background/50"
            }`}
          >
            <Map className="w-4 h-4" />
            <span className="hidden sm:inline">Kawasan</span> Terdekat
          </button>
        </div>
      </div>

      {/* Content Rendering */}
      <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
        {activeTab === "kamar" ? (
          // Adjusted the wrapper since PropertyRoomsClient already has a container class, we might have nested containers. 
          // PropertyRoomsClient adds container mx-auto. That's fine, we'll just render it.
          <div className="-mx-4">
            <PropertyRoomsClient property={property} initialRooms={initialRooms} />
          </div>
        ) : activeTab === "fasilitas" && hasGallery ? (
          <div className="-mx-4">
            <PropertyGallery images={galleryImages} />
          </div>
        ) : activeTab === "kawasan" ? (
          <div className="-mx-4">
            <PropertyNearby places={property.nearbyPlaces} />
          </div>
        ) : null}
      </div>
    </div>
  );
}
