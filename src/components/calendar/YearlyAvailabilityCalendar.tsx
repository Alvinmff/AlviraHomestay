"use client";

import { useState, useEffect } from "react";
import { ChevronLeft, ChevronRight, AlertCircle } from "lucide-react";
import { getDay } from "date-fns";
import { cn } from "@/lib/utils";

interface DayData {
  date: string; // YYYY-MM-DD
  status: "available" | "booked" | "maintenance" | "blocked";
  bookingId: string | null;
  guestName: string | null;
  notes: string | null;
}

interface MonthData {
  month: number;
  name: string;
  days: DayData[];
}

interface YearlyData {
  year: number;
  roomId: string;
  months: MonthData[];
}

interface Props {
  roomId: string;
}

const WEEKDAYS = ["M", "S", "S", "R", "K", "J", "S"];

const STATUS_COLORS = {
  available: "bg-emerald-50 dark:bg-emerald-500/10 hover:bg-emerald-100 dark:hover:bg-emerald-500/20 text-emerald-700 dark:text-emerald-400 border-emerald-200 dark:border-emerald-900/30",
  booked: "bg-rose-50 dark:bg-rose-500/10 text-rose-600 dark:text-rose-400 border-rose-200 dark:border-rose-900/30 cursor-not-allowed",
  maintenance: "bg-amber-50 dark:bg-amber-500/10 text-amber-700 dark:text-amber-400 border-amber-200 dark:border-amber-900/30 cursor-not-allowed hidden-strips",
  blocked: "bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400 border-slate-200 dark:border-slate-700 cursor-not-allowed",
};

