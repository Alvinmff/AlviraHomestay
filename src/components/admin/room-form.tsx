"use client";

import { useState, useRef } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "sonner";
import { Upload, Loader2, Image as ImageIcon } from "lucide-react";

interface RoomFormProps {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  initialData?: any;
  properties: { id: string, name: string }[];
}

export function RoomForm({ initialData, properties }: RoomFormProps) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [uploadingImage, setUploadingImage] = useState(false);
  const [uploadingGallery, setUploadingGallery] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const galleryInputRef = useRef<HTMLInputElement>(null);

  // Safe parsing of amenities
  let initialAmenities = "";
  if (initialData?.amenities) {
    try {
      const parsed = Array.isArray(initialData.amenities) ? initialData.amenities : JSON.parse(initialData.amenities);
      if (Array.isArray(parsed)) {
        initialAmenities = parsed.join(", ");
      }
    } catch {
      initialAmenities = initialData.amenities;
    }
  }

  // Safe parsing of photos
  let initialPhotos: string[] = [];
  if (initialData?.photos) {
    try {
      const parsed = Array.isArray(initialData.photos) ? initialData.photos : JSON.parse(initialData.photos);
      if (Array.isArray(parsed)) {
        initialPhotos = parsed;
      }
    } catch { }
  }

  const [formData, setFormData] = useState({
    propertyId: initialData?.propertyId || "",
    roomNumber: initialData?.roomNumber || "",
    roomName: initialData?.roomName || "",
    description: initialData?.description || "",
    maxGuests: initialData?.maxGuests?.toString() || "2",
    roomSize: initialData?.roomSize || "",
    bedType: initialData?.bedType || "",
    amenities: initialAmenities,
    thumbnail: initialData?.thumbnail || "",
    basePrice: initialData?.basePrice?.toString() || "",
    weekendPrice: initialData?.weekendPrice?.toString() || "",
    monthlyPrice: initialData?.monthlyPrice?.toString() || "",
    photos: initialPhotos,
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSelectChange = (name: string, value: string) => {
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  async function handleThumbnailUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploadingImage(true);
    const formPayload = new FormData();
    formPayload.append("file", file);

    try {
      const res = await fetch("/api/upload", {
        method: "POST",
        body: formPayload,
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Gagal upload gambar kamar");

      setFormData(prev => ({ ...prev, thumbnail: data.url }));
      toast.success("Foto kamar berhasil diunggah");
    } catch (err: any) {
      toast.error(err.message);
    } finally {
      setUploadingImage(false);
    }
  }

  async function handleGalleryUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    setUploadingGallery(true);

    try {
      const newUrls: string[] = [];
      for (let i = 0; i < files.length; i++) {
        const formPayload = new FormData();
        formPayload.append("file", files[i]);

        const res = await fetch("/api/upload", {
          method: "POST",
          body: formPayload,
        });
        const data = await res.json();

        if (res.ok) {
          newUrls.push(data.url);
        } else {
          toast.error(`Gagal upload ${files[i].name}`);
        }
      }

      if (newUrls.length > 0) {
        setFormData(prev => ({ ...prev, photos: [...prev.photos, ...newUrls] }));
        toast.success(`${newUrls.length} foto berhasil diunggah.`);
      }
    } catch (err: any) {
      toast.error("Terjadi kesalahan sistem saat mengunggah galeri.");
    } finally {
      if (galleryInputRef.current) galleryInputRef.current.value = "";
      setUploadingGallery(false);
    }
  }

  const removePhoto = (index: number) => {
    setFormData(prev => ({
      ...prev,
      photos: prev.photos.filter((_, i) => i !== index)
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (!formData.propertyId) throw new Error("Properti harus dipilih");

      const payload = {
        ...formData,
        maxGuests: parseInt(formData.maxGuests) || 2,
        basePrice: parseFloat(formData.basePrice) || 0,
        weekendPrice: formData.weekendPrice ? parseFloat(formData.weekendPrice) : null,
        monthlyPrice: formData.monthlyPrice ? parseFloat(formData.monthlyPrice) : null,
        amenities: formData.amenities.split(",").map((s: string) => s.trim()).filter(Boolean),
        photos: formData.photos,
      };

      const url = initialData ? `/api/admin/rooms/${initialData.id}` : `/api/admin/rooms`;
      const method = initialData ? "PUT" : "POST";

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        const error = await res.json();
        throw new Error(error.error || "Terjadi kesalahan pada server");
      }

      toast.success(initialData ? "Kamar berhasil diperbarui" : "Kamar berhasil ditambahkan");
      router.push("/admin/rooms");
      router.refresh();
    } catch (error: unknown) {
      toast.error((error as Error).message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6 max-w-3xl bg-white p-6 md:p-8 rounded-xl border shadow-sm">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-2">
          <Label>Properti Tautan *</Label>
          <Select value={formData.propertyId} onValueChange={(val) => handleSelectChange("propertyId", val)} required>
            <SelectTrigger>
              <SelectValue placeholder="Pilih properti..." />
            </SelectTrigger>
            <SelectContent>
              {properties.map(p => (
                <SelectItem key={p.id} value={p.id}>{p.name}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label>Tipe Tempat Tidur *</Label>
          <Input name="bedType" value={formData.bedType} onChange={handleChange} placeholder="Contoh: 1 Queen Bed" required />
        </div>

        <div className="space-y-2">
          <Label>Nama Kamar / Paket *</Label>
          <Input name="roomName" value={formData.roomName} onChange={handleChange} placeholder="Contoh: Kamar Deluxe" required />
        </div>

        <div className="space-y-2">
          <Label>Nomor / Identitas Kamar *</Label>
          <Input name="roomNumber" value={formData.roomNumber} onChange={handleChange} placeholder="Contoh: 101 atau Lantai 1" required />
        </div>

        <div className="space-y-2">
          <Label>Maksimal Tamu *</Label>
          <Input name="maxGuests" type="number" value={formData.maxGuests} onChange={handleChange} min="1" required />
        </div>

        <div className="space-y-2">
          <Label>Ukuran Kamar (Opsional)</Label>
          <Input name="roomSize" value={formData.roomSize} onChange={handleChange} placeholder="Contoh: 24 m²" />
        </div>

        <div className="space-y-2">
          <Label>Harga Dasar (Rp) *</Label>
          <Input name="basePrice" type="number" value={formData.basePrice} onChange={handleChange} placeholder="Contoh: 250000" required />
        </div>

        <div className="space-y-2 md:col-span-2">
          <Label>Thumbnail Kamar *</Label>
          <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center p-4 border rounded-lg bg-muted/20">
            {formData.thumbnail ? (
              <div className="relative w-24 h-24 rounded-md overflow-hidden bg-muted border shrink-0">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={formData.thumbnail} alt="Thumbnail preview" className="w-full h-full object-cover" />
              </div>
            ) : (
              <div className="w-24 h-24 rounded-md bg-muted border flex items-center justify-center text-muted-foreground shrink-0">
                <ImageIcon className="w-8 h-8 opacity-50" />
              </div>
            )}
            <div className="flex-1 space-y-3 w-full">
              <input type="file" ref={fileInputRef} className="hidden" accept="image/*" onChange={handleThumbnailUpload} />
              <div className="flex items-center gap-2">
                <Button type="button" variant="secondary" onClick={() => fileInputRef.current?.click()} disabled={uploadingImage}>
                  {uploadingImage ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <Upload className="w-4 h-4 mr-2" />}
                  Unggah Foto
                </Button>
                {formData.thumbnail && (
                  <Button type="button" variant="ghost" className="text-red-500" onClick={() => setFormData(p => ({ ...p, thumbnail: "" }))}>
                    Hapus
                  </Button>
                )}
              </div>
              <Input name="thumbnail" value={formData.thumbnail} onChange={handleChange} placeholder="Atau tempel URL gambar (https://...)" required />
            </div>
          </div>
        </div>

        <div className="space-y-4 md:col-span-2">
          <Label>Galeri Kamar (Bisa pilih lebih dari satu)</Label>
          <div className="p-4 border rounded-lg bg-muted/20 space-y-4">
            {formData.photos.length > 0 && (
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 mb-4">
                {formData.photos.map((url, i) => (
                  <div key={i} className="relative aspect-square rounded-md overflow-hidden bg-muted border group">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={url} alt={`Gallery ${i + 1}`} className="w-full h-full object-cover" />
                    <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                      <Button type="button" variant="destructive" size="sm" onClick={() => removePhoto(i)}>
                        Hapus
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            )}

            <div className="flex flex-col items-center justify-center border-2 border-dashed p-6 rounded-lg text-center hover:bg-muted/50 transition-colors">
              <input type="file" ref={galleryInputRef} className="hidden" accept="image/*" multiple onChange={handleGalleryUpload} />
              <div className="w-12 h-12 bg-primary/10 text-primary rounded-full flex items-center justify-center mb-3">
                {uploadingGallery ? <Loader2 className="w-6 h-6 animate-spin" /> : <ImageIcon className="w-6 h-6" />}
              </div>
              <h3 className="font-semibold mb-1">Tambah Foto Galeri</h3>
              <p className="text-sm text-muted-foreground mb-4 max-w-[200px]">Pilih file gambar untuk ditampilkan pada grid detail kamar.</p>
              <Button type="button" onClick={() => galleryInputRef.current?.click()} disabled={uploadingGallery}>
                {uploadingGallery ? "Mengunggah..." : "Pilih Beberapa Foto"}
              </Button>
            </div>
          </div>
        </div>

        <div className="space-y-2">
          <Label>Harga Akhir Pekan (Opsional)</Label>
          <Input name="weekendPrice" type="number" value={formData.weekendPrice} onChange={handleChange} placeholder="Contoh: 300000" />
        </div>

        <div className="space-y-2">
          <Label>Harga Bulanan (Opsional)</Label>
          <Input name="monthlyPrice" type="number" value={formData.monthlyPrice} onChange={handleChange} placeholder="Contoh: 2000000" />
        </div>
      </div>

      <div className="space-y-2 pt-2">
        <Label>Keterangan Deskripsi</Label>
        <Textarea name="description" value={formData.description} onChange={handleChange} rows={4} placeholder="Jelaskan keistimewaan kamar ini..." />
      </div>

      <div className="space-y-2">
        <Label>Fasilitas (Pisahkan dengan koma)</Label>
        <Textarea name="amenities" value={formData.amenities} onChange={handleChange} placeholder="AC, Smart TV, WiFi Cepat, Air Panas" />
      </div>

      <div className="flex items-center justify-end gap-4 pt-6 border-t">
        <Button type="button" variant="outline" onClick={() => router.push("/admin/rooms")} disabled={loading}>
          Batal
        </Button>
        <Button type="submit" disabled={loading} className="px-8">
          {loading ? "Menyimpan..." : "Simpan Kamar"}
        </Button>
      </div>
    </form>
  );
}
