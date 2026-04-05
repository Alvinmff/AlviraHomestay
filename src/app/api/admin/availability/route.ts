import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";

// GET: Fetch availability data (filtered by property or room)
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const propertyId = searchParams.get("propertyId");
    const roomId = searchParams.get("roomId");
    
    const whereClause: Record<string, unknown> = {};
    if (roomId) {
      whereClause.roomId = roomId;
    } else if (propertyId) {
      whereClause.room = { propertyId };
    }

    const availabilities = await prisma.roomAvailability.findMany({
      where: whereClause,
      include: {
        room: {
          select: { 
            roomName: true, 
            roomNumber: true, 
            property: { select: { name: true, slug: true } } 
          }
        }
      }
    });

    return NextResponse.json(availabilities);
  } catch {
    return NextResponse.json({ error: "Failed to fetch availability data" }, { status: 500 });
  } finally {
    await prisma.$disconnect();
  }
}

// POST: Bulk update or single update availability status
export async function POST(request: Request) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const userId = session.user.id;
    const body = await request.json();
    const { roomId, dates, status, notes } = body;

    if (!roomId || !dates || !Array.isArray(dates) || !status) {
      return NextResponse.json({ error: "Invalid payload" }, { status: 400 });
    }

    // Process dates and upsert records
    const operations = dates.map((dateStr: string) => {
      const date = new Date(dateStr);
      // Zero out time
      date.setUTCHours(0, 0, 0, 0);

      return prisma.roomAvailability.upsert({
        where: {
          roomId_date: {
            roomId: roomId,
            date: date,
          }
        },
        update: {
          status,
          notes: notes || null,
          updatedById: userId,
        },
        create: {
          roomId,
          date,
          status,
          notes: notes || null,
          updatedById: userId,
        }
      });
    });

    await prisma.$transaction(operations);

    return NextResponse.json({ success: true, message: `Updated ${dates.length} dates` });
  } catch (error) {
    console.error("[ADMIN_AVAILABILITY_POST]", error);
    return NextResponse.json({ error: "Failed to update availability" }, { status: 500 });
  } finally {
    await prisma.$disconnect();
  }
}
