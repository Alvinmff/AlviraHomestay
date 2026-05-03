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
  available: "bg-green-100 dark:bg-green-500/10 hover:bg-green-200 dark:hover:bg-green-500/20 text-green-700 dark:text-green-400 border-green-200 dark:border-green-900/30",
  booked: "bg-red-100 dark:bg-red-500/10 text-red-700 dark:text-red-400 border-red-200 dark:border-red-900/30 cursor-not-allowed",
  maintenance: "bg-amber-100 dark:bg-amber-500/10 text-amber-700 dark:text-amber-400 border-amber-200 dark:border-amber-900/30 cursor-not-allowed hidden-strips",
  blocked: "bg-muted text-muted-foreground border-border cursor-not-allowed",
};

export function YearlyAvailabilityCalendar({ roomId }: Props) {
  const [currentYear, setCurrentYear] = useState<number>(new Date().getFullYear());
  const [data, setData] = useState<YearlyData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

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

  const getDayTooltip = (day: DayData, isPast: boolean) => {
    if (isPast) return `Sudah berlalu (${day.date})`;
    if (day.status === "available") return `Tersedia pada ${day.date}`;
    if (day.status === "booked") return `Sudah dibooking ${day.guestName ? "oleh " + day.guestName : ""}`;
    if (day.status === "maintenance") return `Maintenance: ${day.notes || ""}`;
    return `Tidak Tersedia`;
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
        <span className="flex items-center gap-1.5"><div className="w-3 h-3 rounded-full bg-green-400" /> Tersedia</span>
        <span className="flex items-center gap-1.5"><div className="w-3 h-3 rounded-full bg-red-400" /> Booked</span>
        <span className="flex items-center gap-1.5"><div className="w-3 h-3 rounded-full bg-amber-400" /> Maintenance</span>
        <span className="flex items-center gap-1.5"><div className="w-3 h-3 rounded-full bg-muted" /> Tutup</span>
      </div>

      {/* Calendar Matrix Viewport */}
      <div className="p-6 relative">
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

        {/* Scrollable Container Container: Horizontal on Desktop, Vertical stack on Mobile */}
        <div className="flex flex-col xl:flex-row gap-8 xl:overflow-x-auto pb-4 custom-scrollbar lg:justify-between xl:justify-start">
          {data?.months.map((month) => {
            // Calculate starting offset based on the first day
            const firstDateObj = new Date(`${currentYear}-${month.month.toString().padStart(2, '0')}-01`);
            const startDayIndex = getDay(firstDateObj); // 0 = Sunday
            const paddingCells = Array.from({ length: startDayIndex });

            return (
              <div key={month.month} className="min-w-[280px] shrink-0 border rounded-xl overflow-hidden bg-card">
                <div className="bg-primary text-primary-foreground py-2 text-center font-bold text-sm tracking-wider uppercase">
                  {month.name}
                </div>
                
                <div className="p-4">
                  <div className="grid grid-cols-7 gap-1 mb-2">
                    {WEEKDAYS.map((day, idx) => (
                      <div key={idx} className="text-center text-[10px] font-bold text-muted-foreground w-8 2xl:w-9">
                        {day}
                      </div>
                    ))}
                  </div>

                  <div className="grid grid-cols-7 gap-1">
                    {paddingCells.map((_, idx) => (
                      <div key={`pad-${idx}`} className="w-8 h-8 2xl:w-9 2xl:h-9" />
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
                          className={cn(
                            "w-8 h-8 2xl:w-9 2xl:h-9 flex items-center justify-center text-xs font-medium rounded-md border transition-all cursor-pointer group relative", 
                            colorClass
                          )}
                        >
                          {dayNum}
                          
                          {/* CSS Native Tooltip completely disconnected from heavy Radix Tooltips */}
                          <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 w-max max-w-[200px] p-2 bg-slate-800 text-white text-[11px] rounded shadow-xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all z-50 pointer-events-none scale-95 group-hover:scale-100 origin-bottom">
                            {getDayTooltip(day, isPast)}
                            <div className="absolute top-full left-1/2 -translate-x-1/2 border-4 border-transparent border-t-slate-800" />
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
