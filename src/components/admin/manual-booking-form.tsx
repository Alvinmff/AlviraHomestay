"use client";

import { useState, useMemo } from "react";
import { useRouter } from "next/navigation";
import { format, differenceInDays } from "date-fns";
import { Calendar as CalendarIcon, Save, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import { createManualBookingWithAvailability, updateBookingWithAvailability } from "@/app/admin/(dashboard)/bookings/actions";

interface ManualBookingFormProps {
    properties: any[];
    initialData?: {
        id: string;
        guestName: string;
        guestPhone: string | null;
        propertyId: string;
        roomId: string;
        checkIn: Date;
        checkOut: Date;
        totalPrice: number;
        notes: string | null;
    };
}

export function ManualBookingForm({ properties, initialData }: ManualBookingFormProps) {
    const router = useRouter();
    const [loading, setLoading] = useState(false);

    const [guestName, setGuestName] = useState(initialData?.guestName || "");
    const [guestPhone, setGuestPhone] = useState(initialData?.guestPhone || "");
    const [propertyId, setPropertyId] = useState(initialData?.propertyId || "");
    const [roomId, setRoomId] = useState(initialData?.roomId || "");
    const [dateRange, setDateRange] = useState<{ from: Date | undefined; to: Date | undefined }>({
        from: initialData ? new Date(initialData.checkIn) : undefined,
        to: initialData ? new Date(initialData.checkOut) : undefined,
    });
    const [notes, setNotes] = useState(initialData?.notes || "");

    const selectedProperty = useMemo(() => properties.find(p => p.id === propertyId), [properties, propertyId]);
    const selectedRoom = useMemo(() => selectedProperty?.rooms.find((r: any) => r.id === roomId), [selectedProperty, roomId]);

    // Calculate generic price (basePrice * nights)
    const calculatedPrice = useMemo(() => {
        if (selectedRoom && dateRange.from && dateRange.to) {
            // differenceInDays counts nights accurately
            const nights = differenceInDays(dateRange.to, dateRange.from);
            return nights > 0 ? (nights * selectedRoom.basePrice) : selectedRoom.basePrice;
        }
        return 0;
    }, [selectedRoom, dateRange]);

    const [totalPriceOverride, setTotalPriceOverride] = useState<string>(initialData?.totalPrice?.toString() || "");

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!guestName || !propertyId || !roomId || !dateRange.from || !dateRange.to) {
            toast.error("Harap isi semua kolom wajib yang ditandai *");
            return;
        }

        const finalPrice = totalPriceOverride ? parseFloat(totalPriceOverride) : calculatedPrice;

        setLoading(true);
        try {
            if (initialData) {
                await updateBookingWithAvailability(initialData.id, {
                    guestName,
                    guestPhone: guestPhone || null,
                    propertyId,
                    roomId,
                    checkIn: dateRange.from,
                    checkOut: dateRange.to,
                    totalPrice: finalPrice,
                    notes: notes || null,
                });
                toast.success("Data booking berhasil diperbarui!");
            } else {
                await createManualBookingWithAvailability({
                    guestName,
                    guestPhone: guestPhone || null,
                    propertyId,
                    roomId,
                    checkIn: dateRange.from,
                    checkOut: dateRange.to,
                    totalPrice: finalPrice,
                    notes: notes || null,
                });
                toast.success("Booking manual berhasil dibuat!");
            }
            router.push("/admin/bookings");
            router.refresh();

        } catch (err: any) {
            toast.error(err.message || "Gagal menyimpan booking");
        } finally {
            setLoading(false);
        }
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-8">

            {/* 1. Data Tamu */}
            <div className="space-y-4">
                <h3 className="font-semibold text-lg border-b pb-2">Data Tamu</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                        <Label htmlFor="guestName">Nama Tamu <span className="text-red-500">*</span></Label>
                        <Input
                            id="guestName"
                            value={guestName}
                            onChange={(e) => setGuestName(e.target.value)}
                            placeholder="Contoh: Budi Santoso"
                            required
                        />
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="guestPhone">No. Telepon / WhatsApp</Label>
                        <Input
                            id="guestPhone"
                            value={guestPhone}
                            onChange={(e) => setGuestPhone(e.target.value)}
                            placeholder="Contoh: 08123456789"
                        />
                    </div>
                </div>
            </div>

            {/* 2. Detail Menginap */}
            <div className="space-y-4">
                <h3 className="font-semibold text-lg border-b pb-2">Detail Menginap</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                        <Label>Properti <span className="text-red-500">*</span></Label>
                        <select
                            value={propertyId}
                            onChange={(e) => { setPropertyId(e.target.value); setRoomId(""); }}
                            className="flex h-10 w-full items-center justify-between rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                            required
                        >
                            <option value="" disabled>-- Pilih Properti --</option>
                            {properties.map(p => (
                                <option key={p.id} value={p.id}>{p.name}</option>
                            ))}
                        </select>
                    </div>

                    <div className="space-y-2">
                        <Label>Kamar <span className="text-red-500">*</span></Label>
                        <select
                            value={roomId}
                            onChange={(e) => setRoomId(e.target.value)}
                            className="flex h-10 w-full items-center justify-between rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                            required
                            disabled={!propertyId}
                        >
                            <option value="" disabled>-- Pilih Kamar --</option>
                            {selectedProperty?.rooms.map((r: any) => (
                                <option key={r.id} value={r.id}>{r.roomNumber} - {r.roomName}</option>
                            ))}
                        </select>
                    </div>

                    <div className="space-y-2 md:col-span-2">
                        <Label>Tanggal Check-in & Check-out <span className="text-red-500">*</span></Label>
                        <Popover>
                            <PopoverTrigger className={cn("inline-flex w-full items-center justify-start rounded-md border border-input bg-transparent px-4 py-2 text-sm font-normal shadow-sm transition-colors hover:bg-accent hover:text-accent-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50", !dateRange.from && "text-muted-foreground", "h-10 text-left")}>
                                <CalendarIcon className="mr-2 h-4 w-4" />
                                {dateRange.from ? (
                                    dateRange.to ? (
                                        <>
                                            {format(dateRange.from, "dd MMM yyyy")} - {format(dateRange.to, "dd MMM yyyy")}
                                        </>
                                    ) : (
                                        format(dateRange.from, "dd MMM yyyy")
                                    )
                                ) : (
                                    <span>Pilih rentang tanggal</span>
                                )}
                            </PopoverTrigger>
                            <PopoverContent className="w-auto p-0" align="start">
                                <Calendar
                                    mode="range"
                                    selected={dateRange}
                                    onSelect={(r: any) => setDateRange(r || { from: undefined, to: undefined })}
                                    numberOfMonths={2}
                                    disabled={(date) => date < new Date(new Date().setHours(0, 0, 0, 0))}
                                />
                            </PopoverContent>
                        </Popover>
                    </div>
                </div>
            </div>

            {/* 3. Pembayaran & Catatan */}
            <div className="space-y-4">
                <h3 className="font-semibold text-lg border-b pb-2">Pembayaran & Catatan</h3>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                        <Label>Total Tagihan Aktual (Otomatis)</Label>
                        <div className="flex h-10 w-full items-center rounded-md border border-input bg-muted/50 px-3 py-2 text-sm font-semibold text-muted-foreground">
                            {new Intl.NumberFormat("id-ID", { style: "currency", currency: "IDR", minimumFractionDigits: 0 }).format(calculatedPrice)}
                        </div>
                        <p className="text-xs text-muted-foreground">Harga dasar kamar × jumlah malam.</p>
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="overridePrice">Harga Kesepakatan Khusus (Rp) (Opsional)</Label>
                        <Input
                            id="overridePrice"
                            type="number"
                            value={totalPriceOverride}
                            onChange={(e) => setTotalPriceOverride(e.target.value)}
                            placeholder={`Contoh: ${calculatedPrice || 500000}`}
                        />
                        <p className="text-xs text-muted-foreground">Isi ini hanya jika harga akhir berbeda dari harga sistem (diskon, dll).</p>
                    </div>

                    <div className="space-y-2 md:col-span-2">
                        <Label htmlFor="notes">Catatan Internal (Opsional)</Label>
                        <Textarea
                            id="notes"
                            value={notes}
                            onChange={(e) => setNotes(e.target.value)}
                            placeholder="Contoh: DP 50% via Transfer BCA. Tamu minta extra bed."
                            rows={3}
                        />
                    </div>
                </div>

            </div>

            <div className="pt-6 flex items-center justify-end gap-3 border-t">
                <Button
                    type="button"
                    variant="outline"
                    onClick={() => router.back()}
                    disabled={loading}
                >
                    Batal
                </Button>
                <Button
                    type="submit"
                    disabled={loading || !guestName || !propertyId || !roomId || !dateRange.from || !dateRange.to}
                >
                    {loading ? (
                        <>
                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                            {initialData ? "Memperbarui..." : "Menyimpan..."}
                        </>
                    ) : (
                        <>
                            <Save className="mr-2 h-4 w-4" />
                            {initialData ? "Simpan Perubahan" : "Simpan & Konfirmasi Booking"}
                        </>
                    )}
                </Button>
            </div>

        </form>
    );
}
