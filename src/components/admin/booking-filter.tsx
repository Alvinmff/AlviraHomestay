"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { Filter } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";

interface BookingFilterProps {
  properties: { id: string, name: string }[];
}

export function BookingFilter({ properties }: BookingFilterProps) {
  const router = useRouter();
  const searchParams = useSearchParams();

  const currentStatus = searchParams.get("status") ?? "ALL";
  const currentProperty = searchParams.get("propertyId") ?? "ALL";
  const currentSort = searchParams.get("sort") ?? "date_desc";

  function updateFilter(key: string, value: string) {
    const params = new URLSearchParams(searchParams.toString());
    if (value === "ALL" && key !== "sort") {
      params.delete(key);
    } else {
      params.set(key, value);
    }
    router.push(`/admin/bookings?${params.toString()}`);
  }

  function resetFilters() {
    router.push("/admin/bookings");
  }

  const hasFilters = currentStatus !== "ALL" || currentProperty !== "ALL" || currentSort !== "date_desc";

  return (
    <Popover>
      <PopoverTrigger
        className={`inline-flex items-center justify-center gap-2 self-start sm:self-auto rounded-md border px-4 py-2 text-sm font-medium transition-colors ${
          hasFilters
            ? "bg-primary text-primary-foreground hover:bg-primary/90 border-primary"
            : "bg-transparent text-muted-foreground hover:bg-accent hover:text-accent-foreground border-input"
        }`}
      >
        <Filter className="w-4 h-4" />
        {hasFilters ? "Filter Aktif" : "Filter & Urutkan"}
      </PopoverTrigger>
      <PopoverContent className="w-80 p-4" align="end">
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h4 className="font-medium leading-none">Filter & Urutkan</h4>
            {hasFilters && (
              <button
                className="text-xs text-muted-foreground hover:text-primary transition-colors"
                onClick={resetFilters}
              >
                Reset
              </button>
            )}
          </div>
          
          <div className="grid gap-2">
            <Label htmlFor="status" className="text-xs">Status Reservasi</Label>
            <Select value={currentStatus} onValueChange={(v: string | null) => v && updateFilter("status", v)}>
              <SelectTrigger id="status" className="h-9">
                <SelectValue placeholder="Pilih Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="ALL">Semua Status</SelectItem>
                <SelectItem value="CONFIRMED">Booking</SelectItem>
                <SelectItem value="CHECKED_IN">Check-in</SelectItem>
                <SelectItem value="COMPLETED">Selesai</SelectItem>
                <SelectItem value="CANCELLED">Dibatalkan</SelectItem>
                <SelectItem value="INQUIRY">Inquiry</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="grid gap-2">
            <Label htmlFor="property" className="text-xs">Properti</Label>
            <Select value={currentProperty} onValueChange={(v: string | null) => v && updateFilter("propertyId", v)}>
              <SelectTrigger id="property" className="h-9">
                <SelectValue placeholder="Pilih Properti" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="ALL">Semua Properti</SelectItem>
                {properties.map((p) => (
                  <SelectItem key={p.id} value={p.id}>{p.name}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="grid gap-2">
            <Label htmlFor="sort" className="text-xs">Urutkan Berdasarkan</Label>
            <Select value={currentSort} onValueChange={(v: string | null) => v && updateFilter("sort", v)}>
              <SelectTrigger id="sort" className="h-9">
                <SelectValue placeholder="Pilih Urutan" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="date_desc">Check-in Terbaru</SelectItem>
                <SelectItem value="date_asc">Check-in Terlama</SelectItem>
                <SelectItem value="price_desc">Harga Tertinggi</SelectItem>
                <SelectItem value="price_asc">Harga Terendah</SelectItem>
                <SelectItem value="created_desc">Waktu Entry Terbaru</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </PopoverContent>
    </Popover>
  );
}
