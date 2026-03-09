"use client";

import { useState } from "react";
import { Calendar as CalendarIcon, MessageCircle } from "lucide-react";
import { format } from "date-fns";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface WhatsAppFormProps {
  propertyName: string;
  bookingOptions: { value: string; label: string; price?: number }[];
  defaultOption?: string;
  adminPhone: string; // WhatsApp number format: 628...
}

export function WhatsAppForm({
  propertyName,
  bookingOptions,
  defaultOption,
  adminPhone,
}: WhatsAppFormProps) {
  const [date, setDate] = useState<Date>();
  const [duration, setDuration] = useState("1");
  const [roomType, setRoomType] = useState(defaultOption || bookingOptions[0]?.value);
  const [guestName, setGuestName] = useState("");

  const handleBookNow = () => {
    if (!date || !guestName || !roomType) {
      alert("Mohon lengkapi nama pemesan, tanggal, dan tipe ruangan.");
      return;
    }

    const formattedDate = format(date, "dd MMMM yyyy");
    const optionSelected = bookingOptions.find(opt => opt.value === roomType)?.label || roomType;

    const message = `Halo Admin Homestay Alvira,

Saya ingin mengecek ketersediaan untuk booking:
*Properti:* ${propertyName}
*Tipe:* ${optionSelected}
*Nama:* ${guestName}
*Tanggal Check-in:* ${formattedDate}
*Durasi:* ${duration} Malam

Mohon info ketersediaan dan detail pembayarannya. Terima kasih!`;

    const encodedMessage = encodeURIComponent(message);
    const waUrl = `https://wa.me/${adminPhone}?text=${encodedMessage}`;
    
    window.open(waUrl, "_blank");
  };

  return (
    <div className="bg-card border rounded-2xl p-6 shadow-sm sticky top-24">
      <h3 className="text-xl font-serif font-bold mb-6 text-foreground">
        Cek Ketersediaan
      </h3>

      <div className="space-y-4 mb-6">
        {/* <AvailabilityViewer propertySlug={propertySlug} /> */}
      </div>

      <div className="space-y-4">
        {/* Guest Name */}
        <div className="space-y-2">
          <Label htmlFor="name">Nama Pemesan <span className="text-destructive">*</span></Label>
          <Input 
            id="name" 
            placeholder="Contoh: Budi Santoso" 
            value={guestName}
            onChange={(e) => setGuestName(e.target.value)}
          />
        </div>

        {/* Room / Type Selection */}
        <div className="space-y-2">
          <Label>Tipe Pilihan</Label>
          <Select value={roomType} onValueChange={(v) => v && setRoomType(v)}>
            <SelectTrigger className="w-full bg-background">
              <SelectValue placeholder="Pilih tipe" />
            </SelectTrigger>
            <SelectContent>
              {bookingOptions.map((opt) => (
                <SelectItem key={opt.value} value={opt.value}>
                  {opt.label} {opt.price && `- Rp ${opt.price.toLocaleString("id-ID")}`}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Date Selection */}
        <div className="space-y-2">
          <Label>Tanggal Check-in <span className="text-destructive">*</span></Label>
          <Popover>
            <PopoverTrigger 
              className={cn(
                "inline-flex items-center whitespace-nowrap rounded-lg border border-border h-9 px-4 w-full justify-start text-left font-normal bg-background hover:bg-muted/50 transition-colors shadow-sm",
                !date && "text-muted-foreground"
              )}
            >
              <CalendarIcon className="mr-2 h-4 w-4 text-primary" />
              {date ? format(date, "PPP") : <span>Pilih tanggal</span>}
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="start">
              <Calendar
                mode="single"
                selected={date}
                onSelect={setDate}
                initialFocus
                disabled={(date) => date < new Date(new Date().setHours(0, 0, 0, 0))}
              />
            </PopoverContent>
          </Popover>
        </div>

        {/* Duration Selection */}
        <div className="space-y-2">
          <Label>Durasi (Malam)</Label>
          <Select value={duration} onValueChange={(v) => v && setDuration(v)}>
            <SelectTrigger className="w-full bg-background">
              <SelectValue placeholder="Pilih durasi" />
            </SelectTrigger>
            <SelectContent>
              {[1, 2, 3, 4, 5, 6, 7].map((num) => (
                <SelectItem key={num} value={num.toString()}>
                  {num} Malam
                </SelectItem>
              ))}
              <SelectItem value="monthly">1 Bulan (Kost Surabaya)</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Divider */}
        <div className="h-px w-full bg-border my-6" />

        {/* Submit */}
        <Button 
          onClick={handleBookNow}
          className="w-full h-12 text-base font-semibold bg-[#25D366] hover:bg-[#20bd5a] text-white flex items-center justify-center gap-2 transition-all shadow-sm"
        >
          <MessageCircle className="w-5 h-5" />
          Tanya via WhatsApp
        </Button>
        <p className="text-xs text-center text-muted-foreground mt-3">
          Anda akan diarahkan ke WhatsApp Admin untuk konfirmasi ketersediaan & pembayaran.
        </p>
      </div>
    </div>
  );
}
