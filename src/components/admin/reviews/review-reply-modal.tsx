import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Loader2, Send } from "lucide-react";
import { toast } from "sonner";

export function ReviewReplyModal({ isOpen, onClose, onSuccess, initialData }: any) {
  const [loading, setLoading] = useState(false);
  const [replyText, setReplyText] = useState("");

  useEffect(() => {
    if (isOpen && initialData) {
      setReplyText(initialData.replyText || "");
    }
  }, [isOpen, initialData]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!initialData) return;

    setLoading(true);

    try {
      const res = await fetch(`/api/admin/reviews/${initialData.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ 
          replyText, 
          replyDate: replyText ? new Date().toISOString() : null 
        })
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error);

      toast.success("Balasan berhasil disimpan!");
      onSuccess();
      onClose();
    } catch (error: any) {
      toast.error(error.message);
    } finally {
      setLoading(false);
    }
  };

  if (!initialData) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Balas Ulasan</DialogTitle>
          <DialogDescription>
            Tanggapi ulasan dari {initialData.authorName}.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4 py-4">
          <div className="bg-muted/50 p-4 rounded-lg text-sm text-muted-foreground italic border">
            "{initialData.text}"
          </div>

          <div className="space-y-2">
            <Label>Balasan Anda</Label>
            <Textarea 
              value={replyText} 
              onChange={(e) => setReplyText(e.target.value)} 
              placeholder="Terima kasih atas ulasannya..."
              rows={5}
            />
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={onClose} disabled={loading}>Batal</Button>
            <Button type="submit" disabled={loading}>
              {loading ? <><Loader2 className="w-4 h-4 mr-2 animate-spin" /> Menyimpan...</> : <><Send className="w-4 h-4 mr-2" /> Simpan Balasan</>}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
