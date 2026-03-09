import { NextResponse } from "next/server";
import { fetchGoogleReviews } from "@/lib/google-reviews";

export async function GET() {
  try {
    const reviews = await fetchGoogleReviews();
    return NextResponse.json(reviews, {
      headers: {
        'Cache-Control': 'public, s-maxage=21600, stale-while-revalidate=86400',
      },
    });
  } catch {
    return NextResponse.json({ error: "Failed to load reviews" }, { status: 500 });
  }
}
