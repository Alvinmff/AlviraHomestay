"use client";

import { motion } from "framer-motion";
import { useEffect, useRef } from "react";

interface TikTokVideo {
  id: string;
  videoId: string;
  username: string;
  caption: string;
}

const tiktokVideos: TikTokVideo[] = [
  {
    id: "1",
    videoId: "7609626709859585298",
    username: "@alvirahomestay",
    caption: "Panduan Resmi Rute Menuju Alvira Homestay | Akses Mudah & Lokasi Strategis",
  },
  {
    id: "2",
    videoId: "7645850506874621205",
    username: "@alvirahomestay",
    caption: "🏡 ALVIRA HOMESTAY 1 – Sidoarjo, Jawa Timur Full House Nyaman untuk Keluarga & Rombongan",
  },
  {
    id: "3",
    videoId: "7645852439085665556",
    username: "@alvirahomestay",
    caption: "🏡 ALVIRA HOMESTAY 2 – Sidoarjo, Jawa Timur Full House Nyaman untuk Keluarga & Rombongan",
  },
  {
    id: "4",
    videoId: "7645854997179075860",
    username: "@alvirahomestay",
    caption: "🏡 ALVIRA HOMESTAY 3 – Sidoarjo, Jawa Timur Nyaman untuk Keluarga & Rombongan",
  },
  {
    id: "5",
    videoId: "7645855685195992341",
    username: "@alvirahomestay",
    caption: "🏡 ALVIRA HOMESTAY 4 – Sidoarjo, Jawa Timur Nyaman untuk Keluarga & Rombongan",
  },
];

const containerVariants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.15, delayChildren: 0.2 },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 30 },
  show: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, ease: "easeOut" as const },
  },
};

export function TikTokSection() {
  const sectionRef = useRef<HTMLDivElement>(null);

  // Load TikTok embed script
  useEffect(() => {
    // Remove existing script to force re-processing of blockquotes
    const existingScript = document.getElementById("tiktok-embed-script");
    if (existingScript) {
      existingScript.remove();
    }

    const script = document.createElement("script");
    script.id = "tiktok-embed-script";
    script.src = "https://www.tiktok.com/embed.js";
    script.async = true;
    document.body.appendChild(script);

    return () => {
      // Cleanup on unmount
      const s = document.getElementById("tiktok-embed-script");
      if (s) s.remove();
    };
  }, []);

  return (
    <section className="py-24 bg-gradient-to-b from-background via-primary/[0.02] to-background overflow-hidden">
      <div className="container mx-auto px-4" ref={sectionRef}>
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.7 }}
          className="text-center mb-14"
        >
          <div className="inline-flex items-center gap-2 mb-4">
            <svg
              className="w-6 h-6 text-foreground"
              viewBox="0 0 24 24"
              fill="currentColor"
            >
              <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64 2.93 2.93 0 0 1 .88.13V9.4a6.84 6.84 0 0 0-1-.05A6.33 6.33 0 0 0 5 20.1a6.34 6.34 0 0 0 10.86-4.43v-7a8.16 8.16 0 0 0 4.77 1.52v-3.4a4.85 4.85 0 0 1-1-.1z" />
            </svg>
            <h2 className="text-3xl md:text-4xl font-serif font-bold text-foreground">
              TikTok Kami
            </h2>
          </div>
          <p className="text-muted-foreground max-w-xl mx-auto leading-relaxed text-sm md:text-base">
            Jelajahi video-video seru seputar homestay dan tips wisata. Jangan
            lupa follow TikTok kami untuk konten menarik lainnya!
          </p>
        </motion.div>

        {/* TikTok Embed Grid */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: "-50px" }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 justify-items-center"
        >
          {tiktokVideos.map((video) => (
            <motion.div
              key={video.id}
              variants={itemVariants}
              className="w-full max-w-[325px] rounded-2xl overflow-hidden bg-card border border-border/40 shadow-sm hover:shadow-xl transition-all duration-500 hover:-translate-y-1"
            >
              {/* TikTok Official Embed */}
              <blockquote
                className="tiktok-embed"
                cite={`https://www.tiktok.com/${video.username}/video/${video.videoId}`}
                data-video-id={video.videoId}
                style={{ maxWidth: "605px", minWidth: "325px" }}
              >
                <section>
                  <a
                    target="_blank"
                    rel="noopener noreferrer"
                    title={video.username}
                    href={`https://www.tiktok.com/${video.username}?refer=embed`}
                  >
                    {video.username}
                  </a>
                  <p>{video.caption}</p>
                </section>
              </blockquote>
            </motion.div>
          ))}
        </motion.div>

        {/* Follow Button */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.4, duration: 0.6 }}
          className="flex justify-center mt-10"
        >
          <a
            href="https://tiktok.com/@alvirahomestay"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 rounded-full h-11 px-8 text-sm font-semibold bg-foreground text-background hover:bg-foreground/90 transition-all duration-300 hover:-translate-y-0.5 shadow-lg"
          >
            <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
              <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64 2.93 2.93 0 0 1 .88.13V9.4a6.84 6.84 0 0 0-1-.05A6.33 6.33 0 0 0 5 20.1a6.34 6.34 0 0 0 10.86-4.43v-7a8.16 8.16 0 0 0 4.77 1.52v-3.4a4.85 4.85 0 0 1-1-.1z" />
            </svg>
            Follow @alvirahomestay
          </a>
        </motion.div>
      </div>
    </section>
  );
}
