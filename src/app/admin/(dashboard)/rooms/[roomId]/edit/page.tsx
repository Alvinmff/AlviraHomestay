import { PrismaClient } from "@prisma/client";
import { RoomForm } from "@/components/admin/room-form";
import { notFound } from "next/navigation";

const prisma = new PrismaClient();

interface PageProps {
  params: { roomId: string }
}

export default async function EditRoomPage({ params }: PageProps) {
  const room = await prisma.room.findUnique({
    where: { id: params.roomId }
  });

  if (!room) notFound();

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
        <h2 className="text-3xl font-serif font-bold tracking-tight text-foreground">Ubah Detail Kamar</h2>
        <p className="text-muted-foreground mt-1">Perbarui rincian harga dan spesifikasi kamar listing Anda dari sini.</p>
      </div>
      
      <RoomForm initialData={room} properties={formattedProperties} />
    </div>
  );
}
