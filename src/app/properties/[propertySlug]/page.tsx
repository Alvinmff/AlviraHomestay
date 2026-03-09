import { notFound } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { PrismaClient } from "@prisma/client";
import { MapPin, Users, Maximize, BedDouble, Check } from "lucide-react";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { AnimatedGrid } from "@/components/animations/AnimatedGrid";

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
      <section className="relative h-[40vh] min-h-[300px] flex items-end pb-12 overflow-hidden">
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

      {/* Room Grid Section */}
      <section className="container mx-auto px-4 mt-12">
        <div className="flex justify-between items-end mb-8">
          <div>
            <h2 className="text-3xl font-serif font-bold text-foreground">Pilihan {property.type === 'KOST' ? 'Kamar Kost' : 'Akomodasi'}</h2>
            <p className="text-muted-foreground mt-2 max-w-2xl">{property.description}</p>
          </div>
        </div>

        {property.rooms.length === 0 ? (
          <div className="text-center py-24 bg-card border rounded-2xl">
            <p className="text-muted-foreground">Belum ada kamar yang tersedia untuk properti ini.</p>
          </div>
        ) : (
          <AnimatedGrid className="grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {property.rooms.map((room) => {
              const amenities = JSON.parse(room.amenities) as string[];
              
              return (
                <Card key={room.id} className="overflow-hidden flex flex-col group border-border/50 shadow-sm transition-all h-full">
                  <div className="relative h-60 w-full overflow-hidden bg-muted">
                    <Image
                      src={room.thumbnail || "/images/placeholder-room.jpg"}
                      alt={room.roomName}
                      fill
                      className="object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                    {property.type === 'VILLA' && (
                      <div className="absolute top-4 left-4">
                        <Badge className="bg-secondary text-secondary-foreground shadow-sm">
                          Paket {room.roomName}
                        </Badge>
                      </div>
                    )}
                  </div>
                  
                  <CardHeader className="pb-4">
                    <div className="flex justify-between items-start mb-1">
                      <h3 className="text-xl font-bold font-serif text-foreground line-clamp-1">{room.roomName}</h3>
                    </div>
                    <div className="flex flex-wrap items-center gap-3 text-sm text-muted-foreground mt-2">
                      <span className="flex items-center gap-1.5"><Users className="w-4 h-4"/> Maks {room.maxGuests} Tamu</span>
                      <span className="w-1 h-1 rounded-full bg-border"></span>
                      <span className="flex items-center gap-1.5"><Maximize className="w-4 h-4"/> {room.roomSize}</span>
                      <span className="w-1 h-1 rounded-full bg-border"></span>
                      <span className="flex items-center gap-1.5"><BedDouble className="w-4 h-4"/> {room.bedType}</span>
                    </div>
                  </CardHeader>

                  <CardContent className="flex-1">
                    <div className="flex flex-wrap gap-2 mb-4">
                      {amenities.slice(0, 4).map((amenity, i) => (
                        <div key={i} className="inline-flex items-center gap-1 text-xs px-2 py-1 bg-muted rounded-md text-foreground">
                          <Check className="w-3 h-3 text-primary" />
                          {amenity}
                        </div>
                      ))}
                      {amenities.length > 4 && (
                        <div className="inline-flex items-center text-xs px-2 py-1 bg-muted/50 rounded-md text-muted-foreground">
                          +{amenities.length - 4} lainnya
                        </div>
                      )}
                    </div>
                  </CardContent>

                  <CardFooter className="pt-4 border-t border-border/50 flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">Mulai dari</p>
                      <p className="text-lg font-serif font-bold text-primary">
                        {formatRupiah(room.basePrice)}
                        <span className="text-sm font-sans font-normal text-muted-foreground">/{property.type === 'KOST' ? 'Bulan' : 'Malam'}</span>
                      </p>
                    </div>
                    <Link 
                      href={`/properties/${propertySlug}/${room.slug}`}
                      className="inline-flex items-center justify-center rounded-lg h-9 px-4 text-sm font-medium bg-primary/10 text-primary hover:bg-primary hover:text-white transition-colors relative z-10"
                    >
                      Lihat Detail
                    </Link>
                  </CardFooter>
                </Card>
              );
            })}
          </AnimatedGrid>
        )}
      </section>
    </div>
  );
}
