"use client";

import { Info } from "lucide-react";
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
  };
}

export function BookingInfoDialog({ booking }: BookingInfoDialogProps) {
  return (
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
      <DialogContent className="sm:max-w-[425px]">
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
          {booking.guestPhone && (
             <div className="space-y-1">
                <h4 className="text-xs font-bold text-muted-foreground uppercase tracking-wider">WhatsApp</h4>
                <p className="text-sm font-mono">{booking.guestPhone}</p>
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
  );
}
