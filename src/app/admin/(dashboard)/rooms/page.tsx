import { prisma } from "@/lib/prisma";
import { CopyPlus, LayoutTemplate, MapPin } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import Link from "next/link";
import { RoomActions } from "@/components/admin/room-actions";



const formatRupiah = (number: number) => {
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    minimumFractionDigits: 0,
  }).format(number);
};

export default async function AdminRoomsPage() {
  const allRooms = await prisma.room.findMany({
    include: {
      property: {
        select: {
          name: true,
          city: true,
        }
      }
    }
  });

  // Urutan kota khusus sesuai permintaan user
  const cityOrder = ["Sidoarjo", "Surabaya", "Batu"];

  // Pengelompokan dan Pengurutan
  const groupedRooms = cityOrder.reduce((acc: any, city: string) => {
    const roomsInCity = allRooms
      .filter((r) => r.property.city === city)
      .sort((a, b) => {
        // Alphanumeric sort for roomName (e.g. Alvira 1, Alvira 2, Alvira 10)
        return a.roomName.localeCompare(b.roomName, undefined, { numeric: true, sensitivity: 'base' });
      });
    
    if (roomsInCity.length > 0) {
      acc[city] = roomsInCity;
    }
    return acc;
  }, {});

  // Handle cities not in the predefined list (if any)
  allRooms.forEach(room => {
    const city = room.property.city;
    if (!cityOrder.includes(city) && !groupedRooms[city]) {
      groupedRooms[city] = allRooms
        .filter(r => r.property.city === city)
        .sort((a, b) => a.roomName.localeCompare(b.roomName, undefined, { numeric: true, sensitivity: 'base' }));
    }
  });

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-3xl font-serif font-bold tracking-tight text-foreground">Manajemen Kamar</h2>
          <p className="text-muted-foreground mt-1">Kelola listing, harga, dan pengaturan properti granular Anda.</p>
        </div>
        <Button className="bg-primary text-primary-foreground hover:bg-primary/90 flex items-center gap-2">
          <Link href="/admin/rooms/new" className="flex items-center gap-2">
            <CopyPlus className="w-4 h-4" /> Tambah Kamar
          </Link>
        </Button>
      </div>

      <Card className="border-border/50 shadow-sm mt-8">
        <CardHeader>
          <CardTitle className="font-serif flex items-center gap-2">
            <LayoutTemplate className="w-5 h-5 text-primary" />
            Daftar Akomodasi Tersedia
          </CardTitle>
          <CardDescription>
            Terdapat total {allRooms.length} kamar melintasi {Object.keys(groupedRooms).length} lokasi.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-10">
          
          {Object.entries(groupedRooms).map(([city, rooms]: [string, any]) => (
            <div key={city} className="space-y-4">
              <div className="flex items-center gap-4">
                <h3 className="text-sm font-bold tracking-widest uppercase text-primary px-4 py-1.5 rounded-lg bg-primary/5 border border-primary/10 flex items-center gap-2">
                  <MapPin className="w-4 h-4" /> {city}
                </h3>
                <div className="h-px flex-1 bg-gradient-to-r from-primary/20 to-transparent"></div>
              </div>

              <div className="rounded-xl border border-border/50 overflow-hidden shadow-sm bg-card">
                <div className="overflow-x-auto">
                  <table className="w-full text-sm text-left">
                  <thead className="text-[11px] text-muted-foreground uppercase bg-muted/30 border-b font-bold tracking-wider">
                    <tr>
                      <th scope="col" className="px-6 py-4">Info Kamar</th>
                      <th scope="col" className="px-6 py-4">Properti</th>
                      <th scope="col" className="px-6 py-4">Harga Dasar</th>
                      <th scope="col" className="px-6 py-4 text-center">Status</th>
                      <th scope="col" className="px-6 py-4 text-right">Aksi</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border/40">
                    {rooms.map((room: any) => (
                      <tr key={room.id} className="hover:bg-muted/10 transition-colors group">
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-4">
                            <div className="relative w-14 h-11 rounded-lg border bg-muted overflow-hidden flex-shrink-0 shadow-sm">
                              <Image 
                                src={room.thumbnail || "/images/placeholder-room.jpg"} 
                                alt={room.roomName} 
                                fill 
                                sizes="56px"
                                className="object-cover group-hover:scale-105 transition-transform duration-300"
                              />
                            </div>
                            <div>
                              <p className="font-bold text-foreground leading-tight text-sm">{room.roomName}</p>
                              <div className="flex items-center gap-2 mt-1.5">
                                <span className="text-[10px] bg-sky-500/10 text-sky-500 font-bold px-2 py-0.5 rounded border border-sky-500/20 shadow-sm">
                                  Kamar {room.roomNumber}
                                </span>
                                <span className="text-[10px] text-muted-foreground font-medium flex items-center gap-1">
                                  • {room.maxGuests} Tamu
                                </span>
                              </div>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <p className="text-foreground text-xs font-semibold">{room.property.name}</p>
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex flex-col">
                            <span className="text-sm font-bold text-foreground">{formatRupiah(room.basePrice)}</span>
                            {room.monthlyPrice && (
                              <span className="text-[10px] text-muted-foreground font-medium">
                                Bulanan: {formatRupiah(room.monthlyPrice)}
                              </span>
                            )}
                          </div>
                        </td>
                        <td className="px-6 py-4 text-center">
                          <Badge variant="outline" className={room.isShown ? "border-emerald-500/20 bg-emerald-500/10 text-emerald-500 font-bold text-[10px] py-0.5" : "border-zinc-500/20 bg-zinc-500/10 text-zinc-500 font-bold text-[10px] py-0.5"}>
                            {room.isShown ? "PUBLISHED" : "HIDDEN"}
                          </Badge>
                        </td>
                        <td className="px-6 py-4 text-right">
                          <RoomActions roomId={room.id} isShown={room.isShown} />
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
                </div>
              </div>
            </div>
          ))}
          
          {allRooms.length === 0 && (
            <div className="text-center p-16 text-muted-foreground border-2 border-dashed rounded-2xl bg-muted/10">
              <p className="font-medium">Belum ada data kamar.</p>
              <p className="text-xs mt-1">Gunakan tombol "Tambah Kamar" untuk memulai.</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
