import { useState, useEffect, useRef } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Loader2, Star, Upload, ImageIcon, X, Trash2, Check } from "lucide-react";
import { toast } from "sonner";
import ReactCrop, { type Crop, centerCrop, makeAspectCrop } from "react-image-crop";
import "react-image-crop/dist/ReactCrop.css";

export function ReviewFormModal({ isOpen, onClose, onSuccess, initialData }: any) {
  const [loading, setLoading] = useState(false);
  const [uploadingImage, setUploadingImage] = useState(false);
  const [properties, setProperties] = useState<any[]>([]);
  
  // Form States
  const [authorName, setAuthorName] = useState("");
  const [authorPhoto, setAuthorPhoto] = useState("");
  const [rating, setRating] = useState(5);
  const [text, setText] = useState("");
  const [propertyId, setPropertyId] = useState("");
  const [reviewDate, setReviewDate] = useState(new Date().toISOString().split('T')[0]);
  const [isVisible, setIsVisible] = useState(true);
  
  // Crop States
  const [imgSrc, setImgSrc] = useState("");
  const [crop, setCrop] = useState<Crop>();
  const [completedCrop, setCompletedCrop] = useState<Crop | null>(null);
  const [showCropModal, setShowCropModal] = useState(false);
  const imgRef = useRef<HTMLImageElement>(null);
  
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isOpen) {
      setAuthorName(initialData?.authorName || "");
      setAuthorPhoto(initialData?.authorPhoto || "");
      setRating(initialData?.rating || 5);
      setText(initialData?.text || "");
      setPropertyId(initialData?.propertyId || "");
      setReviewDate(initialData?.reviewDate ? new Date(initialData.reviewDate).toISOString().split('T')[0] : new Date().toISOString().split('T')[0]);
      setIsVisible(initialData?.isVisible ?? true);

      // Fetch properties
      fetch("/api/admin/properties")
        .then(res => res.json())
        .then(data => setProperties(data))
        .catch(console.error);
    }
  }, [isOpen, initialData]);

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setCrop(undefined);
    setCompletedCrop(null);
    const reader = new FileReader();
    reader.addEventListener("load", () => {
      setImgSrc(reader.result?.toString() || "");
      setShowCropModal(true);
    });
    reader.readAsDataURL(file);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const uploadCroppedImage = async () => {
    if (!imgRef.current || !completedCrop || !completedCrop.width || !completedCrop.height) {
      toast.error("Silakan tentukan area potong gambar.");
      return;
    }

    const image = imgRef.current;
    const canvas = document.createElement("canvas");
    const scaleX = image.naturalWidth / image.width;
    const scaleY = image.naturalHeight / image.height;

    const cx = completedCrop.x * scaleX;
    const cy = completedCrop.y * scaleY;
    const cw = completedCrop.width * scaleX;
    const ch = completedCrop.height * scaleY;

    canvas.width = cw;
    canvas.height = ch;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    ctx.imageSmoothingQuality = "high";
    ctx.drawImage(image, cx, cy, cw, ch, 0, 0, cw, ch);

    setUploadingImage(true);

    canvas.toBlob(async (blob) => {
      if (!blob) {
        setUploadingImage(false);
        return toast.error("Gagal memproses gambar.");
      }

      const formData = new FormData();
      formData.append("file", blob, "avatar.jpg");

      try {
        const res = await fetch("/api/upload", {
          method: "POST",
          body: formData,
        });
        const data = await res.json();
        if (!res.ok) throw new Error(data.error);

        setAuthorPhoto(data.url);
        toast.success("Foto profil diperbarui");
        setShowCropModal(false);
      } catch (err: any) {
        toast.error(err.message);
      } finally {
        setUploadingImage(false);
      }
    }, "image/jpeg", 0.9);
  };

  const removePhoto = () => {
    setAuthorPhoto("");
    toast.success("Foto dihapus, menggunakan avatar default");
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    const payload = {
      authorName,
      authorPhoto,
      rating,
      text,
      propertyId: propertyId || null,
      reviewDate,
      isVisible
    };

    try {
      const url = initialData ? `/api/admin/reviews/${initialData.id}` : `/api/admin/reviews`;
      const method = initialData ? "PATCH" : "POST";

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error);

      toast.success(initialData ? "Review diupdate!" : "Review ditambahkan!");
      onSuccess();
      onClose();
    } catch (error: any) {
      toast.error(error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>{initialData ? "Edit Review Manual" : "Tambah Review Manual"}</DialogTitle>
          <DialogDescription>
            Ulasan yang ditambahkan secara manual dapat dikelola secara penuh oleh Admin.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6 py-4">
          <div className="flex gap-4 items-center">
            <div className="relative w-16 h-16 rounded-full border bg-muted flex-shrink-0 flex items-center justify-center overflow-hidden group">
              {authorPhoto ? (
                <img src={authorPhoto} alt="Avatar" className="w-full h-full object-cover" />
              ) : (
                <ImageIcon className="w-6 h-6 text-muted-foreground opacity-50" />
              )}
              <div 
                className={`absolute inset-0 bg-black/50 items-center justify-center cursor-pointer transition-opacity ${authorPhoto ? 'opacity-0 group-hover:opacity-100' : 'opacity-0 hover:opacity-100'} flex`}
                onClick={() => fileInputRef.current?.click()}
              >
                {uploadingImage ? <Loader2 className="w-5 h-5 text-white animate-spin" /> : <Upload className="w-5 h-5 text-white" />}
              </div>
              <input type="file" accept="image/*" className="hidden" ref={fileInputRef} onChange={handleFileSelect} />
              
              {authorPhoto && (
                <Button 
                  type="button" 
                  variant="outline" 
                  size="icon" 
                  className="absolute bottom-0 right-0 w-6 h-6 rounded-full bg-white shadow-md border-destructive/20 text-destructive hover:bg-destructive hover:text-white transition-all z-20 scale-90 group-hover:scale-100 shadow-destructive/10"
                  onClick={(e) => {
                    e.stopPropagation();
                    removePhoto();
                  }}
                >
                  <Trash2 className="w-3 h-3" />
                </Button>
              )}
            </div>

            <div className="flex-1 space-y-2">
              <Label>Nama Penulis <span className="text-destructive">*</span></Label>
              <Input value={authorName} onChange={(e) => setAuthorName(e.target.value)} placeholder="Nama Tamu..." required />
            </div>
          </div>

          <div className="space-y-3">
            <Label>Rating Bintang <span className="text-destructive">*</span></Label>
            <div className="flex gap-1 items-center bg-muted/50 p-3 rounded-lg w-fit">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  type="button"
                  onClick={() => setRating(star)}
                  className={`p-1 transition-all hover:scale-110 focus:outline-none`}
                >
                  <Star className={`w-8 h-8 ${star <= rating ? 'fill-amber-500 text-amber-500' : 'text-slate-300'}`} />
                </button>
              ))}
              <span className="ml-3 font-semibold text-muted-foreground">{rating}/5</span>
            </div>
          </div>

          <div className="space-y-2">
            <Label>Tanggal Ulasan <span className="text-destructive">*</span></Label>
            <Input 
              type="date" 
              value={reviewDate} 
              onChange={(e) => setReviewDate(e.target.value)} 
              required 
            />
          </div>

          <div className="space-y-2">
            <Label>Lokasi Menginap (Opsional)</Label>
            <select 
              className="flex h-10 w-full items-center justify-between rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
              value={propertyId}
              onChange={(e) => setPropertyId(e.target.value)}
            >
              <option value="">Pilih Properti (Tidak Spesifik)</option>
              {properties.map((prop) => (
                <option key={prop.id} value={prop.id}>
                  {prop.name} - {prop.city}
                </option>
              ))}
            </select>
          </div>

          <div className="space-y-2">
            <Label>Isi Ulasan <span className="text-destructive">*</span></Label>
            <Textarea 
              value={text} 
              onChange={(e) => setText(e.target.value)} 
              placeholder="Tuliskan isi ulasan yang diberikan oleh tamu..."
              rows={4}
              required 
            />
          </div>
          
          <div className="flex items-center space-x-2">
            <input 
              type="checkbox" 
              id="isVisible" 
              className="w-4 h-4 text-primary focus:ring-primary border-gray-300 rounded"
              checked={isVisible}
              onChange={(e) => setIsVisible(e.target.checked)}
            />
            <Label htmlFor="isVisible" className="font-normal cursor-pointer">
              Tampilkan langsung di Homepage
            </Label>
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={onClose} disabled={loading}>Batal</Button>
            <Button type="submit" disabled={loading || uploadingImage}>
              {loading ? <><Loader2 className="w-4 h-4 mr-2 animate-spin" /> Menyimpan...</> : "Simpan Ulasan"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>

    {/* Crop Modal */}
    <Dialog open={showCropModal} onOpenChange={setShowCropModal}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Sesuaikan Foto Profil</DialogTitle>
          <DialogDescription>
            Geser dan sesuaikan area yang ingin ditampilkan sebagai foto profil.
          </DialogDescription>
        </DialogHeader>
        
        <div className="flex justify-center bg-black/5 rounded-lg p-4 overflow-hidden max-h-[400px]">
          {imgSrc && (
            <ReactCrop
              crop={crop}
              onChange={(c) => setCrop(c)}
              onComplete={(c) => setCompletedCrop(c)}
              aspect={1}
              circularCrop
            >
              <img
                ref={imgRef}
                alt="Crop me"
                src={imgSrc}
                onLoad={(e) => {
                  const { width, height } = e.currentTarget;
                  const initialCrop = centerCrop(
                    makeAspectCrop(
                      { unit: '%', width: 90 },
                      1,
                      width,
                      height
                    ),
                    width,
                    height
                  );
                  setCrop(initialCrop);
                }}
                className="max-w-full max-h-[350px] object-contain"
              />
            </ReactCrop>
          )}
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => setShowCropModal(false)}>Batal</Button>
          <Button onClick={uploadCroppedImage} disabled={uploadingImage}>
            {uploadingImage ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <Check className="w-4 h-4 mr-2" />}
            Simpan Potongan
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
    </>
  );
}
