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
  const [emblaRef1, emblaApi1] = useEmblaCarousel(
    { loop: true, dragFree: true },
    [AutoScroll({ playOnInit: true, speed: 1, stopOnInteraction: false, direction: "forward" })]
  );

  const [emblaRef2, emblaApi2] = useEmblaCarousel(
    { loop: true, dragFree: true },
    [AutoScroll({ playOnInit: true, speed: 1, stopOnInteraction: false, direction: "backward" })]
  );

  const onMouseEnter = (api: any) => () => {
    if (api?.plugins()?.autoScroll) {
      api.plugins().autoScroll.stop();
    }
  };

  const onMouseLeave = (api: any) => () => {
    if (api?.plugins()?.autoScroll) {
      api.plugins().autoScroll.play();
    }
  };

  if (reviews.length === 0) return null;

  // Split reviews into two rows
  const mid = Math.ceil(reviews.length / 2);
  const row1 = reviews.slice(0, mid);
  // If we don't have enough reviews for row2, duplicate row1, but reversed, to create a flowing effect.
  const row2 = reviews.length > 2 ? reviews.slice(mid) : [...row1].reverse();

  // Function to render a single review card
  const ReviewCard = ({ review }: { review: any }) => (
    <div className="flex-[0_0_auto] pl-4 md:pl-6 w-[280px] sm:w-[350px] md:w-[400px]">
      <div className="bg-card rounded-2xl p-5 md:p-6 shadow-sm border border-border/50 hover:shadow-lg transition-shadow relative flex flex-col h-full cursor-grab active:cursor-grabbing select-none">
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
  // Embla needs at least enough slides to fill the viewport width multiple times over.
  // Using 15 duplicates guarantees that even if there is only 1 review, it will cover ultra-wide screens.
  const row1Loops = Array(15).fill(row1).flat();
  const row2Loops = Array(15).fill(row2).flat();

  return (
    <div className="relative flex flex-col gap-6 overflow-hidden w-screen left-1/2 -translate-x-1/2 py-4 px-0">
      {/* Edge Gradients for smooth fade */}
      {/* Edge Gradients for smooth fade - widened to 20% and made more opaque at edges */}
      <div className="pointer-events-none absolute inset-y-0 left-0 w-[15%] md:w-[20%] bg-gradient-to-r from-background via-background/80 to-transparent z-10" />
      <div className="pointer-events-none absolute inset-y-0 right-0 w-[15%] md:w-[20%] bg-gradient-to-l from-background via-background/80 to-transparent z-10" />

      {/* Row 1 (Forward) */}
      <div 
        className="overflow-hidden pb-2" 
        ref={emblaRef1}
        onMouseEnter={onMouseEnter(emblaApi1)}
        onMouseLeave={onMouseLeave(emblaApi1)}
      >
        <div className="flex -ml-4 md:-ml-6">
          {row1Loops.map((review, i) => (
            <ReviewCard key={`r1-${review.id}-${i}`} review={review} />
          ))}
        </div>
      </div>

      {/* Row 2 (Backward) */}
      <div 
        className="overflow-hidden pt-2" 
        ref={emblaRef2}
        onMouseEnter={onMouseEnter(emblaApi2)}
        onMouseLeave={onMouseLeave(emblaApi2)}
      >
        <div className="flex -ml-4 md:-ml-6">
          {row2Loops.map((review, i) => (
             <ReviewCard key={`r2-${review.id}-${i}`} review={review} />
          ))}
        </div>
      </div>
    </div>
  );
}
