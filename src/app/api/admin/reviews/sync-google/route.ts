import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { fetchGoogleReviews } from "@/lib/google-reviews";

export async function POST() {
  try {
    const googleReviews = await fetchGoogleReviews();
    let syncedCount = 0;
    
    // We need to map Google locations (strings) to actual Property IDs
    // But for now, we'll just save them without property links if we can't map them quickly,
    // or just rely on googlePlaceId.
    const properties = await prisma.property.findMany({ select: { id: true, city: true } });
    
    for (const review of googleReviews) {
      if (review.id.startsWith("mock-")) continue; // Skip mock data
      
      const isVisible = review.rating >= 4; // User requested: auto-hide if < 4
      const propDb = properties.find(p => p.city.toLowerCase() === review.location.toLowerCase());

      const existing = await prisma.review.findUnique({
        where: { googleReviewId: review.id }
      });

      if (!existing) {
        await prisma.review.create({
          data: {
            source: "GOOGLE",
            isVisible, // Apply auto-hide rule specifically on creation
            authorName: review.authorName,
            authorPhoto: review.authorPhoto,
            rating: review.rating,
            text: review.text,
            relativeTime: review.relativeTime,
            reviewDate: review.reviewDate,
            googleReviewId: review.id,
            googlePlaceId: review.placeId,
            propertyId: propDb?.id || null, // Map to property if possible
          }
        });
        syncedCount++;
      } else {
        // If it already exists, we might want to update it, but let's just leave it 
        // to preserve any admin visibility toggles they might have done.
      }
    }

    return NextResponse.json({
      syncedCount,
      message: `Berhasil sinkronisasi ${syncedCount} ulasan baru dari Google`
    });
  } catch (error: any) {
    console.error("Sync Google Reviews error:", error);
    return NextResponse.json({ error: "Gagal sinkronisasi dengan Google Places API: " + error.message }, { status: 500 });
  }
}
