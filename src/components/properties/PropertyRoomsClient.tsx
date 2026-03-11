"use client";

import { useState, useMemo } from "react";
import Image from "next/image";
import Link from "next/link";
import { Users, Maximize, BedDouble, Check } from "lucide-react";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { AnimatedGrid } from "@/components/animations/AnimatedGrid";

const formatRupiah = (number: number) => {
    return new Intl.NumberFormat("id-ID", {
        style: "currency",
        currency: "IDR",
        minimumFractionDigits: 0,
    }).format(number);
};

interface Room {
    id: string;
    slug: string;
    roomName: string;
    roomNumber: string;
    maxGuests: number;
    roomSize: string | null;
    bedType: string | null;
    basePrice: number;
    amenities: any;
    thumbnail: string | null;
}

interface Property {
    type: string;
    city: string;
    name: string;
    address: string;
    description: string;
    slug: string;
}

export function PropertyRoomsClient({
    property,
    initialRooms
}: {
    property: Property;
    initialRooms: Room[];
}) {
    const [sortBy, setSortBy] = useState<string>("recommended");

    const sortedRooms = useMemo(() => {
        let result = [...initialRooms];

        if (sortBy === "price_asc") {
            result.sort((a, b) => a.basePrice - b.basePrice);
        } else if (sortBy === "price_desc") {
            result.sort((a, b) => b.basePrice - a.basePrice);
        } else if (sortBy === "capacity_desc") {
            result.sort((a, b) => b.maxGuests - a.maxGuests);
        }

        return result;
    }, [initialRooms, sortBy]);

    return (
        <section className="container mx-auto px-4 mt-8 md:mt-12 pb-24">
            <div className="mb-6 pb-4 border-b flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <h2 className="text-2xl font-serif font-bold text-foreground">
                    Pilihan {property.type === 'KOST' ? 'Kamar Kost' : 'Akomodasi'}
                    <span className="text-muted-foreground text-lg ml-2 font-sans font-normal">({sortedRooms.length} kamar)</span>
                </h2>

                <div className="flex items-center gap-2">
                    <span className="text-sm text-muted-foreground font-medium shrink-0">Urutkan:</span>
                    <select
                        value={sortBy}
                        onChange={(e) => setSortBy(e.target.value)}
                        className="px-4 py-2 text-sm rounded-lg border bg-surface font-semibold focus:outline-none focus:ring-2 focus:ring-primary/20 hover:border-primary/50 transition-colors"
                    >
                        <option value="recommended">Rekomendasi</option>
                        <option value="price_asc">Harga Terendah</option>
                        <option value="price_desc">Harga Tertinggi</option>
                        <option value="capacity_desc">Kapasitas Maksimal</option>
                    </select>
                </div>
            </div>

            {initialRooms.length === 0 ? (
                <div className="text-center py-20 bg-card border rounded-2xl flex flex-col items-center">
                    <h3 className="text-xl font-bold mb-2">Belum Ada Kamar Tersedia</h3>
                    <p className="text-muted-foreground mb-6">Properti ini belum memiliki kamar yang bisa disewa saat ini.</p>
                </div>
            ) : (
                <AnimatedGrid className="grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 w-full">
                    {sortedRooms.map((room) => {
                        const amenities = (room.amenities || []) as string[];

                        return (
                            <Card key={room.id} className="overflow-hidden flex flex-col group border-border shadow-sm transition-all h-full hover:shadow-xl hover:border-primary/20">
                                <Link href={`/properties/${property.slug}/${room.slug}`} className="relative h-56 w-full overflow-hidden bg-muted block">
                                    <Image
                                        src={room.thumbnail || "/images/placeholder-room.jpg"}
                                        alt={room.roomName}
                                        fill
                                        className="object-cover transition-transform duration-700 group-hover:scale-110"
                                    />
                                    <div className="absolute inset-0 bg-black/10 group-hover:bg-transparent transition-colors z-10" />

                                    {property.type === 'VILLA' && (
                                        <div className="absolute top-4 left-4 z-20">
                                            <Badge className="bg-secondary text-secondary-foreground shadow-sm px-3 py-1.5 text-xs font-bold uppercase tracking-wide">
                                                Paket {room.roomName}
                                            </Badge>
                                        </div>
                                    )}

                                    <div className="absolute top-4 right-4 z-20 md:opacity-0 group-hover:opacity-100 transition-opacity translate-y-2 group-hover:translate-y-0 duration-300">
                                        <span className="bg-black/60 backdrop-blur-md text-white px-3 py-1.5 text-xs font-semibold rounded-lg">
                                            Lihat Detail
                                        </span>
                                    </div>
                                </Link>

                                <CardHeader className="pb-3 pt-5 px-5">
                                    <div className="flex justify-between items-start mb-2">
                                        <Link href={`/properties/${property.slug}/${room.slug}`} className="hover:text-primary transition-colors">
                                            <h3 className="text-2xl font-bold font-serif text-foreground line-clamp-1">{room.roomName}</h3>
                                        </Link>
                                    </div>
                                    <div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-sm text-foreground/80 font-medium bg-muted/30 p-2.5 rounded-lg border border-border/50">
                                        <span className="flex items-center gap-1.5"><Users className="w-4 h-4 text-emerald-600" /> {room.maxGuests} Tamu</span>
                                        <span className="w-1.5 h-1.5 rounded-full bg-border"></span>
                                        <span className="flex items-center gap-1.5"><Maximize className="w-4 h-4 text-blue-600" /> {room.roomSize || '-'}</span>
                                        <span className="w-1.5 h-1.5 rounded-full bg-border"></span>
                                        <span className="flex items-center gap-1.5"><BedDouble className="w-4 h-4 text-amber-600" /> {room.bedType || '-'}</span>
                                    </div>
                                </CardHeader>

                                <CardContent className="flex-1 px-5 pb-4">
                                    <div className="flex flex-wrap gap-2">
                                        {amenities.slice(0, 4).map((amenity, i) => (
                                            <div key={i} className="inline-flex items-center gap-1.5 text-xs font-medium px-2.5 py-1 bg-surface border rounded-md text-foreground/80">
                                                <Check className="w-3 h-3 text-primary" />
                                                {amenity}
                                            </div>
                                        ))}
                                        {amenities.length > 4 && (
                                            <div className="inline-flex items-center text-xs font-semibold px-2.5 py-1 bg-primary/5 text-primary rounded-md">
                                                +{amenities.length - 4} lainnya
                                            </div>
                                        )}
                                    </div>
                                </CardContent>

                                <CardFooter className="p-5 border-t bg-muted/10 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4 mt-auto">
                                    <div>
                                        <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-0.5">Mulai dari</p>
                                        <p className="text-2xl font-serif font-bold text-primary leading-none">
                                            {formatRupiah(room.basePrice)}
                                            <span className="text-sm font-sans font-medium text-muted-foreground ml-1">/{property.type === 'KOST' ? 'Bulan' : 'Malam'}</span>
                                        </p>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <Link
                                            href={`/properties/${property.slug}/${room.slug}#calendar`}
                                            className="inline-flex flex-1 sm:flex-none items-center justify-center rounded-lg h-8 px-3 text-xs font-semibold bg-white dark:bg-zinc-800 border dark:border-zinc-700 shadow-sm text-foreground hover:bg-muted dark:hover:bg-zinc-700 transition-colors"
                                        >
                                            Cek Jadwal
                                        </Link>
                                        <Link
                                            href={`/properties/${property.slug}/${room.slug}`}
                                            className="inline-flex flex-1 sm:flex-none items-center justify-center rounded-lg h-8 px-4 text-xs font-semibold bg-primary text-primary-foreground hover:bg-primary/90 transition-colors shadow-sm shadow-primary/20"
                                        >
                                            Lihat Detail
                                        </Link>
                                    </div>
                                </CardFooter>
                            </Card>
                        );
                    })}
                </AnimatedGrid>
            )}
        </section>
    );
}
