"use client";

import { GoogleReview } from "@/lib/google-reviews";
import { Star, MapPin } from "lucide-react";

export function TestimonialMarquee({ reviews }: { reviews: GoogleReview[] }) {
  if (reviews.length === 0) return null;

  // Split reviews into two rows
  const mid = Math.ceil(reviews.length / 2);
  const row1 = reviews.slice(0, mid);
  // If we don't have enough reviews for row2, duplicate row1, but reversed, to create a flowing effect.
  const row2 = reviews.length > 2 ? reviews.slice(mid) : [...row1].reverse();

  // Function to render a single review card
  const ReviewCard = ({ review }: { review: GoogleReview }) => (
    <div className="bg-white rounded-2xl p-6 shadow-sm border border-border/50 hover:shadow-lg transition-shadow relative flex flex-col h-full w-[350px] shrink-0 mx-3">
      <div className="flex items-center gap-1 mb-4">
        {[...Array(5)].map((_, i) => (
          <Star 
            key={i} 
            className={`w-4 h-4 ${i < review.rating ? "text-amber-500 fill-amber-500" : "text-muted opacity-50 fill-muted"}`} 
          />
        ))}
      </div>
      <p className="text-muted-foreground text-[15px] leading-relaxed mb-8 flex-1 italic">
        &quot;{review.text}&quot;
      </p>
      <div className="mt-auto flex items-center justify-between pt-4 border-t border-border/50">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center overflow-hidden shrink-0">
            {review.authorPhoto ? (
              /* eslint-disable-next-line @next/next/no-img-element */
              <img src={review.authorPhoto} alt={review.authorName} className="w-full h-full object-cover" />
            ) : (
              <span className="font-bold text-primary text-sm">{review.authorName.charAt(0)}</span>
            )}
          </div>
          <div>
            <p className="font-semibold text-sm text-foreground line-clamp-1">{review.authorName}</p>
            <p className="text-xs text-muted-foreground flex items-center gap-1 line-clamp-1">
              <MapPin className="w-3 h-3 min-w-[12px]" /> {review.location}
            </p>
          </div>
        </div>
        <span className="text-[10px] text-muted-foreground shrink-0">{review.relativeTime}</span>
      </div>
    </div>
  );

  return (
    <div className="relative flex flex-col gap-6 overflow-hidden w-full py-4 -mx-4 px-4">
      {/* Edge Gradients for smooth fade */}
      <div className="pointer-events-none absolute inset-y-0 left-0 w-[10%] bg-gradient-to-r from-muted/30 to-transparent z-10" />
      <div className="pointer-events-none absolute inset-y-0 right-0 w-[10%] bg-gradient-to-l from-muted/30 to-transparent z-10" />

      {/* Row 1 (Normal) - duplicate twice for seamless infinite effect since content translates 50% */}
      <div className="flex w-max animate-marquee hover:[animation-play-state:paused] pb-2">
        {[...row1, ...row1, ...row1, ...row1].map((review, i) => (
          <ReviewCard key={`r1-${review.id}-${i}`} review={review} />
        ))}
      </div>

      {/* Row 2 (Reverse) */}
      <div className="flex w-max animate-marquee-reverse hover:[animation-play-state:paused] pt-2">
        {[...row2, ...row2, ...row2, ...row2].map((review, i) => (
           <ReviewCard key={`r2-${review.id}-${i}`} review={review} />
        ))}
      </div>
    </div>
  );
}
