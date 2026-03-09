"use client";

import { MapPin } from "lucide-react";

interface PropertyMapProps {
  mapEmbedUrl?: string; // e.g: Source URL from a Google Maps iframe
  addressStr: string;
  city: string;
}

export function PropertyMap({ mapEmbedUrl, addressStr, city }: PropertyMapProps) {
  return (
    <div className="flex flex-col space-y-4 w-full h-full">
      <div className="flex items-start gap-3 p-4 bg-muted/50 rounded-xl border border-border/50">
        <MapPin className="w-5 h-5 text-primary mt-1 shrink-0" />
        <div>
          <h4 className="font-semibold text-foreground">Lokasi di {city}</h4>
          <p className="text-muted-foreground text-sm mt-1 leading-relaxed">
            {addressStr}
          </p>
        </div>
      </div>

      <div className="w-full h-[300px] md:h-[400px] rounded-xl overflow-hidden border bg-muted relative">
        {mapEmbedUrl ? (
           <iframe
             src={mapEmbedUrl}
             width="100%"
             height="100%"
             style={{ border: 0 }}
             allowFullScreen={false}
             loading="lazy"
             referrerPolicy="no-referrer-when-downgrade"
             className="absolute inset-0 w-full h-full filter grayscale-[0.2] contrast-[0.9] hover:grayscale-0 transition-all duration-500"
             title={`Map location of ${city} property`}
           ></iframe>
        ) : (
           <div className="absolute inset-0 flex flex-col items-center justify-center text-muted-foreground">
             <MapPin className="w-8 h-8 mb-2 opacity-50" />
             <span className="font-serif italic text-sm">Peta Interaktif belum tersedia</span>
           </div>
        )}
      </div>
    </div>
  );
}
