"use client";

import { useState, useRef } from "react";
import { useRouter } from "next/navigation";
import { Building2, MapPin, Image as ImageIcon, Sparkles, Save, ArrowLeft, Loader2, Upload, Plus, Trash2, Map } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from "@/components/ui/dialog";
import { toast } from "sonner";
import ReactCrop, { type Crop } from "react-image-crop";
import "react-image-crop/dist/ReactCrop.css";
import { uploadToCloudinaryClient } from "@/lib/upload-client";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function PropertyForm({ initialData }: { initialData?: any }) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState("info");
  const [imageUrl, setImageUrl] = useState(initialData?.heroImage || "");
  const [galleryItems, setGalleryItems] = useState<{ url: string; description: string }[]>(() => {
    try {
      if (!initialData?.gallery) return [];
      const parsed = typeof initialData.gallery === 'string' ? JSON.parse(initialData.gallery) : initialData.gallery;
      
      // Handle legacy string arrays (convert to objects)
      if (Array.isArray(parsed) && parsed.length > 0 && typeof parsed[0] === 'string') {
        return parsed.map(url => ({ url, description: "" }));
      }
      return parsed; // Assuming it's already an array of {}
    } catch {
      return [];
    }
  });

  const [nearbyPlaces, setNearbyPlaces] = useState<{ name: string; distance: string; type: string; imageUrl?: string; mapsUrl?: string }[]>(() => {
    try {
      if (!initialData?.nearbyPlaces) return [];
      return typeof initialData.nearbyPlaces === 'string' ? JSON.parse(initialData.nearbyPlaces) : initialData.nearbyPlaces;
    } catch {
      return [];
    }
  });

  const [uploadingImage, setUploadingImage] = useState(false);
  const [uploadingGallery, setUploadingGallery] = useState(false);
  const [uploadingNearby, setUploadingNearby] = useState<number | null>(null);

  // Crop States
  const [imgSrc, setImgSrc] = useState("");
  const [crop, setCrop] = useState<Crop>();
  const [completedCrop, setCompletedCrop] = useState<Crop | null>(null);
  const [showCropModal, setShowCropModal] = useState(false);
  const imgRef = useRef<HTMLImageElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  function handleFileSelect(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;

    setCrop(undefined); // Reset crop
    setCompletedCrop(null);
    const reader = new FileReader();
    reader.addEventListener("load", () => {
      setImgSrc(reader.result?.toString() || "");
      setShowCropModal(true);
    });
    reader.readAsDataURL(file);
    if (fileInputRef.current) fileInputRef.current.value = ""; // Reset input
  }

  async function uploadCroppedImage() {
    if (!imgRef.current || !completedCrop || !completedCrop.width || !completedCrop.height) {
      toast.error("Silakan buat area potongan (crop) terlebih dahulu.");
      return;
    }

    const image = imgRef.current;
    const canvas = document.createElement("canvas");

    // Scale X/Y calculate the discrepancy between the physical <img> DOM element size 
    // and its original natural size. ReactCrop provides absolute pixel values based on the DOM element's visual size.
    const scaleX = image.naturalWidth / image.width;
    const scaleY = image.naturalHeight / image.height;

    // Convert visually cropped size to actual image pixels
    const cx = completedCrop.x * scaleX;
    const cy = completedCrop.y * scaleY;
    const cw = completedCrop.width * scaleX;
    const ch = completedCrop.height * scaleY;

    canvas.width = cw;
    canvas.height = ch;
    const ctx = canvas.getContext("2d");

    if (!ctx) return;

    // smooth image rendering
    ctx.imageSmoothingQuality = "high";

    ctx.drawImage(
      image,
      cx,
      cy,
      cw,
      ch,
      0,
      0,
      cw,
      ch
    );

    setUploadingImage(true);

    canvas.toBlob(async (blob) => {
      if (!blob) {
        setUploadingImage(false);
        return toast.error("Gagal memproses gambar.");
      }

      try {
        const file = new File([blob], "cropped-hero.jpg", { type: "image/jpeg" });
        const url = await uploadToCloudinaryClient(file);
        setImageUrl(url);
        toast.success("Gambar berhasil dipotong dan diunggah");
        setShowCropModal(false);
      } catch (err: any) {
        toast.error(err.message);
      } finally {
        setUploadingImage(false);
      }
    }, "image/jpeg", 0.9);
  }

  async function handleGalleryUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    setUploadingGallery(true);
    let uploadedCount = 0;

    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      try {
        const url = await uploadToCloudinaryClient(file);
        setGalleryItems((prev) => [...prev, { url, description: "" }]);
        uploadedCount++;
      } catch (err) {
        console.error("Gallery upload error:", err);
      }
    }

    setUploadingGallery(false);
    toast.success(`${uploadedCount} foto galeri berhasil diunggah.`);
    if (e.target) e.target.value = "";
  }

  function removeGalleryImage(index: number) {
    setGalleryItems((prev) => prev.filter((_, i) => i !== index));
  }

  function updateGalleryDescription(index: number, newDesc: string) {
    setGalleryItems((prev) => prev.map((item, i) => i === index ? { ...item, description: newDesc } : item));
  }

  function addNearbyPlace() {
    setNearbyPlaces(prev => [...prev, { name: "", distance: "", type: "Wisata", imageUrl: "", mapsUrl: "" }]);
  }

  function updateNearbyPlace(index: number, field: keyof typeof nearbyPlaces[0], value: string) {
    setNearbyPlaces(prev => prev.map((place, i) => i === index ? { ...place, [field]: value } : place));
  }

  function removeNearbyPlace(index: number) {
    setNearbyPlaces(prev => prev.filter((_, i) => i !== index));
  }

  async function handleNearbyImageUpload(e: React.ChangeEvent<HTMLInputElement>, index: number) {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploadingNearby(index);

    try {
      const url = await uploadToCloudinaryClient(file);
      updateNearbyPlace(index, "imageUrl", url);
      toast.success("Foto kawasan berhasil diunggah.");
    } catch {
      toast.error("Terjadi kesalahan saat mengunggah.");
    } finally {
      setUploadingNearby(null);
      if (e.target) e.target.value = "";
    }
  }

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    const formData = new FormData(e.currentTarget);
    const payload = Object.fromEntries(formData.entries());

    // Simpan imageUrl dari state yang sudah diupload, ke payload
    payload.heroImage = imageUrl;

    // Simulate API request saving details to the database (In actual use, hook up to Server Endpoint)
    try {
      const url = initialData ? `/api/admin/properties/${initialData.id}` : `/api/admin/properties`;
      const method = initialData ? "PUT" : "POST";

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...payload,
          // Facilities parser placeholder,
          commonFacilities: "[]",
          gallery: JSON.stringify(galleryItems),
          nearbyPlaces: JSON.stringify(nearbyPlaces)
        }),
      });

      if (!res.ok) throw new Error("Gagal menyimpan properti");

      toast.success(initialData ? "Properti berhasil diperbarui!" : "Properti baru ditambahkan!");
      router.push("/admin/properties");
      router.refresh();
    } catch {
      toast.error("Terjadi kesalahan teknis saat menyimpan data.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <form onSubmit={onSubmit} className="max-w-4xl space-y-8">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button type="button" variant="outline" size="icon" onClick={() => router.back()}>
            <ArrowLeft className="w-4 h-4" />
          </Button>
          <h2 className="text-2xl font-serif font-bold text-foreground">
            {initialData ? "Edit Properti" : "Tambah Properti Baru"}
          </h2>
        </div>
        <Button type="submit" disabled={loading} className="bg-primary text-primary-foreground hover:bg-primary/90 flex items-center gap-2">
          <Save className="w-4 h-4" /> {loading ? "Menyimpan..." : "Simpan Properti"}
        </Button>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-5 h-12 bg-muted/50 p-1 rounded-xl">
          <TabsTrigger value="info" className="rounded-lg font-medium text-sm data-[state=active]:bg-background data-[state=active]:shadow-sm transition-all flex items-center gap-2">
            <Building2 className="w-4 h-4" /> <span className="hidden sm:inline">Info Dasar</span>
          </TabsTrigger>
          <TabsTrigger value="lokasi" className="rounded-lg font-medium text-sm data-[state=active]:bg-background data-[state=active]:shadow-sm transition-all flex items-center gap-2">
            <MapPin className="w-4 h-4" /> <span className="hidden sm:inline">Lokasi</span>
          </TabsTrigger>
          <TabsTrigger value="foto" className="rounded-lg font-medium text-sm data-[state=active]:bg-background data-[state=active]:shadow-sm transition-all flex items-center gap-2">
            <ImageIcon className="w-4 h-4" /> <span className="hidden sm:inline">Foto</span>
          </TabsTrigger>
          <TabsTrigger value="fasilitas" className="rounded-lg font-medium text-sm data-[state=active]:bg-background data-[state=active]:shadow-sm transition-all flex items-center gap-2">
            <Sparkles className="w-4 h-4" /> <span className="hidden sm:inline">Fasilitas</span>
          </TabsTrigger>
          <TabsTrigger value="kawasan" className="rounded-lg font-medium text-sm data-[state=active]:bg-background data-[state=active]:shadow-sm transition-all flex items-center gap-2">
            <Map className="w-4 h-4" /> <span className="hidden sm:inline">Kawasan</span>
          </TabsTrigger>
        </TabsList>

        <div className="mt-6">
          <TabsContent value="info" className="m-0 border-0 p-0 focus-visible:outline-none">
            <Card className="shadow-sm border-border/50">
              <CardHeader className="bg-muted/10 border-b">
                <CardTitle className="font-serif">Informasi Properti</CardTitle>
                <CardDescription>Detail utama dari properti akomodasi Anda.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6 pt-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="name">Nama Properti</Label>
                    <Input id="name" name="name" defaultValue={initialData?.name} placeholder="Mis: Homestay Alvira Sidoarjo" required />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="type">Tipe Akomodasi</Label>
                    <Select name="type" defaultValue={initialData?.type || "HOMESTAY"}>
                      <SelectTrigger>
                        <SelectValue placeholder="Pilih Tipe" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="HOMESTAY">Homestay (Harian)</SelectItem>
                        <SelectItem value="KOST">Kost (Bulanan)</SelectItem>
                        <SelectItem value="VILLA">Villa (Booking Utuh)</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="city">Kota Operasional</Label>
                    <Select name="city" defaultValue={initialData?.city || "SIDOARJO"}>
                      <SelectTrigger>
                        <SelectValue placeholder="Pilih Kota" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="SIDOARJO">Sidoarjo</SelectItem>
                        <SelectItem value="SURABAYA">Surabaya</SelectItem>
                        <SelectItem value="BATU">Batu</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2 md:col-span-2">
                    <Label htmlFor="description">Deskripsi Lengkap</Label>
                    <Textarea id="description" name="description" defaultValue={initialData?.description} rows={5} placeholder="Deskripsikan keunggulan unik dari properti ini..." />
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="lokasi" className="m-0 border-0 p-0 focus-visible:outline-none">
            <Card className="shadow-sm border-border/50">
              <CardHeader className="bg-muted/10 border-b">
                <CardTitle className="font-serif">Lokasi & Peta</CardTitle>
                <CardDescription>Atur alamat properti agar mudah ditemukan tamu.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6 pt-6">
                <div className="space-y-2">
                  <Label htmlFor="address">Alamat Lengkap (Jl, RT/RW, Kec, Kode Pos)</Label>
                  <Textarea id="address" name="address" defaultValue={initialData?.address} rows={3} placeholder="Contoh: Jl. Diponegoro No. 1, Sidoarjo..." />
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="latitude">Koordinat Latitude</Label>
                    <Input id="latitude" name="latitude" type="number" step="any" defaultValue={initialData?.latitude} placeholder="-7.452632" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="longitude">Koordinat Longitude</Label>
                    <Input id="longitude" name="longitude" type="number" step="any" defaultValue={initialData?.longitude} placeholder="112.716154" />
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="foto" className="m-0 border-0 p-0 focus-visible:outline-none">
            <Card className="shadow-sm border-border/50">
              <CardHeader className="bg-muted/10 border-b">
                <CardTitle className="font-serif">Manajemen Visual</CardTitle>
                <CardDescription>Unggah Hero Image dan Galeri Area Umum Properti.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6 pt-6 flex flex-col items-center justify-center p-12 text-center border-2 border-dashed m-6 rounded-xl relative overflow-hidden bg-muted/10">
                {imageUrl ? (
                  <>
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={imageUrl} alt="Hero property" className="absolute inset-0 w-full h-full object-cover opacity-60" />
                    <div className="relative z-10 flex flex-col items-center p-6 bg-background/90 backdrop-blur-sm rounded-xl shadow-sm border">
                      <ImageIcon className="w-10 h-10 mb-3 text-primary" />
                      <p className="font-medium text-foreground mb-4">Gambar Berhasil Diunggah</p>
                      <div className="flex gap-2">
                        <Button type="button" variant="outline" size="sm" onClick={() => setImageUrl("")}>
                          Hapus
                        </Button>
                        <Button type="button" size="sm" onClick={() => fileInputRef.current?.click()} disabled={uploadingImage}>
                          Ganti Foto
                        </Button>
                      </div>
                    </div>
                  </>
                ) : (
                  <>
                    <div className="p-4 bg-primary/10 rounded-full mb-4 text-primary">
                      {uploadingImage ? <Loader2 className="w-8 h-8 animate-spin" /> : <Upload className="w-8 h-8" />}
                    </div>
                    <h3 className="text-lg font-semibold mb-2">Unggah Foto Utama</h3>
                    <p className="max-w-md text-sm text-muted-foreground mb-6">Pilih file beresolusi tinggi (max 5MB) untuk ditampilkan di halaman properti.</p>

                    <div className="flex flex-col sm:flex-row gap-3">
                      <Button type="button" onClick={() => fileInputRef.current?.click()} disabled={uploadingImage} className="gap-2">
                        <Upload className="w-4 h-4" /> {uploadingImage ? "Mengunggah..." : "Pilih File"}
                      </Button>
                      <div className="flex items-center gap-3">
                        <span className="text-muted-foreground text-xs uppercase font-medium">Atau Tautan</span>
                        <Input
                          type="url"
                          placeholder="https://..."
                          value={imageUrl}
                          onChange={(e) => setImageUrl(e.target.value)}
                          className="w-48 h-9 text-xs"
                        />
                      </div>
                    </div>
                  </>
                )}
                <input
                  type="file"
                  ref={fileInputRef}
                  className="hidden"
                  accept="image/*"
                  onChange={handleFileSelect}
                />
              </CardContent>
            </Card>

            {/* Galeri Fasilitas */}
            <Card className="shadow-sm border-border/50 mt-6">
              <CardHeader className="bg-muted/10 border-b">
                <CardTitle className="font-serif">Galeri Foto Lainnya / Fasilitas</CardTitle>
                <CardDescription>Tambahkan foto-foto area umum, fasad depan, beserta deskripsi per fasilitasnya.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6 pt-6">
                {galleryItems.length > 0 && (
                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 mb-6">
                    {galleryItems.map((item, i) => (
                      <div key={i} className="flex flex-col gap-3 p-3 border rounded-xl bg-card shadow-sm">
                        <div className="relative group rounded-lg overflow-hidden border aspect-video bg-muted flex items-center justify-center">
                          {/* eslint-disable-next-line @next/next/no-img-element */}
                          <img src={item.url} alt={`Gallery ${i}`} className="w-full h-full object-cover" />
                          <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center backdrop-blur-sm">
                            <Button
                              type="button"
                              variant="destructive"
                              size="sm"
                              onClick={() => removeGalleryImage(i)}
                            >
                              Hapus
                            </Button>
                          </div>
                        </div>
                        <div className="space-y-1.5">
                          <Label className="text-xs text-muted-foreground font-semibold">Deskripsi / Keterangan</Label>
                          <Input
                            placeholder="Mis: Kolam Renang Umum, Dapur Bersih..."
                            value={item.description}
                            onChange={(e) => updateGalleryDescription(i, e.target.value)}
                            className="bg-surface text-sm border-input font-medium placeholder:font-normal"
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                )}

                <div className="flex items-center justify-center p-6 border-2 border-dashed rounded-xl bg-muted/10 hover:bg-muted/30 transition-colors">
                  <div className="text-center">
                    <div className="p-3 bg-primary/10 rounded-full inline-block mb-3 text-primary">
                      {uploadingGallery ? <Loader2 className="w-6 h-6 animate-spin" /> : <ImageIcon className="w-6 h-6" />}
                    </div>
                    <div>
                      <Button
                        type="button"
                        variant="secondary"
                        onClick={() => document.getElementById("gallery-upload")?.click()}
                        disabled={uploadingGallery}
                      >
                        {uploadingGallery ? "Mengunggah..." : "Tambah Foto Galeri"}
                      </Button>
                      <p className="text-xs text-muted-foreground mt-2">Bisa pilih lebih dari satu gambar sekaligus</p>
                    </div>
                    <input
                      id="gallery-upload"
                      type="file"
                      multiple
                      accept="image/*"
                      className="hidden"
                      onChange={handleGalleryUpload}
                    />
                  </div>
                </div>

                {/* Crop Dialog Modal */}
                <Dialog open={showCropModal} onOpenChange={setShowCropModal}>
                  <DialogContent className="sm:max-w-2xl">
                    <DialogHeader>
                      <DialogTitle>Potong Gambar Utama</DialogTitle>
                      <DialogDescription>
                        Tarik kursor untuk memotong bagian gambar yang diinginkan. Anda disarankan memotong dengan rasio melebar (landscape).
                      </DialogDescription>
                    </DialogHeader>
                    <div className="flex justify-center bg-black/5 p-4 rounded-xl border border-dashed overflow-auto max-h-[60vh] w-full relative">
                      <ReactCrop
                        crop={crop}
                        onChange={(c) => setCrop(c)}
                        onComplete={(c) => setCompletedCrop(c)}
                        aspect={16 / 9}
                        className="max-w-full m-auto flex justify-center w-fit"
                      >
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img
                          ref={imgRef}
                          alt="Crop preview"
                          src={imgSrc}
                          className="w-auto h-auto max-h-[50vh] max-w-full object-contain mx-auto"
                        />
                      </ReactCrop>
                    </div>
                    <DialogFooter>
                      <Button type="button" variant="outline" onClick={() => setShowCropModal(false)} disabled={uploadingImage}>
                        Batal
                      </Button>
                      <Button type="button" onClick={uploadCroppedImage} disabled={uploadingImage}>
                        {uploadingImage ? "Menyimpan..." : "Potong & Terapkan"}
                      </Button>
                    </DialogFooter>
                  </DialogContent>
                </Dialog>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="fasilitas" className="m-0 border-0 p-0 focus-visible:outline-none">
            <Card className="shadow-sm border-border/50">
              <CardHeader className="bg-muted/10 border-b">
                <CardTitle className="font-serif">Fasilitas Bersama (Common Area)</CardTitle>
                <CardDescription>Fasilitas yang bisa digunakan oleh seluruh tamu akomodasi ini.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6 pt-6 text-center text-muted-foreground border-2 border-dashed m-6 rounded-xl p-12">
                <Sparkles className="w-12 h-12 mb-4 opacity-20 mx-auto" />
                <p>Sistem multi-select fasilitas pintar akan dinamis melacak metadata JSON. Komponen dalam status mounting.</p>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="kawasan" className="m-0 border-0 p-0 focus-visible:outline-none">
            <Card className="shadow-sm border-border/50">
              <CardHeader className="bg-muted/10 border-b flex flex-row items-center justify-between py-4">
                <div>
                  <CardTitle className="font-serif">Kawasan Terdekat</CardTitle>
                  <CardDescription>Tambahkan tempat menarik, kampus, mall, atau fasilitas umum di sekitar properti.</CardDescription>
                </div>
                <Button type="button" size="sm" onClick={addNearbyPlace} className="gap-2">
                  <Plus className="w-4 h-4" /> Tambah Tempat
                </Button>
              </CardHeader>
              <CardContent className="space-y-6 pt-6 bg-muted/5">
                {nearbyPlaces.length === 0 ? (
                  <div className="text-center p-8 border-2 border-dashed rounded-xl border-muted bg-card">
                    <Map className="w-12 h-12 mb-4 opacity-20 mx-auto" />
                    <p className="text-muted-foreground">Belum ada kawasan terdekat yang ditambahkan.</p>
                  </div>
                ) : (
                  <div className="space-y-6">
                    {nearbyPlaces.map((place, index) => (
                      <div key={index} className="flex flex-col sm:flex-row gap-4 p-4 bg-card border rounded-xl shadow-sm items-start">
                        {/* Image Upload Area */}
                        <div className="w-full sm:w-32 h-32 flex-shrink-0 relative group rounded-lg overflow-hidden border bg-muted flex flex-col items-center justify-center">
                          {place.imageUrl ? (
                            <>
                              {/* eslint-disable-next-line @next/next/no-img-element */}
                              <img src={place.imageUrl} alt={place.name} className="w-full h-full object-cover" />
                              <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col gap-2 items-center justify-center backdrop-blur-sm">
                                <Button 
                                  type="button" 
                                  variant="secondary" 
                                  size="sm" 
                                  className="h-7 text-xs px-2"
                                  onClick={() => document.getElementById(`nearby-upload-${index}`)?.click()}
                                >
                                  Ganti
                                </Button>
                                <Button 
                                  type="button" 
                                  variant="destructive" 
                                  size="sm" 
                                  className="h-7 text-xs px-2"
                                  onClick={() => updateNearbyPlace(index, "imageUrl", "")}
                                >
                                  Hapus
                                </Button>
                              </div>
                            </>
                          ) : (
                            <div className="text-center p-2">
                              {uploadingNearby === index ? (
                                <Loader2 className="w-6 h-6 animate-spin mx-auto text-primary" />
                              ) : (
                                <ImageIcon className="w-6 h-6 mx-auto text-muted-foreground opacity-50 mb-2" />
                              )}
                              <Button
                                type="button"
                                variant="outline"
                                size="sm"
                                className="text-[10px] h-6 px-2 w-full"
                                onClick={() => document.getElementById(`nearby-upload-${index}`)?.click()}
                                disabled={uploadingNearby === index}
                              >
                                {uploadingNearby === index ? "Proses..." : "Pilih Foto"}
                              </Button>
                            </div>
                          )}
                          <input
                            id={`nearby-upload-${index}`}
                            type="file"
                            accept="image/*"
                            className="hidden"
                            onChange={(e) => handleNearbyImageUpload(e, index)}
                          />
                        </div>

                        {/* Fields Array */}
                        <div className="flex-1 space-y-4 w-full">
                          <div className="flex flex-col sm:flex-row gap-4 w-full">
                            <div className="flex-1 space-y-2">
                              <Label>Nama Tempat</Label>
                              <Input
                                placeholder="Mis: Royal Plaza Surabaya"
                                value={place.name}
                                onChange={(e) => updateNearbyPlace(index, "name", e.target.value)}
                                required
                              />
                            </div>
                            <div className="w-full sm:w-48 space-y-2">
                              <Label>Tipe</Label>
                              <Select 
                                value={place.type} 
                                onValueChange={(val) => updateNearbyPlace(index, "type", val || "")}
                              >
                                <SelectTrigger>
                                  <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                  <SelectItem value="Wisata">Wisata / Hiburan</SelectItem>
                                  <SelectItem value="Belanja">Pusat Perbelanjaan</SelectItem>
                                  <SelectItem value="Pendidikan">Kampus / Sekolah</SelectItem>
                                  <SelectItem value="Kesehatan">Rumah Sakit</SelectItem>
                                  <SelectItem value="Transportasi">Stasiun / Bandara</SelectItem>
                                  <SelectItem value="Lainnya">Fasilitas Umum</SelectItem>
                                </SelectContent>
                              </Select>
                            </div>
                          </div>
                          
                          <div className="flex flex-col sm:flex-row gap-4 w-full items-end">
                            <div className="flex-1 space-y-2">
                              <Label>Jarak</Label>
                              <Input
                                placeholder="Mis: 5 Menit"
                                value={place.distance}
                                onChange={(e) => updateNearbyPlace(index, "distance", e.target.value)}
                                required
                              />
                            </div>
                            <div className="flex-[2] space-y-2">
                              <Label>Link Google Maps (Opsional)</Label>
                              <Input
                                placeholder="https://www.google.com/maps/..."
                                value={place.mapsUrl || ""}
                                onChange={(e) => updateNearbyPlace(index, "mapsUrl", e.target.value)}
                              />
                            </div>
                            <Button 
                              type="button" 
                              variant="destructive" 
                              size="icon"
                              onClick={() => removeNearbyPlace(index)}
                              className="shrink-0 rounded-lg aspect-square w-10 h-10"
                            >
                              <Trash2 className="w-4 h-4" />
                            </Button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </div>
      </Tabs>
    </form>
  );
}
