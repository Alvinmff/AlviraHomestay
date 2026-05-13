"use client";

import { useState, useMemo, useEffect } from "react";
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
import { createManualBookingWithAvailability, updateBookingWithAvailability, updateGroupedBooking } from "@/app/admin/(dashboard)/bookings/actions";
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
        roomIds?: string[];
        checkIn: Date;
        checkOut: Date;
        totalPrice: number;
        notes: string | null;
        dpAmount: number | null;
        guestCount: number;
        groupId?: string | null;
        allBookingIds?: string[];
        roomDetails?: { roomId: string; checkIn: Date; checkOut: Date }[];
    };
}

export function ManualBookingForm({ properties, initialData }: ManualBookingFormProps) {
    const router = useRouter();
    const [loading, setLoading] = useState(false);

    const [guestName, setGuestName] = useState(initialData?.guestName || "");
    const [guestPhone, setGuestPhone] = useState(initialData?.guestPhone || "");
    const [propertyId, setPropertyId] = useState(initialData?.propertyId || "");
    // Saat edit, gunakan roomIds dari grup (semua kamar), fallback ke roomId tunggal
    const [roomIds, setRoomIds] = useState<string[]>(
        initialData?.roomIds && initialData.roomIds.length > 0
            ? initialData.roomIds
            : initialData?.roomId ? [initialData.roomId] : []
    );
    const [dateRange, setDateRange] = useState<{ from: Date | undefined; to: Date | undefined }>({
        from: initialData ? new Date(initialData.checkIn) : undefined,
        to: initialData ? new Date(initialData.checkOut) : undefined,
    });
    const [notes, setNotes] = useState(initialData?.notes || "");
    const [dpAmount, setDpAmount] = useState<string>(initialData?.dpAmount?.toString() || "0");
    const [guestCount, setGuestCount] = useState<string>(initialData?.guestCount?.toString() || "1");
    
    // 🔥 TAMBAHAN: State untuk tanggal berbeda per kamar
    const [differentDatesPerRoom, setDifferentDatesPerRoom] = useState(false);
    const [roomDates, setRoomDates] = useState<Record<string, { from: Date | undefined; to: Date | undefined }>>({});

    // Inisialisasi roomDates dari initialData jika ada (untuk edit)
    useEffect(() => {
        if (initialData?.roomDetails && initialData.roomDetails.length > 1) {
            const initialRoomDates: Record<string, { from: Date; to: Date }> = {};
            let isDifferent = false;
            const firstIn = initialData.roomDetails[0].checkIn.getTime();
            const firstOut = initialData.roomDetails[0].checkOut.getTime();

            initialData.roomDetails.forEach(detail => {
                initialRoomDates[detail.roomId] = { from: new Date(detail.checkIn), to: new Date(detail.checkOut) };
                if (detail.checkIn.getTime() !== firstIn || detail.checkOut.getTime() !== firstOut) {
                    isDifferent = true;
                }
            });
            setRoomDates(initialRoomDates);
            setDifferentDatesPerRoom(isDifferent);
        }
    }, [initialData]);

    // Sinkronisasi roomDates saat roomIds berubah
    useEffect(() => {
        setRoomDates(prev => {
            const next = { ...prev };
            roomIds.forEach(id => {
                if (!next[id]) {
                    next[id] = { from: dateRange.from, to: dateRange.to };
                }
            });
            return next;
        });
    }, [roomIds, dateRange.from, dateRange.to]);

    const handleRoomDateChange = (roomId: string, range: { from: Date | undefined; to: Date | undefined }) => {
        setRoomDates(prev => ({ ...prev, [roomId]: range }));
    };

    const selectedProperty = useMemo(() => properties.find(p => p.id === propertyId), [properties, propertyId]);
    const selectedRooms = useMemo(() => {
        if (!selectedProperty) return [];
        return selectedProperty.rooms.filter((r: any) => roomIds.includes(r.id));
    }, [selectedProperty, roomIds]);

    // Calculate generic price
    const calculatedPrice = useMemo(() => {
        if (roomIds.length === 0) return 0;

        if (differentDatesPerRoom) {
            let total = 0;
            roomIds.forEach(id => {
                const range = roomDates[id] || dateRange;
                const room = selectedProperty?.rooms.find((r: any) => r.id === id);
                if (range.from && range.to && room) {
                    const nights = differenceInDays(range.to, range.from) || 1;
                    total += (nights * room.basePrice);
                }
            });
            return total;
        } else {
            if (selectedRooms.length > 0 && dateRange.from && dateRange.to) {
                const nights = differenceInDays(dateRange.to, dateRange.from) || 1;
                return selectedRooms.reduce((sum: number, room: any) => sum + (nights * room.basePrice), 0);
            }
        }
        return 0;
    }, [selectedRooms, dateRange, differentDatesPerRoom, roomDates, roomIds, selectedProperty]);

    // Saat edit, selalu inisialisasi totalPriceOverride dari harga total grup
    const [totalPriceOverride, setTotalPriceOverride] = useState<string>(
        initialData?.totalPrice?.toString() || ""
    );

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!guestName || !propertyId || roomIds.length === 0 || !dateRange.from || !dateRange.to) {
            toast.error("Harap isi semua kolom wajib yang ditandai *");
            return;
        }

        const finalPrice = totalPriceOverride ? parseFloat(totalPriceOverride) : calculatedPrice;
        const pricePerRoom = Math.round(finalPrice / (roomIds.length || 1));

        // Validasi tanggal jika berbeda per kamar
        if (differentDatesPerRoom) {
            const allSet = roomIds.every(id => roomDates[id]?.from && roomDates[id]?.to);
            if (!allSet) {
                toast.error("Harap tentukan tanggal untuk semua kamar");
                return;
            }
        } else if (!dateRange.from || !dateRange.to) {
            toast.error("Harap tentukan rentang tanggal menginap");
            return;
        }

        setLoading(true);
        try {
            if (initialData) {
                const commonData = {
                    guestName,
                    guestPhone: guestPhone || null,
                    propertyId,
                    notes: notes || null,
                    dpAmount: Math.round(Number(dpAmount)) || 0,
                    guestCount: parseInt(guestCount) || 1,
                };

                // Jika ada multiple booking IDs (grouped booking), gunakan updateGroupedBooking
                if (initialData.allBookingIds && initialData.allBookingIds.length > 1) {
                    const roomDetails = differentDatesPerRoom ? roomIds.map(id => ({
                        roomId: id,
                        checkIn: toNoonUTC(roomDates[id].from!),
                        checkOut: toNoonUTC(roomDates[id].to!),
                    })) : undefined;

                    await updateGroupedBooking(initialData.allBookingIds, {
                        ...commonData,
                        checkIn: toNoonUTC(dateRange.from!),
                        checkOut: toNoonUTC(dateRange.to!),
                        totalPrice: Math.round(finalPrice),
                        roomIds: roomIds,
                        groupId: initialData.groupId || undefined,
                        roomDetails,
                    });
                } else {
                    // Single booking edit
                    const range = differentDatesPerRoom ? roomDates[roomIds[0]] : dateRange;
                    await updateBookingWithAvailability(initialData.id, {
                        ...commonData,
                        checkIn: toNoonUTC(range.from!),
                        checkOut: toNoonUTC(range.to!),
                        roomId: roomIds[0],
                        totalPrice: Math.round(finalPrice),
                    });
                }
                toast.success("Data booking berhasil diperbarui!");
            } else {
                // For new bookings, loop through all selected rooms
                // Generate a groupId for multi-room bookings
                const gid = roomIds.length > 1 ? `grp_${Date.now().toString(36)}_${Math.random().toString(36).substring(2, 7)}` : undefined;
                
                for (const rId of roomIds) {
                    const range = differentDatesPerRoom ? roomDates[rId] : dateRange;
                    await createManualBookingWithAvailability({
                        guestName,
                        guestPhone: guestPhone || null,
                        propertyId,
                        roomId: rId,
                        checkIn: toNoonUTC(range.from!),
                        checkOut: toNoonUTC(range.to!),
                        totalPrice: Math.round(pricePerRoom),
                        notes: notes || null,
                        dpAmount: Math.round(Number(dpAmount)) || 0,
                        guestCount: parseInt(guestCount) || 1,
                        groupId: gid,
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
                    <div className="space-y-2">
                        <Label htmlFor="guestCount">Jumlah Tamu <span className="text-red-500">*</span></Label>
                        <Input
                            id="guestCount"
                            type="number"
                            min="1"
                            value={guestCount}
                            onChange={(e) => setGuestCount(e.target.value)}
                            placeholder="1"
                            required
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
                                    Jumlah Kamar: {roomIds.length}                                </Badge>
                            </div>
                        )}
                        
                        {roomIds.length > 1 && (
                            <div className="flex items-center space-x-2 mt-4 p-3 bg-primary/5 rounded-lg border border-dashed border-primary/20">
                                <input
                                    type="checkbox"
                                    id="diffDates"
                                    checked={differentDatesPerRoom}
                                    onChange={(e) => setDifferentDatesPerRoom(e.target.checked)}
                                    className="h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary cursor-pointer"
                                />
                                <Label htmlFor="diffDates" className="text-xs font-semibold cursor-pointer text-primary">
                                    Atur tanggal berbeda untuk setiap kamar (Rombongan)
                                </Label>
                            </div>
                        )}
                    </div>

                    {!differentDatesPerRoom ? (
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
                    ) : (
                        <div className="md:col-span-2 space-y-3">
                            <Label className="text-primary font-bold">Pengaturan Tanggal Per Kamar <span className="text-red-500">*</span></Label>
                            <div className="grid grid-cols-1 gap-3">
                                {selectedRooms.map((room: any) => (
                                    <div key={room.id} className="flex flex-col sm:flex-row sm:items-center justify-between p-3 border rounded-xl bg-background gap-3 shadow-sm">
                                        <div className="font-semibold text-sm">
                                            {room.roomNumber} - {room.roomName}
                                        </div>
                                        <div className="w-full sm:w-auto">
                                            <Popover>
                                                <PopoverTrigger className={cn("inline-flex w-full sm:w-[260px] items-center justify-start rounded-md border border-input bg-transparent px-3 py-2 text-xs font-normal shadow-sm transition-colors hover:bg-accent hover:text-accent-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50", !roomDates[room.id]?.from && "text-muted-foreground", "h-9 text-left")}>
                                                    <CalendarIcon className="mr-2 h-3 w-3" />
                                                    {roomDates[room.id]?.from ? (
                                                        roomDates[room.id]?.to ? (
                                                            <>
                                                                {format(roomDates[room.id]!.from!, "dd MMM")} - {format(roomDates[room.id]!.to!, "dd MMM yyyy")}
                                                            </>
                                                        ) : (
                                                            format(roomDates[room.id]!.from!, "dd MMM yyyy")
                                                        )
                                                    ) : (
                                                        <span>Pilih tanggal</span>
                                                    )}
                                                </PopoverTrigger>
                                                <PopoverContent className="w-auto p-0" align="start">
                                                    <Calendar
                                                        mode="range"
                                                        selected={roomDates[room.id]}
                                                        onSelect={(r: any) => handleRoomDateChange(room.id, r || { from: undefined, to: undefined })}
                                                        numberOfMonths={1}
                                                        disabled={(date) => date < new Date(new Date().setHours(0, 0, 0, 0))}
                                                    />
                                                </PopoverContent>
                                            </Popover>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}
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
                        
                        {selectedRooms.length > 0 && (
                            <div className="mt-2 space-y-1.5 border border-dashed rounded-md p-2 bg-muted/10">
                                {selectedRooms.map((room: any) => {
                                    const range = differentDatesPerRoom ? roomDates[room.id] : dateRange;
                                    const nights = range?.from && range?.to ? differenceInDays(range.to, range.from) || 1 : 1;
                                    return (
                                        <div key={room.id} className="text-[11px] flex flex-col text-muted-foreground border-b border-muted last:border-0 pb-1 mb-1 last:mb-0 last:pb-0">
                                            <div className="flex justify-between">
                                                <span className="font-semibold text-foreground">{room.roomNumber} ({room.roomName})</span>
                                                <span className="font-mono">
                                                    {new Intl.NumberFormat("id-ID").format(room.basePrice)} x {nights} malam
                                                </span>
                                            </div>
                                            {differentDatesPerRoom && range?.from && range?.to && (
                                                <div className="text-[9px] italic">
                                                    {format(range.from, "dd MMM")} - {format(range.to, "dd MMM yyyy")}
                                                </div>
                                            )}
                                        </div>
                                    );
                                })}
                                {selectedRooms.length > 1 && (
                                    <div className="border-t border-dashed pt-1 flex justify-between text-xs font-bold text-foreground">
                                        <span>Total</span>
                                        <span>{new Intl.NumberFormat("id-ID").format(calculatedPrice)}</span>
                                    </div>
                                )}
                            </div>
                        )}
                        <p className="text-[10px] text-muted-foreground mt-1 italic">Harga sistem berdasarkan harga dasar kamar × jumlah malam.</p>
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
                                Math.max(0, (totalPriceOverride ? parseFloat(totalPriceOverride) : calculatedPrice) - (Number(dpAmount) || 0))
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
                    disabled={loading || !guestName || !propertyId || roomIds.length === 0 || (!differentDatesPerRoom && (!dateRange.from || !dateRange.to))}
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
