import { PrismaClient } from "@prisma/client";
import { CopyPlus, Edit, Eye, MapPin, BedDouble } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import Link from "next/link";
import { PropertyActions } from "@/components/admin/property-actions";

const prisma = new PrismaClient();

export default async function AdminPropertiesPage() {
  const properties = await prisma.property.findMany({
    orderBy: { createdAt: 'desc' },
    include: {
      _count: {
        select: { rooms: true }
      }
    }
  });

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-3xl font-serif font-bold tracking-tight text-foreground">Properti Terdaftar</h2>
          <p className="text-muted-foreground mt-1">Kelola portofolio properti Anda, dari Kost, Homestay hingga Villa.</p>
        </div>
        <Link href="/admin/properties/new" className={cn("inline-flex items-center justify-center rounded-lg text-sm font-medium transition-colors h-9 px-4 py-2", "bg-primary text-primary-foreground hover:bg-primary/90 flex gap-2")}>
          <CopyPlus className="w-4 h-4" /> Properti Baru
        </Link>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6 mt-8">
        {properties.map((property) => (
          <Card key={property.id} className="border-border/50 shadow-sm hover:shadow-md transition-shadow flex flex-col overflow-hidden">
            <div className="h-40 bg-muted/30 relative">
              {property.heroImage ? (
                /* eslint-disable-next-line @next/next/no-img-element */
                <img src={property.heroImage} alt={property.name} className="w-full h-full object-cover" />
              ) : (
                <div className="w-full h-full flex flex-col justify-center items-center text-muted-foreground bg-primary/5">
                  <span className="text-4xl mb-2 flex items-center justify-center">🏫</span>
                </div>
              )}
              
              <div className="absolute top-3 right-3 flex gap-2">
                <Badge className={property.isActive ? "bg-emerald-500 hover:bg-emerald-600 text-white shadow-sm border-0" : "bg-slate-500 hover:bg-slate-600 text-white shadow-sm border-0"}>
                  {property.isActive ? "Aktif" : "Nonaktif"}
                </Badge>
              </div>
              <div className="absolute top-3 left-3 flex gap-2">
                <Badge variant="secondary" className="bg-white/95 text-foreground shadow-sm">
                  {property.type}
                </Badge>
              </div>
            </div>

            <CardContent className="p-5 flex flex-col flex-1">
              <h3 className="font-serif font-bold text-xl text-foreground mb-1 line-clamp-1">{property.name}</h3>
              
              <div className="space-y-2 mt-3 mb-6 flex-1">
                <p className="text-sm text-muted-foreground flex items-start gap-2 h-10">
                  <MapPin className="w-4 h-4 shrink-0 mt-0.5 text-primary/70" /> 
                  <span className="line-clamp-2">{property.address || property.city}</span>
                </p>
                <div className="flex items-center gap-4 text-sm text-muted-foreground font-medium pt-3 border-t mt-3">
                  <p className="flex items-center gap-1.5 bg-muted/50 px-2 py-1.5 rounded-md">
                    <BedDouble className="w-4 h-4 text-blue-500" /> 
                    {property._count.rooms} Kamar
                  </p>
                  <p className="flex items-center gap-1 bg-muted/50 px-2 py-1.5 rounded-md">
                    <span className="text-amber-500 text-base leading-none">★</span>
                    4.9
                  </p>
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-3 mt-4">
                <Link href={`/properties/${property.slug}`} target="_blank" className={cn("inline-flex items-center justify-center rounded-lg text-sm font-medium transition-colors border border-input bg-background hover:bg-accent hover:text-accent-foreground", "w-full flex gap-2 h-9")}>
                  <Eye className="w-4 h-4" /> Pratinjau
                </Link>
                <Link href={`/admin/properties/${property.id}/edit`} className={cn("inline-flex items-center justify-center rounded-lg text-sm font-medium transition-colors", "w-full flex gap-2 h-9 bg-primary/10 text-primary hover:bg-primary/20 hover:text-primary border-none shadow-none")}>
                  <Edit className="w-4 h-4" /> Edit Detail
                </Link>
              </div>
              
              <div className="mt-4 pt-3 border-t">
                 <PropertyActions propertyId={property.id} isActive={property.isActive} />
              </div>
            </CardContent>
          </Card>
        ))}

        {properties.length === 0 && (
          <div className="col-span-full py-24 text-center text-muted-foreground flex flex-col items-center bg-white rounded-xl border border-dashed">
            <span className="text-4xl mb-4">🏠</span>
            <p className="text-lg">Belum ada portofolio properti.</p>
            <Link href="/admin/properties/new" className={cn("inline-flex items-center justify-center rounded-lg text-sm font-medium transition-colors h-9 px-4 py-2", "text-primary underline-offset-4 hover:underline mt-2 bg-transparent")}>
              Buat properti pertama Anda
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}
