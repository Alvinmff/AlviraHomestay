"use client";

import { useState } from "react";
import { format, addDays } from "date-fns";
import { Calendar as CalendarIcon, MessageCircle, Info } from "lucide-react";
import { cn, generateWALink, WA_TEMPLATES } from "@/lib/utils";
import { isWeekendOrHoliday } from "@/lib/holidays";
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
  weekendPrice: number;
  hidePrice?: boolean;
}

export function RoomWhatsAppForm({ roomName, roomId, propertyCity, propertyName, basePrice, weekendPrice, hidePrice = false }: RoomWhatsAppFormProps) {
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
    let nightCount = 0;
    let weekdayCount = 0;
    let weekendCount = 0;
    let estimatedTotalNum = 0;

    if (dateRange.from && dateRange.to) {
      let currentDate = dateRange.from;
      // Loop until the day before check-out
      while (currentDate < dateRange.to) {
        nightCount++;
        if (isWeekendOrHoliday(currentDate)) {
          estimatedTotalNum += weekendPrice;
          weekendCount++;
        } else {
          estimatedTotalNum += basePrice;
          weekdayCount++;
        }
        currentDate = addDays(currentDate, 1);
      }
    } else {
      nightCount = 1;
      estimatedTotalNum = isWeekendOrHoliday(dateRange.from) ? weekendPrice : basePrice;
      if (isWeekendOrHoliday(dateRange.from)) weekendCount = 1; else weekdayCount = 1;
    }

    const estimatedTotal = estimatedTotalNum.toLocaleString('id-ID');

    let breakdownStr = "";
    if (weekdayCount > 0) breakdownStr += `- Weekday: ${weekdayCount} malam\n`;
    if (weekendCount > 0) breakdownStr += `- Weekend/Libur: ${weekendCount} malam\n`;

    const message = hidePrice
      ? `Halo Admin Alvira Homestay, saya ingin menanyakan ketersediaan kamar:

*Properti:* ${propertyName} (${propertyCity})
*Kamar:* ${roomName}

*Detail Pesanan:*
Nama: ${guestName}
Check-in: ${checkIn}
Check-out: ${checkOut}
Durasi: ${nightCount} Malam

Mohon informasi harga untuk jumlah tamu yang akan menginap. Terima kasih.`
      : `Halo Admin Alvira Homestay, saya ingin menanyakan ketersediaan kamar:

*Properti:* ${propertyName} (${propertyCity})
*Kamar:* ${roomName}

*Detail Pesanan:*
Nama: ${guestName}
Check-in: ${checkIn}
Check-out: ${checkOut}
Durasi: ${nightCount} Malam

*Rincian Harga:*
${breakdownStr.trim()}
Estimasi Harga: Rp ${estimatedTotal}
${nightCount >= 7 ? "\n_(Pesan: Mohon informasi untuk harga khusus mingguan)_" : ""}

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
          
          {/* Price Details Information below calendar */}
          {!hidePrice && (
          <div className="mt-3 p-3 bg-muted/30 rounded-lg text-xs space-y-1.5 border border-border/50">
            <div className="flex justify-between text-muted-foreground">
              <span>Harga Weekday (Sen-Kam):</span>
              <span className="font-semibold text-foreground">{formatRupiah(basePrice)} / malam</span>
            </div>
            <div className="flex justify-between text-muted-foreground">
              <span>Harga Weekend/Libur (Jum-Min):</span>
              <span className="font-semibold text-foreground">{formatRupiah(weekendPrice)} / malam</span>
            </div>
          </div>
          )}
          {hidePrice && (
          <div className="mt-3 p-3 bg-primary/5 rounded-lg text-xs border border-primary/10">
            <p className="text-sm font-medium text-primary">Harga menyesuaikan jumlah tamu</p>
            <p className="text-muted-foreground mt-1">Hubungi admin untuk mendapatkan informasi harga terbaru.</p>
          </div>
          )}
        </div>
      </div>

      <div className="pt-4 border-t border-border/50">
        {dateRange.from && dateRange.to && (
          <div className="flex justify-between items-center mb-2">
            <span className="text-sm text-muted-foreground">Durasi Menginap:</span>
            <span className="text-sm font-semibold text-foreground">
              {Math.max(1, Math.ceil(Math.abs(dateRange.to.getTime() - dateRange.from.getTime()) / (1000 * 60 * 60 * 24)))} Malam
            </span>
          </div>
        )}
        <div className="flex justify-between items-center mb-2">
          <span className="text-sm font-semibold text-foreground">Total Estimasi:</span>
          <span className="text-xl font-bold text-primary">
            {hidePrice ? (
              "Hubungi Admin"
            ) : (
            (() => {
              if (dateRange.from && dateRange.to) {
                let total = 0;
                let cur = dateRange.from;
                while (cur < dateRange.to) {
                  total += isWeekendOrHoliday(cur) ? weekendPrice : basePrice;
                  cur = addDays(cur, 1);
                }
                // Handle same day selection edge case
                if (total === 0) total = isWeekendOrHoliday(dateRange.from) ? weekendPrice : basePrice;
                return formatRupiah(total);
              }
              return formatRupiah(dateRange.from && isWeekendOrHoliday(dateRange.from) ? weekendPrice : basePrice);
            })()
            )}
          </span>
        </div>

        {dateRange.from && dateRange.to && Math.ceil(Math.abs(dateRange.to.getTime() - dateRange.from.getTime()) / (1000 * 60 * 60 * 24)) >= 7 && (
          <div className="flex items-start gap-2 text-xs text-amber-600 bg-amber-50 p-2 rounded-md mb-4 border border-amber-200">
            <Info className="w-4 h-4 shrink-0 mt-0.5" />
            <p>* Hubungi admin untuk mendapatkan harga khusus mingguan/bulanan.</p>
          </div>
        )}

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
