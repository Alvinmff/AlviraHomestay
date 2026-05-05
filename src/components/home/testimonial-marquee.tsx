"use client";

import { Star, MapPin, CheckCircle } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { formatDistanceToNow, differenceInDays } from "date-fns";
import useEmblaCarousel from "embla-carousel-react";
import AutoScroll from "embla-carousel-auto-scroll";

function getRelativeTimeString(date: string | Date) {
  if (!date) return "Baru saja";
  const d = typeof date === "string" ? new Date(date) : date;
  
  // Custom logic to match Indonesian request precisely
  const days = differenceInDays(new Date(), d);
  
  if (days === 0) return "Hari ini";
  if (days < 7) return `${days} hari yang lalu`;
  if (days < 30) {
    const weeks = Math.floor(days / 7);
    return `${weeks} minggu yang lalu`;
  }
  if (days < 365) {
    const months = Math.floor(days / 30);
    return `${months} bulan yang lalu`;
  }
  
  const years = Math.floor(days / 365);
  return `${years} tahun yang lalu`;
}

export function TestimonialMarquee({ reviews }: { reviews: any[] }) {
  const [emblaRef1] = useEmblaCarousel(
    { loop: true, dragFree: true },
    [AutoScroll({ playOnInit: true, speed: 1, stopOnInteraction: false, stopOnMouseEnter: true, direction: "forward" })]
  );

  const [emblaRef2] = useEmblaCarousel(
    { loop: true, dragFree: true },
    [AutoScroll({ playOnInit: true, speed: 1, stopOnInteraction: false, stopOnMouseEnter: true, direction: "backward" })]
  );

  if (reviews.length === 0) return null;

  // Split reviews into two rows
  const mid = Math.ceil(reviews.length / 2);
  const row1 = reviews.slice(0, mid);
  // If we don't have enough reviews for row2, duplicate row1, but reversed, to create a flowing effect.
  const row2 = reviews.length > 2 ? reviews.slice(mid) : [...row1].reverse();

  // Function to render a single review card
  const ReviewCard = ({ review }: { review: any }) => (
    <div className="flex-[0_0_auto] pl-6 w-[350px] md:w-[400px]">
      <div className="bg-card rounded-2xl p-6 shadow-sm border border-border/50 hover:shadow-lg transition-shadow relative flex flex-col h-full cursor-grab active:cursor-grabbing select-none">
        <div className="flex items-center gap-1 mb-4">
          {[...Array(5)].map((_, i) => (
            <Star 
              key={i} 
              className={`w-4 h-4 ${i < review.rating ? "text-amber-500 fill-amber-500" : "text-muted opacity-50 fill-muted"}`} 
            />
          ))}
        </div>
        <p className="text-muted-foreground text-[15px] leading-relaxed mb-8 flex-1 italic pointer-events-none">
          &quot;{review.text}&quot;
        </p>
        <div className="mt-auto flex items-center justify-between pt-4 border-t border-border/50 pointer-events-none">
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
              <div className="flex items-center gap-1">
                <p className="font-semibold text-sm text-foreground line-clamp-1">{review.authorName}</p>
                {review.source === "GOOGLE" && (
                  <CheckCircle className="w-3 h-3 text-blue-500" />
                )}
              </div>
              <p className="text-xs text-muted-foreground flex items-center gap-1 line-clamp-1">
                <MapPin className="w-3 h-3 min-w-[12px]" /> {review.property?.city || "Alvira Homestay"}
              </p>
            </div>
          </div>
          <div className="flex flex-col items-end">
            <Badge variant={review.source === "GOOGLE" ? "outline" : "secondary"} className="text-[9px] px-1.5 py-0">
              {review.source === "GOOGLE" ? "Google Review" : "Guest Review"}
            </Badge>
            <span className="text-[10px] text-muted-foreground shrink-0 mt-1">{getRelativeTimeString(review.reviewDate)}</span>
          </div>
        </div>
      </div>
    </div>
  );

  // We need to ensure we have enough slides for Embla to loop smoothly.
  // Embla needs at least enough slides to fill the viewport width.
  const row1Loops = [...row1, ...row1, ...row1, ...row1];
  const row2Loops = [...row2, ...row2, ...row2, ...row2];

  return (
    <div className="relative flex flex-col gap-6 overflow-hidden w-full py-4 px-0">
      {/* Edge Gradients for smooth fade */}
      <div className="pointer-events-none absolute inset-y-0 left-0 w-[10%] bg-gradient-to-r from-muted/30 via-background/80 to-transparent z-10" />
      <div className="pointer-events-none absolute inset-y-0 right-0 w-[10%] bg-gradient-to-l from-muted/30 via-background/80 to-transparent z-10" />

      {/* Row 1 (Forward) */}
      <div className="overflow-hidden pb-2" ref={emblaRef1}>
        <div className="flex -ml-6">
          {row1Loops.map((review, i) => (
            <ReviewCard key={`r1-${review.id}-${i}`} review={review} />
          ))}
        </div>
      </div>

      {/* Row 2 (Backward) */}
      <div className="overflow-hidden pt-2" ref={emblaRef2}>
        <div className="flex -ml-6">
          {row2Loops.map((review, i) => (
             <ReviewCard key={`r2-${review.id}-${i}`} review={review} />
          ))}
        </div>
      </div>
    </div>
  );
}
