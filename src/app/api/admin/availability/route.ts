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
      console.warn("[ADMIN_AVAILABILITY_POST] No session or user ID found");
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const userId = session.user.id;
    console.log(`[ADMIN_AVAILABILITY_POST] UserID: ${userId}`);
    
    // Verify user exists in Admin table to avoid P2003
    const admin = await prisma.admin.findUnique({ where: { id: userId } });
    if (!admin) {
      console.error(`[ADMIN_AVAILABILITY_POST] Admin user ${userId} not found in database. Stale session?`);
      return NextResponse.json({ 
        error: "Sesi Anda tidak valid atau admin tidak ditemukan. Silakan logout dan login kembali.",
        staleSession: true 
      }, { status: 403 });
    }

    const body = await request.json();
    const { roomId, dates, status, notes } = body;

    console.log(`[ADMIN_AVAILABILITY_POST] RoomID: ${roomId}, Dates count: ${dates?.length}, Status: ${status}`);

    if (!roomId || !dates || !Array.isArray(dates) || !status) {
      return NextResponse.json({ error: "Payload tidak valid" }, { status: 400 });
    }

    // Verify room exists
    const room = await prisma.room.findUnique({ where: { id: roomId } });
    if (!room) {
      return NextResponse.json({ error: "Ruangan tidak ditemukan" }, { status: 404 });
    }

    // Process dates and upsert records
    const operations = dates.map((dateStr: string) => {
      const d = new Date(dateStr);
      // Use noon UTC to prevent timezone shifts
      const date = new Date(Date.UTC(d.getFullYear(), d.getMonth(), d.getDate(), 12, 0, 0));

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

    return NextResponse.json({ success: true, message: `Berhasil memperbarui ${dates.length} tanggal` });
  } catch (error: any) {
    console.error("[ADMIN_AVAILABILITY_POST] Error:", error);
    
    if (error.code === 'P2003') {
      return NextResponse.json({ 
        error: "Gagal menyimpan: Terjadi kendala relasi data (Foreign Key). Silakan coba logout dan login kembali.",
        details: error.meta
      }, { status: 500 });
    }

    return NextResponse.json({ error: "Gagal memperbarui ketersediaan" }, { status: 500 });
  } finally {
    await prisma.$disconnect();
  }
}
