import { notFound } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { PrismaClient } from "@prisma/client";
import { MapPin, Users, Maximize, BedDouble, Check } from "lucide-react";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { PropertyRoomsClient } from "@/components/properties/PropertyRoomsClient";

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
      <PropertyRoomsClient property={property} initialRooms={property.rooms} />
    </div>
  );
}
