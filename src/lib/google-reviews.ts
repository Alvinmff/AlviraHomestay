

export interface GoogleReview {
  id: string;
  placeId: string;
  authorName: string;
  authorPhoto: string | null;
  rating: number;
  text: string;
  relativeTime: string;
  reviewDate: Date;
  location: string;
}

// 6 hours in seconds
export const REVALIDATE_TIME = 21600;

export async function fetchGoogleReviews(): Promise<GoogleReview[]> {
  const apiKey = process.env.GOOGLE_PLACES_API_KEY;
  const placeIds = [
    { id: process.env.PLACE_ID_SIDOARJO_1, location: "Sidoarjo" },
    { id: process.env.PLACE_ID_SIDOARJO_2, location: "Sidoarjo" }
  ].filter(p => p.id !== undefined && p.id !== null);

  if (!apiKey || placeIds.length === 0) {
    console.warn("Google Places API Key or Place IDs are missing. Using fallback data.");
    return getFallbackReviews();
  }

  try {
    const allReviews: GoogleReview[] = [];

    for (const place of placeIds) {
      // Fetch details for the place
       const res = await fetch(
        `https://maps.googleapis.com/maps/api/place/details/json?place_id=${place.id}&fields=reviews&key=${apiKey}&language=id`,
        { next: { revalidate: REVALIDATE_TIME } }
      );

      if (!res.ok) {
        throw new Error(`Failed to fetch reviews for place ${place.id}`);
      }

      const data = await res.json();
      
      if (data.status === "OK" && data.result && data.result.reviews) {
        const mappedReviews = data.result.reviews.map((r: Record<string, unknown>) => ({
          id: `${place.id}-${r.time}`,
          placeId: place.id as string,
          authorName: r.author_name as string,
          authorPhoto: (r.profile_photo_url as string) || null,
          rating: r.rating as number,
          text: r.text as string,
          relativeTime: r.relative_time_description as string,
          reviewDate: new Date((r.time as number) * 1000),
          location: place.location,
        }));
        
        allReviews.push(...mappedReviews);
      } else if (data.status === "ZERO_RESULTS" || data.status === "NOT_FOUND") {
        console.warn(`No reviews found for place ${place.id}`);
      } else if (data.status === "OVER_QUERY_LIMIT" || data.status === "REQUEST_DENIED") {
         console.warn(`Google API Error: ${data.status} - ${data.error_message || ''}. Falling back to mock data.`);
         return getFallbackReviews(); // Return fallback immediately if quota reached
      } else {
         console.warn(`Google API Warning: status ${data.status}`);
      }
    }

    // Sort all reviews strictly by date descending
    allReviews.sort((a, b) => b.reviewDate.getTime() - a.reviewDate.getTime());
    
    // Fall back to dummy if empty even after successful fetch
    if (allReviews.length === 0) {
      return getFallbackReviews();
    }

    return allReviews;

  } catch (error) {
    console.error("Error fetching Google Reviews:", error);
    return getFallbackReviews();
  }
}

// Fallback logic returns high quality mock data ensuring UI never breaks
function getFallbackReviews(): GoogleReview[] {
  return [
    {
      id: "mock-1",
      placeId: "mock-sidoarjo-1",
      authorName: "Budi Santoso",
      authorPhoto: null,
      rating: 5,
      text: "Tempatnya sangat bersih dan nyaman. Dekat dengan pusat kota, pelayanannya luar biasa menyenangkan! Sangat merekomendasikan untuk staycation keluarga.",
      relativeTime: "1 minggu lalu",
      reviewDate: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
      location: "Sidoarjo"
    },
    {
      id: "mock-2",
      placeId: "mock-sidoarjo-2",
      authorName: "Anisa Rahmawati",
      authorPhoto: null,
      rating: 5,
      text: "Fasilitas lengkap, WiFi kencang, dan dapurnya berguna banget buat bikin sarapan pagi-pagi. Penjaganya juga sangat ramah.",
      relativeTime: "2 minggu lalu",
      reviewDate: new Date(Date.now() - 14 * 24 * 60 * 60 * 1000),
      location: "Sidoarjo"
    },
    {
      id: "mock-3",
      placeId: "mock-batu-1",
      authorName: "Kevin Wijaya",
      authorPhoto: null,
      rating: 4,
      text: "Villanya cukup besar untuk rombongan kantor. Udaranya sejuk dan pemandangannya ke gunung sangat bagus dari balkon lantai 2.",
      relativeTime: "1 bulan lalu",
      reviewDate: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000),
      location: "Batu"
    },
    {
      id: "mock-4",
      placeId: "mock-surabaya-1",
      authorName: "Sari Indah",
      authorPhoto: null,
      rating: 5,
      text: "Kost terbaik yang pernah saya sewa selama kuliah di Surabaya. Bersih, aman, dan akses kemana-mana gampang. AC dingin pol!",
      relativeTime: "2 bulan lalu",
      reviewDate: new Date(Date.now() - 60 * 24 * 60 * 60 * 1000),
      location: "Surabaya"
    }
  ];
}
