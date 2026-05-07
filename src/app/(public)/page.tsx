"use client";

import Link from "next/link";
import { motion, useScroll, useTransform } from "framer-motion";
import { ArrowRight } from "lucide-react";
import { GoogleReviewsSection } from "@/components/home/google-reviews-section";
import { ScrollingBanner } from "@/components/home/scrolling-banner";
import { TikTokSection } from "@/components/home/tiktok-section";

export default function Home() {
  const containerVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
        delayChildren: 0.1,
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 40 },
    show: { opacity: 1, y: 0, transition: { duration: 0.8, ease: "easeOut" as const } }
  };

  const { scrollY } = useScroll();
  const yHero = useTransform(scrollY, [0, 1000], [0, 300]);
  const opacityHero = useTransform(scrollY, [0, 700], [1, 0]);

  const properties = [
    {
      name: "Homestay Sidoarjo",
      slug: "sidoarjo",
      image: "https://res.cloudinary.com/drq4p06mk/image/upload/v1777687149/alvira-static/upload-1773135068512-112765190.jpg",
      description: "Penginapan nyaman dan strategis untuk keluarga, cocok untuk transit atau kunjungan bisnis.",
      type: "Homestay"
    },
    {
      name: "Kost Eksklusif Surabaya",
      slug: "surabaya",
      image: "https://res.cloudinary.com/drq4p06mk/image/upload/v1777689605/alvira-static/po0j83tr2qcjv70c6y2v.jpg",
      description: "Fasilitas premium di pusat kota pahlawan, memberikan kenyamanan maksimal untuk mahasiswa dan pekerja.",
      type: "Kost"
    },
    {
      name: "Villa Premium Batu",
      slug: "batu",
      image: "https://res.cloudinary.com/drq4p06mk/image/upload/v1777689612/alvira-static/axlsrjylabvqtxclbcdi.jpg",
      description: "Liburan tak terlupakan dengan nuansa alam pegunungan, udara sejuk, dan privasi penuh.",
      type: "Villa"
    },
  ];

  return (
    <div className="flex flex-col min-h-screen -mt-[72px]">
      {/* Hero Section — Scandinavian Clean */}
      <section className="relative h-[100vh] flex items-center justify-center overflow-hidden">
        {/* Parallax Background */}
        <motion.div
          className="absolute inset-0 z-0 w-full h-[120%]"
          style={{ y: yHero, opacity: opacityHero }}
        >
          <picture className="w-full h-full">
            <source media="(max-width: 768px)" srcSet="https://res.cloudinary.com/drq4p06mk/image/upload/v1778138945/alvira-static/backgroundmobile.png" />
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="https://res.cloudinary.com/drq4p06mk/image/upload/v1778138941/alvira-static/Background.png"
              alt="Hero Background Alvira"
              className="w-full h-full object-cover origin-top"
            />
          </picture>
        </motion.div>

        {/* Soft vignette overlay — not heavy black */}
        {/* Soft vignette overlay — not heavy black */}
        {/* Soft vignette overlay — not heavy black */}
        {/* Soft vignette overlay — not heavy black */}
        <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-black/10 to-transparent z-10" />

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1.2, ease: [0.25, 0.46, 0.45, 0.94] }}
          className="container relative z-20 mx-auto px-4 text-center"
        >
          {/* Subtle label */}
          <motion.p
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.3 }}
            className="text-sm tracking-[0.3em] uppercase text-white/70 mb-6 font-medium"
          >
            Tiga Kota · Satu Kenyamanan
          </motion.p>

          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.5 }}
            className="text-4xl md:text-7xl font-serif font-bold mb-8 tracking-tight text-white leading-tight drop-shadow-2xl"
          >
            Selamat Datang di<br />
            <span className="text-secondary brightness-110 drop-shadow-[0_4px_4px_rgba(0,0,0,0.8)]">Homestay Alvira</span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.7 }}
            className="text-base md:text-lg max-w-xl mx-auto mb-12 text-white/80 leading-relaxed"
          >
            Penginapan murah, bersih, dan nyaman dengan lokasi strategis dengan pilihan akomodasi beragam dari homestay cozy di Sidoarjo, kost eksklusif di Surabaya, hingga villa dengan pemandangan indah Gunung Arjuno di Batu.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.9, duration: 1 }}
            className="flex flex-col sm:flex-row justify-center gap-4"
          >
            <Link
              href="/#destinasi"
              className="inline-flex items-center justify-center gap-2 rounded-xl h-12 px-8 text-sm bg-primary text-primary-foreground hover:bg-primary/90 font-semibold transition-all duration-300 shadow-lg shadow-primary/20 hover:shadow-xl hover:shadow-primary/30 hover:-translate-y-0.5"
            >
              Jelajahi Properti
              <ArrowRight className="w-4 h-4" />
            </Link>
            <Link
              href="/kontak"
              className="inline-flex items-center justify-center rounded-xl h-12 px-8 text-sm text-white border border-white/30 bg-white/10 hover:bg-white/20 backdrop-blur-sm font-semibold transition-all duration-300 hover:-translate-y-0.5"
            >
              Hubungi Kami
            </Link>
          </motion.div>
        </motion.div>

        {/* Scroll indicator */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.5, duration: 1 }}
          className="absolute bottom-8 left-1/2 -translate-x-1/2 z-20 flex flex-col items-center gap-2"
        >
          <span className="text-white/40 text-xs tracking-widest uppercase">Scroll</span>
          <motion.div
            animate={{ y: [0, 8, 0] }}
            transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
            className="w-5 h-8 border-2 border-white/30 rounded-full flex justify-center pt-1.5"
          >
            <div className="w-1 h-1.5 bg-white/60 rounded-full" />
          </motion.div>
        </motion.div>
      </section>

      {/* Featured Properties — Airy Layout */}
      <section id="tentang" className="py-32 bg-background">
        <div id="destinasi" className="container mx-auto px-4 pt-10 -mt-10">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.8, ease: [0.25, 0.46, 0.45, 0.94] }}
            className="text-center mb-20"
          >
            <p className="text-sm tracking-[0.2em] uppercase text-primary/70 mb-4 font-medium">Destinasi Kami</p>
            <h2 className="text-3xl md:text-4xl font-serif font-bold text-foreground mb-5">Destinasi Unggulan</h2>
            <p className="text-muted-foreground max-w-lg mx-auto leading-relaxed">
              Satu platform untuk berbagai kebutuhan akomodasi Anda di Jawa Timur.
            </p>
          </motion.div>

          <motion.div
            variants={containerVariants}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, margin: "-100px" }}
            className="grid grid-cols-1 md:grid-cols-3 gap-10"
          >
            {properties.map((prop) => (
              <motion.div
                key={prop.slug}
                variants={itemVariants}
                className="group rounded-2xl overflow-hidden bg-card border border-border/40 shadow-sm hover:shadow-xl transition-all duration-500 hover:-translate-y-1.5"
              >
                <Link href={`/properties/${prop.slug}`} className="block">
                  <div className="h-64 relative overflow-hidden">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={prop.image}
                      alt={prop.name}
                      className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
                    />
                    {/* Soft bottom gradient */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />
                    {/* Type badge */}
                    <div className="absolute top-5 left-5">
                      <span className="text-xs font-medium tracking-wider uppercase bg-white/90 backdrop-blur-sm text-foreground/80 px-3 py-1.5 rounded-lg">
                        {prop.type}
                      </span>
                    </div>
                  </div>
                  <div className="p-7">
                    <h3 className="text-xl font-bold font-serif mb-2 text-foreground group-hover:text-primary transition-colors duration-300">
                      {prop.name}
                    </h3>
                    <p className="text-muted-foreground mb-6 leading-relaxed text-sm line-clamp-2">
                      {prop.description}
                    </p>
                    <span className="inline-flex items-center gap-2 text-sm font-semibold text-primary group-hover:gap-3 transition-all duration-300">
                      Lihat Detail
                      <ArrowRight className="w-4 h-4" />
                    </span>
                  </div>
                </Link>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Scrolling Banner Transition */}
      <ScrollingBanner />

      {/* TikTok Section — VIDEO REAL */}
      <TikTokSection />

      {/* Google Reviews Testimonials */}
      <GoogleReviewsSection />
    </div>
  );
}
