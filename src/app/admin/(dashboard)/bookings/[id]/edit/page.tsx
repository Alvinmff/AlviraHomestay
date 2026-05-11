import { prisma } from "@/lib/prisma";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import { ManualBookingForm } from "@/components/admin/manual-booking-form";
import { notFound } from "next/navigation";

export default async function EditBookingPage({ params }: { params: { id: string } }) {
    const booking = await prisma.booking.findUnique({
        where: { id: params.id },
    });

    if (!booking) {
        notFound();
    }

    const properties = await prisma.property.findMany({
        where: { isActive: true },
        include: {
            rooms: {
                where: { isActive: true },
                select: { id: true, roomName: true, roomNumber: true, basePrice: true }
            }
        }
    });

    const initialData = {
        id: booking.id,
        guestName: booking.guestName,
        guestPhone: booking.guestPhone,
        propertyId: booking.propertyId,
        roomId: booking.roomId,
        checkIn: booking.checkIn,
        checkOut: booking.checkOut,
        totalPrice: booking.totalPrice,
        notes: booking.notes,
    };

    return (
        <div className="space-y-6 max-w-4xl mx-auto">
            <div className="flex items-center gap-4">
                <Link href="/admin/bookings" className="text-muted-foreground hover:text-foreground">
                    <ArrowLeft className="w-5 h-5" />
                </Link>
                <div>
                    <h2 className="text-3xl font-serif font-bold tracking-tight text-foreground">Edit Data Booking</h2>
                    <p className="text-muted-foreground mt-1">Perbarui detail reservasi tamu.</p>
                </div>
            </div>

            <div className="bg-card border rounded-2xl p-6 md:p-8 shadow-sm">
                <ManualBookingForm properties={properties} initialData={initialData} />
            </div>
        </div>
    );
}
