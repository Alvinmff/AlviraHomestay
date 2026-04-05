import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(
  request: Request,
  { params }: { params: { roomSlug: string } }
) {
  try {
    const roomSlug = params.roomSlug;

    if (!roomSlug) {
      return NextResponse.json({ error: "Missing roomSlug" }, { status: 400 });
    }

    const room = await prisma.room.findUnique({
      where: {
        slug: roomSlug,
      },
      include: {
        property: true,
      }
    });

    if (!room || !room.isActive || !room.isShown) {
      return NextResponse.json({ error: "Room not found" }, { status: 404 });
    }

    // With PostgreSQL native Json, Prisma returns real arrays directly
    return NextResponse.json(room);
  } catch (error) {
    console.error("[ROOM_GET]", error);
    return NextResponse.json({ error: "Failed to fetch room details" }, { status: 500 });
  } finally {
    await prisma.$disconnect();
  }
}