export function YearlyAvailabilityCalendar({ roomId }: Props) {
  const [currentYear, setCurrentYear] = useState<number>(new Date().getFullYear());
  const [data, setData] = useState<YearlyData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [activeDate, setActiveDate] = useState<string | null>(null);

  useEffect(() => {
    let isMounted = true;
    async function fetchData() {
      setLoading(true);
      setError(false);
      try {
        const res = await fetch(`/api/availability/yearly?roomId=${roomId}&year=${currentYear}`);
        if (!res.ok) throw new Error("Failed to fetch");
        const json = await res.json();
        if (isMounted) setData(json);
      } catch {
        if (isMounted) setError(true);
      } finally {
        if (isMounted) setLoading(false);
      }
    }
    fetchData();
    return () => { isMounted = false; };
  }, [roomId, currentYear]);

  const changeYear = (delta: number) => {
    setCurrentYear(prev => prev + delta);
  };

  const today = new Date();
  const todayStr = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}-${String(today.getDate()).padStart(2, '0')}`;

  const formatIndonesianDate = (dateStr: string) => {
    const [year, month, day] = dateStr.split('-');
    const months = [
      "Januari", "Februari", "Maret", "April", "Mei", "Juni",
      "Juli", "Agustus", "September", "Oktober", "November", "Desember"
    ];
    return `${parseInt(day)} ${months[parseInt(month) - 1]} ${year}`;
  };

  return (
    <div className="bg-card rounded-2xl border shadow-sm overflow-hidden flex flex-col">
      {/* Header Controls */}
      <div className="flex items-center justify-between p-4 md:p-6 border-b bg-muted/20">
        <div>
          <h3 className="font-serif font-bold text-xl text-foreground flex items-center gap-2">
            Kalender Tahunan
          </h3>
          <p className="text-sm text-muted-foreground mt-1">Cek ketersediaan untuk merencanakan liburan panjang.</p>
        </div>
        
        <div className="flex items-center bg-background rounded-lg border shadow-sm p-1">
          <button 
            onClick={() => changeYear(-1)}
            className="p-2 hover:bg-muted rounded-md transition-colors text-muted-foreground"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>
          <span className="w-16 text-center font-bold text-lg text-foreground bg-transparent">
            {currentYear}
          </span>
          <button 
            onClick={() => changeYear(1)}
            className="p-2 hover:bg-muted rounded-md transition-colors text-muted-foreground"
          >
            <ChevronRight className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Legend */}
      <div className="flex flex-wrap items-center gap-4 px-6 py-4 text-xs font-medium border-b bg-muted/10">
        <span className="flex items-center gap-1.5"><div className="w-3 h-3 rounded bg-emerald-50 dark:bg-emerald-500/20 border border-emerald-200 dark:border-emerald-800/50" /> Tersedia</span>
        <span className="flex items-center gap-1.5"><div className="w-3 h-3 rounded bg-rose-50 dark:bg-rose-500/20 border border-rose-200 dark:border-rose-800/50" /> Booked</span>
        <span className="flex items-center gap-1.5"><div className="w-3 h-3 rounded bg-amber-50 dark:bg-amber-500/20 border border-amber-200 dark:border-amber-800/50" /> Maintenance</span>
        <span className="flex items-center gap-1.5"><div className="w-3 h-3 rounded bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700" /> Tutup</span>
      </div>

      {/* Calendar Matrix Viewport */}
      <div className="p-3 sm:p-6 relative">
        {loading && (
          <div className="absolute inset-0 z-10 bg-background/60 backdrop-blur-sm flex items-center justify-center">
            <div className="w-10 h-10 border-4 border-primary border-t-transparent rounded-full animate-spin" />
          </div>
        )}

        {error && (
          <div className="py-12 text-center text-red-500 flex flex-col items-center">
             <AlertCircle className="w-10 h-10 mb-2 opacity-50" />
             <p>Gagal memuat kalender. Silakan coba lagi.</p>
          </div>
        )}

        {/* Scrollable Container Container: Horizontal scrollable on ALL devices */}
        <div className="flex flex-row gap-6 overflow-x-auto pb-4 custom-scrollbar snap-x snap-mandatory lg:justify-between xl:justify-start">
          {data?.months.map((month) => {
            // Calculate starting offset based on the first day
            const firstDateObj = new Date(`${currentYear}-${month.month.toString().padStart(2, '0')}-01`);
            const startDayIndex = getDay(firstDateObj); // 0 = Sunday
            const paddingCells = Array.from({ length: startDayIndex });

            return (
              <div key={month.month} className="min-w-[260px] w-[82vw] sm:min-w-[280px] sm:w-auto shrink-0 border rounded-xl overflow-hidden bg-card snap-center">
                <div className="bg-primary text-primary-foreground py-2 text-center font-bold text-sm tracking-wider uppercase">
                  {month.name}
                </div>
                
                <div className="p-3 sm:p-4">
                  <div className="grid grid-cols-7 gap-1 sm:gap-1.5 mb-2">
                    {WEEKDAYS.map((day, idx) => (
                      <div key={idx} className="text-center text-[10px] font-bold text-muted-foreground py-1">
                        {day}
                      </div>
                    ))}
                  </div>

                  <div className="grid grid-cols-7 gap-1 sm:gap-1.5">
                    {paddingCells.map((_, idx) => (
                      <div key={`pad-${idx}`} className="w-full aspect-square" />
                    ))}
                    
                    {month.days.map((day) => {
                      const dayNum = parseInt(day.date.split('-')[2]);
                      const isPast = day.date < todayStr;
                      
                      let colorClass = STATUS_COLORS[day.status] || STATUS_COLORS.available;
                      if (isPast) {
                        colorClass = "bg-muted/50 text-muted-foreground/50 border-border cursor-not-allowed";
                      }
                      
                      return (
                        <div 
                          key={day.date} 
                          className="relative w-full aspect-square"
                          onMouseEnter={() => setActiveDate(day.date)}
                          onMouseLeave={() => setActiveDate(null)}
                          onClick={() => setActiveDate(activeDate === day.date ? null : day.date)}
                        >
                          <div 
                            className={cn(
                              "absolute inset-0 flex items-center justify-center text-xs font-semibold rounded-lg border transition-all cursor-pointer select-none", 
                              colorClass
                            )}
                          >
                            {dayNum}
                          </div>
                          
                          {/* Lightweight Responsive Tooltip */}
                          <div className={cn(
                            "absolute bottom-full left-1/2 -translate-x-1/2 mb-2 w-max max-w-[200px] p-2 bg-white dark:bg-slate-800 text-slate-800 dark:text-white text-[11px] rounded-lg shadow-xl border border-slate-200 dark:border-slate-700 transition-all z-50 pointer-events-none scale-95 origin-bottom flex flex-col items-center text-center gap-0.5",
                            activeDate === day.date ? "opacity-100 visible scale-100" : "opacity-0 invisible"
                          )}>
                            <span className="font-semibold text-slate-900 dark:text-white">{formatIndonesianDate(day.date)}</span>
                            <span className={cn(
                              "text-[10px] font-bold",
                              isPast ? "text-slate-400 dark:text-slate-500" :
                              day.status === "available" ? "text-emerald-600 dark:text-emerald-400" :
                              day.status === "booked" ? "text-rose-600 dark:text-rose-400" : "text-amber-600 dark:text-amber-400"
                            )}>
                              {isPast ? "Tanggal Berlalu" :
                               day.status === "available" ? "✅ Tersedia untuk dipesan" :
                               day.status === "booked" ? "❌ Telah Dipesan" :
                               day.status === "maintenance" ? "⚠️ Dalam Perawatan" : "🔒 Ditutup Sementara"}
                            </span>
                            <div className="absolute top-full left-1/2 -translate-x-1/2 border-4 border-transparent border-t-white dark:border-t-slate-800" />
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
      
      <style jsx>{`
        .custom-scrollbar::-webkit-scrollbar {
          height: 8px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: #f1f5f9;
          border-radius: 4px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: #cbd5e1;
          border-radius: 4px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: #94a3b8;
        }
        .hidden-strips {
          background-image: repeating-linear-gradient(45deg, transparent, transparent 5px, rgba(0,0,0,0.03) 5px, rgba(0,0,0,0.03) 10px);
        }
      `}</style>
    </div>
  );
}
