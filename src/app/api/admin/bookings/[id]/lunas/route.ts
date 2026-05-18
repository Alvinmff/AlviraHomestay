import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function PATCH(req: Request, { params }: { params: { id: string } }) {
  try {
    const booking = await prisma.booking.findUnique({
      where: { id: params.id }
    });

    if (!booking) {
      return NextResponse.json({ error: "Booking not found" }, { status: 404 });
    }

    if (booking.groupId) {
      const groupBookings = await prisma.booking.findMany({
        where: { groupId: booking.groupId }
      });
      
      for (const b of groupBookings) {
        await prisma.booking.update({
          where: { id: b.id },
          data: {
            dpAmount: b.totalPrice,
            paymentStatus: "PAID"
          }
        });
      }
    } else {
      await prisma.booking.update({
        where: { id: booking.id },
        data: {
          dpAmount: booking.totalPrice,
          paymentStatus: "PAID"
        }
      });
    }

    return NextResponse.json({ success: true });
  } catch (error: unknown) {
    return NextResponse.json({ error: (error as Error).message }, { status: 500 });
  }
}
