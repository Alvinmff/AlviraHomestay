"use client";

import { useState } from "react";
import { Info, ZoomIn } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from "@/components/ui/dialog";

interface BookingInfoDialogProps {
  booking: {
    guestName: string;
    guestPhone?: string | null;
    notes?: string | null;
    roomNumbers: string;
    checkIn: string;
    checkOut: string;
    guestCount: number;
    identityType?: string | null;
    identityNumber?: string | null;
    identityImage?: string | null;
  };
}

export function BookingInfoDialog({ booking }: BookingInfoDialogProps) {
  const [showFullImage, setShowFullImage] = useState(false);

  return (
    <>
      <Dialog>
        <DialogTrigger
          render={
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8 text-muted-foreground hover:text-primary"
            />
          }
        >
          <Info className="w-4 h-4" />
        </DialogTrigger>
        <DialogContent className="sm:max-w-[480px]">
          <DialogHeader>
            <DialogTitle className="font-serif text-xl">Informasi Reservasi</DialogTitle>
            <DialogDescription>
              Detail tambahan untuk pesanan atas nama <strong>{booking.guestName}</strong>.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="space-y-1">
              <h4 className="text-xs font-bold text-muted-foreground uppercase tracking-wider">Kamar</h4>
              <p className="text-sm font-medium">{booking.roomNumbers}</p>
            </div>
            <div className="space-y-1">
              <h4 className="text-xs font-bold text-muted-foreground uppercase tracking-wider">Jadwal</h4>
              <p className="text-sm">{booking.checkIn} - {booking.checkOut}</p>
            </div>
            <div className="space-y-1">
              <h4 className="text-xs font-bold text-muted-foreground uppercase tracking-wider">Jumlah Tamu</h4>
              <p className="text-sm">{booking.guestCount} Orang</p>
            </div>
            {booking.guestPhone && (
               <div className="space-y-1">
                  <h4 className="text-xs font-bold text-muted-foreground uppercase tracking-wider">WhatsApp</h4>
                  <p className="text-sm font-mono">{booking.guestPhone}</p>
               </div>
            )}
            {(booking.identityType || booking.identityNumber) && (
              <div className="space-y-1">
                <h4 className="text-xs font-bold text-muted-foreground uppercase tracking-wider">Identitas Tamu</h4>
                <div className="flex items-center gap-2">
                  {booking.identityType && (
                    <span className="bg-primary/10 text-primary text-xs font-bold px-2 py-0.5 rounded-full">
                      {booking.identityType}
                    </span>
                  )}
                  {booking.identityNumber && (
                    <span className="text-sm font-mono">{booking.identityNumber}</span>
                  )}
                </div>
              </div>
            )}
            {booking.identityImage && (
              <div className="space-y-1">
                <h4 className="text-xs font-bold text-muted-foreground uppercase tracking-wider">Foto Identitas</h4>
                <div
                  className="relative group cursor-pointer w-fit"
                  onClick={() => setShowFullImage(true)}
                >
                  <img
                    src={booking.identityImage}
                    alt="Foto Identitas"
                    className="max-h-36 rounded-lg border border-border object-contain bg-muted/20"
                  />
                  <div className="absolute inset-0 rounded-lg bg-black/0 group-hover:bg-black/30 flex items-center justify-center transition-colors">
                    <ZoomIn className="w-6 h-6 text-white opacity-0 group-hover:opacity-100 transition-opacity" />
                  </div>
                </div>
              </div>
            )}
            <div className="space-y-1">
              <h4 className="text-xs font-bold text-muted-foreground uppercase tracking-wider">Catatan Internal</h4>
              <div className="bg-muted/50 p-3 rounded-md text-sm whitespace-pre-wrap min-h-[80px]">
                {booking.notes || "Tidak ada catatan khusus."}
              </div>
            </div>
          </div>
          <DialogFooter showCloseButton />
        </DialogContent>
      </Dialog>

      {/* Full-size image modal */}
      {showFullImage && booking.identityImage && (
        <div
          className="fixed inset-0 z-[100] bg-black/80 flex items-center justify-center p-4 cursor-pointer"
          onClick={() => setShowFullImage(false)}
        >
          <img
            src={booking.identityImage}
            alt="Foto Identitas (Penuh)"
            className="max-w-full max-h-[90vh] rounded-lg object-contain shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          />
        </div>
      )}
    </>
  );
}

