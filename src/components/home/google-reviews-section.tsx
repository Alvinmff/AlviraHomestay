"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Star, ExternalLink, MessageSquareQuote } from "lucide-react";
import { GoogleReview } from "@/lib/google-reviews";
import { TestimonialMarquee } from "./testimonial-marquee";

const TABS = ["Semua", "Sidoarjo", "Surabaya", "Batu"];

export function GoogleReviewsSection() {
  const [activeTab, setActiveTab] = useState("Semua");
  const [reviews, setReviews] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadReviews() {
      try {
        const res = await fetch("/api/reviews");
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

  const filteredReviews = reviews.filter(r => {
    if (activeTab === "Semua") return true;
    return r.property?.city === activeTab.toUpperCase(); 
  });

  const avgRating = reviews.length > 0
    ? (reviews.reduce((acc, r) => acc + r.rating, 0) / reviews.length).toFixed(1)
    : "5.0";

  return (
    <section className="py-32 overflow-hidden relative bg-accent/20">
      {/* Soft decorative blurs */}
      <div className="absolute top-0 right-0 -translate-y-1/3 translate-x-1/3 w-[500px] h-[500px] bg-primary/[0.03] rounded-full blur-3xl" />
      <div className="absolute bottom-0 left-0 translate-y-1/3 -translate-x-1/3 w-[500px] h-[500px] bg-secondary/[0.03] rounded-full blur-3xl" />

      <div className="container mx-auto px-4 relative z-10">
        <div className="text-center max-w-2xl mx-auto mb-20">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, ease: [0.25, 0.46, 0.45, 0.94] }}
            className="inline-flex items-center gap-2.5 bg-card px-5 py-2.5 rounded-full shadow-sm border border-border/40 mb-8"
          >
            <div className="flex gap-0.5">
              {[...Array(5)].map((_, i) => (
                <Star key={i} className="w-3.5 h-3.5 text-amber-500 fill-amber-500" />
              ))}
            </div>
            <span className="text-xs font-semibold text-foreground/70 tracking-wide uppercase">Google Reviews</span>
          </motion.div>

          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.15, duration: 0.8, ease: [0.25, 0.46, 0.45, 0.94] }}
            className="text-3xl md:text-4xl font-serif font-bold text-foreground mb-5"
          >
            Apa Kata Tamu Kami
          </motion.h2>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.3, duration: 0.8, ease: [0.25, 0.46, 0.45, 0.94] }}
            className="text-muted-foreground text-base mb-10 leading-relaxed"
          >
            Lebih dari {reviews.length} tamu telah berbagi pengalaman luar biasa mereka menginap bersama Homestay Alvira. Rating rata-rata <span className="font-bold text-foreground">{avgRating} ⭐</span>
          </motion.p>

          {/* Filter Tabs — minimal pill style */}
          <motion.div
            initial={{ opacity: 0, scale: 0.98 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.4, duration: 0.6 }}
            className="flex flex-wrap justify-center gap-2"
          >
            {TABS.map(tab => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`px-5 py-2 rounded-full text-sm font-medium transition-all duration-300 ${activeTab === tab
                  ? "bg-primary text-primary-foreground shadow-sm"
                  : "bg-card text-muted-foreground border border-border/40 hover:bg-accent/50 hover:text-foreground"
                  }`}
              >
                {tab}
              </button>
            ))}
          </motion.div>
        </div>

        {/* Reviews Area */}
        <div className="mt-12 min-h-[400px]">
          <AnimatePresence mode="wait">
            {loading ? (
              <motion.div
                key="loading"
                initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                transition={{ duration: 0.5 }}
                className="flex items-center justify-center h-64"
              >
                <div className="w-8 h-8 border-2 border-primary/30 border-t-primary rounded-full animate-spin" />
              </motion.div>
            ) : filteredReviews.length === 0 ? (
              <motion.div
                key="empty"
                initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                transition={{ duration: 0.5 }}
                className="py-24 text-center text-muted-foreground flex flex-col items-center"
              >
                <MessageSquareQuote className="w-12 h-12 mb-4 opacity-15" />
                <p className="text-base">Belum ada ulasan untuk lokasi ini.</p>
              </motion.div>
            ) : (
              <motion.div
                key={`marquee-${activeTab}`}
                initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.6, ease: [0.25, 0.46, 0.45, 0.94] }}
              >
                <TestimonialMarquee reviews={filteredReviews} />
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.4, duration: 0.8, ease: [0.25, 0.46, 0.45, 0.94] }}
          className="mt-20 text-center"
        >
          <a
            href="https://www.google.com/maps/search/Alvira+Homestay"
            target="_blank"
            referrerPolicy="no-referrer"
            className="inline-flex items-center gap-2 text-primary font-semibold hover:text-primary/70 transition-colors duration-300 group"
          >
            Lihat Semua di Google Maps
            <ExternalLink className="w-4 h-4 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform duration-300" />
          </a>
        </motion.div>
      </div>
    </section>
  );
}
