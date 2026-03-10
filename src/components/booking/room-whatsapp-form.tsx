"use client";

import { useState } from "react";
import { format } from "date-fns";
import { Calendar as CalendarIcon, MessageCircle } from "lucide-react";
import { cn, generateWALink, WA_TEMPLATES } from "@/lib/utils";
import { Button, buttonVariants } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { AvailabilityViewer } from "./availability-viewer";

interface RoomWhatsAppFormProps {
  roomName: string;
  roomId: string;
  propertyCity: string;
  propertyName: string;
  basePrice: number;
}

export function RoomWhatsAppForm({ roomName, roomId, propertyCity, propertyName, basePrice }: RoomWhatsAppFormProps) {
  const [dateRange, setDateRange] = useState<{
    from: Date | undefined;
    to: Date | undefined;
  }>({
    from: undefined,
    to: undefined,
  });

  const [guestName, setGuestName] = useState("");

  const formatRupiah = (number: number) => {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      minimumFractionDigits: 0,
    }).format(number);
  };

  const handleWhatsAppBooking = () => {
    if (!dateRange.from || !guestName) {
      alert("Harap isi nama dan pilih tanggal check-in.");
      return;
    }

    const checkIn = format(dateRange.from, "dd MMMM yyyy");
    const checkOut = dateRange.to ? format(dateRange.to, "dd MMMM yyyy") : "Belum ditentukan";

    // Calculate nights for price estimation
    let nightCount = 1;
    if (dateRange.from && dateRange.to) {
      const diffTime = Math.abs(dateRange.to.getTime() - dateRange.from.getTime());
      nightCount = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    }

    const estimatedTotal = (basePrice * nightCount).toLocaleString('id-ID');

    const message = `Halo Admin Alvira Homestay, saya ingin menanyakan ketersediaan kamar:

*Properti:* ${propertyName} (${propertyCity})
*Kamar:* ${roomName}

*Detail Pesanan:*
Nama: ${guestName}
Check-in: ${checkIn}
Check-out: ${checkOut}
Durasi: ${nightCount} Malam
Estimasi Harga: Rp ${estimatedTotal}

Apakah kamar ini tersedia untuk tanggal tersebut? Terima kasih.`;

    const adminWhatsAppNumber = "6281234567890"; // Ganti dengan nomor asli nanti
    const whatsappUrl = `https://wa.me/${adminWhatsAppNumber}?text=${encodeURIComponent(message)}`;

    window.open(whatsappUrl, "_blank");
  };

  return (
    <div className="space-y-6">

      <div className="bg-primary/5 rounded-xl p-4 border border-primary/10">
        <AvailabilityViewer roomId={roomId} />
      </div>

      <div className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="guestName">Nama Lengkap</Label>
          <Input
            id="guestName"
            placeholder="Masukkan nama Anda"
            value={guestName}
            onChange={(e) => setGuestName(e.target.value)}
          />
        </div>

        <div className="space-y-2">
          <Label>Pilih Tanggal Menginap</Label>
          <div className="grid gap-2">
            <Popover>
              <PopoverTrigger
                id="date"
                className={cn(
                  buttonVariants({ variant: "outline" }),
                  "w-full justify-start text-left font-normal",
                  !dateRange.from && "text-muted-foreground"
                )}
              >
                <CalendarIcon className="mr-2 h-4 w-4 text-primary" />
                {dateRange.from ? (
                  dateRange.to ? (
                    <>
                      {format(dateRange.from, "LLL dd, y")} -{" "}
                      {format(dateRange.to, "LLL dd, y")}
                    </>
                  ) : (
                    format(dateRange.from, "LLL dd, y")
                  )
                ) : (
                  <span>Pilih tanggal check-in & check-out</span>
                )}
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="start">
                {/* @ts-expect-error Bypass react-day-picker Mode conflict */}
                <Calendar
                  initialFocus
                  mode="range"
                  defaultMonth={dateRange?.from}
                  selected={dateRange}
                  onSelect={(range: { from: Date | undefined, to?: Date | undefined }) => setDateRange({ from: range?.from, to: range?.to })}
                  numberOfMonths={2}
                  disabled={(date) => date < new Date(new Date().setHours(0, 0, 0, 0))}
                />
              </PopoverContent>
            </Popover>
          </div>
        </div>
      </div>

      <div className="pt-4 border-t border-border/50">
        <div className="flex justify-between items-center mb-4">
          <span className="text-sm text-muted-foreground">Harga Estimasi:</span>
          <span className="text-lg font-bold text-foreground">
            {dateRange.from && dateRange.to
              ? formatRupiah(basePrice * Math.max(1, Math.ceil(Math.abs(dateRange.to.getTime() - dateRange.from.getTime()) / (1000 * 60 * 60 * 24))))
              : formatRupiah(basePrice)
            }
          </span>
        </div>
        <Button
          onClick={handleWhatsAppBooking}
          className="w-full bg-[#25D366] hover:bg-[#128C7E] text-white flex items-center justify-center gap-2"
        >
          <MessageCircle className="w-5 h-5" />
          Pesan via WhatsApp
        </Button>
        <div className="mt-4 text-center">
          <a
            href={generateWALink("081231646523", WA_TEMPLATES.general)}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center text-sm font-medium text-muted-foreground hover:text-primary transition-colors"
          >
            Hanya ingin bertanya? <span className="underline ml-1">Hubungi Admin</span>
          </a>
        </div>
      </div>

    </div>
  );
}
