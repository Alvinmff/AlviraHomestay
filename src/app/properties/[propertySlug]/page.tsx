import { notFound } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { PrismaClient } from "@prisma/client";
import { MapPin, Users, Maximize, BedDouble, Check, AlertCircle, Info } from "lucide-react";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { PropertyContentTabs } from "@/components/properties/PropertyContentTabs";

const prisma = new PrismaClient();

// Format Rupiah helper
const formatRupiah = (number: number) => {
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    minimumFractionDigits: 0,
  }).format(number);
};

export default async function PropertyRoomsPage({ params }: { params: { propertySlug: string } }) {
  const { propertySlug } = params;

  // Fetch Property & its Rooms
  const property = await prisma.property.findFirst({
    where: { slug: propertySlug, isActive: true },
    include: {
      rooms: {
        where: { isActive: true, isShown: true },
        orderBy: { roomNumber: 'asc' }
      }
    }
  });

  if (!property) {
    notFound();
  }

  return (
    <div className="min-h-screen bg-background pb-20">
      {/* Property Hero Header */}
      <section className="relative h-[60vh] min-h-[400px] flex items-end pb-12 overflow-hidden">
        <div className="absolute inset-0 bg-black/50 z-10" />
        {property.heroImage && (
          <Image
            src={property.heroImage}
            alt={property.name}
            fill
            className="object-cover z-0"
            priority
          />
        )}
        <div className="container relative z-20 mx-auto px-4">
          <Badge className="mb-4 bg-primary/80 hover:bg-primary/90 text-white border-transparent">
            {property.type} &bull; {property.city}
          </Badge>
          <h1 className="text-4xl md:text-5xl font-serif font-bold text-white mb-2 tracking-tight">
            {property.name}
          </h1>
          <div className="flex items-center text-white/90 gap-2">
            <MapPin className="w-4 h-4" />
            <span>{property.address}</span>
          </div>
        </div>
      </section>

      {/* Conditional Description for Surabaya */}
      {property.slug === 'surabaya' && (
        <section className="container mx-auto px-4 -mt-8 relative z-30 mb-8">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <Card className="lg:col-span-1 shadow-lg border-border">
              <CardHeader className="bg-primary/5 pb-4">
                <h2 className="text-xl font-serif font-bold flex items-center gap-2">
                  <Info className="w-5 h-5 text-primary" />
                  Kost Premium di Tempat Strategis dan Nyaman
                </h2>
              </CardHeader>
              <CardContent className="pt-6">
                <p className="text-sm text-foreground/80 mb-4 leading-relaxed">
                  Dekat Pusat Bisnis Kota Surabaya (Royal Plaza Mall, Kantor Pertamina Jagir, Kantor Pajak Jagir, Pasar Wonokromo, Stasiun Wonokromo, Universitas Kedokteran Hang Tuah, RSAL, Jatim Expo, DBL, Graha Pangeran).
                </p>
                <h3 className="font-bold text-sm mb-3">Fasilitas Tersedia:</h3>
                <ul className="space-y-2 text-sm text-muted-foreground">
                  <li className="flex items-start gap-2"><Check className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" /> AC, TV, WIFI, Water Heater</li>
                  <li className="flex items-start gap-2"><Check className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" /> Mesin Cuci Bersama Gratis</li>
                  <li className="flex items-start gap-2"><Check className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" /> Kompor Elpiji & Kulkas Bersama Gratis</li>
                  <li className="flex items-start gap-2"><Check className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" /> Galon Air Minum & Air PDAM Gratis</li>
                  <li className="flex items-start gap-2"><Check className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" /> Parkiran Luas & Rumah Sangat Luas</li>
                  <li className="flex items-start gap-2"><Check className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" /> Satpam 24 Jam & Dekat Masjid 100 Meter</li>
                </ul>
              </CardContent>
            </Card>

            <Card className="lg:col-span-2 shadow-lg border-border">
              <CardHeader className="bg-red-50 dark:bg-red-950/20 pb-4">
                <h2 className="text-xl font-serif font-bold text-red-700 dark:text-red-400 flex items-center gap-2">
                  <AlertCircle className="w-5 h-5" />
                  Tata Tertib Penghuni dan Tamu
                </h2>
              </CardHeader>
              <CardContent className="pt-6 grid grid-cols-1 md:grid-cols-2 gap-8">
                <div>
                  <h3 className="font-bold text-sm mb-3 text-red-600 dark:text-red-400 border-b pb-2">Tata Tertib Homestay/Kost</h3>
                  <ul className="space-y-2 text-xs text-muted-foreground list-decimal pl-4">
                    <li>Setiap Penyewa wajib menyerahkan fotocopy KTP / Identitas diri yang sah.</li>
                    <li>Penyewa bertanggung jawab terhadap kerapian & kebersihan kamar & lingkungan serta keamanan.</li>
                    <li>Buanglah sampah pada tempat yang disediakan.</li>
                    <li>Kehilangan barang-barang penyewa bukan tanggung jawab pemilik.</li>
                    <li>Dilarang meminjamkan kunci pada siapapun kecuali memberitahu kepada pemilik terlebih dahulu.</li>
                    <li>Mematikan air, lampu, dan listrik saat meninggalkan kamar.</li>
                    <li>Saling menghargai, menghormati, serta menjaga kenyamanan sesama penyewa.</li>
                    <li>Dilarang membawa tamu lawan jenis kedalam kamar (bagi pasangan tidak menikah).</li>
                    <li>Jumlah penyewa sesuai perjanjian / kesepakatan Bersama.</li>
                    <li>Dilarang keras menggunakan Narkotika, Minuman Keras, dll.</li>
                  </ul>
                </div>
                <div>
                  <h3 className="font-bold text-sm mb-3 text-red-600 dark:text-red-400 border-b pb-2">Tata Tertib Tamu</h3>
                  <ul className="space-y-2 text-xs text-muted-foreground list-decimal pl-4">
                    <li>Jam Bertamu Maksimal Pukul 22.00 WIB.</li>
                    <li>Tamu Dilarang Menggunakan Kamar Mandi Untuk Keperluan Yang Tidak Sewajarnya (Mencuci, Mandi, dll).</li>
                    <li>Tamu Dilarang Menitipkan Kendaraan Dengan Alasan Apapun, mengingat parkiran sangat terbatas.</li>
                    <li>Jaga Kebersihan, Buang Sampah Pada Tempatnya.</li>
                  </ul>
                </div>
              </CardContent>
            </Card>
          </div>
        </section>
      )}

      {/* Room Grid & Gallery Section Handler */}
      <PropertyContentTabs property={property} initialRooms={property.rooms} />
    </div>
  );
}
