import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";

export async function DELETE(req: Request, { params }: { params: { id: string } }) {
  try {
    const session = await auth();
    if (!session || !session.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const bookingId = params.id;

    // 1. Delete associated RoomAvailability records first to avoid foreign key issues
    // or just let Prisma handle it if configured, but here it's safer to do manually
    // because RoomAvailability references Booking.
    await prisma.roomAvailability.deleteMany({
      where: { bookingId: bookingId }
    });

    // 2. Delete the Booking
    await prisma.booking.delete({
      where: { id: bookingId }
    });

    return NextResponse.json({ success: true, message: "Booking deleted successfully" });
  } catch (error: unknown) {
    console.error("DELETE BOOKING ERROR", error);
    return NextResponse.json({ error: (error as Error).message }, { status: 500 });
  }
}
