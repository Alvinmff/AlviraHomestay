import { prisma } from "@/lib/prisma";
import { format } from "date-fns";
import { Eye, Filter, CalendarPlus } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { BookingActions } from "@/components/admin/booking-actions";
import { BookingFilter } from "@/components/admin/booking-filter";

const formatRupiah = (number: number) => {
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    minimumFractionDigits: 0,
  }).format(number);
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
                  <th scope="col" className="px-6 py-4 font-semibold text-center">Status</th>
                  <th scope="col" className="px-6 py-4 font-semibold text-right">Aksi</th>
                </tr>
              </thead>
              <tbody>
                {bookings.map((booking) => (
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
                      <p className="font-medium text-foreground text-sm flex items-center gap-1.5 mt-0.5">
                        <span className="font-mono bg-primary/10 text-primary px-1.5 py-0.5 rounded font-bold text-[10px]">
                          {booking.room.roomNumber}
                        </span>
                        {booking.room.roomName}
                      </p>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <p className="text-xs font-medium text-foreground">In: {format(new Date(booking.checkIn), "dd MMM yyyy")}</p>
                      <p className="text-xs text-muted-foreground mt-1">Out: {format(new Date(booking.checkOut), "dd MMM yyyy")}</p>
                    </td>
                    <td className="px-6 py-4 text-foreground font-semibold">
                      {formatRupiah(booking.totalPrice)}
                    </td>
                    <td className="px-6 py-4 text-center">
                      <Badge variant="outline" className={
                        booking.status === "CONFIRMED" ? "bg-emerald-500/10 text-emerald-500 border-emerald-500/20" :
                          booking.status === "CHECKED_IN" ? "bg-blue-500/10 text-blue-500 border-blue-500/20" :
                            booking.status === "COMPLETED" ? "bg-slate-500/10 text-slate-500 border-slate-500/20" :
                              booking.status === "CANCELLED" ? "bg-red-500/10 text-red-500 border-red-500/20" :
                                "bg-amber-500/10 text-amber-500 border-amber-500/20"
                      }>
                        {booking.status.replace("_", " ")}
                      </Badge>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex items-center justify-end gap-1">
                        <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground hover:text-primary">
                          <Eye className="w-4 h-4" />
                        </Button>
                        <BookingActions bookingId={booking.id} currentStatus={booking.status} />
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            {bookings.length === 0 && (
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
