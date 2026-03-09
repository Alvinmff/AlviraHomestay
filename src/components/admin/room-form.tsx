"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "sonner";

interface RoomFormProps {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  initialData?: any;
  properties: { id: string, name: string }[];
}

export function RoomForm({ initialData, properties }: RoomFormProps) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  
  // Safe parsing of amenities
  let initialAmenities = "";
  if (initialData?.amenities) {
    try {
      const parsed = JSON.parse(initialData.amenities);
      if (Array.isArray(parsed)) {
        initialAmenities = parsed.join(", ");
      }
    } catch {
      initialAmenities = initialData.amenities;
    }
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
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSelectChange = (name: string, value: string) => {
    setFormData(prev => ({ ...prev, [name]: value }));
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
        amenities: JSON.stringify(formData.amenities.split(",").map((s: string) => s.trim()).filter(Boolean)),
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

        <div className="space-y-2">
          <Label>Thumbnail URL *</Label>
          <Input name="thumbnail" value={formData.thumbnail} onChange={handleChange} placeholder="https://..." required />
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
