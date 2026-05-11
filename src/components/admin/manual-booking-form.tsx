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
import { createManualBookingWithAvailability, updateBookingWithAvailability } from "@/app/admin/(dashboard)/bookings/actions";
import { MultiSelect } from "@/components/ui/multi-select";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

// Normalize a local date to noon UTC so the calendar date is preserved
// regardless of the server's timezone (prevents ±1 day shift).
function toNoonUTC(date: Date): Date {
    return new Date(Date.UTC(date.getFullYear(), date.getMonth(), date.getDate(), 12, 0, 0));
}

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
    const [roomIds, setRoomIds] = useState<string[]>(initialData?.roomId ? [initialData.roomId] : []);
    const [dateRange, setDateRange] = useState<{ from: Date | undefined; to: Date | undefined }>({
        from: initialData ? new Date(initialData.checkIn) : undefined,
        to: initialData ? new Date(initialData.checkOut) : undefined,
    });
    const [notes, setNotes] = useState(initialData?.notes || "");
    const [dpAmount, setDpAmount] = useState<string>("0");

    const selectedProperty = useMemo(() => properties.find(p => p.id === propertyId), [properties, propertyId]);
    const selectedRooms = useMemo(() => {
        if (!selectedProperty) return [];
        return selectedProperty.rooms.filter((r: any) => roomIds.includes(r.id));
    }, [selectedProperty, roomIds]);

    // Calculate generic price (sum of basePrice * nights for all rooms)
    const calculatedPrice = useMemo(() => {
        if (selectedRooms.length > 0 && dateRange.from && dateRange.to) {
            const nights = differenceInDays(dateRange.to, dateRange.from) || 1;
            const total = selectedRooms.reduce((sum: number, room: any) => sum + (nights * room.basePrice), 0);
            return total;
        }
        return 0;
    }, [selectedRooms, dateRange]);

    const [totalPriceOverride, setTotalPriceOverride] = useState<string>(initialData?.totalPrice?.toString() || "");

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!guestName || !propertyId || roomIds.length === 0 || !dateRange.from || !dateRange.to) {
            toast.error("Harap isi semua kolom wajib yang ditandai *");
            return;
        }

        const finalPrice = totalPriceOverride ? parseFloat(totalPriceOverride) : calculatedPrice;
        const pricePerRoom = finalPrice / (roomIds.length || 1);

        setLoading(true);
        try {
            if (initialData) {
                // If editing, we currently only support editing one booking at a time
                await updateBookingWithAvailability(initialData.id, {
                    guestName,
                    guestPhone: guestPhone || null,
                    propertyId,
                    roomId: roomIds[0],
                    checkIn: toNoonUTC(dateRange.from),
                    checkOut: toNoonUTC(dateRange.to),
                    totalPrice: finalPrice,
                    notes: notes || null,
                });
                toast.success("Data booking berhasil diperbarui!");
            } else {
                // For new bookings, loop through all selected rooms
                for (const rId of roomIds) {
                    const parsedDP = parseInt(dpAmount);
                    const finalNotes = dpAmount && !isNaN(parsedDP) && parsedDP !== 0 
                        ? `${notes}\n\n[DP: Rp ${parsedDP.toLocaleString('id-ID')}]`.trim()
                        : notes;

                    await createManualBookingWithAvailability({
                        guestName,
                        guestPhone: guestPhone || null,
                        propertyId,
                        roomId: rId,
                        checkIn: toNoonUTC(dateRange.from),
                        checkOut: toNoonUTC(dateRange.to),
                        totalPrice: pricePerRoom,
                        notes: finalNotes || null,
                    });
                }
                toast.success(`Berhasil membuat ${roomIds.length} booking untuk ${guestName}`);
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
                            onChange={(e) => { setPropertyId(e.target.value); setRoomIds([]); }}
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
                        {propertyId ? (
                            <MultiSelect
                                options={selectedProperty?.rooms.map((r: any) => ({
                                    label: `${r.roomNumber} - ${r.roomName}`,
                                    value: r.id
                                })) || []}
                                selected={roomIds}
                                onChange={setRoomIds}
                                placeholder="Pilih satu atau lebih kamar..."
                            />
                        ) : (
                            <div className="h-10 w-full rounded-md border border-input bg-muted/50 px-3 py-2 text-sm text-muted-foreground flex items-center">
                                Pilih properti terlebih dahulu
                            </div>
                        )}
                        {roomIds.length > 0 && (
                            <div className="flex items-center gap-2 mt-2">
                                <Badge variant="outline" className="bg-primary/5 text-primary border-primary/20">
                                    Jumlah Kamar: {roomIds.length}
                                </Badge>
                            </div>
                        )}
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
                        {selectedRooms.length > 0 && dateRange.from && dateRange.to && (
                            <p className="text-xs text-muted-foreground font-mono">
                                {new Intl.NumberFormat("id-ID").format(selectedRooms.reduce((sum: number, r: any) => sum + r.basePrice, 0))} x {differenceInDays(dateRange.to, dateRange.from) || 1} malam = {new Intl.NumberFormat("id-ID").format(calculatedPrice)}
                            </p>
                        )}
                        <p className="text-[10px] text-muted-foreground mt-1">Harga dasar kamar × jumlah malam.</p>
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="dpAmount">DP (Uang Muka)</Label>
                        <Input
                            id="dpAmount"
                            type="number"
                            value={dpAmount}
                            onChange={(e) => setDpAmount(e.target.value)}
                            className="h-10"
                            placeholder="0"
                        />
                        <p className="text-xs text-muted-foreground">Masukkan jumlah pembayaran awal jika ada.</p>
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
                        <p className="text-xs text-muted-foreground">Gunakan jika harga akhir berbeda dari sistem.</p>
                    </div>

                    <div className="space-y-2">
                        <Label>Info Sisa Pembayaran</Label>
                        <div className="flex h-10 w-full items-center rounded-md border border-input bg-emerald-500/5 px-3 py-2 text-sm font-bold text-emerald-600">
                            Sisa: {new Intl.NumberFormat("id-ID", { style: "currency", currency: "IDR", minimumFractionDigits: 0 }).format(
                                Math.max(0, (totalPriceOverride ? parseFloat(totalPriceOverride) : calculatedPrice) - (parseInt(dpAmount) || 0))
                            )}
                        </div>
                        <p className="text-[10px] text-muted-foreground mt-1">Total dikurangi uang muka (DP).</p>
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
                    disabled={loading || !guestName || !propertyId || roomIds.length === 0 || !dateRange.from || !dateRange.to}
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
