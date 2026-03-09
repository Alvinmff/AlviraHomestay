"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Star, MapPin, ExternalLink, MessageSquareQuote } from "lucide-react";
import { GoogleReview } from "@/lib/google-reviews";
const TABS = ["Semua", "Sidoarjo", "Surabaya", "Batu"];

const containerVariants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1
    }
  }
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0, transition: { duration: 0.4, ease: "easeOut" as const } }
};

export function GoogleReviewsSection() {
  const [activeTab, setActiveTab] = useState("Semua");
  const [reviews, setReviews] = useState<GoogleReview[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadReviews() {
      try {
        const res = await fetch("/api/reviews/google");
        if (res.ok) {
          const data = await res.json();
          setReviews(data);
        }
      } catch (error) {
        console.error("Failed to load reviews:", error);
      } finally {
        setLoading(false);
      }
    }
    loadReviews();
  }, []);

  const filteredReviews = reviews.filter(r => 
    activeTab === "Semua" ? true : r.location === activeTab
  );

  // Calculate aggregates
  const avgRating = reviews.length > 0 
    ? (reviews.reduce((acc, r) => acc + r.rating, 0) / reviews.length).toFixed(1) 
    : "5.0";

  return (
    <section className="py-24 bg-muted/30 overflow-hidden relative">
      {/* Background Decor */}
      <div className="absolute top-0 right-0 -translate-y-1/2 translate-x-1/2 w-96 h-96 bg-primary/5 rounded-full blur-3xl" />
      <div className="absolute bottom-0 left-0 translate-y-1/2 -translate-x-1/2 w-96 h-96 bg-primary/5 rounded-full blur-3xl" />
      
      <div className="container mx-auto px-4 relative z-10">
        <div className="text-center max-w-2xl mx-auto mb-16">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="inline-flex items-center gap-2 bg-white px-4 py-2 rounded-full shadow-sm border mb-6"
          >
            <div className="flex gap-1">
              {[...Array(5)].map((_, i) => (
                <Star key={i} className="w-4 h-4 text-amber-500 fill-amber-500" />
              ))}
            </div>
            <span className="text-sm font-semibold">Google Reviews</span>
          </motion.div>
          
          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="text-3xl md:text-5xl font-serif font-bold text-foreground mb-4"
          >
            Apa Kata Tamu Kami
          </motion.h2>
          
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="text-muted-foreground text-lg mb-8"
          >
            Lebih dari {reviews.length} tamu telah berbagi pengalaman luar biasa mereka menginap bersama Homestay Alvira. Rating rata-rata <span className="font-bold text-foreground text-xl">{avgRating} ⭐</span>
          </motion.p>

          {/* Filter Tabs */}
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.3 }}
            className="flex flex-wrap justify-center gap-2"
          >
            {TABS.map(tab => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`px-5 py-2 rounded-full text-sm font-medium transition-all duration-300 ${
                  activeTab === tab 
                    ? "bg-primary text-primary-foreground shadow-md scale-105" 
                    : "bg-white text-muted-foreground border hover:bg-muted hover:text-foreground"
                }`}
              >
                {tab}
              </button>
            ))}
          </motion.div>
        </div>

        {/* Reviews Grid */}
        <motion.div 
          variants={containerVariants}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: "-100px" }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
        >
          <AnimatePresence mode="popLayout">
            {loading ? (
              [...Array(3)].map((_, i) => (
                 <motion.div
                    key={`skeleton-${i}`}
                    exit={{ opacity: 0, scale: 0.9 }}
                    className="bg-white rounded-2xl p-6 shadow-sm border border-border/50 h-[250px] animate-pulse flex flex-col"
                  >
                    <div className="flex gap-1 mb-4">
                      {[1,2,3,4,5].map(j => <div key={j} className="w-4 h-4 rounded-full bg-muted" />)}
                    </div>
                    <div className="space-y-2 mb-8">
                       <div className="h-4 bg-muted rounded w-full" />
                       <div className="h-4 bg-muted rounded w-5/6" />
                       <div className="h-4 bg-muted rounded w-4/6" />
                    </div>
                    <div className="mt-auto flex items-center gap-3 pt-4 border-t">
                       <div className="w-10 h-10 rounded-full bg-muted shrink-0" />
                       <div className="space-y-2 flex-1">
                         <div className="h-3 bg-muted rounded w-1/2" />
                         <div className="h-2 bg-muted rounded w-1/3" />
                       </div>
                    </div>
                  </motion.div>
              ))
            ) : filteredReviews.length === 0 ? (
              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="col-span-full py-12 text-center text-muted-foreground flex flex-col items-center"
              >
                <MessageSquareQuote className="w-12 h-12 mb-4 opacity-20" />
                <p>Belum ada ulasan untuk lokasi ini.</p>
              </motion.div>
            ) : (
                filteredReviews.map((review) => (
                  <motion.div
                    key={review.id}
                    layout // Animate layout changes when filtering
                    variants={itemVariants}
                    exit={{ opacity: 0, scale: 0.9, transition: { duration: 0.2 } }}
                    whileHover={{ y: -8, transition: { duration: 0.2 } }}
                    className="bg-white rounded-2xl p-6 shadow-sm border border-border/50 hover:shadow-lg transition-shadow relative flex flex-col h-full"
                  >
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
                          <p className="text-xs text-muted-foreground flex items-center gap-1">
                            <MapPin className="w-3 h-3" /> {review.location}
                          </p>
                        </div>
                      </div>
                      <span className="text-[10px] text-muted-foreground shrink-0">{review.relativeTime}</span>
                    </div>
                  </motion.div>
                ))
            )}
          </AnimatePresence>
        </motion.div>

        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.4 }}
          className="mt-16 text-center"
        >
          <a 
            href="#" 
            target="_blank" 
            referrerPolicy="no-referrer"
            className="inline-flex items-center gap-2 text-primary font-semibold hover:text-primary/80 transition-colors group"
          >
            Lihat Semua di Google Maps
            <ExternalLink className="w-4 h-4 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
          </a>
        </motion.div>
      </div>
    </section>
  );
}
