"use client";

import { useState } from "react";
import { Edit, Eye, EyeOff, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

export function RoomActions({ roomId, isShown }: { roomId: string, isShown: boolean }) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  async function toggleVisibility() {
    try {
      setLoading(true);
      const res = await fetch(`/api/admin/rooms/${roomId}/toggle-visibility`, { method: "PATCH" });
      if (!res.ok) throw new Error("Gagal merubah status");
      toast.success(isShown ? "Kamar disembunyikan dari listing" : "Kamar berhasil dipublish");
      router.refresh();
    } catch (e: unknown) {
      toast.error((e as Error).message);
    } finally {
      setLoading(false);
    }
  }

  async function deleteRoom() {
    if (!confirm("Apakah Anda yakin ingin menghapus kamar ini selamanya?")) return;
    try {
      setLoading(true);
      const res = await fetch(`/api/admin/rooms/${roomId}`, { method: "DELETE" });
      if (!res.ok) throw new Error("Gagal menghapus kamar");
      toast.success("Kamar berhasil dihapus");
      router.refresh();
    } catch (e: unknown) {
      toast.error((e as Error).message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="flex items-center justify-end gap-2">
      <Button 
        variant="ghost" 
        size="icon" 
        className="h-8 w-8 text-muted-foreground hover:text-primary"
        onClick={() => router.push(`/admin/rooms/${roomId}/edit`)}
        disabled={loading}
      >
        <Edit className="w-4 h-4" />
      </Button>
      <Button 
        variant="ghost" 
        size="icon" 
        className="h-8 w-8 text-muted-foreground hover:text-primary"
        onClick={toggleVisibility}
        disabled={loading}
      >
        {isShown ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
      </Button>
      <Button 
        variant="ghost" 
        size="icon" 
        className="h-8 w-8 text-muted-foreground hover:text-destructive"
        onClick={deleteRoom}
        disabled={loading}
      >
        <Trash2 className="w-4 h-4" />
      </Button>
    </div>
  );
}
