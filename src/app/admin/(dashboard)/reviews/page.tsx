"use client";

import { useState, useEffect } from "react";
import { ReviewTable } from "@/components/admin/reviews/review-table";
import { ReviewFormModal } from "@/components/admin/reviews/review-form-modal";
import { ReviewReplyModal } from "@/components/admin/reviews/review-reply-modal";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Plus, RefreshCcw, Star, Calendar } from "lucide-react";
import { toast } from "sonner";

export default function AdminReviewsPage() {
  const [reviews, setReviews] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [isSyncing, setIsSyncing] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isReplyModalOpen, setIsReplyModalOpen] = useState(false);
  const [editingReview, setEditingReview] = useState<any | null>(null);
  const [replyingReview, setReplyingReview] = useState<any | null>(null);

  const fetchReviews = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/admin/reviews");
      if (!res.ok) throw new Error("Gagal mengambil data review");
      const data = await res.json();
      setReviews(data);
    } catch (error: any) {
      toast.error(error.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReviews();
  }, []);

  const handleSyncGoogle = async () => {
    setIsSyncing(true);
    try {
      const res = await fetch("/api/admin/reviews/sync-google", { method: "POST" });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Sync failed");
      toast.success(data.message);
      fetchReviews();
    } catch (error: any) {
      toast.error(error.message);
    } finally {
      setIsSyncing(false);
    }
  };

  const activeReviews = reviews.filter(r => r.isVisible);
  const googleReviews = reviews.filter(r => r.source === "GOOGLE");
  const manualReviews = reviews.filter(r => r.source === "MANUAL");

  return (
    <div className="p-6 md:p-8 max-w-7xl mx-auto space-y-8 animate-in fade-in duration-150">
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
        <div>
          <h1 className="text-3xl font-serif font-bold tracking-tight text-foreground">Kelola Ulasan</h1>
          <p className="text-muted-foreground mt-1">Management sistem review publik dan manual.</p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" onClick={handleSyncGoogle} disabled={isSyncing} className="gap-2">
            <RefreshCcw className={`w-4 h-4 ${isSyncing ? 'animate-spin' : ''}`} />
            {isSyncing ? "Menyinkronkan..." : "Sync Google Reviews"}
          </Button>
          <Button onClick={() => { setEditingReview(null); setIsModalOpen(true); }} className="gap-2">
            <Plus className="w-4 h-4" /> Tambah Manual
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="bg-gradient-to-br from-primary/10 to-primary/5 border-none shadow-sm">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
              <Star className="w-4 h-4 text-amber-500" /> Total Ulasan Aktif
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{activeReviews.length}</div>
            <p className="text-xs text-muted-foreground mt-1">Ditampilkan di layar publik</p>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-rose-500/10 to-rose-500/5 border-none shadow-sm dark:from-rose-500/20 dark:to-rose-500/10">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
              <Star className="w-4 h-4 text-rose-500 opacity-50" /> Ulasan Disembunyikan
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{reviews.filter(r => !r.isVisible).length}</div>
            <p className="text-xs text-muted-foreground mt-1">Menunggu moderasi / disembunyikan</p>
          </CardContent>
        </Card>
        
        <Card className="bg-gradient-to-br from-blue-500/10 to-blue-500/5 border-none shadow-sm dark:from-blue-500/20 dark:to-blue-500/10">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
              <RefreshCcw className="w-4 h-4 text-blue-500" /> Sumber: Google
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{googleReviews.length}</div>
            <p className="text-xs text-muted-foreground mt-1">Hasil sinkronisasi otomatis</p>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-emerald-500/10 to-emerald-500/5 border-none shadow-sm dark:from-emerald-500/20 dark:to-emerald-500/10">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
              <Calendar className="w-4 h-4 text-emerald-500" /> Sumber: Manual
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{manualReviews.length}</div>
            <p className="text-xs text-muted-foreground mt-1">Dibuat oleh admin</p>
          </CardContent>
        </Card>
      </div>

      <div className="bg-card border rounded-xl shadow-sm overflow-hidden">
        <ReviewTable 
          data={reviews} 
          loading={loading} 
          onRefresh={fetchReviews} 
          onEdit={(r: any) => { setEditingReview(r); setIsModalOpen(true); }}
          onReply={(r: any) => { setReplyingReview(r); setIsReplyModalOpen(true); }}
        />
      </div>

      <ReviewFormModal 
        isOpen={isModalOpen} 
        onClose={() => { setIsModalOpen(false); setEditingReview(null); }} 
        onSuccess={fetchReviews}
        initialData={editingReview}
      />

      <ReviewReplyModal
        isOpen={isReplyModalOpen}
        onClose={() => { setIsReplyModalOpen(false); setReplyingReview(null); }}
        onSuccess={fetchReviews}
        initialData={replyingReview}
      />
    </div>
  );
}
