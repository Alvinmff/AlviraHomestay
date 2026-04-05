import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { format, startOfYear, endOfYear, eachMonthOfInterval, getDaysInMonth, startOfMonth, addDays } from "date-fns";
import { id } from "date-fns/locale";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const roomId = searchParams.get("roomId");
    const yearParam = searchParams.get("year");

    if (!roomId) {
      return NextResponse.json({ error: "roomId is required" }, { status: 400 });
    }

    const currentYear = new Date().getFullYear();
    const year = yearParam ? parseInt(yearParam) : currentYear;

    if (isNaN(year) || year < 2020 || year > 2100) {
      return NextResponse.json({ error: "Invalid year parameter" }, { status: 400 });
    }

    // Step 1: Define date boundaries
    const startDate = new Date(year, 0, 1);
    const endDate = new Date(year, 11, 31, 23, 59, 59);

    // Step 2: Fetch all customized availabilities from DB for that year
    const availabilities = await prisma.roomAvailability.findMany({
      where: {
        roomId,
        date: {
          gte: startDate,
          lte: endDate,
        },
      },
      include: {
        booking: {
          select: {
            guestName: true,
          }
        }
      }
    });

    // Hash map for O(1) lookups
    const availabilityMap = new Map();
    availabilities.forEach((avail) => {
      const dateKey = format(avail.date, 'yyyy-MM-dd');
      availabilityMap.set(dateKey, {
        status: avail.status.toLowerCase(),
        bookingId: avail.bookingId,
        guestName: avail.booking?.guestName,
        price: "price" in avail ? (avail as Record<string, unknown>).price : undefined, // fallback if price was missing from schema but present in db
        notes: avail.notes
      });
    });

    // Step 3: Generate the exhaustive 365-day (or 366) matrix
    const monthsInterval = eachMonthOfInterval({
      start: startOfYear(startDate),
      end: endOfYear(startDate)
    });

    const yearlyMatrix = monthsInterval.map(monthDate => {
      const monthNum = monthDate.getMonth(); // 0-11
      const totalDays = getDaysInMonth(monthDate);
      const monthStart = startOfMonth(monthDate);

      const days = [];
      for (let i = 0; i < totalDays; i++) {
        const currentDate = addDays(monthStart, i);
        const dateKey = format(currentDate, 'yyyy-MM-dd');
        
        // Lookup DB status or fallback to standard AVAILABLE
        const dbStatus = availabilityMap.get(dateKey);
        
        days.push({
          date: dateKey,
          status: dbStatus?.status || "available",
          bookingId: dbStatus?.bookingId || null,
          guestName: dbStatus?.guestName || null,
          notes: dbStatus?.notes || null
        });
      }

      return {
        month: monthNum + 1,
        name: format(monthDate, 'LLLL', { locale: id }),
        days,
      };
    });

    return NextResponse.json({
      year,
      roomId,
      months: yearlyMatrix
    }, {
      headers: {
        // Cache this expensive payload for 5 minutes globally and refresh in background
        'Cache-Control': 'public, s-maxage=300, stale-while-revalidate=600',
      }
    });

  } catch (error) {
    console.error("Yearly Availability Error:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
