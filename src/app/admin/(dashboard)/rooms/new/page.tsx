import { prisma } from "@/lib/prisma";
import { RoomForm } from "@/components/admin/room-form";

export default async function NewRoomPage() {
  const properties = await prisma.property.findMany({
    select: { id: true, name: true, city: true },
    orderBy: { name: 'asc' }
  });

  const formattedProperties = properties.map(p => ({
    id: p.id,
    name: `${p.name} (${p.city})`
  }));

  return (
    <div className="space-y-6 mb-12">
      <div>
        <h2 className="text-3xl font-serif font-bold tracking-tight text-foreground">Tambah Kamar Baru</h2>
        <p className="text-muted-foreground mt-1">Masukkan rincian spesifikasi untuk listing kamar baru Anda.</p>
      </div>
      
      <RoomForm properties={formattedProperties} />
    </div>
  );
}
