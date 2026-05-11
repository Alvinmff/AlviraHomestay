import { prisma } from "@/lib/prisma";
import { Eye, CalendarPlus } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { BookingActions } from "@/components/admin/booking-actions";
import { BookingFilter } from "@/components/admin/booking-filter";
import { BookingInfoDialog } from "@/components/admin/booking-info-dialog";

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
      existing.roomNumbers = `${existing.roomNumbers}, ${current.room.roomNumber}`;
      existing.totalPrice += current.totalPrice;
      // Catatan: dpAmount biasanya sama untuk satu grup, jadi tidak perlu dijumlahkan
    } else {
      // Jika belum ada, buat entri baru
      acc.push({
        ...current,
        roomNumbers: current.room.roomNumber,
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
          <BookingFilter properties={properties} />
        </CardHeader>
        <CardContent className="p-0">

          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left text-muted-foreground">
              <thead className="text-xs text-foreground uppercase bg-muted/50 border-b">
                <tr>
                  <th scope="col" className="px-6 py-4 font-semibold">Tamu & Order Info</th>
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
                      <p className="text-xs text-muted-foreground">{booking.property.name}</p>
                      <div className="font-medium text-foreground text-sm flex items-center flex-wrap gap-1.5 mt-0.5">
                        <span className="font-mono bg-primary/10 text-primary px-1.5 py-0.5 rounded font-bold text-[10px]">
                           {booking.roomNumbers}
                        </span>
                        {booking.roomNumbers.split(',').length === 1 && booking.room.roomName}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <p className="text-xs font-medium text-foreground">In: {formatDateWIB(booking.checkIn)}</p>
                      <p className="text-xs text-muted-foreground mt-1">Out: {formatDateWIB(booking.checkOut)}</p>
                    </td>
                    <td className="px-6 py-4 text-foreground font-semibold">
                      {formatRupiah(booking.totalPrice)}
                    </td>
                    <td className="px-6 py-4 text-emerald-600 font-medium">
                       {formatRupiah(booking.dpAmount || 0)}
                    </td>
                    <td className="px-6 py-4 text-orange-600 font-bold">
                       {formatRupiah(Math.max(0, booking.totalPrice - (booking.dpAmount || 0)))}
                    </td>
                    <td className="px-6 py-4 text-center">
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
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex items-center justify-end gap-1">
                        <BookingInfoDialog booking={{
                            guestName: booking.guestName,
                            guestPhone: booking.guestPhone,
                            notes: booking.notes,
                            roomNumbers: booking.roomNumbers,
                            checkIn: formatDateWIB(booking.checkIn),
                            checkOut: formatDateWIB(booking.checkOut)
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
