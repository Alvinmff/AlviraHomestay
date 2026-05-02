import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const search = searchParams.get("search");
    const source = searchParams.get("source");
    const isVisible = searchParams.get("isVisible");
    
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const where: any = {};

    if (search) {
      where.OR = [
        { authorName: { contains: search, mode: "insensitive" } },
        { text: { contains: search, mode: "insensitive" } },
      ];
    }
    
    if (source && source !== "ALL") {
      where.source = source;
    }
    
    if (isVisible && isVisible !== "ALL") {
      where.isVisible = isVisible === "true";
    }

    const reviews = await prisma.review.findMany({
      where,
      orderBy: {
        reviewDate: 'desc',
      },
      include: {
        property: {
          select: { name: true }
        }
      }
    });

    return NextResponse.json(reviews);
  } catch (error) {
    console.error("GET /api/admin/reviews Error:", error);
    return NextResponse.json({ error: "Gagal mengambil data review" }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { authorName, authorPhoto, rating, text, propertyId, roomId, reviewDate, isVisible = true } = body;

    // Validasi basic
    if (!authorName || !rating || !text) {
      return NextResponse.json({ error: "Nama, rating, dan isi review wajib diisi" }, { status: 400 });
    }

    const newReview = await prisma.review.create({
      data: {
        source: "MANUAL",
        isVisible,
        authorName,
        authorPhoto: authorPhoto || null,
        rating: Number(rating),
        text,
        reviewDate: reviewDate ? new Date(reviewDate) : new Date(),
        propertyId: propertyId || null,
        roomId: roomId || null,
      }
    });

    return NextResponse.json(newReview, { status: 201 });
  } catch (error: any) {
    console.error("Create review error:", error);
    return NextResponse.json({ error: "Gagal membuat review manual: " + error.message }, { status: 500 });
  }
}
