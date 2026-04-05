import { prisma } from "@/lib/prisma";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import { ManualBookingForm } from "@/components/admin/manual-booking-form";

export default async function NewBookingPage() {
    const properties = await prisma.property.findMany({
        where: { isActive: true },
        include: {
            rooms: {
                where: { isActive: true },
                select: { id: true, roomName: true, roomNumber: true, basePrice: true }
            }
        }
    });

    return (
        <div className="space-y-6 max-w-4xl mx-auto">
            <div className="flex items-center gap-4">
                <Link href="/admin/bookings" className="text-muted-foreground hover:text-foreground">
                    <ArrowLeft className="w-5 h-5" />
                </Link>
                <div>
                    <h2 className="text-3xl font-serif font-bold tracking-tight text-foreground">Entri Booking Manual</h2>
                    <p className="text-muted-foreground mt-1">Buat pesanan baru untuk tamu yang walk-in atau reservasi via WhatsApp.</p>
                </div>
            </div>

            <div className="bg-card border rounded-2xl p-6 md:p-8 shadow-sm">
                <ManualBookingForm properties={properties} />
            </div>
        </div>
    );
}
