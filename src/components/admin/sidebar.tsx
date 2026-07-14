"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { cn } from "@/lib/utils";
import { signOut } from "next-auth/react";
import {
  LayoutDashboard,
  CalendarDays,
  Building2,
  ClipboardList,
  Settings,
  LogOut,
  Menu,
  X,
  MessageSquareQuote
} from "lucide-react";

interface SidebarProps {
  pendingBookings?: number;
  totalReviews?: number;
}

export function Sidebar({ pendingBookings = 0, totalReviews = 0 }: SidebarProps) {
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);

  const menuGroups = [
    {
      label: "DASHBOARD",
      items: [
        { href: "/admin", icon: <LayoutDashboard className="w-5 h-5" />, title: "Overview" },
      ]
    },
    {
      label: "MANAGEMENT",
      items: [
        { href: "/admin/calendar", icon: <CalendarDays className="w-5 h-5" />, title: "Kalender Ketersediaan" },
        { href: "/admin/bookings", icon: <ClipboardList className="w-5 h-5" />, title: "Data Booking" },
        { href: "/admin/properties", icon: <Building2 className="w-5 h-5" />, title: "Kelola Properti" },
        { href: "/admin/reviews", icon: <MessageSquareQuote className="w-5 h-5" />, title: "Kelola Ulasan" },
      ]
    },
    {
      label: "SETTINGS",
      items: [
        { href: "/admin/settings", icon: <Settings className="w-5 h-5" />, title: "Pengaturan" },
      ]
    }
  ];

  const NavContent = () => (
    <>
      {/* Brand */}
      <div className="h-20 flex items-center px-8">
        <span className="text-xl font-bold tracking-widest text-foreground uppercase">Homestay Alvira</span>
        <button onClick={() => setMobileOpen(false)} className="lg:hidden ml-auto p-1 rounded-md hover:bg-muted text-muted-foreground">
          <X className="w-5 h-5" />
        </button>
      </div>

      {/* Navigation */}
      <div className="flex-1 py-4 px-6 space-y-8 overflow-y-auto">
        {menuGroups.map((group, idx) => (
          <div key={idx} className="space-y-4">
            <h4 className="text-xs font-semibold text-muted-foreground/70 tracking-[0.1em] px-2 uppercase">
              {group.label}
            </h4>
            <div className="space-y-1">
              {group.items.map((item) => {
                const isActive = pathname === item.href || pathname.startsWith(item.href + "/");
                // Avoid matching /admin for all routes
                const exactMatch = item.href === "/admin" ? pathname === "/admin" : isActive;
                
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    prefetch={false}
                    onClick={() => setMobileOpen(false)}
                    className={cn(
                      "flex items-center justify-between px-4 py-3 rounded-2xl text-sm font-medium transition-all duration-200 group",
                      exactMatch
                        ? "bg-accent text-accent-foreground shadow-sm"
                        : "text-muted-foreground hover:bg-muted/50 hover:text-foreground"
                    )}
                  >
                    <div className="flex items-center gap-4">
                      <span className={cn(
                        "transition-colors", 
                        exactMatch ? "text-foreground" : "text-muted-foreground group-hover:text-foreground"
                      )}>
                        {item.icon}
                      </span>
                      <span className={cn(exactMatch && "font-bold")}>{item.title}</span>
                    </div>
                    {/* Dynamic notification badge */}
                    {item.title === "Data Booking" && pendingBookings > 0 && (
                      <span className="bg-[#19A794] text-white text-[10px] font-bold px-2 py-0.5 rounded-full">
                        {pendingBookings}
                      </span>
                    )}
                    {item.title === "Kelola Ulasan" && totalReviews > 0 && (
                      <span className="bg-[#19A794] text-white text-[10px] font-bold px-2 py-0.5 rounded-full">
                        {totalReviews}
                      </span>
                    )}
                  </Link>
                )
              })}
            </div>
          </div>
        ))}
      </div>

      {/* Footer / Logout */}
      <div className="p-6">
        <button
          onClick={() => signOut({ callbackUrl: '/admin/login' })}
          className="flex flex-row items-center gap-4 px-4 py-3 rounded-2xl text-sm font-medium text-muted-foreground hover:bg-destructive/10 hover:text-destructive transition-colors w-full text-left group"
        >
          <LogOut className="w-5 h-5 text-muted-foreground/70 group-hover:text-destructive" />
          Logout
        </button>
      </div>
    </>
  );

  return (
    <>
      {/* Mobile Toggle Button (fixed top-left) */}
      <button
        onClick={() => setMobileOpen(true)}
        className="lg:hidden fixed top-3 left-4 z-30 p-2 rounded-lg bg-background text-foreground border shadow-sm hover:bg-muted transition-colors"
        aria-label="Open menu"
      >
        <Menu className="w-5 h-5" />
      </button>

      {/* Desktop Sidebar */}
      <div className="hidden lg:flex w-64 bg-card border-r border-border/50 h-screen sticky top-0 flex-col shadow-sm z-20">
        <NavContent />
      </div>

      {/* Mobile Sidebar Overlay */}
      {mobileOpen && (
        <>
          <div
            className="lg:hidden fixed inset-0 bg-black/40 z-40 backdrop-blur-sm"
            onClick={() => setMobileOpen(false)}
          />
          <div className="lg:hidden fixed inset-y-0 left-0 w-72 bg-card z-50 flex flex-col shadow-xl animate-in slide-in-from-left duration-200">
            <NavContent />
          </div>
        </>
      )}
    </>
  );
}
