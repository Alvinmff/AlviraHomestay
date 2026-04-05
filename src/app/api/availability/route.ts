import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

// GET: Public endpoint to fetch availability data for a specific room
// e.g. /api/availability?roomId=xyz
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const roomId = searchParams.get("roomId");
    
    if (!roomId) {
      return NextResponse.json({ error: "Missing roomId parameter" }, { status: 400 });
    }

    const availabilities = await prisma.roomAvailability.findMany({
      where: { roomId },
      select: {
        date: true,
        status: true,
      },
      orderBy: {
        date: 'asc'
      }
    });

    return NextResponse.json(availabilities);
  } catch (error) {
    console.error("[AVAILABILITY_GET]", error);
    return NextResponse.json({ error: "Failed to fetch availability data" }, { status: 500 });
  } finally {
    await prisma.$disconnect();
  }
}
