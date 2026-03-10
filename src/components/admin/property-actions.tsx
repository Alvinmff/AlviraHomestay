"use client";

import { useState } from "react";
import { Power, Settings, Trash2, Home } from "lucide-react";
import { Button, buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import Link from "next/link";

export function PropertyActions({ propertyId, isActive }: { propertyId: string, isActive: boolean }) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  async function toggleStatus() {
    try {
      setLoading(true);
      // Fallback empty PUT request or explicitly toggle flag
      const res = await fetch(`/api/admin/properties/${propertyId}/toggle-visibility`, {
        method: "PATCH",
      });
      if (!res.ok) throw new Error("Gagal mengubah status properti");
      toast.success(isActive ? "Properti berhasil dinonaktifkan" : "Properti berhasil diaktifkan");
      router.refresh();
    } catch {
      toast.error("Terjadi kesalahan sistem.");
    } finally {
      setLoading(false);
    }
  }

  async function deleteProperty() {
    if (!window.confirm("Apakah Anda yakin ingin menghapus properti ini beserta seluruh kamar dan data bookingnya? Tindakan ini tidak dapat dibatalkan.")) {
      return;
    }

    try {
      setLoading(true);
      const res = await fetch(`/api/admin/properties/${propertyId}`, {
        method: "DELETE",
      });
      if (!res.ok) throw new Error("Gagal menghapus properti");
      toast.success("Properti berhasil dihapus");
      router.refresh();
    } catch {
      toast.error("Terjadi kesalahan sistem saat menghapus.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="flex items-center justify-between">
      <Link href={`/admin/rooms?propertyId=${propertyId}`} className={cn(buttonVariants({ variant: "ghost", size: "sm" }), "text-muted-foreground hover:text-foreground -ml-2 h-8 px-2")}>
        <Home className="w-3.5 h-3.5 mr-1.5" /> Kelola Kamar
      </Link>

      <div className="flex gap-1">
        <Button
          onClick={toggleStatus}
          disabled={loading}
          variant="ghost"
          size="icon"
          className="h-8 w-8 text-muted-foreground hover:text-primary transition-colors"
          title={isActive ? "Nonaktifkan Properti" : "Aktifkan Properti"}
        >
          <Power className="w-3.5 h-3.5" />
        </Button>
        <Button
          variant="ghost"
          size="icon"
          className="h-8 w-8 text-muted-foreground hover:text-primary transition-colors"
          title="Pengaturan Lanjutan"
          onClick={() => router.push(`/admin/properties/${propertyId}/edit`)}
          disabled={loading}
        >
          <Settings className="w-3.5 h-3.5" />
        </Button>
        <Button
          variant="ghost"
          size="icon"
          className="h-8 w-8 text-muted-foreground hover:text-red-500 transition-colors"
          title="Hapus Properti"
          onClick={deleteProperty}
          disabled={loading}
        >
          <Trash2 className="w-3.5 h-3.5" />
        </Button>
      </div>
    </div>
  );
}
