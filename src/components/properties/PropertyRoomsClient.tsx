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
    hidePrice: boolean;
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
        } else {
            // "recommended" -> urutkan berdasarkan nama kamar secara pintar (Smart Sorting)
            result.sort((a, b) => a.roomName.localeCompare(b.roomName, undefined, { numeric: true, sensitivity: 'base' }));
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
                <AnimatedGrid className="grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 w-full">
                    {sortedRooms.map((room) => {
                        const amenities = (room.amenities || []) as string[];

                        return (
                            <Card key={room.id} className="overflow-hidden flex flex-col group border-border/40 shadow-sm transition-all duration-500 h-full hover:shadow-lg hover:-translate-y-1 p-0 gap-0">
                                <Link href={`/properties/${property.slug}/${room.slug}`} className="relative h-80 w-full overflow-hidden bg-muted block">
                                    <Image
                                        src={room.thumbnail || "/images/placeholder-room.jpg"}
                                        alt={room.roomName}
                                        fill
                                        className="object-cover transition-transform duration-700 ease-out group-hover:scale-105"
                                    />
                                    <div className="absolute inset-0 bg-gradient-to-t from-black/15 to-transparent z-10" />

                                    {property.type === 'VILLA' && (
                                        <div className="absolute top-4 left-4 z-20">
                                            <Badge className="bg-secondary/90 backdrop-blur-sm text-secondary-foreground shadow-sm px-3 py-1.5 text-xs font-bold uppercase tracking-wide rounded-lg">
                                                Paket {room.roomName}
                                            </Badge>
                                        </div>
                                    )}

                                    <div className="absolute top-4 right-4 z-20 md:opacity-0 group-hover:opacity-100 transition-all duration-500 translate-y-1 group-hover:translate-y-0">
                                        <span className="bg-background/90 backdrop-blur-sm text-foreground/80 px-3 py-1.5 text-xs font-medium rounded-lg shadow-sm">
                                            Lihat Detail
                                        </span>
                                    </div>
                                </Link>

                                <CardHeader className="pb-3 pt-6 px-6">
                                    <div className="flex justify-between items-start mb-3">
                                        <Link href={`/properties/${property.slug}/${room.slug}`} className="hover:text-primary transition-colors duration-300">
                                            <h3 className="text-xl font-bold font-serif text-foreground line-clamp-1">{room.roomName}</h3>
                                        </Link>
                                    </div>
                                    <div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-sm text-foreground/60 font-medium">
                                        <span className="flex items-center gap-1.5"><Users className="w-4 h-4 text-primary/70" /> {room.maxGuests} Tamu</span>
                                        <span className="w-px h-3 bg-border"></span>
                                        <span className="flex items-center gap-1.5"><Maximize className="w-4 h-4 text-primary/70" /> {room.roomSize || '-'}</span>
                                        <span className="w-px h-3 bg-border"></span>
                                        <span className="flex items-center gap-1.5"><BedDouble className="w-4 h-4 text-primary/70" /> {room.bedType || '-'}</span>
                                    </div>
                                </CardHeader>

                                <CardContent className="flex-1 px-6 pb-4">
                                    <div className="flex flex-wrap gap-1.5">
                                        {amenities.slice(0, 4).map((amenity, i) => (
                                            <div key={i} className="inline-flex items-center gap-1.5 text-xs font-medium px-2.5 py-1 bg-accent/40 rounded-lg text-foreground/70">
                                                <Check className="w-3 h-3 text-primary" />
                                                {amenity}
                                            </div>
                                        ))}
                                        {amenities.length > 4 && (
                                            <div className="inline-flex items-center text-xs font-semibold px-2.5 py-1 bg-primary/5 text-primary rounded-lg">
                                                +{amenities.length - 4} lainnya
                                            </div>
                                        )}
                                    </div>
                                </CardContent>

                                <CardFooter className="p-6 border-t border-border/30 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4 mt-auto">
                                    <div>
                                        {room.hidePrice ? (
                                            <>
                                                <p className="text-[10px] font-medium text-muted-foreground uppercase tracking-widest mb-1">Harga</p>
                                                <p className="text-lg font-serif font-bold text-primary leading-none">
                                                    Hubungi Kami
                                                </p>
                                                <p className="text-[10px] text-muted-foreground mt-1">Menyesuaikan jumlah tamu</p>
                                            </>
                                        ) : (
                                            <>
                                                <p className="text-[10px] font-medium text-muted-foreground uppercase tracking-widest mb-1">Mulai dari</p>
                                                <p className="text-xl font-serif font-bold text-foreground leading-none">
                                                    {formatRupiah(room.basePrice)}
                                                    <span className="text-xs font-sans font-medium text-muted-foreground ml-1">/{property.type === 'KOST' ? 'Bulan' : 'Malam'}</span>
                                                </p>
                                            </>
                                        )}
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <Link
                                            href={`/properties/${property.slug}/${room.slug}#calendar`}
                                            className="inline-flex flex-1 sm:flex-none items-center justify-center rounded-xl h-9 px-4 text-xs font-medium bg-card border border-border/50 text-foreground/70 hover:bg-accent/50 hover:text-foreground transition-all duration-300"
                                        >
                                            Cek Jadwal
                                        </Link>
                                        <Link
                                            href={`/properties/${property.slug}/${room.slug}`}
                                            className="inline-flex flex-1 sm:flex-none items-center justify-center rounded-xl h-9 px-5 text-xs font-semibold bg-primary text-primary-foreground hover:bg-primary/90 transition-all duration-300 shadow-sm"
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
