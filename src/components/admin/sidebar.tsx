"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { signOut } from "next-auth/react";
import { 
  LayoutDashboard, 
  CalendarDays, 
  Building2, 
  ClipboardList, 
  Settings,
  LogOut
} from "lucide-react";

export function Sidebar() {
  const pathname = usePathname();

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

  return (
    <div className="w-64 bg-white border-r border-border/50 h-screen sticky top-0 flex flex-col shadow-sm z-20">
      
      {/* Brand */}
      <div className="h-16 flex items-center px-6 border-b border-border/50">
        <span className="text-xl font-serif font-bold tracking-tight text-primary">Alvira Admin</span>
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
    </div>
  );
}
