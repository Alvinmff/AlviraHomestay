"use server";

import { prisma } from "@/lib/prisma";
import { eachDayOfInterval, isBefore, isSameDay } from "date-fns";
import { auth } from "@/lib/auth";
import { revalidatePath } from "next/cache";

export async function createManualBookingWithAvailability(data: {
  guestName: string;
  guestPhone?: string | null;
  checkIn: Date;
  checkOut: Date;
  totalPrice: number;
  roomId: string;
  propertyId: string;
  notes?: string | null;
}) {
  const session = await auth();
  if (!session || !session.user) {
    throw new Error("Unauthorized");
  }

  const userId = session.user.id as string;

  // Validasi dasar
  if (isBefore(data.checkOut, data.checkIn) && !isSameDay(data.checkOut, data.checkIn)) {
    throw new Error("Tanggal check-out tidak boleh lebih awal dari check-in");
  }

  // 1. Buat booking utama
  const booking = await prisma.booking.create({
    data: {
      guestName: data.guestName,
      guestPhone: data.guestPhone,
      checkIn: data.checkIn,
      checkOut: data.checkOut,
      totalPrice: data.totalPrice,
      roomId: data.roomId,
      propertyId: data.propertyId,
      status: "CONFIRMED",
      notes: data.notes,
      createdById: userId,
    },
    include: {
      room: {
        include: {
          property: true
        }
      }
    }
  });

  // 2. Generate semua tanggal menginap (checkIn inclusive, checkOut exclusive)
  const dates = eachDayOfInterval({
    start: data.checkIn,
    end: data.checkOut,
  }).filter(d => !isSameDay(d, data.checkOut));

  // 3. Upsert record Availability untuk setiap tanggal
  if (dates.length > 0) {
    await prisma.$transaction(
      dates.map((date) =>
        prisma.roomAvailability.upsert({
          where: {
            roomId_date: {
              roomId: data.roomId,
              date: date,
            },
          },
          update: {
            status: "BOOKED",
            bookingId: booking.id,
            updatedById: userId,
          },
          create: {
            roomId: data.roomId,
            date: date,
            status: "BOOKED",
            bookingId: booking.id,
            updatedById: userId,
          },
        })
      )
    );
  }

  // 4. Penanganan Khusus: Villa Batu (L1, L2, Full)
  // Jika ini villa batu full, blokir juga L1 dan L2
  if (booking.room.roomNumber === "FULL" && booking.room.property.slug === "batu") {
    const childRooms = await prisma.room.findMany({
      where: {
        property: { slug: "batu" },
        roomNumber: { in: ["L1", "L2"] },
      },
    });

    for (const child of childRooms) {
      if (dates.length > 0) {
        await prisma.$transaction(
          dates.map((date) =>
            prisma.roomAvailability.upsert({
              where: { roomId_date: { roomId: child.id, date: date } },
              update: { status: "BOOKED", updatedById: userId, bookingId: booking.id },
              create: { roomId: child.id, date: date, status: "BOOKED", updatedById: userId, bookingId: booking.id },
            })
          )
        );
      }
    }
  }

  revalidatePath("/admin/bookings");
  return booking;
}
