import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const propertyId = searchParams.get("propertyId");
    const propertySlug = searchParams.get("propertySlug");

    const whereClause: Record<string, unknown> = { isActive: true, isShown: true };

    if (propertyId) {
      whereClause.propertyId = propertyId;
    } else if (propertySlug) {
      whereClause.property = { slug: propertySlug };
    }

    const rooms = await prisma.room.findMany({
      where: whereClause,
      include: {
        property: {
          select: {
            name: true,
            city: true,
            slug: true,
          }
        }
      },
      orderBy: {
        roomNumber: 'asc'
      }
    });

    // Parse the JSON string fields back to objects for the client
    const serializedRooms = rooms.map(room => ({
      ...room,
      amenities: JSON.parse(room.amenities),
      photos: JSON.parse(room.photos)
    }));

    return NextResponse.json(serializedRooms);
  } catch (error) {
    console.error("[ROOMS_GET]", error);
    return NextResponse.json({ error: "Failed to fetch rooms" }, { status: 500 });
  } finally {
    await prisma.$disconnect();
  }
}
