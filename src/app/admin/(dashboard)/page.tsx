import { prisma } from "@/lib/prisma";
import { format, subDays, startOfDay, endOfDay } from "date-fns";
import { Building2, CalendarCheck, ArrowUpRight } from "lucide-react";
import Link from "next/link";



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

  // 6. Data Performa Properti
  const propertiesPerformance = await prisma.property.findMany({
    where: { isActive: true },
    include: {
      _count: {
        select: { bookings: { where: { status: { in: ["CONFIRMED", "COMPLETED", "CHECKED_IN"] } } } }
      }
    },
    take: 3,
  });

  // 7. Data Tingkat Okupansi (5 hari terakhir)
  const today = new Date();
  const last5Days = Array.from({ length: 5 }).map((_, i) => subDays(today, 4 - i));
  
  const occupancyData = await Promise.all(
    last5Days.map(async (date) => {
      const count = await prisma.booking.count({
        where: {
          checkIn: { lte: endOfDay(date) },
          checkOut: { gte: startOfDay(date) },
          status: { in: ["CONFIRMED", "CHECKED_IN", "COMPLETED"] }
        }
      });
      // Assuming max capacity across all properties is e.g. 10 (change according to real capacity logic)
      // For visual purposes, we scale count to a percentage (max 100%)
      const maxCapacity = 15; // Dummy max capacity for chart visual scaling
      const percentage = Math.min(Math.round((count / maxCapacity) * 100), 100);
      return {
        day: format(date, "EEE"),
        percentage: percentage === 0 ? 5 : percentage, // give at least 5% so bar is visible
      };
    })
  );

  const averageOccupancy = Math.round(occupancyData.reduce((acc, curr) => acc + curr.percentage, 0) / 5);

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      
      {/* Header section matching mockup */}
      <div className="space-y-1">
        <h2 className="text-4xl font-normal tracking-tight text-black">Welcome back</h2>
        <p className="text-gray-400 text-sm">Welcome to dashboard</p>
      </div>

      <div className="flex flex-col lg:flex-row gap-6">
        
        {/* Left Column: 4 Pastel Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 flex-1">
          {/* Card 1: Revenue (Peach) */}
          <Link href="/admin/bookings" className="bg-[#FCEFE4] p-6 rounded-[24px] flex flex-col justify-between h-[160px] relative group hover:shadow-md transition-shadow">
            <div className="flex justify-between items-start">
              <span className="text-black font-medium">Estimasi Pendapatan</span>
              <div className="w-8 h-8 rounded-full bg-white flex items-center justify-center shadow-sm">
                <ArrowUpRight className="w-4 h-4 text-black group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
              </div>
            </div>
            <div>
              <div className="text-3xl font-medium text-black mb-1">
                {formatRupiah(revenueThisMonth)}
              </div>
              <span className="text-xs text-[#D99A6C] font-medium">Bulan ini</span>
            </div>
          </Link>

          {/* Card 2: Bookings (Green) */}
          <Link href="/admin/bookings" className="bg-[#EAF5E5] p-6 rounded-[24px] flex flex-col justify-between h-[160px] relative group hover:shadow-md transition-shadow">
            <div className="flex justify-between items-start">
              <span className="text-black font-medium">Booking Baru</span>
              <div className="w-8 h-8 rounded-full bg-white flex items-center justify-center shadow-sm">
                <ArrowUpRight className="w-4 h-4 text-black group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
              </div>
            </div>
            <div>
              <div className="text-3xl font-medium text-black mb-1">
                {totalBookingsThisMonth}
              </div>
              <span className="text-xs text-[#7DBE7A] font-medium">Bulan ini</span>
            </div>
          </Link>

          {/* Card 3: Active Properties (Blue) */}
          <Link href="/admin/properties" className="bg-[#EEF2FB] p-6 rounded-[24px] flex flex-col justify-between h-[160px] relative group hover:shadow-md transition-shadow">
            <div className="flex justify-between items-start">
              <span className="text-black font-medium">Properti Aktif</span>
              <div className="w-8 h-8 rounded-full bg-white flex items-center justify-center shadow-sm">
                <ArrowUpRight className="w-4 h-4 text-black group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
              </div>
            </div>
            <div>
              <div className="text-3xl font-medium text-black mb-1">
                {activePropertiesCount}
              </div>
              <span className="text-xs text-[#6B8FE3] font-medium">Semua properti live</span>
            </div>
          </Link>

          {/* Card 4: Estimated Guests (Mint) */}
          <Link href="/admin/bookings" className="bg-[#E6F5F3] p-6 rounded-[24px] flex flex-col justify-between h-[160px] relative group hover:shadow-md transition-shadow">
            <div className="flex justify-between items-start">
              <span className="text-black font-medium">Estimasi Tamu</span>
              <div className="w-8 h-8 rounded-full bg-white flex items-center justify-center shadow-sm">
                <ArrowUpRight className="w-4 h-4 text-black group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
              </div>
            </div>
            <div>
              <div className="text-3xl font-medium text-black mb-1">
                {estGuestsThisMonth}
              </div>
              <span className="text-xs text-[#52B7A6] font-medium">Bulan ini</span>
            </div>
          </Link>
        </div>

        {/* Right Column: Teal Chart Area */}
        <div className="bg-[#19A794] rounded-[24px] p-6 flex flex-col justify-between text-white lg:w-[320px] h-[336px]">
          <div>
            <h3 className="text-xl font-medium mb-1">Tingkat Okupansi</h3>
            <div className="flex items-center gap-2">
              <span className="text-2xl font-medium">{averageOccupancy}%</span>
              <span className="bg-white/20 text-white text-[10px] font-bold px-2 py-0.5 rounded-full">
                5 Hari Terakhir
              </span>
            </div>
          </div>
          
          {/* Dynamic Bar Chart */}
          <div className="flex items-end gap-3 h-32 mt-4">
            <div className="flex flex-col gap-2 h-full text-[10px] text-white/70 justify-between py-2">
              <span>100%</span>
              <span>75%</span>
              <span>50%</span>
              <span>25%</span>
            </div>
            <div className="flex items-end justify-around flex-1 h-full gap-2 pb-2">
              {occupancyData.map((data, i) => {
                const isToday = i === occupancyData.length - 1;
                return (
                  <div 
                    key={i} 
                    className={`w-full rounded-t-sm transition-all duration-500 ease-out ${
                      isToday 
                        ? "bg-[#FCEFE4] shadow-[0_0_15px_rgba(252,239,228,0.5)]" 
                        : "bg-white/40 hover:bg-white"
                    }`}
                    style={{ height: `${data.percentage}%` }}
                    title={`${data.percentage}% Okupansi`}
                  ></div>
                );
              })}
            </div>
          </div>
          <div className="flex justify-around text-[10px] text-white/70 pl-8">
            {occupancyData.map((data, i) => (
              <span key={i}>{data.day}</span>
            ))}
          </div>
        </div>
      </div>

      {/* Bottom Row: Lists */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* Recent Transactions / Bookings */}
        <div className="bg-white border border-gray-100 rounded-[24px] p-6 shadow-sm">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-lg font-medium text-black">Booking Terbaru</h3>
            <Link href="/admin/bookings" className="text-xs font-bold text-gray-400 hover:text-black transition-colors uppercase tracking-wider">Lihat Semua</Link>
          </div>
          
          <div className="space-y-5">
            {recentBookings.length === 0 ? (
              <p className="text-sm text-gray-400 italic py-4">Belum ada booking.</p>
            ) : (
              recentBookings.map((b) => (
                <div key={b.id} className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className={`w-12 h-12 rounded-[14px] flex items-center justify-center ${
                      b.status === "CONFIRMED" ? "bg-[#EAF5E5]" : 
                      b.status === "INQUIRY" ? "bg-[#FCEFE4]" : "bg-[#EEF2FB]"
                    }`}>
                      <CalendarCheck className={`w-5 h-5 ${
                        b.status === "CONFIRMED" ? "text-[#7DBE7A]" : 
                        b.status === "INQUIRY" ? "text-[#D99A6C]" : "text-[#6B8FE3]"
                      }`} />
                    </div>
                    <div>
                      <p className="text-sm font-bold text-black">{b.guestName}</p>
                      <p className="text-xs text-gray-400 mt-0.5">{b.property.name}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className={`text-sm font-bold ${
                      b.status === "CONFIRMED" ? "text-black" : "text-gray-500"
                    }`}>
                      {formatRupiah(b.totalPrice)}
                    </p>
                    <p className="text-[10px] text-gray-400 uppercase tracking-wider">{b.status}</p>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Categories / Properties Overview */}
        <div className="bg-white border border-gray-100 rounded-[24px] p-6 shadow-sm">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-lg font-medium text-black">Performa Properti</h3>
            <Link href="/admin/properties" className="text-xs font-bold text-gray-400 hover:text-black transition-colors uppercase tracking-wider">Lihat Semua</Link>
          </div>
          
          <div className="grid grid-cols-3 gap-4">
            {propertiesPerformance.length === 0 ? (
              <p className="col-span-3 text-sm text-gray-400 italic text-center py-10">Belum ada properti aktif.</p>
            ) : (
              propertiesPerformance.map((prop, idx) => {
                const bgColors = ["bg-[#EEF2FB]", "bg-[#FCEFE4]", "bg-[#EAF5E5]"];
                const colorTheme = bgColors[idx % bgColors.length];
                
                return (
                  <Link href={`/admin/properties`} key={prop.id} className={`${colorTheme} rounded-[20px] p-4 flex flex-col items-center justify-center text-center gap-2 hover:-translate-y-1 transition-transform cursor-pointer`}>
                    <div className="w-10 h-10 rounded-full bg-white flex items-center justify-center">
                      <Building2 className="w-5 h-5 text-black" />
                    </div>
                    <div>
                      <p className="text-xs text-black font-medium mb-1 line-clamp-1" title={prop.name}>{prop.name}</p>
                      <p className="text-[10px] text-gray-500">{prop._count.bookings} Total Booking</p>
                    </div>
                  </Link>
                )
              })
            )}
          </div>
        </div>

      </div>

    </div>
  );
}
