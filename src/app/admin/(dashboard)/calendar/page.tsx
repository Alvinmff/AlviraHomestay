"use client";

import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { format, startOfMonth, endOfMonth, eachDayOfInterval, addMonths, subMonths } from "date-fns";
import { Calendar as CalendarIcon, Loader2, Check, AlertCircle, ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { cn } from "@/lib/utils";

// Types matching schema
type Room = { id: string; roomName: string; roomNumber: string; property: { name: string; slug: string } };
type Availability = { id: string; roomId: string; date: string; status: string };

const STATUS_COLORS: Record<string, string> = {
  AVAILABLE: "bg-emerald-500/10 text-emerald-500 border-emerald-500/20",
  BOOKED: "bg-red-500/10 text-red-500 border-red-500/20",
  MAINTENANCE: "bg-amber-500/10 text-amber-500 border-amber-500/20",
  BLOCKED: "bg-slate-500/10 text-slate-500 border-slate-500/20"
};

const STATUS_LABELS: Record<string, string> = {
  AVAILABLE: "Tersedia",
  BOOKED: "Dipesan",
  MAINTENANCE: "Maintenance",
  BLOCKED: "Diblokir"
};

export default function AdminCalendarPage() {
  const [propertyFilter, setPropertyFilter] = useState<string>("all");
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [selectedDates, setSelectedDates] = useState<{ roomId: string, date: string }[]>([]);
  const queryClient = useQueryClient();

  // Fetch all rooms
  const { data: rooms, isLoading: loadingRooms } = useQuery<Room[]>({
    queryKey: ['admin_rooms'],
    queryFn: async () => {
      const res = await fetch("/api/rooms");
      if (!res.ok) throw new Error("Failed to fetch rooms");
      return res.json();
    }
  });

  // Fetch all availabilities
  const { data: availabilities, isLoading: loadingAvail } = useQuery<Availability[]>({
    queryKey: ['admin_availabilities'],
    queryFn: async () => {
      const res = await fetch("/api/admin/availability");
      if (!res.ok) throw new Error("Failed to fetch availabilities");
      return res.json();
    }
  });

  const updateStatusMut = useMutation({
    mutationFn: async ({ roomId, dates, status }: { roomId: string, dates: string[], status: string }) => {
      const res = await fetch("/api/admin/availability", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ roomId, dates, status })
      });
      if (!res.ok) throw new Error("Update failed");
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin_availabilities'] });
      setSelectedDates([]);
    }
  });

  const todayStr = format(new Date(), "yyyy-MM-dd");

  // Calculate days for the grid
  const daysInMonth = eachDayOfInterval({
    start: startOfMonth(currentMonth),
    end: endOfMonth(currentMonth)
  });

  // Filter rooms based on selection
  const filteredRooms = rooms?.filter(room =>
    propertyFilter === "all" || room.property.slug === propertyFilter
  ) || [];

  const handleDateClick = (roomId: string, dateStr: string) => {
    if (dateStr < todayStr) return; // Prevent clicking past dates

    const existing = selectedDates.find(s => s.roomId === roomId && s.date === dateStr);
    if (existing) {
      setSelectedDates(selectedDates.filter(s => !(s.roomId === roomId && s.date === dateStr)));
    } else {
      setSelectedDates([...selectedDates, { roomId, date: dateStr }]);
    }
  };

  const applyBulkStatus = (status: string) => {
    if (selectedDates.length === 0) return;

    // Group by roomId because API expects roomId and array of dates
    const grouped = selectedDates.reduce((acc, curr) => {
      if (!acc[curr.roomId]) acc[curr.roomId] = [];
      acc[curr.roomId].push(curr.date);
      return acc;
    }, {} as Record<string, string[]>);

    Object.entries(grouped).forEach(([roomId, dates]) => {
      updateStatusMut.mutate({ roomId, dates, status });
    });
  };

  // Batu Virtual Computed Status Logic Helper
  const getComputedStatus = (roomId: string, dateStr: string, roomSlug: string) => {
    // Robust date matching: convert availability date to YYYY-MM-DD in Asia/Jakarta
    const record = availabilities?.find(a => {
      if (a.roomId !== roomId) return false;
      const d = new Date(a.date);
      const recordDateStr = new Intl.DateTimeFormat("en-CA", {
        year: "numeric",
        month: "2-digit",
        day: "2-digit",
        timeZone: "Asia/Jakarta",
      }).format(d);
      return recordDateStr === dateStr;
    });
    let status = record?.status || "AVAILABLE";

    // Inject Batu Computed Logic
    if (roomSlug === "batu-full") {
      // Check L1 and L2
      const l1 = filteredRooms.find(r => r.property.slug === 'batu' && r.roomNumber === 'L1');
      const l2 = filteredRooms.find(r => r.property.slug === 'batu' && r.roomNumber === 'L2');
      if (l1 && l2) {
        const l1Status = availabilities?.find(a => a.roomId === l1.id && a.date.startsWith(dateStr))?.status || "AVAILABLE";
        const l2Status = availabilities?.find(a => a.roomId === l2.id && a.date.startsWith(dateStr))?.status || "AVAILABLE";

        if (l1Status !== "AVAILABLE" || l2Status !== "AVAILABLE") {
          status = "BLOCKED"; // Auto block full villa if any floor is booked
        }
      }
    }

    return status;
  };

  const isLoading = loadingRooms || loadingAvail;

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-3xl font-serif font-bold tracking-tight text-foreground">Kalender Ketersediaan</h2>
          <p className="text-muted-foreground mt-1">Kelola status per-kamar secara real-time tersinkronisasi.</p>
        </div>
      </div>

      <Card className="border-border/50 shadow-sm">
        <CardHeader className="flex flex-col md:flex-row md:items-center justify-between bg-muted/20 border-b py-4 gap-4">
          <div className="flex items-center gap-4">
            <Select value={propertyFilter} onValueChange={(v) => v && setPropertyFilter(v)}>
              <SelectTrigger className="w-[200px] bg-background">
                <SelectValue placeholder="Semua Properti" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Semua Properti</SelectItem>
                <SelectItem value="sidoarjo">Homestay Sidoarjo</SelectItem>
                <SelectItem value="surabaya">Kost Surabaya</SelectItem>
                <SelectItem value="batu">Villa Batu</SelectItem>
              </SelectContent>
            </Select>
            <div className="flex items-center bg-background rounded-md border shadow-sm ml-4">
              <Button variant="ghost" size="icon" className="h-9 w-9" onClick={() => setCurrentMonth(subMonths(currentMonth, 1))}>
                <ChevronLeft className="w-4 h-4" />
              </Button>
              <h3 className="font-semibold text-sm w-36 text-center flex items-center justify-center">
                <CalendarIcon className="w-4 h-4 mr-2 text-primary" />
                {format(currentMonth, "MMMM yyyy")}
              </h3>
              <Button variant="ghost" size="icon" className="h-9 w-9" onClick={() => setCurrentMonth(addMonths(currentMonth, 1))}>
                <ChevronRight className="w-4 h-4" />
              </Button>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <span className="text-sm font-semibold text-primary mr-2 bg-primary/10 px-3 py-1 rounded-full">
              {selectedDates.length} terpilih
            </span>
            <Button size="sm" variant="outline" className="border-emerald-500/20 text-emerald-500 hover:bg-emerald-500/10" onClick={() => applyBulkStatus("AVAILABLE")}>Set Tersedia</Button>
            <Button size="sm" variant="outline" className="border-red-500/20 text-red-500 hover:bg-red-500/10" onClick={() => applyBulkStatus("BOOKED")}>Set Dipesan</Button>
            <Button size="sm" variant="outline" className="border-amber-500/20 text-amber-500 hover:bg-amber-500/10" onClick={() => applyBulkStatus("MAINTENANCE")}>Set Maintenance</Button>
          </div>
        </CardHeader>

        <CardContent className="p-0 overflow-x-auto">
          {isLoading ? (
            <div className="h-[400px] flex items-center justify-center text-muted-foreground">
              <Loader2 className="w-8 h-8 animate-spin" />
            </div>
          ) : (
            <div className="min-w-[1200px]">
              {/* Table Header: Dates */}
              <div className="flex border-b">
                <div className="w-72 shrink-0 p-4 font-semibold text-sm border-r bg-muted/10">Properti / Kamar</div>
                <div className="flex-1 flex">
                  {daysInMonth.map(day => (
                    <div key={day.toISOString()} className="flex-1 min-w-[40px] border-r border-border/50 p-2 text-center text-xs font-medium text-muted-foreground">
                      <div>{format(day, "EEE")}</div>
                      <div className="text-sm font-bold text-foreground mt-1">{format(day, "d")}</div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Table Rows: Rooms & Grid */}
              {filteredRooms.length === 0 ? (
                <div className="p-12 text-center text-muted-foreground flex flex-col items-center">
                  <AlertCircle className="w-12 h-12 mb-4 opacity-20" />
                  <p>Tidak ada kamar ditemukan. Pastikan properti dan kamar tersedia.</p>
                </div>
              ) : filteredRooms.map(room => (
                <div key={room.id} className="flex border-b hover:bg-muted/5 transition-colors">
                  <div className="w-72 shrink-0 p-4 border-r flex items-center gap-3">
                    <span className="font-mono bg-muted/50 px-2 py-1 rounded border text-xs font-semibold text-muted-foreground min-w-[40px] text-center">
                      {room.roomNumber}
                    </span>
                    <div className="overflow-hidden">
                      <p className="font-bold text-sm text-foreground line-clamp-1" title={room.roomName}>{room.roomName}</p>
                      <p className="text-xs text-muted-foreground truncate">{room.property.name}</p>
                    </div>
                  </div>

                  <div className="flex-1 flex">
                    {daysInMonth.map(day => {
                      const dateStr = format(day, "yyyy-MM-dd"); // Strict mapping against UTC shifts
                      const isPast = dateStr < todayStr;

                      let status = getComputedStatus(room.id, dateStr, `${room.property.slug}-${room.roomNumber.toLowerCase()}`);
                      const isSelected = selectedDates.some(s => s.roomId === room.id && s.date === dateStr);

                      let colorClass = STATUS_COLORS[status] || STATUS_COLORS["AVAILABLE"];
                      if (isPast) {
                        colorClass = "bg-muted text-muted-foreground/30 border-border/50 cursor-not-allowed";
                      }

                      return (
                        <div
                          key={dateStr}
                          onClick={() => handleDateClick(room.id, dateStr)}
                          className={cn(
                            "flex-1 min-w-[40px] border-r border-border/50 p-1 transition-all flex items-center justify-center relative group",
                            isPast ? "cursor-not-allowed" : "cursor-pointer",
                            isSelected && !isPast ? "ring-2 ring-primary ring-inset bg-primary/10" : !isPast && "hover:bg-muted/50"
                          )}
                        >
                          <div className={cn(
                            "w-full h-full min-h-[40px] rounded border flex items-center justify-center opacity-80",
                            !isPast && "group-hover:opacity-100",
                            colorClass
                          )}
                            title={isPast ? "Sudah berlalu" : `${room.roomName} | ${format(day, "dd MMM")} - ${STATUS_LABELS[status] || "Tersedia"}`}
                          >
                            {isSelected && !isPast && <Check className="w-4 h-4" />}
                          </div>
                        </div>
                      )
                    })}
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      <div className="text-xs text-muted-foreground flex gap-4 mt-4 px-2">
        <span className="flex items-center gap-1.5"><span className="w-3 h-3 rounded-sm bg-emerald-500/20 border border-emerald-500/30 inline-block"></span> Tersedia</span>
        <span className="flex items-center gap-1.5"><span className="w-3 h-3 rounded-sm bg-red-500/20 border border-red-500/30 inline-block"></span> Dipesan</span>
        <span className="flex items-center gap-1.5"><span className="w-3 h-3 rounded-sm bg-amber-500/20 border border-amber-500/30 inline-block"></span> Maintenance</span>
        <span className="flex items-center gap-1.5"><span className="w-3 h-3 rounded-sm bg-slate-500/20 border border-slate-500/30 inline-block"></span> Diblokir (Auto)</span>
      </div>
    </div>
  );
}
