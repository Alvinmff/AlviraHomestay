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
  dpAmount?: number;
  guestCount?: number;
  groupId?: string;
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
      dpAmount: data.dpAmount || 0,
      guestCount: data.guestCount || 1,
      groupId: data.groupId,
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

export async function updateBookingWithAvailability(id: string, data: {
  guestName: string;
  guestPhone?: string | null;
  checkIn: Date;
  checkOut: Date;
  totalPrice: number;
  roomId: string;
  propertyId: string;
  notes?: string | null;
  dpAmount?: number;
  guestCount?: number;
  groupId?: string;
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

  // 1. Hapus ketersediaan lama (termasuk blokir Villa Batu terkait bookingId ini)
  await prisma.roomAvailability.deleteMany({
    where: { bookingId: id }
  });

  // 2. Update booking utama
  const booking = await prisma.booking.update({
    where: { id },
    data: {
      guestName: data.guestName,
      guestPhone: data.guestPhone,
      checkIn: data.checkIn,
      checkOut: data.checkOut,
      totalPrice: data.totalPrice,
      roomId: data.roomId,
      propertyId: data.propertyId,
      notes: data.notes,
      dpAmount: data.dpAmount || 0,
      guestCount: data.guestCount || 1,
      groupId: data.groupId,
    },
    include: {
      room: {
        include: {
          property: true
        }
      }
    }
  });

  // 3. Generate ketersediaan baru
  const dates = eachDayOfInterval({
    start: data.checkIn,
    end: data.checkOut,
  }).filter(d => !isSameDay(d, data.checkOut));

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
  revalidatePath("/admin/availability");
  return booking;
}

// Update grouped booking: hapus semua booking lama dalam grup, buat ulang
export async function updateGroupedBooking(allBookingIds: string[], data: {
  guestName: string;
  guestPhone?: string | null;
  checkIn: Date;
  checkOut: Date;
  totalPrice: number;
  roomIds: string[];
  propertyId: string;
  notes?: string | null;
  dpAmount?: number;
  guestCount?: number;
  groupId?: string;
  roomDetails?: { roomId: string; checkIn: Date; checkOut: Date }[];
}) {
  const session = await auth();
  if (!session || !session.user) {
    throw new Error("Unauthorized");
  }

  const userId = session.user.id as string;

  if (isBefore(data.checkOut, data.checkIn) && !isSameDay(data.checkOut, data.checkIn)) {
    throw new Error("Tanggal check-out tidak boleh lebih awal dari check-in");
  }

  // 1. Hapus semua availability lama untuk semua booking dalam grup
  await prisma.roomAvailability.deleteMany({
    where: { bookingId: { in: allBookingIds } }
  });

  // 2. Hapus semua booking lama dalam grup
  await prisma.booking.deleteMany({
    where: { id: { in: allBookingIds } }
  });

  // 3. Buat ulang booking baru untuk setiap kamar
  const pricePerRoom = Math.round(data.totalPrice / (data.roomIds.length || 1));
  const gid = data.roomIds.length > 1
    ? (data.groupId || `grp_${Date.now().toString(36)}_${Math.random().toString(36).substring(2, 7)}`)
    : undefined;

  for (const roomId of data.roomIds) {
    const details = data.roomDetails?.find(d => d.roomId === roomId);
    const checkIn = details?.checkIn || data.checkIn;
    const checkOut = details?.checkOut || data.checkOut;

    const booking = await prisma.booking.create({
      data: {
        guestName: data.guestName,
        guestPhone: data.guestPhone,
        checkIn: checkIn,
        checkOut: checkOut,
        totalPrice: pricePerRoom,
        roomId: roomId,
        propertyId: data.propertyId,
        status: "CONFIRMED",
        notes: data.notes,
        dpAmount: data.dpAmount || 0,
        guestCount: data.guestCount || 1,
        groupId: gid,
        createdById: userId,
      },
      include: { room: { include: { property: true } } }
    });

    // Generate ketersediaan
    const dates = eachDayOfInterval({
      start: checkIn,
      end: checkOut,
    }).filter(d => !isSameDay(d, checkOut));

    if (dates.length > 0) {
      await prisma.$transaction(
        dates.map((date) =>
          prisma.roomAvailability.upsert({
            where: { roomId_date: { roomId, date } },
            update: { status: "BOOKED", bookingId: booking.id, updatedById: userId },
            create: { roomId, date, status: "BOOKED", bookingId: booking.id, updatedById: userId },
          })
        )
      );
    }

    // Villa Batu special handling
    if (booking.room.roomNumber === "FULL" && booking.room.property.slug === "batu") {
      const childRooms = await prisma.room.findMany({
        where: { property: { slug: "batu" }, roomNumber: { in: ["L1", "L2"] } },
      });
      for (const child of childRooms) {
        if (dates.length > 0) {
          await prisma.$transaction(
            dates.map((date) =>
              prisma.roomAvailability.upsert({
                where: { roomId_date: { roomId: child.id, date } },
                update: { status: "BOOKED", updatedById: userId, bookingId: booking.id },
                create: { roomId: child.id, date, status: "BOOKED", updatedById: userId, bookingId: booking.id },
              })
            )
          );
        }
      }
    }
  }

  revalidatePath("/admin/bookings");
  revalidatePath("/admin/availability");
}
