import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import { auth } from "@/lib/auth"; // Make sure to use existing auth import

const prisma = new PrismaClient();

export async function POST(req: Request) {
    try {
        const session = await auth();
        if (!session || !session.user) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const body = await req.json();
        const {
            guestName,
            guestPhone,
            propertyId,
            roomId,
            checkIn,
            checkOut,
            totalPrice,
            status,
            notes
        } = body;

        if (!guestName || !propertyId || !roomId || !checkIn || !checkOut || totalPrice === undefined) {
            return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
        }

        // 1. Create Booking
        const booking = await prisma.booking.create({
            data: {
                guestName,
                guestPhone,
                propertyId,
                roomId,
                checkIn: new Date(checkIn),
                checkOut: new Date(checkOut),
                totalPrice: parseFloat(totalPrice),
                status: status || "CONFIRMED",
                notes,
                createdById: session.user.id || undefined,
            }
        });

        // 2. Generate RoomAvailability records if status is active
        if (["CONFIRMED", "CHECKED_IN"].includes(booking.status)) {
            const dates = [];
            let currentDate = new Date(checkIn);
            const endDate = new Date(checkOut);

            while (currentDate < endDate) {
                dates.push(new Date(currentDate));
                currentDate.setDate(currentDate.getDate() + 1);
            }

            if (dates.length > 0) {
                // Find existing to avoid conflict, or simply use createMany with skipDuplicates (not available for some Dbs, but ok for PG)
                // or upsert loop.
                for (const date of dates) {
                    await prisma.roomAvailability.upsert({
                        where: {
                            roomId_date: {
                                roomId,
                                date
                            }
                        },
                        update: {
                            status: "BOOKED",
                            bookingId: booking.id,
                            updatedById: session.user.id as string
                        },
                        create: {
                            roomId,
                            date,
                            status: "BOOKED",
                            bookingId: booking.id,
                            updatedById: session.user.id as string
                        }
                    });
                }
            }
        }

        return NextResponse.json({ success: true, data: booking });

    } catch (error: any) {
        console.error("CREATE BOOKING ERROR", error);
        return NextResponse.json({ error: "Gagal membuat booking" }, { status: 500 });
    }
}
