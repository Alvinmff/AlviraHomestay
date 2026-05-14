import { prisma } from "@/lib/prisma";
import { CalendarPlus } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import Link from "next/link";
import { BookingActions } from "@/components/admin/booking-actions";
import { BookingFilter } from "@/components/admin/booking-filter";
import { BookingInfoDialog } from "@/components/admin/booking-info-dialog";
import { BookingExportButtons } from "@/components/admin/booking-export-buttons";

const formatRupiah = (number: number) => {
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    minimumFractionDigits: 0,
  }).format(number);
};

// Format a Date in Asia/Jakarta timezone to avoid UTC day-shift on the server
const formatDateWIB = (date: Date) => {
  return new Intl.DateTimeFormat("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    timeZone: "Asia/Jakarta",
  }).format(new Date(date));
};

export default async function AdminBookingsPage({
  searchParams
}: {
  searchParams: { [key: string]: string | string[] | undefined }
}) {
  const status = searchParams.status as string | undefined;
  const propertyId = searchParams.propertyId as string | undefined;
  const sort = searchParams.sort as string | undefined;

  const where: any = {};
  if (status && status !== "ALL") {
    where.status = status;
  }
  if (propertyId && propertyId !== "ALL") {
    where.propertyId = propertyId;
  }

  let orderBy: any = { createdAt: 'desc' };
  if (sort === 'date_asc') orderBy = { checkIn: 'asc' };
  else if (sort === 'date_desc') orderBy = { checkIn: 'desc' };
  else if (sort === 'price_asc') orderBy = { totalPrice: 'asc' };
  else if (sort === 'price_desc') orderBy = { totalPrice: 'desc' };
  else if (sort === 'created_desc') orderBy = { createdAt: 'desc' };

  const [bookings, properties] = await Promise.all([
    prisma.booking.findMany({
      where,
      orderBy,
      include: {
        room: {
          select: {
            roomName: true,
            roomNumber: true,
          }
        },
        property: {
          select: {
            name: true,
            city: true,
          }
        }
      }
    }),
    prisma.property.findMany({
      select: { id: true, name: true }
    })
  ]);

  // Logic Grouping: Gabungkan booking yang memiliki groupId yang sama
  const groupedBookings = bookings.reduce((acc: any[], current) => {
    // Gunakan groupId jika ada, jika tidak gunakan id unik
    const key = current.groupId || current.id;
    
    // Cari apakah sudah ada di accumulator
    const existingIndex = acc.findIndex(b => (b.groupId && b.groupId === key) || b.id === key);

    if (existingIndex > -1) {
      // Jika sudah ada, tambahkan kamar dan jumlahkan harga
      const existing = acc[existingIndex];
      existing.roomNames = `${existing.roomNames}, ${current.room.roomName}`;
      existing.totalPrice += current.totalPrice;
      existing.allRoomIds.push(current.roomId);
      // 🔥 TAMBAHAN: simpan detail per kamar untuk invoice
      if (!existing.rooms) existing.rooms = [];
      existing.rooms.push({
        roomName: current.room.roomName,
        roomNumber: current.room.roomNumber,
        roomId: current.roomId,
        totalPrice: current.totalPrice,
        checkIn: current.checkIn,
        checkOut: current.checkOut,
      });
    } else {
      // Jika belum ada, buat entri baru
      acc.push({
        ...current,
        roomNames: current.room.roomName,
        allRoomIds: [current.roomId],
        rooms: [
          {
            roomName: current.room.roomName,
            roomNumber: current.room.roomNumber,
            roomId: current.roomId,
            totalPrice: current.totalPrice,
            checkIn: current.checkIn,
            checkOut: current.checkOut,
          },
        ],
      });
    }
    return acc;
  }, []);

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-3xl font-serif font-bold tracking-tight text-foreground">Daftar Reservasi</h2>
          <p className="text-muted-foreground mt-1">Lacak dan kelola semua pesanan tamu terpusat pada satu dasbor.</p>
        </div>
        <Link href="/admin/bookings/new" className="inline-flex items-center justify-center rounded-md font-medium px-4 py-2 bg-primary text-primary-foreground hover:bg-primary/90 gap-2 h-10 w-full md:w-auto">
          <CalendarPlus className="w-4 h-4" /> Entri Manual
        </Link>
      </div>

      <Card className="border-border/50 shadow-sm mt-8">
        <CardHeader className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 py-4 md:py-5 bg-muted/20 border-b">
          <div>
            <CardTitle className="font-serif">Arsip Booking Aktif & Lalu</CardTitle>
            <CardDescription className="mt-1">
              Data real-time dari {bookings.length} reservasi di sistem.
            </CardDescription>
          </div>
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3">
            <BookingFilter properties={properties} />
            <BookingExportButtons bookings={groupedBookings} />
          </div>
        </CardHeader>
        <CardContent className="p-0">

          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left text-muted-foreground">
              <thead className="text-xs text-foreground uppercase bg-muted/50 border-b">
                <tr>
                  <th scope="col" className="px-6 py-4 font-semibold">Tamu & Order Info</th>
                  <th scope="col" className="px-6 py-4 font-semibold">Tamu</th>
                  <th scope="col" className="px-6 py-4 font-semibold">Properti & Kamar</th>
                  <th scope="col" className="px-6 py-4 font-semibold">Jadwal Menginap</th>
                  <th scope="col" className="px-6 py-4 font-semibold">Tagihan Total</th>
                  <th scope="col" className="px-6 py-4 font-semibold">DP</th>
                  <th scope="col" className="px-6 py-4 font-semibold">Sisa Bayar</th>
                  <th scope="col" className="px-6 py-4 font-semibold text-center">Status</th>
                  <th scope="col" className="px-6 py-4 font-semibold text-right">Aksi</th>
                </tr>
              </thead>
              <tbody>
                {groupedBookings.map((booking) => (
                  <tr key={booking.id} className="bg-background border-b border-border/40 hover:bg-muted/20 transition-colors">
                    <td className="px-6 py-4">
                      <p className="font-semibold text-foreground">{booking.guestName}</p>
                      <p className="text-xs font-mono text-muted-foreground mt-1">ID: ...{booking.id.slice(-6)}</p>
                      {booking.guestPhone && (
                        <p className="text-[10px] bg-muted inline-block px-1.5 py-0.5 rounded mt-1">{booking.guestPhone}</p>
                      )}
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-1.5">
                        <span className="text-sm font-medium text-foreground">{booking.guestCount}</span>
                        <span className="text-[10px] text-muted-foreground uppercase">Orang</span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <p className="text-xs text-muted-foreground">{booking.property.name}</p>
                      <div className="font-medium text-foreground text-sm mt-0.5">
                         {booking.roomNames}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      {booking.rooms && booking.rooms.length > 1 && booking.rooms.some((r: any) => 
                        new Date(r.checkIn).getTime() !== new Date(booking.rooms[0].checkIn).getTime() ||
                        new Date(r.checkOut).getTime() !== new Date(booking.rooms[0].checkOut).getTime()
                      ) ? (
                        <div className="space-y-1.5">
                          {booking.rooms.map((room: any, idx: number) => (
                            <div key={idx} className="text-[11px] border-b border-border/30 last:border-0 pb-1 last:pb-0">
                              <p className="font-semibold text-foreground">{room.roomNumber}</p>
                              <p className="text-muted-foreground whitespace-nowrap">
                                {formatDateWIB(room.checkIn)} — {formatDateWIB(room.checkOut)}
                              </p>
                            </div>
                          ))}
                        </div>
                      ) : (
                        <div className="whitespace-nowrap">
                          <p className="text-xs font-medium text-foreground">In: {formatDateWIB(booking.checkIn)}</p>
                          <p className="text-xs text-muted-foreground mt-1">Out: {formatDateWIB(booking.checkOut)}</p>
                        </div>
                      )}
                    </td>
                    <td className="px-6 py-4 text-foreground font-semibold">
                      {formatRupiah(booking.totalPrice)}
                    </td>
                    <td className="px-6 py-4 text-emerald-600 font-medium">
                       {booking.dpAmount && booking.dpAmount > 0 ? formatRupiah(booking.dpAmount) : "-"}
                    </td>
                    <td className="px-6 py-4 text-orange-600 font-bold">
                       {booking.dpAmount && booking.dpAmount > 0 
                         ? formatRupiah(Math.max(0, booking.totalPrice - booking.dpAmount)) 
                         : "-"}
                    </td>
                    <td className="px-6 py-4 text-center">
                      <div className="flex flex-col items-center gap-1.5">
                        <Badge variant="outline" className={
                          booking.status === "CONFIRMED" ? "bg-emerald-500/10 text-emerald-500 border-emerald-500/20" :
                            booking.status === "CHECKED_IN" ? "bg-blue-500/10 text-blue-500 border-blue-500/20" :
                              booking.status === "COMPLETED" ? "bg-slate-500/10 text-slate-500 border-slate-500/20" :
                                booking.status === "CANCELLED" ? "bg-red-500/10 text-red-500 border-red-500/20" :
                                  "bg-amber-500/10 text-amber-500 border-amber-500/20"
                        }>
                          {booking.status === "CONFIRMED" ? "Booking" :
                           booking.status === "CHECKED_IN" ? "Check-in" :
                           booking.status === "COMPLETED" ? "Selesai" :
                           booking.status === "CANCELLED" ? "Dibatalkan" :
                           booking.status.replace("_", " ")}
                        </Badge>
                        {booking.status !== "CANCELLED" && booking.dpAmount && booking.dpAmount > 0 && (booking.totalPrice - booking.dpAmount) <= 0 && (
                          <Badge variant="outline" className="bg-emerald-500/10 text-emerald-600 border-emerald-500/30 text-[10px] font-bold">
                            ✓ LUNAS
                          </Badge>
                        )}
                        {booking.status !== "CANCELLED" && booking.dpAmount && booking.dpAmount > 0 && (booking.totalPrice - booking.dpAmount) > 0 && (
                          <Badge variant="outline" className="bg-amber-500/10 text-amber-600 border-amber-500/30 text-[10px] font-bold">
                            Belum Lunas
                          </Badge>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex items-center justify-end gap-1">
                        <BookingInfoDialog booking={{
                            guestName: booking.guestName,
                            guestPhone: booking.guestPhone,
                            notes: booking.notes,
                            roomNumbers: booking.roomNames,
                            checkIn: formatDateWIB(booking.checkIn),
                            checkOut: formatDateWIB(booking.checkOut),
                            guestCount: booking.guestCount
                        }} />
                        <BookingActions bookingId={booking.id} currentStatus={booking.status} />
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            {groupedBookings.length === 0 && (
              <div className="text-center py-16 text-muted-foreground">
                <div className="w-12 h-12 rounded-full border border-dashed flex items-center justify-center mx-auto mb-4 bg-muted/20">
                  <span className="text-xl">📋</span>
                </div>
                <p>Belum ada data reservasi kamar.</p>
              </div>
            )}

          </div>
        </CardContent>
      </Card>
    </div>
  );
}
