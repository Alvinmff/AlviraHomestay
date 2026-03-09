"use client";

import { 
  Building2, 
  Users, 
  CalendarCheck, 
  TrendingUp,
  ArrowUpRight
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function AdminOverviewPage() {
  const stats = [
    { title: "Total Booking Bulan Ini", value: "24", icon: <CalendarCheck className="w-4 h-4 text-muted-foreground" />, trend: "+12%" },
    { title: "Occupancy Rate", value: "78%", icon: <Building2 className="w-4 h-4 text-muted-foreground" />, trend: "+5%" },
    { title: "Estimasi Revenue", value: "Rp 15.4M", icon: <TrendingUp className="w-4 h-4 text-muted-foreground" />, trend: "+8%" },
    { title: "Total Tamu", value: "142", icon: <Users className="w-4 h-4 text-muted-foreground" />, trend: "+2%" },
  ];

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      
      <div>
        <h2 className="text-3xl font-serif font-bold tracking-tight text-foreground">Overview</h2>
        <p className="text-muted-foreground">Ringkasan performa Homestay Alvira bulan ini.</p>
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
                {stat.trend} dari bulan lalu
              </p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Recent Bookings Table Placeholder */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-7">
        <Card className="lg:col-span-4 border-border/50 shadow-sm">
          <CardHeader>
            <CardTitle className="font-serif">Booking Terbaru</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-8">
              {/* Dummy data mapping to match requested UI schema */}
              {[
                { name: "Budi Santoso", prop: "Homestay Sidoarjo", status: "Confirmed", date: "15 Oct 2026" },
                { name: "Siti Aminah", prop: "Kost Surabaya", status: "Inquiry", date: "16 Oct 2026" },
                { name: "Reza Rahardian", prop: "Villa Premium Batu", status: "Checked In", date: "14 Oct 2026" },
              ].map((b, i) => (
                <div key={i} className="flex items-center">
                  <div className="space-y-1">
                    <p className="text-sm font-medium leading-none">{b.name}</p>
                    <p className="text-sm text-muted-foreground">
                      {b.prop} • Check-in: {b.date}
                    </p>
                  </div>
                  <div className="ml-auto font-medium text-sm">
                    <span className={`px-2 py-1 rounded-full text-xs ${
                      b.status === "Confirmed" ? "bg-emerald-100 text-emerald-700" :
                      b.status === "Inquiry" ? "bg-amber-100 text-amber-700" :
                      "bg-blue-100 text-blue-700"
                    }`}>
                      {b.status}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Quick Actions / Activity Placeholder */}
        <Card className="lg:col-span-3 border-border/50 shadow-sm">
          <CardHeader>
            <CardTitle className="font-serif">Aktivitas Kalender</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground italic text-center py-10">
              Integrasi Kalender Ketersediaan Real-time akan tampil disini.
            </p>
          </CardContent>
        </Card>
      </div>

    </div>
  );
}
