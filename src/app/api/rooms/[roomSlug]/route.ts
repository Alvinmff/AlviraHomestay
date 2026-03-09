import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

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

    // Parse specific JSON string fields back to real objects
    const serializedRoom = {
      ...room,
      amenities: JSON.parse(room.amenities),
      photos: JSON.parse(room.photos),
      property: {
        ...room.property,
        commonFacilities: JSON.parse(room.property.commonFacilities),
        gallery: room.property.gallery ? JSON.parse(room.property.gallery) : []
      }
    };

    return NextResponse.json(serializedRoom);
  } catch (error) {
    console.error("[ROOM_GET]", error);
    return NextResponse.json({ error: "Failed to fetch room details" }, { status: 500 });
  } finally {
    await prisma.$disconnect();
  }
}
