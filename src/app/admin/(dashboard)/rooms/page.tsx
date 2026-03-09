import { PrismaClient } from "@prisma/client";
import { CopyPlus, LayoutTemplate } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import Link from "next/link";
import { RoomActions } from "@/components/admin/room-actions";

const prisma = new PrismaClient();

const formatRupiah = (number: number) => {
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    minimumFractionDigits: 0,
  }).format(number);
};

export default async function AdminRoomsPage() {
  const rooms = await prisma.room.findMany({
    orderBy: [
      { propertyId: 'asc' },
      { roomNumber: 'asc' }
    ],
    include: {
      property: {
        select: {
          name: true,
          city: true,
        }
      }
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
            Terdapat total {rooms.length} kamar melintasi 3 properti.
          </CardDescription>
        </CardHeader>
        <CardContent>
          
          <div className="rounded-md border overflow-hidden">
            <table className="w-full text-sm text-left text-muted-foreground">
              <thead className="text-xs text-foreground uppercase bg-muted/50 border-b">
                <tr>
                  <th scope="col" className="px-6 py-4 font-semibold">Info Kamar</th>
                  <th scope="col" className="px-6 py-4 font-semibold">Lokasi</th>
                  <th scope="col" className="px-6 py-4 font-semibold">Harga Dasar</th>
                  <th scope="col" className="px-6 py-4 font-semibold text-center">Status</th>
                  <th scope="col" className="px-6 py-4 font-semibold text-right">Aksi</th>
                </tr>
              </thead>
              <tbody>
                {rooms.map((room) => (
                  <tr key={room.id} className="bg-white border-b hover:bg-muted/20 transition-colors">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-4">
                        <div className="relative w-16 h-12 rounded-md overflow-hidden bg-muted flex-shrink-0">
                          <Image 
                            src={room.thumbnail || "/images/placeholder-room.jpg"} 
                            alt={room.roomName} 
                            fill 
                            sizes="64px"
                            className="object-cover"
                          />
                        </div>
                        <div>
                          <p className="font-semibold text-foreground text-sm line-clamp-1">{room.roomName}</p>
                          <p className="text-xs flex items-center gap-2 mt-0.5">
                            <span className="font-mono bg-muted px-1.5 py-0.5 rounded text-[10px]">{room.roomNumber}</span>
                            <span>{room.maxGuests} Tamu</span>
                          </p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <p className="text-foreground font-medium">{room.property.city}</p>
                      <p className="text-xs line-clamp-1 opacity-70">{room.property.name}</p>
                    </td>
                    <td className="px-6 py-4 text-foreground font-medium">
                       {formatRupiah(room.basePrice)}
                       {room.monthlyPrice && (
                         <span className="block text-[10px] text-muted-foreground font-normal mt-0.5">
                           Bl: {formatRupiah(room.monthlyPrice)}
                         </span>
                       )}
                    </td>
                    <td className="px-6 py-4 text-center">
                      <Badge variant="outline" className={room.isShown ? "border-green-200 bg-green-50 text-green-700 hover:bg-green-100" : "border-gray-200 bg-gray-50 text-gray-500 hover:bg-gray-100"}>
                        {room.isShown ? "Publish" : "Hidden"}
                      </Badge>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <RoomActions roomId={room.id} isShown={room.isShown} />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            
            {rooms.length === 0 && (
              <div className="text-center p-12 text-muted-foreground">
                Kamar kosong, harap jalankan seeder.
              </div>
            )}
            
          </div>

        </CardContent>
      </Card>
    </div>
  );
}
