import { PrismaClient } from "@prisma/client";
import { format } from "date-fns";
import {
  Building2,
  Users,
  CalendarCheck,
  TrendingUp,
  ArrowUpRight
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const prisma = new PrismaClient();

const formatRupiah = (number: number) => {
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    minimumFractionDigits: 0,
  }).format(number);
};

export default async function AdminOverviewPage() {
  const startOfMonth = new Date(new Date().getFullYear(), new Date().getMonth(), 1);

  // 1. Total Booking Bulan Ini
  const totalBookingsThisMonth = await prisma.booking.count({
    where: { createdAt: { gte: startOfMonth } }
  });

  // 2. Estimasi Revenue Bulan Ini (Status: CONFIRMED, COMPLETED, CHECKED_IN)
  const revenueResult = await prisma.booking.aggregate({
    where: {
      createdAt: { gte: startOfMonth },
      status: { in: ["CONFIRMED", "COMPLETED", "CHECKED_IN"] }
    },
    _sum: { totalPrice: true }
  });
  const revenueThisMonth = revenueResult._sum.totalPrice || 0;

  // 3. Properti Aktif
  const activePropertiesCount = await prisma.property.count({
    where: { isActive: true }
  });

  // 4. Estimasi Total Tamu Bulan Ini (Booking Confirmed * 2 asumsi per kamar)
  const confirmedBookingsCount = await prisma.booking.count({
    where: {
      createdAt: { gte: startOfMonth },
      status: { in: ["CONFIRMED", "COMPLETED", "CHECKED_IN"] }
    }
  });
  const estGuestsThisMonth = confirmedBookingsCount * 2;

  // 5. Booking Terbaru (5 data terakhir)
  const recentBookings = await prisma.booking.findMany({
    take: 5,
    orderBy: { createdAt: 'desc' },
    include: { property: { select: { name: true } } }
  });

  const stats = [
    { title: "Total Booking Bulan Ini", value: totalBookingsThisMonth.toString(), icon: <CalendarCheck className="w-4 h-4 text-muted-foreground" />, trend: "Bulan ini" },
    { title: "Properti Aktif", value: activePropertiesCount.toString(), icon: <Building2 className="w-4 h-4 text-muted-foreground" />, trend: "Live" },
    { title: "Estimasi Revenue", value: formatRupiah(revenueThisMonth), icon: <TrendingUp className="w-4 h-4 text-muted-foreground" />, trend: "Bulan ini" },
    { title: "Estimasi Tamu", value: estGuestsThisMonth.toString(), icon: <Users className="w-4 h-4 text-muted-foreground" />, trend: "Bulan ini" },
  ];

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">

      <div>
        <h2 className="text-3xl font-serif font-bold tracking-tight text-foreground">Overview</h2>
        <p className="text-muted-foreground">Ringkasan performa Homestay Alvira berdasarkan data riil dari sistem.</p>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat, idx) => (
          <Card key={idx} className="border-border/50 shadow-sm">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                {stat.title}
              </CardTitle>
              {stat.icon}
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold font-serif">{stat.value}</div>
              <p className="text-xs text-emerald-600 flex items-center font-medium mt-1">
                <ArrowUpRight className="w-3 h-3 mr-1" />
                {stat.trend}
              </p>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-7">

        {/* Recent Bookings Table */}
        <Card className="lg:col-span-4 border-border/50 shadow-sm overflow-hidden flex flex-col">
          <CardHeader>
            <CardTitle className="font-serif">Booking Terbaru</CardTitle>
          </CardHeader>
          <CardContent className="flex-1 overflow-auto">
            <div className="space-y-6">
              {recentBookings.length === 0 ? (
                <p className="text-sm text-muted-foreground italic text-center py-6">Belum ada booking.</p>
              ) : (
                recentBookings.map((b) => (
                  <div key={b.id} className="flex items-center">
                    <div className="space-y-1">
                      <p className="text-sm font-medium leading-none">{b.guestName}</p>
                      <p className="text-xs text-muted-foreground mt-0.5">
                        {b.property.name} • Check-in: {format(new Date(b.checkIn), "dd MMM yyyy")}
                      </p>
                    </div>
                    <div className="ml-auto font-medium text-sm">
                      <span className={`px-2 py-1 rounded-full text-[10px] font-bold ${b.status === "CONFIRMED" ? "bg-emerald-100 text-emerald-700" :
                          b.status === "CHECKED_IN" ? "bg-blue-100 text-blue-700" :
                            b.status === "COMPLETED" ? "bg-slate-100 text-slate-700" :
                              b.status === "CANCELLED" ? "bg-red-100 text-red-700" :
                                "bg-amber-100 text-amber-700"
                        }`}>
                        {b.status}
                      </span>
                    </div>
                  </div>
                ))
              )}
            </div>
          </CardContent>
        </Card>

        {/* Quick Activity Placeholder */}
        <Card className="lg:col-span-3 border-border/50 shadow-sm">
          <CardHeader>
            <CardTitle className="font-serif">Aktivitas Sistem</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground italic text-center py-10">
              Semua modul berjalan normal. Integrasi database Vercel PostgreSQL berhasil.
            </p>
          </CardContent>
        </Card>
      </div>

    </div>
  );
}
