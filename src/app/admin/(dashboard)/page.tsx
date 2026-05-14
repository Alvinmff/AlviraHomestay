import { prisma } from "@/lib/prisma";
import { format, subDays, startOfDay, endOfDay, isSameMonth } from "date-fns";
import { 
  Building2, 
  CalendarCheck, 
  ArrowUpRight, 
  ArrowDownRight,
  Wallet,
  Clock,
  Wrench,
  LogOut,
  LogIn
} from "lucide-react";
import Link from "next/link";
import { RevenueChart, OccupancyChart } from "@/components/admin/dashboard-charts";
import { AdminAlerts } from "@/components/admin/admin-alerts";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const formatRupiah = (number: number) => {
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    minimumFractionDigits: 0,
  }).format(number);
};

export default async function AdminOverviewPage() {
  const today = new Date();
  const startOfMonthDate = new Date(today.getFullYear(), today.getMonth(), 1);
  const startOfLastMonth = new Date(today.getFullYear(), today.getMonth() - 1, 1);
  const endOfLastMonth = new Date(today.getFullYear(), today.getMonth(), 0);
  const startOfToday = startOfDay(today);
  const endOfToday = endOfDay(today);

  // --- TOP SUMMARY CARDS DATA ---
  
  // 1. Revenue
  const currentMonthRevenueReq = prisma.booking.aggregate({
    where: { createdAt: { gte: startOfMonthDate }, status: { in: ["CONFIRMED", "COMPLETED", "CHECKED_IN"] } },
    _sum: { totalPrice: true }
  });
  const lastMonthRevenueReq = prisma.booking.aggregate({
    where: { createdAt: { gte: startOfLastMonth, lte: endOfLastMonth }, status: { in: ["CONFIRMED", "COMPLETED", "CHECKED_IN"] } },
    _sum: { totalPrice: true }
  });

  // 2. Bookings count
  const currentMonthBookingsReq = prisma.booking.count({
    where: { createdAt: { gte: startOfMonthDate }, status: { notIn: ["CANCELLED"] } }
  });
  
  // 3. Pending Payments
  const pendingPaymentsReq = prisma.booking.aggregate({
    where: { paymentStatus: "UNPAID", status: { notIn: ["CANCELLED"] } },
    _sum: { totalPrice: true },
    _count: true
  });

  const [
    currentMonthRevenueRes, 
    lastMonthRevenueRes, 
    currentMonthBookings,
    pendingPaymentsRes
  ] = await Promise.all([
    currentMonthRevenueReq,
    lastMonthRevenueReq,
    currentMonthBookingsReq,
    pendingPaymentsReq
  ]);

  const revenueThisMonth = currentMonthRevenueRes._sum.totalPrice || 0;
  const revenueLastMonth = lastMonthRevenueRes._sum.totalPrice || 0;
  const revenueGrowth = revenueLastMonth === 0 ? 100 : ((revenueThisMonth - revenueLastMonth) / revenueLastMonth) * 100;

  const pendingAmount = pendingPaymentsRes._sum.totalPrice || 0;
  const pendingCount = pendingPaymentsRes._count || 0;


  // --- CHARTS DATA (30 DAYS) ---
  const last30Days = Array.from({ length: 30 }).map((_, i) => subDays(today, 29 - i));
  
  // Fetch total rooms for occupancy percentage
  const totalRooms = await prisma.room.count();

  // Fetch all relevant bookings for the last 30 days for revenue & occupancy
  const thirtyDaysAgo = subDays(today, 30);
  const recentConfirmedBookings = await prisma.booking.findMany({
    where: { 
      status: { in: ["CONFIRMED", "COMPLETED", "CHECKED_IN"] },
      OR: [
        // For revenue (createdAt based)
        { createdAt: { gte: startOfDay(thirtyDaysAgo) } },
        // For occupancy (stay covers any day in the last 30 days)
        { 
          AND: [
             { checkIn: { lte: endOfDay(today) } },
             { checkOut: { gt: startOfDay(thirtyDaysAgo) } }
          ]
        }
      ]
    },
    select: { createdAt: true, totalPrice: true, checkIn: true, checkOut: true, roomId: true }
  });

  const chartData = last30Days.map(date => {
    const dayStart = startOfDay(date);
    const dayEnd = endOfDay(date);
    
    // Revenue for this day (based on transaction creation date)
    const dayRevenue = recentConfirmedBookings
      .filter(b => b.createdAt >= dayStart && b.createdAt <= dayEnd)
      .reduce((sum, b) => sum + b.totalPrice, 0);

    // Occupancy for this day
    // A room is considered occupied for the night if checkIn is on or before the end of the day, 
    // and checkOut is STRICTLY AFTER the start of the day.
    const occupiedRoomIds = new Set(
      recentConfirmedBookings
        .filter(b => b.checkIn <= dayEnd && b.checkOut > dayStart)
        .map(b => b.roomId)
    );
    
    const occupancyPercentage = totalRooms > 0 
      ? Math.round((occupiedRoomIds.size / totalRooms) * 100) 
      : 0;

    return {
      date: format(date, "dd MMM"),
      revenue: dayRevenue,
      occupancy: occupancyPercentage
    };
  });

  const averageOccupancy = Math.round(chartData.reduce((acc, curr) => acc + curr.occupancy, 0) / 30);


  // --- OPERATIONS DATA ---
  
  const arrivalsToday = await prisma.booking.findMany({
    where: { checkIn: { gte: startOfToday, lte: endOfToday }, status: { notIn: ["CANCELLED"] } },
    include: { room: true, property: true }
  });

  const departuresToday = await prisma.booking.findMany({
    where: { checkOut: { gte: startOfToday, lte: endOfToday }, status: { notIn: ["CANCELLED"] } },
    include: { room: true, property: true }
  });

  const roomIssues = await prisma.room.findMany({
    where: { currentStatus: { in: ["DIRTY", "MAINTENANCE"] } },
    include: { property: true }
  });


  // --- PROPERTY PERFORMANCE ---
  const propertiesPerformance = await prisma.property.findMany({
    where: { isActive: true },
    include: {
      _count: {
        select: { bookings: { where: { status: { in: ["CONFIRMED", "COMPLETED", "CHECKED_IN"] } } } }
      },
      rooms: { select: { id: true } }
    },
    take: 5,
  });

  // --- COMPUTE ALERTS ---
  const alerts: any[] = [];
  
  if (pendingCount > 0) {
    alerts.push({
      type: "warning",
      title: "Pembayaran Tertunda",
      description: `Ada ${pendingCount} booking dengan status pembayaran belum lunas.`,
      link: "/admin/bookings"
    });
  }

  const dirtyRooms = roomIssues.filter(r => r.currentStatus === "DIRTY");
  if (dirtyRooms.length > 0) {
    alerts.push({
      type: "destructive",
      title: "Kamar Perlu Dibersihkan",
      description: `Terdapat ${dirtyRooms.length} kamar berstatus DIRTY yang harus segera dibersihkan.`,
      link: "/admin/rooms"
    });
  }

  const maintenanceRooms = roomIssues.filter(r => r.currentStatus === "MAINTENANCE");
  if (maintenanceRooms.length > 0) {
    alerts.push({
      type: "info",
      title: "Kamar dalam Perbaikan",
      description: `${maintenanceRooms.length} kamar sedang dalam status MAINTENANCE.`,
      link: "/admin/rooms"
    });
  }


  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      
      <div className="space-y-1">
        <h2 className="text-4xl font-normal tracking-tight text-foreground">Dashboard</h2>
        <p className="text-muted-foreground text-sm mb-6">Business insights & daily operations overview.</p>
      </div>

      <AdminAlerts alerts={alerts} />

      {/* TOP SUMMARY CARDS */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Revenue Card */}
        <div className="bg-card border p-6 rounded-[24px] shadow-sm flex flex-col justify-between">
          <div className="flex justify-between items-start mb-4">
            <span className="text-muted-foreground font-medium text-sm">Pendapatan (Bulan Ini)</span>
            <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
              <Wallet className="w-4 h-4 text-primary" />
            </div>
          </div>
          <div>
            <div className="text-2xl font-bold text-foreground mb-1">
              {formatRupiah(revenueThisMonth)}
            </div>
            <div className="flex items-center gap-1 text-xs">
              {revenueGrowth >= 0 ? (
                <span className="text-emerald-500 flex items-center font-medium"><ArrowUpRight className="w-3 h-3 mr-0.5"/> {revenueGrowth.toFixed(1)}%</span>
              ) : (
                <span className="text-rose-500 flex items-center font-medium"><ArrowDownRight className="w-3 h-3 mr-0.5"/> {Math.abs(revenueGrowth).toFixed(1)}%</span>
              )}
              <span className="text-muted-foreground">vs bulan lalu</span>
            </div>
          </div>
        </div>

        {/* Occupancy Card */}
        <div className="bg-card border p-6 rounded-[24px] shadow-sm flex flex-col justify-between">
          <div className="flex justify-between items-start mb-4">
            <span className="text-muted-foreground font-medium text-sm">Rata-rata Okupansi</span>
            <div className="w-8 h-8 rounded-full bg-blue-500/10 flex items-center justify-center">
              <Building2 className="w-4 h-4 text-blue-500" />
            </div>
          </div>
          <div>
            <div className="text-2xl font-bold text-foreground mb-1">
              {averageOccupancy}%
            </div>
            <div className="flex items-center gap-1 text-xs">
              <span className="text-muted-foreground">Periode 30 hari terakhir</span>
            </div>
          </div>
        </div>

        {/* Bookings Card */}
        <div className="bg-card border p-6 rounded-[24px] shadow-sm flex flex-col justify-between">
          <div className="flex justify-between items-start mb-4">
            <span className="text-muted-foreground font-medium text-sm">Total Booking</span>
            <div className="w-8 h-8 rounded-full bg-emerald-500/10 flex items-center justify-center">
              <CalendarCheck className="w-4 h-4 text-emerald-500" />
            </div>
          </div>
          <div>
            <div className="text-2xl font-bold text-foreground mb-1">
              {currentMonthBookings}
            </div>
            <div className="flex items-center gap-1 text-xs">
              <span className="text-muted-foreground">Bulan ini</span>
            </div>
          </div>
        </div>

        {/* Pending Card */}
        <div className="bg-card border p-6 rounded-[24px] shadow-sm flex flex-col justify-between">
          <div className="flex justify-between items-start mb-4">
            <span className="text-muted-foreground font-medium text-sm">Pembayaran Pending</span>
            <div className="w-8 h-8 rounded-full bg-amber-500/10 flex items-center justify-center">
              <Clock className="w-4 h-4 text-amber-500" />
            </div>
          </div>
          <div>
            <div className="text-2xl font-bold text-foreground mb-1">
              {formatRupiah(pendingAmount)}
            </div>
            <div className="flex items-center gap-1 text-xs">
              <span className="text-amber-600 font-medium">{pendingCount} tagihan</span>
              <span className="text-muted-foreground">menunggu</span>
            </div>
          </div>
        </div>
      </div>

      {/* CHARTS AREA */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-card border rounded-[24px] p-6 shadow-sm overflow-hidden">
          <h3 className="text-lg font-medium text-foreground mb-6">Tren Pendapatan (30 Hari)</h3>
          <RevenueChart data={chartData} />
        </div>
        <div className="bg-card border rounded-[24px] p-6 shadow-sm overflow-hidden">
          <h3 className="text-lg font-medium text-foreground mb-6">Tren Okupansi (30 Hari)</h3>
          <OccupancyChart data={chartData} />
        </div>
      </div>

      {/* DAILY OPERATIONS & PERFORMANCE */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Operations Panel (Takes up 2 cols) */}
        <div className="bg-card border rounded-[24px] p-6 shadow-sm lg:col-span-2">
          <h3 className="text-lg font-medium text-foreground mb-4">Operasional Hari Ini</h3>
          
          <Tabs defaultValue="arrivals" className="w-full">
            <TabsList className="grid w-full grid-cols-3 mb-6 bg-muted/50 rounded-xl p-1">
              <TabsTrigger value="arrivals" className="rounded-lg text-xs sm:text-sm">Check-in ({arrivalsToday.length})</TabsTrigger>
              <TabsTrigger value="departures" className="rounded-lg text-xs sm:text-sm">Check-out ({departuresToday.length})</TabsTrigger>
              <TabsTrigger value="issues" className="rounded-lg text-xs sm:text-sm">Room Issues ({roomIssues.length})</TabsTrigger>
            </TabsList>
            
            <TabsContent value="arrivals" className="space-y-4">
              {arrivalsToday.length === 0 ? (
                <div className="text-center py-8 text-muted-foreground text-sm">Tidak ada jadwal check-in hari ini.</div>
              ) : (
                arrivalsToday.map(b => (
                  <div key={b.id} className="flex items-center justify-between p-3 rounded-xl hover:bg-muted/50 transition-colors border border-transparent hover:border-border/50">
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 rounded-full bg-emerald-500/10 flex items-center justify-center">
                        <LogIn className="w-4 h-4 text-emerald-500" />
                      </div>
                      <div>
                        <p className="font-medium text-sm text-foreground">{b.guestName}</p>
                        <p className="text-xs text-muted-foreground">{b.property.name} - {b.room.roomName}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <span className={`text-[10px] font-bold px-2 py-1 rounded-full uppercase ${b.paymentStatus === 'PAID' ? 'bg-emerald-500/10 text-emerald-500' : 'bg-amber-500/10 text-amber-500'}`}>
                        {b.paymentStatus}
                      </span>
                    </div>
                  </div>
                ))
              )}
            </TabsContent>

            <TabsContent value="departures" className="space-y-4">
              {departuresToday.length === 0 ? (
                <div className="text-center py-8 text-muted-foreground text-sm">Tidak ada jadwal check-out hari ini.</div>
              ) : (
                departuresToday.map(b => (
                  <div key={b.id} className="flex items-center justify-between p-3 rounded-xl hover:bg-muted/50 transition-colors border border-transparent hover:border-border/50">
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 rounded-full bg-rose-500/10 flex items-center justify-center">
                        <LogOut className="w-4 h-4 text-rose-500" />
                      </div>
                      <div>
                        <p className="font-medium text-sm text-foreground">{b.guestName}</p>
                        <p className="text-xs text-muted-foreground">{b.property.name} - {b.room.roomName}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <span className="text-[10px] font-bold px-2 py-1 rounded-full uppercase bg-blue-500/10 text-blue-500">
                        {b.status}
                      </span>
                    </div>
                  </div>
                ))
              )}
            </TabsContent>

            <TabsContent value="issues" className="space-y-4">
              {roomIssues.length === 0 ? (
                <div className="text-center py-8 text-muted-foreground text-sm">Semua kamar dalam kondisi baik.</div>
              ) : (
                roomIssues.map(room => (
                  <div key={room.id} className="flex items-center justify-between p-3 rounded-xl hover:bg-muted/50 transition-colors border border-transparent hover:border-border/50">
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 rounded-full bg-amber-500/10 flex items-center justify-center">
                        <Wrench className="w-4 h-4 text-amber-500" />
                      </div>
                      <div>
                        <p className="font-medium text-sm text-foreground">{room.roomNumber} - {room.roomName}</p>
                        <p className="text-xs text-muted-foreground">{room.property.name}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <span className={`text-[10px] font-bold px-2 py-1 rounded-full uppercase ${room.currentStatus === 'DIRTY' ? 'bg-orange-500/10 text-orange-500' : 'bg-red-500/10 text-red-500'}`}>
                        {room.currentStatus}
                      </span>
                    </div>
                  </div>
                ))
              )}
            </TabsContent>

          </Tabs>
        </div>

        {/* Property Performance */}
        <div className="bg-card border rounded-[24px] p-6 shadow-sm">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-lg font-medium text-foreground">Performa Properti</h3>
            <Link href="/admin/properties" className="text-xs font-bold text-muted-foreground hover:text-foreground transition-colors uppercase tracking-wider">Lihat Semua</Link>
          </div>
          
          <div className="space-y-4">
            {propertiesPerformance.length === 0 ? (
              <p className="text-sm text-muted-foreground italic text-center py-10">Belum ada properti aktif.</p>
            ) : (
              propertiesPerformance.map((prop) => (
                <div key={prop.id} className="flex items-center justify-between p-3 rounded-xl bg-muted/30">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-background border flex items-center justify-center">
                      <Building2 className="w-3 h-3 text-foreground" />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-foreground line-clamp-1">{prop.name}</p>
                      <p className="text-[10px] text-muted-foreground">{prop.rooms.length} Kamar</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-bold text-foreground">{prop._count.bookings}</p>
                    <p className="text-[10px] text-muted-foreground">Bookings</p>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

      </div>

    </div>
  );
}
