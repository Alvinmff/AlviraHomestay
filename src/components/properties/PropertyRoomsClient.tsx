"use client";

import { useState, useMemo } from "react";
import Image from "next/image";
import Link from "next/link";
import { MapPin, Users, Maximize, BedDouble, Check, Filter, X } from "lucide-react";
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
    const [isMobileFilterOpen, setIsMobileFilterOpen] = useState(false);

    // Filters state
    const [priceRange, setPriceRange] = useState<number>(5000000); // Max price
    const [capacity, setCapacity] = useState<string>("all");
    const [selectedAmenities, setSelectedAmenities] = useState<string[]>([]);
    const [sortBy, setSortBy] = useState<string>("recommended");

    // Extract all unique amenities from all rooms for filtering options
    const allAmenities = useMemo(() => {
        const amenitiesSet = new Set<string>();
        initialRooms.forEach(room => {
            const roomAmenities = (room.amenities || []) as string[];
            roomAmenities.forEach(a => amenitiesSet.add(a));
        });
        return Array.from(amenitiesSet).sort();
    }, [initialRooms]);

    // Find max possible price for the slider
    const maxRoomPrice = useMemo(() => {
        if (initialRooms.length === 0) return 5000000;
        return Math.max(...initialRooms.map(r => r.basePrice)) + 100000;
    }, [initialRooms]);

    const toggleAmenity = (amenity: string) => {
        setSelectedAmenities(prev =>
            prev.includes(amenity)
                ? prev.filter(a => a !== amenity)
                : [...prev, amenity]
        );
    };

    const resetFilters = () => {
        setPriceRange(maxRoomPrice);
        setCapacity("all");
        setSelectedAmenities([]);
        setSortBy("recommended");
    };

    const filteredAndSortedRooms = useMemo(() => {
        let result = [...initialRooms];

        // Filter by Price
        result = result.filter(room => room.basePrice <= priceRange);

        // Filter by Capacity
        if (capacity !== "all") {
            const cap = parseInt(capacity);
            result = result.filter(room => room.maxGuests >= cap);
        }

        // Filter by Amenities
        if (selectedAmenities.length > 0) {
            result = result.filter(room => {
                const roomAmenities = (room.amenities || []) as string[];
                return selectedAmenities.every(a => roomAmenities.includes(a));
            });
        }

        // Sort
        if (sortBy === "price_asc") {
            result.sort((a, b) => a.basePrice - b.basePrice);
        } else if (sortBy === "price_desc") {
            result.sort((a, b) => b.basePrice - a.basePrice);
        } else if (sortBy === "capacity_desc") {
            result.sort((a, b) => b.maxGuests - a.maxGuests);
        } // "recommended" keeps original order (by roomNumber usually)

        return result;
    }, [initialRooms, priceRange, capacity, selectedAmenities, sortBy]);

    const FilterSidebar = () => (
        <div className="space-y-8">
            <div className="flex items-center justify-between pb-4 border-b">
                <h3 className="font-serif font-bold text-lg flex items-center gap-2">
                    <Filter className="w-5 h-5 text-primary" /> Filter
                </h3>
                <button
                    onClick={resetFilters}
                    className="text-sm font-semibold text-muted-foreground hover:text-destructive transition-colors"
                >
                    Reset
                </button>
            </div>

            {/* Price Range */}
            <div className="space-y-4">
                <h4 className="font-semibold text-sm">Rentang Harga Maksimal</h4>
                <input
                    type="range"
                    min="50000"
                    max={maxRoomPrice}
                    step="50000"
                    value={priceRange}
                    onChange={(e) => setPriceRange(Number(e.target.value))}
                    className="w-full accent-primary"
                />
                <div className="flex justify-between text-xs text-muted-foreground font-medium">
                    <span>Rp 50rb</span>
                    <span>{formatRupiah(priceRange)}</span>
                </div>
            </div>

            {/* Capacity */}
            <div className="space-y-4">
                <h4 className="font-semibold text-sm">Kapasitas Tamu</h4>
                <div className="flex flex-wrap gap-2">
                    {["all", "1", "2", "3", "4"].map(cap => (
                        <button
                            key={cap}
                            onClick={() => setCapacity(cap)}
                            className={`px-4 py-2 text-sm rounded-lg border font-medium transition-colors ${capacity === cap
                                ? "bg-primary border-primary text-primary-foreground"
                                : "bg-surface text-foreground hover:bg-muted"
                                }`}
                        >
                            {cap === "all" ? "Semua" : `${cap}+ Orang`}
                        </button>
                    ))}
                </div>
            </div>

            {/* Facilities */}
            {allAmenities.length > 0 && (
                <div className="space-y-4">
                    <h4 className="font-semibold text-sm">Fasilitas Khusus</h4>
                    <div className="space-y-2 max-h-60 overflow-y-auto pr-2 custom-scrollbar">
                        {allAmenities.map(amenity => (
                            <label key={amenity} className="flex items-center gap-3 cursor-pointer group">
                                <div className={`w-5 h-5 rounded border flex items-center justify-center transition-colors ${selectedAmenities.includes(amenity) ? "bg-primary border-primary" : "border-input group-hover:border-primary"}`}>
                                    {selectedAmenities.includes(amenity) && <Check className="w-3 h-3 text-white" />}
                                </div>
                                <span className="text-sm text-foreground/80 group-hover:text-foreground line-clamp-1 flex-1">
                                    {amenity}
                                </span>
                            </label>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );

    return (
        <section className="container mx-auto px-4 mt-8 md:mt-12">
            <div className="flex flex-col lg:flex-row gap-8 items-start">

                {/* Desktop Sidebar */}
                <div className="hidden lg:block w-72 shrink-0 sticky top-24 bg-card border rounded-2xl p-6 shadow-sm">
                    <FilterSidebar />
                </div>

                {/* Mobile Filter Toggle */}
                <div className="w-full lg:hidden flex items-center justify-between bg-card border rounded-xl p-4 shadow-sm">
                    <button
                        onClick={() => setIsMobileFilterOpen(true)}
                        className="flex items-center gap-2 font-semibold text-primary"
                    >
                        <Filter className="w-5 h-5" /> Filter Kamar
                    </button>

                    <div className="flex items-center gap-2">
                        <span className="text-sm text-muted-foreground mr-2">Urutkan:</span>
                        <select
                            value={sortBy}
                            onChange={(e) => setSortBy(e.target.value)}
                            className="px-3 py-1.5 text-sm rounded-lg border bg-surface font-medium focus:outline-none focus:ring-2 focus:ring-primary/20"
                        >
                            <option value="recommended">Rekomendasi</option>
                            <option value="price_asc">Harga Terendah</option>
                            <option value="price_desc">Harga Tertinggi</option>
                            <option value="capacity_desc">Kapasitas Max</option>
                        </select>
                    </div>
                </div>

                {/* Main Content Area */}
                <div className="flex-1 w-full min-w-0">

                    {/* Desktop Sort Bar */}
                    <div className="hidden lg:flex justify-between items-center mb-6 pb-4 border-b">
                        <h2 className="text-2xl font-serif font-bold text-foreground">
                            Pilihan {property.type === 'KOST' ? 'Kamar Kost' : 'Akomodasi'}
                            <span className="text-muted-foreground text-lg ml-2 font-sans font-normal">({filteredAndSortedRooms.length} kamar)</span>
                        </h2>

                        <div className="flex items-center gap-2">
                            <span className="text-sm text-muted-foreground font-medium">Urutkan:</span>
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

                    {filteredAndSortedRooms.length === 0 ? (
                        <div className="text-center py-20 bg-card border rounded-2xl flex flex-col items-center">
                            <Filter className="w-12 h-12 text-muted-foreground/30 mb-4" />
                            <h3 className="text-xl font-bold mb-2">Tidak Ada Kamar Sesuai</h3>
                            <p className="text-muted-foreground mb-6">Coba sesuaikan filter harga, kapasitas, atau fasilitas.</p>
                            <button
                                onClick={resetFilters}
                                className="px-6 py-2 bg-primary text-primary-foreground font-semibold rounded-lg hover:bg-primary/90 transition-colors"
                            >
                                Reset Filter
                            </button>
                        </div>
                    ) : (
                        <AnimatedGrid className="grid-cols-1 md:grid-cols-2 xl:grid-cols-2 gap-6 w-full">
                            {filteredAndSortedRooms.map((room) => {
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
                                                    className="inline-flex flex-1 sm:flex-none items-center justify-center rounded-lg h-10 px-4 text-sm font-semibold bg-white border shadow-sm text-foreground hover:bg-muted transition-colors"
                                                >
                                                    Cek Jadwal
                                                </Link>
                                                <Link
                                                    href={`/properties/${property.slug}/${room.slug}`}
                                                    className="inline-flex flex-1 sm:flex-none items-center justify-center rounded-lg h-10 px-6 text-sm font-semibold bg-primary text-primary-foreground hover:bg-primary/90 transition-colors shadow-sm shadow-primary/20"
                                                >
                                                    Booking
                                                </Link>
                                            </div>
                                        </CardFooter>
                                    </Card>
                                );
                            })}
                        </AnimatedGrid>
                    )}
                </div>
            </div>

            {/* Mobile Filter Drawer Sidebar */}
            {isMobileFilterOpen && (
                <div className="lg:hidden fixed inset-0 z-50 flex">
                    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setIsMobileFilterOpen(false)} />
                    <div className="absolute right-0 top-0 bottom-0 w-[85%] max-w-[320px] bg-card shadow-2xl overflow-y-auto animate-in slide-in-from-right duration-300">
                        <div className="p-6">
                            <div className="flex items-center justify-between mb-8">
                                <h2 className="text-xl font-serif font-bold flex items-center gap-2">
                                    <Filter className="w-5 h-5" /> Filter Kamar
                                </h2>
                                <button
                                    onClick={() => setIsMobileFilterOpen(false)}
                                    className="p-2 bg-muted rounded-full hover:bg-muted/80 transition-colors"
                                >
                                    <X className="w-5 h-5" />
                                </button>
                            </div>
                            <FilterSidebar />

                            <div className="mt-8 pt-6 border-t">
                                <button
                                    onClick={() => setIsMobileFilterOpen(false)}
                                    className="w-full py-3 bg-primary text-primary-foreground rounded-xl font-bold shadow-lg shadow-primary/20"
                                >
                                    Terapkan Filter ({filteredAndSortedRooms.length})
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </section>
    );
}
