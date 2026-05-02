import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const propertyId = searchParams.get("propertyId");
    const source = searchParams.get("source");
    const minRating = searchParams.get("minRating");
    
    const where: any = {
      isVisible: true,
    };

    if (propertyId) where.propertyId = propertyId;
    if (source && source !== "Semua" && source !== "ALL") {
      where.source = source === "MANUAL" ? "MANUAL" : "GOOGLE";
    }
    if (minRating) {
      where.rating = { gte: parseInt(minRating) };
    }

    const reviews = await prisma.review.findMany({
      where,
      orderBy: {
        reviewDate: 'desc',
      },
      include: {
        property: {
          select: {
            name: true,
            city: true,
          }
        }
      },
      take: 20, // Limit default
    });

    return NextResponse.json(reviews);
  } catch (error) {
    console.error("GET /api/reviews [PUBLIC] Error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
