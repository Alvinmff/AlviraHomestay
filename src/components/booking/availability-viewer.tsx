"use client";

import { useQuery } from "@tanstack/react-query";
import { format, startOfMonth, endOfMonth, eachDayOfInterval, isBefore, startOfDay } from "date-fns";
import { Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "@/components/ui/hover-card";

interface AvailabilityViewerProps {
  roomId: string;
}

export function AvailabilityViewer({ roomId }: AvailabilityViewerProps) {
  const { data: availabilities, isLoading, error } = useQuery({
    queryKey: ['availability', roomId],
    queryFn: async () => {
      const res = await fetch(`/api/availability?roomId=${roomId}`);
      if (!res.ok) throw new Error("Failed to fetch availability");
      return res.json();
    },
    // Refresh every 5 minutes automatically
    refetchInterval: 5 * 60 * 1000,
  });

  const today = startOfDay(new Date());
  const currentMonthStart = startOfMonth(today);

  // Create a 35-day window for rendering calendar broadly
  const calendarEnd = endOfMonth(new Date(today.getFullYear(), today.getMonth() + 1));
  const days = eachDayOfInterval({ start: currentMonthStart, end: calendarEnd });

  const getDailyStatus = (date: Date) => {
    if (isBefore(startOfDay(date), today)) return "PAST";

    if (!availabilities || availabilities.length === 0) return "AVAILABLE";

    // Find precise availability status for this date
    // Match the strict date YYYY-MM-DD instead of generic UTC toISOString which offsets the day
    const localDateStr = format(date, "yyyy-MM-dd");
    const match = availabilities.find((a: { date: string, status: string }) => {
      const d = new Date(a.date);
      const recordDateStr = new Intl.DateTimeFormat("en-CA", {
        year: "numeric",
        month: "2-digit",
        day: "2-digit",
        timeZone: "Asia/Jakarta",
      }).format(d);
      return recordDateStr === localDateStr;
    });

    if (match) return match.status; // BOOKED, MAINTENANCE, BLOCKED
    return "AVAILABLE";
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "AVAILABLE": return "bg-green-100 dark:bg-green-500/10 hover:bg-green-200 dark:hover:bg-green-500/20 text-green-700 dark:text-green-400 border-green-200 dark:border-green-900/30 cursor-help";
      case "BOOKED": return "bg-red-100/50 dark:bg-red-500/10 text-red-500 dark:text-red-400 border-red-200/50 dark:border-red-900/30 cursor-not-allowed line-through opacity-70";
      case "MAINTENANCE": return "bg-yellow-100/50 dark:bg-yellow-500/10 text-yellow-600 dark:text-yellow-400 border-yellow-200/50 dark:border-yellow-900/30 cursor-not-allowed opacity-70";
      case "BLOCKED": return "bg-muted text-muted-foreground border-border cursor-not-allowed opacity-50";
      case "PAST": return "bg-muted/30 text-muted-foreground/30 border-border/30 cursor-not-allowed";
      default: return "bg-card";
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case "AVAILABLE": return "✅ Tersedia untuk dipesan";
      case "BOOKED": return "❌ Telah Dipesan";
      case "MAINTENANCE": return "⚠️ Dalam Perawatan";
      case "BLOCKED": return "🔒 Ditutup Sementara";
      case "PAST": return "Tanggal Berlalu";
      default: return "";
    }
  };

  if (error) {
    return <div className="text-sm text-red-500 bg-red-50 p-3 rounded-md border border-red-100">Gagal memuat data ketersediaan kalender.</div>;
  }

  return (
    <div className="w-full">
      <div className="flex items-center justify-between mb-4">
        <h4 className="font-semibold text-sm">Kalender Ketersediaan</h4>
        {isLoading && <Loader2 className="w-4 h-4 animate-spin text-muted-foreground mr-1" />}
      </div>

      <div className="grid grid-cols-7 gap-1 text-center">
        {['Min', 'Sen', 'Sel', 'Rab', 'Kam', 'Jum', 'Sab'].map(day => (
          <div key={day} className="text-xs font-semibold text-muted-foreground py-1">
            {day}
          </div>
        ))}

        {/* Padding for first day of month alignment */}
        {Array.from({ length: currentMonthStart.getDay() }).map((_, i) => (
          <div key={`padding-${i}`} className="p-2 border border-transparent"></div>
        ))}

        {days.map((day) => {
          const status = getDailyStatus(day);

          return (
            <HoverCard key={day.toISOString()}>
              <HoverCardTrigger>
                <div
                  className={cn(
                    "p-2 text-xs rounded-md border text-center transition-colors min-w-[36px]",
                    getStatusColor(status),
                    // Current day highlight indicator
                    day.getTime() === today.getTime() ? "ring-2 ring-primary ring-offset-1 font-bold" : ""
                  )}
                >
                  {format(day, 'd')}
                </div>
              </HoverCardTrigger>
              <HoverCardContent side="top" className="w-auto p-2">
                <p className="text-sm font-medium">{format(day, 'dd MMMM yyyy')}</p>
                <p className={cn("text-xs font-semibold mt-1",
                  status === 'AVAILABLE' ? "text-green-600" :
                    status === 'BOOKED' ? "text-red-500" : "text-muted-foreground"
                )}>
                  {getStatusText(status)}
                </p>
              </HoverCardContent>
            </HoverCard>
          );
        })}
      </div>

      <div className="flex items-center justify-center gap-4 mt-4 pt-4 border-t border-border/50 text-xs text-muted-foreground">
        <div className="flex items-center gap-1.5"><div className="w-3 h-3 rounded bg-green-100 dark:bg-green-500/20 border border-green-200 dark:border-green-800/50"></div> Tersedia</div>
        <div className="flex items-center gap-1.5"><div className="w-3 h-3 rounded bg-red-100/50 dark:bg-red-500/20 border border-red-200/50 dark:border-red-800/50"></div> Penuh</div>
      </div>
    </div>
  );
}
