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
  X
} from "lucide-react";

export function Sidebar() {
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
      <div className="h-16 flex items-center justify-between px-6 border-b border-border/50">
        <span className="text-xl font-serif font-bold tracking-tight text-primary">Alvira Admin</span>
        <button onClick={() => setMobileOpen(false)} className="lg:hidden p-1 rounded-md hover:bg-muted">
          <X className="w-5 h-5" />
        </button>
      </div>

      {/* Navigation */}
      <div className="flex-1 py-6 px-4 space-y-8 overflow-y-auto">
        {menuGroups.map((group, idx) => (
          <div key={idx} className="space-y-3">
            <h4 className="text-xs font-semibold text-muted-foreground tracking-wider px-2">
              {group.label}
            </h4>
            <div className="space-y-1">
              {group.items.map((item) => {
                const isActive = pathname === item.href;
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    onClick={() => setMobileOpen(false)}
                    className={cn(
                      "flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors group",
                      isActive
                        ? "bg-primary/10 text-primary"
                        : "text-muted-foreground hover:bg-muted/50 hover:text-foreground"
                    )}
                  >
                    <span className={cn("transition-colors", isActive ? "text-primary" : "text-muted-foreground group-hover:text-foreground")}>
                      {item.icon}
                    </span>
                    {item.title}
                  </Link>
                )
              })}
            </div>
          </div>
        ))}
      </div>

      {/* Footer / Logout */}
      <div className="p-4 border-t border-border/50">
        <button
          onClick={() => signOut({ callbackUrl: '/admin/login' })}
          className="flex flex-row items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-destructive hover:bg-destructive/10 transition-colors w-full text-left"
        >
          <LogOut className="w-5 h-5" />
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
        className="lg:hidden fixed top-3 left-4 z-30 p-2 rounded-lg bg-white border shadow-sm hover:bg-muted transition-colors"
        aria-label="Open menu"
      >
        <Menu className="w-5 h-5" />
      </button>

      {/* Desktop Sidebar */}
      <div className="hidden lg:flex w-64 bg-white border-r border-border/50 h-screen sticky top-0 flex-col shadow-sm z-20">
        <NavContent />
      </div>

      {/* Mobile Sidebar Overlay */}
      {mobileOpen && (
        <>
          <div
            className="lg:hidden fixed inset-0 bg-black/40 z-40 backdrop-blur-sm"
            onClick={() => setMobileOpen(false)}
          />
          <div className="lg:hidden fixed inset-y-0 left-0 w-72 bg-white z-50 flex flex-col shadow-xl animate-in slide-in-from-left duration-200">
            <NavContent />
          </div>
        </>
      )}
    </>
  );
}
