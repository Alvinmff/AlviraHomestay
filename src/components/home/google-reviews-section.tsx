"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Star, ExternalLink, MessageSquareQuote } from "lucide-react";
import { GoogleReview } from "@/lib/google-reviews";
import { TestimonialMarquee } from "./testimonial-marquee";

const TABS = ["Semua", "Sidoarjo", "Surabaya", "Batu"];

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
            className="inline-flex items-center gap-2 bg-white dark:bg-zinc-800 px-4 py-2 rounded-full shadow-sm border dark:border-zinc-700 mb-6"
          >
            <div className="flex gap-1">
              {[...Array(5)].map((_, i) => (
                <Star key={i} className="w-4 h-4 text-amber-500 fill-amber-500" />
              ))}
            </div>
            <span className="text-sm font-semibold text-foreground">Google Reviews</span>
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
                className={`px-5 py-2 rounded-full text-sm font-medium transition-all duration-300 ${activeTab === tab
                  ? "bg-primary text-primary-foreground shadow-md scale-105 border-transparent"
                  : "bg-white dark:bg-zinc-800 text-muted-foreground border dark:border-zinc-700 hover:bg-muted dark:hover:bg-zinc-700 hover:text-foreground"
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
                className="flex items-center justify-center h-64"
              >
                <div className="w-10 h-10 border-4 border-primary border-t-transparent rounded-full animate-spin" />
              </motion.div>
            ) : filteredReviews.length === 0 ? (
              <motion.div
                key="empty"
                initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                className="py-24 text-center text-muted-foreground flex flex-col items-center"
              >
                <MessageSquareQuote className="w-16 h-16 mb-4 opacity-20" />
                <p className="text-lg">Belum ada ulasan untuk lokasi ini.</p>
              </motion.div>
            ) : (
              <motion.div
                key={`marquee-${activeTab}`}
                initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.5 }}
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
          transition={{ delay: 0.4 }}
          className="mt-16 text-center"
        >
          <a
            href="https://www.google.com/maps/search/Alvira+Homestay"
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
