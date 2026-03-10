"use client";

import { useState, useRef } from "react";
import { useRouter } from "next/navigation";
import { Building2, MapPin, Image as ImageIcon, Sparkles, Save, ArrowLeft, Loader2, Upload } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "sonner";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function PropertyForm({ initialData }: { initialData?: any }) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState("info");
  const [imageUrl, setImageUrl] = useState(initialData?.heroImage || "");
  const [uploadingImage, setUploadingImage] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  async function handleImageUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploadingImage(true);
    const formData = new FormData();
    formData.append("file", file);

    try {
      const res = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Gagal upload gambar");

      setImageUrl(data.url);
      toast.success("Gambar berhasil diunggah");
    } catch (err: any) {
      toast.error(err.message);
    } finally {
      setUploadingImage(false);
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
          gallery: "[]"
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
        <TabsList className="grid w-full grid-cols-4 h-12 bg-muted/50 p-1 rounded-xl">
          <TabsTrigger value="info" className="rounded-lg font-medium text-sm data-[state=active]:bg-white data-[state=active]:shadow-sm transition-all flex items-center gap-2">
            <Building2 className="w-4 h-4" /> <span className="hidden sm:inline">Info Dasar</span>
          </TabsTrigger>
          <TabsTrigger value="lokasi" className="rounded-lg font-medium text-sm data-[state=active]:bg-white data-[state=active]:shadow-sm transition-all flex items-center gap-2">
            <MapPin className="w-4 h-4" /> <span className="hidden sm:inline">Lokasi</span>
          </TabsTrigger>
          <TabsTrigger value="foto" className="rounded-lg font-medium text-sm data-[state=active]:bg-white data-[state=active]:shadow-sm transition-all flex items-center gap-2">
            <ImageIcon className="w-4 h-4" /> <span className="hidden sm:inline">Foto & Media</span>
          </TabsTrigger>
          <TabsTrigger value="fasilitas" className="rounded-lg font-medium text-sm data-[state=active]:bg-white data-[state=active]:shadow-sm transition-all flex items-center gap-2">
            <Sparkles className="w-4 h-4" /> <span className="hidden sm:inline">Fasilitas</span>
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
                    <div className="relative z-10 flex flex-col items-center p-6 bg-white/90 backdrop-blur-sm rounded-xl shadow-sm border">
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
                  onChange={handleImageUpload}
                />
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
        </div>
      </Tabs>
    </form>
  );
}
