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

    // Jika booking punya groupId, ambil semua booking dalam grup
    let allGroupBookings = [booking];
    if (booking.groupId) {
        allGroupBookings = await prisma.booking.findMany({
            where: { groupId: booking.groupId },
            orderBy: { createdAt: 'asc' },
        });
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

    // Aggregate data dari semua booking dalam grup
    const totalGroupPrice = allGroupBookings.reduce((sum, b) => sum + b.totalPrice, 0);
    const allRoomIds = allGroupBookings.map(b => b.roomId);

    const initialData = {
        id: booking.id,
        guestName: booking.guestName,
        guestPhone: booking.guestPhone,
        propertyId: booking.propertyId,
        roomIds: allRoomIds,
        roomId: booking.roomId,
        checkIn: booking.checkIn,
        checkOut: booking.checkOut,
        totalPrice: totalGroupPrice,
        notes: booking.notes,
        dpAmount: booking.dpAmount,
        guestCount: booking.guestCount,
        groupId: booking.groupId,
        allBookingIds: allGroupBookings.map(b => b.id),
        roomDetails: allGroupBookings.map(b => ({
            roomId: b.roomId,
            checkIn: b.checkIn,
            checkOut: b.checkOut,
        })),
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
