"use client";

import { useState } from "react";
import { CheckCircle2, XCircle, LogIn, CheckSquare, MoreHorizontal } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

export function BookingActions({ bookingId, currentStatus }: { bookingId: string, currentStatus: string }) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  async function updateStatus(newStatus: string) {
    try {
      setLoading(true);
      const res = await fetch(`/api/admin/bookings/${bookingId}/status`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: newStatus }),
      });
      
      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.error || "Gagal mengubah status");
      }
      
      toast.success(`Status berhasil diubah ke ${newStatus.replace("_", " ")}`);
      router.refresh();
    } catch (e: unknown) {
      toast.error((e as Error).message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="h-8 w-8 p-0" disabled={loading}>
          <span className="sr-only">Buka menu</span>
          <MoreHorizontal className="h-4 w-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuLabel>Aksi Reservasi</DropdownMenuLabel>
        <DropdownMenuSeparator />
        
        {currentStatus === "INQUIRY" && (
          <>
            <DropdownMenuItem onClick={() => updateStatus("CONFIRMED")} className="text-emerald-600 focus:text-emerald-600 focus:bg-emerald-50 font-medium">
              <CheckCircle2 className="mr-2 h-4 w-4" /> Konfirmasi Booking
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => updateStatus("CANCELLED")} className="text-red-600 focus:text-red-600 focus:bg-red-50 font-medium">
              <XCircle className="mr-2 h-4 w-4" /> Tolak / Batalkan
            </DropdownMenuItem>
          </>
        )}

        {currentStatus === "CONFIRMED" && (
          <>
            <DropdownMenuItem onClick={() => updateStatus("CHECKED_IN")} className="text-blue-600 focus:text-blue-600 focus:bg-blue-50 font-medium">
              <LogIn className="mr-2 h-4 w-4" /> Tamu Check-In
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => updateStatus("CANCELLED")} className="text-red-600 focus:text-red-600 focus:bg-red-50 font-medium">
              <XCircle className="mr-2 h-4 w-4" /> Batalkan Reservasi
            </DropdownMenuItem>
          </>
        )}

        {currentStatus === "CHECKED_IN" && (
          <DropdownMenuItem onClick={() => updateStatus("COMPLETED")} className="text-slate-600 focus:text-slate-600 focus:bg-slate-50 font-medium">
            <CheckSquare className="mr-2 h-4 w-4" /> Selesaikan Booking
          </DropdownMenuItem>
        )}

        {(currentStatus === "COMPLETED" || currentStatus === "CANCELLED") && (
          <DropdownMenuItem disabled className="opacity-50 text-xs text-muted-foreground flex justify-center py-2">
            Status Akhir (Terkunci)
          </DropdownMenuItem>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
