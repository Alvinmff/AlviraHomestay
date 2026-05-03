"use client";

import { useState } from "react";
import { format, differenceInDays } from "date-fns";
import { id } from "date-fns/locale";

function getRelativeTimeString(date: string | Date) {
  if (!date) return "Baru saja";
  const d = typeof date === "string" ? new Date(date) : date;
  const days = differenceInDays(new Date(), d);
  
  if (days === 0) return "Hari ini";
  if (days < 7) return `${days} hari yang lalu`;
  if (days < 30) {
    const weeks = Math.floor(days / 7);
    return `${weeks} minggu yang lalu`;
  }
  if (days < 365) {
    const months = Math.floor(days / 30);
    return `${months} bulan yang lalu`;
  }
  const years = Math.floor(days / 365);
  return `${years} tahun yang lalu`;
}
import { MapPin, Search, MoreVertical, Eye, EyeOff, Edit, Trash2, Filter } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export function ReviewTable({ data, loading, onRefresh, onEdit }: any) {
  const [searchTerm, setSearchTerm] = useState("");
  const [filterSource, setFilterSource] = useState("ALL");

  const filteredData = data.filter((review: any) => {
    const matchesSearch = review.authorName.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          review.text.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesSource = filterSource === "ALL" || review.source === filterSource;
    return matchesSearch && matchesSource;
  });

  const toggleVisibility = async (review: any) => {
    const newStatus = !review.isVisible;
    try {
      const res = await fetch(`/api/admin/reviews/${review.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ isVisible: newStatus })
      });
      if (!res.ok) throw new Error();
      toast.success(`Ulasan berhasil di${newStatus ? 'tampilkan' : 'sembunyikan'}`);
      onRefresh();
    } catch {
      toast.error("Gagal mengubah status ulasan");
    }
  };

  const deleteReview = async (reviewId: string) => {
    if (!confirm("Hapus ulasan ini secara permanen?")) return;
    try {
      const res = await fetch(`/api/admin/reviews/${reviewId}`, { method: "DELETE" });
      if (!res.ok) throw new Error();
      toast.success("Ulasan dihapus");
      onRefresh();
    } catch {
      toast.error("Gagal menghapus ulasan");
    }
  };

  return (
    <div className="flex flex-col h-full bg-card rounded-xl border">
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 p-4 border-b">
        <div className="relative w-full sm:max-w-sm">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input 
            placeholder="Cari nama atau ulasan..." 
            className="pl-9"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <div className="flex items-center gap-2 w-full sm:w-auto">
          <Filter className="w-4 h-4 text-muted-foreground" />
          <select 
            className="h-10 px-3 py-2 rounded-md border bg-background text-sm ring-offset-background"
            value={filterSource}
            onChange={(e) => setFilterSource(e.target.value)}
          >
            <option value="ALL">Semua Sumber</option>
            <option value="GOOGLE">Google Review</option>
            <option value="MANUAL">Input Manual</option>
          </select>
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-sm text-left">
          <thead className="bg-muted/50 border-b">
            <tr>
              <th className="font-semibold p-4 w-1/4">Penulis & Rating</th>
              <th className="font-semibold p-4 w-1/2">Isi Ulasan</th>
              <th className="font-semibold p-4">Detail</th>
              <th className="font-semibold p-4 text-center">Status</th>
              <th className="font-semibold p-4 text-right">Aksi</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan={5} className="py-12 text-center text-muted-foreground">Memuat data...</td>
              </tr>
            ) : filteredData.length === 0 ? (
              <tr>
                <td colSpan={5} className="py-12 text-center text-muted-foreground">Tidak ada ulasan ditemukan.</td>
              </tr>
            ) : (
              filteredData.map((review: any) => (
                <tr key={review.id} className={`border-b hover:bg-muted/30 transition-colors ${!review.isVisible ? 'bg-muted/10 opacity-75' : ''}`}>
                  <td className="p-4 align-top">
                    <div className="flex items-center gap-3">
                      {review.authorPhoto ? (
                        <img src={review.authorPhoto} alt={review.authorName} className="w-10 h-10 rounded-full object-cover border bg-muted" />
                      ) : (
                        <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold text-lg">
                          {review.authorName.charAt(0).toUpperCase()}
                        </div>
                      )}
                      <div>
                        <p className="font-semibold line-clamp-1">{review.authorName}</p>
                        <div className="flex items-center text-amber-500 mt-1">
                          {'★'.repeat(review.rating)}{'☆'.repeat(5-review.rating)}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="p-4 align-top">
                    <p className="line-clamp-2 md:line-clamp-3 leading-relaxed text-muted-foreground">{review.text}</p>
                    {review.propertyId && review.property?.name && (
                      <span className="inline-flex items-center gap-1 text-xs text-primary bg-primary/10 px-2 py-0.5 rounded-full mt-2">
                        <MapPin className="w-3 h-3" /> {review.property.name}
                      </span>
                    )}
                  </td>
                  <td className="p-4 align-top">
                    <div className="space-y-1">
                      <Badge variant={review.source === "GOOGLE" ? "outline" : "secondary"} className="text-[10px]">
                        {review.source}
                      </Badge>
                      <p className="text-sm font-medium text-foreground">
                        {getRelativeTimeString(review.reviewDate)}
                      </p>
                      <p className="text-[10px] text-muted-foreground uppercase tracking-wider">
                        {format(new Date(review.reviewDate), "dd MMM yyyy", { locale: id })}
                      </p>
                    </div>
                  </td>
                  <td className="p-4 align-top text-center">
                    <Badge variant={review.isVisible ? "default" : "secondary"} className={review.isVisible ? "bg-emerald-500 hover:bg-emerald-600" : ""}>
                      {review.isVisible ? <><Eye className="w-3 h-3 mr-1" /> Tampil</> : <><EyeOff className="w-3 h-3 mr-1" /> Disembunyikan</>}
                    </Badge>
                  </td>
                  <td className="p-4 align-top text-right">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <button 
                          type="button"
                          className="flex items-center justify-center rounded-md hover:bg-muted transition-colors h-8 w-8 outline-none focus:ring-2 focus:ring-primary/20"
                        >
                          <MoreVertical className="h-4 w-4 text-muted-foreground" />
                        </button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end" className="z-[100]">
                        <DropdownMenuLabel>Aksi</DropdownMenuLabel>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem onClick={() => toggleVisibility(review)}>
                          {review.isVisible ? <EyeOff className="w-4 h-4 mr-2" /> : <Eye className="w-4 h-4 mr-2" />}
                          {review.isVisible ? "Sembunyikan" : "Tampilkan Publik"}
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => onEdit(review)}>
                          <Edit className="w-4 h-4 mr-2" /> Edit Ulasan
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem className="text-destructive focus:bg-destructive/10" onClick={() => deleteReview(review.id)}>
                          <Trash2 className="w-4 h-4 mr-2" /> Hapus Permanen
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
