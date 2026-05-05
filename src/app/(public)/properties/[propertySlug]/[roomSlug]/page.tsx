import { notFound } from "next/navigation";
import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { ArrowLeft, Users, Maximize, BedDouble, Check, MapPin } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { RoomWhatsAppForm } from "@/components/booking/room-whatsapp-form";
import { RoomGalleryModal } from "@/components/gallery/room-gallery-modal";
import { YearlyAvailabilityCalendar } from "@/components/calendar/YearlyAvailabilityCalendar";

export default async function RoomDetailPage({ params }: { params: { propertySlug: string, roomSlug: string } }) {
  const { propertySlug, roomSlug } = params;

  // Fetch specific room and its parent property
  const room = await prisma.room.findFirst({
    where: { slug: roomSlug, isActive: true, isShown: true },
    include: {
      property: true,
    }
  });

  if (!room || room.property.slug !== propertySlug) {
    notFound();
  }

  const amenities = (room.amenities || []) as string[];
  const photos = (room.photos || []) as string[];
  const commonFacilities = (room.property.commonFacilities || []) as string[];

  return (
    <div className="min-h-screen bg-background pb-24">
      {/* Back Navigation Bar */}
      <div className="bg-background border-b sticky top-0 z-40">
        <div className="container mx-auto px-4 h-16 flex items-center">
          <Link
            href={`/properties/${propertySlug}`}
            className="inline-flex items-center gap-2 text-sm font-medium text-muted-foreground hover:text-primary transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            Kembali ke {room.property.name}
          </Link>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">

        {/* Header Section */}
        <div className="mb-8">
          <div className="flex flex-wrap items-center gap-3 mb-4">
            <Badge className="bg-secondary/20 text-secondary hover:bg-secondary/30 border-transparent shadow-none">
              {room.property.type}
            </Badge>
            <span className="text-muted-foreground text-sm flex items-center gap-1">
              <MapPin className="w-4 h-4" /> {room.property.city}
            </span>
          </div>
          <h1 className="text-4xl md:text-5xl font-serif font-bold text-foreground mb-4">
            {room.roomName}
          </h1>
        </div>

        {/* Media Gallery / Map out Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

          {/* Main Left Content */}
          <div className="lg:col-span-2 space-y-8">

            {/* Enhanced Immersive Gallery Modal */}
            <RoomGalleryModal
              photos={photos}
              thumbnail={room.thumbnail}
              roomName={room.roomName}
            />

            {/* Quick Stats Banner */}
            <div className="flex flex-wrap items-center gap-8 py-4 border-y border-border/50">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary">
                  <Users className="w-5 h-5" />
                </div>
                <div>
                  <p className="text-xs text-muted-foreground mb-0.5">Kapasitas</p>
                  <p className="text-sm font-semibold">{room.maxGuests} Tamu</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary">
                  <Maximize className="w-5 h-5" />
                </div>
                <div>
                  <p className="text-xs text-muted-foreground mb-0.5">Ukuran</p>
                  <p className="text-sm font-semibold">{room.roomSize}</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary">
                  <BedDouble className="w-5 h-5" />
                </div>
                <div>
                  <p className="text-xs text-muted-foreground mb-0.5">Tipe Kasur</p>
                  <p className="text-sm font-semibold">{room.bedType}</p>
                </div>
              </div>
            </div>

            {/* Description */}
            <section className="space-y-4">
              <h2 className="text-2xl font-serif font-bold text-foreground">Tentang {room.roomName}</h2>
              <p className="text-muted-foreground leading-relaxed whitespace-pre-wrap">
                {room.description || "Jelajahi kenyamanan menginap premium dengan fasilitas lengkap dari Alvira Homestay."}
              </p>
            </section>

            {/* Individual Amenities */}
            <section className="space-y-6">
              <h2 className="text-2xl font-serif font-bold text-foreground">Fasilitas</h2>
              <div className="columns-1 sm:columns-2 lg:columns-3 gap-4">
                {amenities.map((amenity, i) => (
                  <div key={i} className="flex items-start gap-3 break-inside-avoid mb-4">
                    <Check className="w-5 h-5 text-green-600 shrink-0 mt-0.5" />
                    <span className="text-foreground">{amenity}</span>
                  </div>
                ))}
              </div>
            </section>

            {/* Common Area Facilities */}
            <section className="space-y-6 pt-6 border-t border-border/50">
              <h2 className="text-xl font-serif font-bold text-foreground">Fasilitas Area Bersama ({room.property.name})</h2>
              <div className="columns-1 sm:columns-2 lg:columns-3 gap-4">
                {commonFacilities.map((facility, i) => (
                  <div key={i} className="flex items-start gap-3 break-inside-avoid mb-4">
                    <div className="w-1.5 h-1.5 rounded-full bg-primary shrink-0 mt-2" />
                    <span className="text-muted-foreground">{facility}</span>
                  </div>
                ))}
              </div>
            </section>

            {/* Yearly Availability Calendar */}
            <section className="gap-6 pt-6 border-t border-border/50">
              <YearlyAvailabilityCalendar roomId={room.id} />
            </section>

          </div>

          {/* Right Column: Sticky Booking / Price Card */}
          <div className="lg:col-span-1">
            <div className="sticky top-24 bg-card rounded-2xl shadow-[0_8px_30px_rgb(0,0,0,0.08)] border border-border/50 p-6">
              <RoomWhatsAppForm
                roomId={room.id}
                roomName={room.roomName}
                propertyName={room.property.name}
                propertyCity={room.property.city}
                basePrice={room.basePrice}
              />
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
