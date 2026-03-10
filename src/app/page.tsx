"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { GoogleReviewsSection } from "@/components/home/google-reviews-section";

export default function Home() {
  const containerVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.15
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 30 },
    show: { opacity: 1, y: 0, transition: { duration: 0.5 } }
  };

  return (
    <div className="flex flex-col min-h-screen">
      {/* Hero Section */}
      <section className="relative h-[80vh] flex items-center justify-center bg-primary text-primary-foreground overflow-hidden">
        {/* Overlay for background images later */}
        <div className="absolute inset-0 bg-black/40 z-10" />

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="container relative z-20 mx-auto px-4 text-center mt-32"
        >
          <h1 className="text-4xl md:text-6xl font-serif font-bold mb-6 tracking-tight text-white">
            Tiga Kota, <span className="text-secondary">Satu Kenyamanan.</span>
          </h1>
          <p className="text-lg md:text-xl max-w-2xl mx-auto mb-10 opacity-90 text-white">
            Pengalaman menginap premium dengan pilihan akomodasi beragam — dari homestay cozy di Sidoarjo, kost eksklusif di Surabaya, hingga villa mewah di Batu.
          </p>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4, duration: 1 }}
            className="flex flex-col sm:flex-row justify-center gap-4"
          >
            <Link href="/properties" className="inline-flex items-center justify-center rounded-lg h-11 px-8 text-sm bg-secondary text-secondary-foreground hover:bg-secondary/90 font-semibold transition-colors">
              Jelajahi Properti
            </Link>
            <Link href="/kontak" className="inline-flex items-center justify-center rounded-lg h-11 px-8 text-sm text-foreground border border-border bg-white/90 hover:bg-muted hover:text-primary backdrop-blur-sm font-semibold transition-colors">
              Hubungi Kami
            </Link>
          </motion.div>
        </motion.div>
      </section>

      {/* Featured Properties */}
      <section id="tentang" className="py-24 bg-background">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.6 }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl font-serif font-bold text-foreground mb-4">Destinasi Unggulan</h2>
            <p className="text-muted-foreground max-w-xl mx-auto">Satu platform untuk berbagai kebutuhan akomodasi Anda di Jawa Timur.</p>
          </motion.div>

          <motion.div
            variants={containerVariants}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, margin: "-100px" }}
            className="grid grid-cols-1 md:grid-cols-3 gap-8"
          >
            {/* Sidoarjo */}
            <motion.div variants={itemVariants} className="group rounded-2xl overflow-hidden shadow-[0_4px_20px_rgba(0,0,0,0.08)] border bg-card transition-transform hover:-translate-y-1">
              <div className="h-56 bg-muted relative">
                {/* Image Placeholder */}
                <div className="absolute inset-0 bg-gradient-to-br from-primary/10 to-primary/5 flex items-center justify-center">
                  <span className="text-muted-foreground font-serif italic">Gambar Homestay Sidoarjo</span>
                </div>
              </div>
              <div className="p-6">
                <h3 className="text-xl font-bold font-serif mb-2 text-foreground">Homestay Sidoarjo</h3>
                <p className="text-muted-foreground mb-6 line-clamp-2">Penginapan nyaman dan strategis untuk keluarga, cocok untuk transit atau kunjungan bisnis.</p>
                <Link href="/properties/sidoarjo" className="inline-flex items-center justify-center rounded-lg h-9 px-4 text-sm w-full text-primary border border-primary/20 hover:bg-primary/5 transition-colors">
                  Lihat Detail
                </Link>
              </div>
            </motion.div>

            {/* Surabaya */}
            <motion.div variants={itemVariants} className="group rounded-2xl overflow-hidden shadow-[0_4px_20px_rgba(0,0,0,0.08)] border bg-card transition-transform hover:-translate-y-1">
              <div className="h-56 bg-muted relative">
                <div className="absolute inset-0 bg-gradient-to-br from-primary/10 to-primary/5 flex items-center justify-center">
                  <span className="text-muted-foreground font-serif italic">Gambar Kost Surabaya</span>
                </div>
              </div>
              <div className="p-6">
                <h3 className="text-xl font-bold font-serif mb-2 text-foreground">Kost Eksklusif Surabaya</h3>
                <p className="text-muted-foreground mb-6 line-clamp-2">Fasilitas premium di pusat kota pahlawan, memberikan kenyamanan maksimal untuk mahasiswa dan pekerja.</p>
                <Link href="/properties/surabaya" className="inline-flex items-center justify-center rounded-lg h-9 px-4 text-sm w-full text-primary border border-primary/20 hover:bg-primary/5 transition-colors">
                  Lihat Detail
                </Link>
              </div>
            </motion.div>

            {/* Batu */}
            <motion.div variants={itemVariants} className="group rounded-2xl overflow-hidden shadow-[0_4px_20px_rgba(0,0,0,0.08)] border bg-card transition-transform hover:-translate-y-1">
              <div className="h-56 bg-muted relative">
                <div className="absolute inset-0 bg-gradient-to-br from-primary/10 to-primary/5 flex items-center justify-center">
                  <span className="text-muted-foreground font-serif italic">Gambar Villa Batu</span>
                </div>
              </div>
              <div className="p-6">
                <h3 className="text-xl font-bold font-serif mb-2 text-foreground">Villa Premium Batu</h3>
                <p className="text-muted-foreground mb-6 line-clamp-2">Liburan tak terlupakan dengan nuansa alam pegunungan, udara sejuk, dan privasi penuh.</p>
                <Link href="/properties/batu" className="inline-flex items-center justify-center rounded-lg h-9 px-4 text-sm w-full text-primary border border-primary/20 hover:bg-primary/5 transition-colors">
                  Lihat Detail
                </Link>
              </div>
            </motion.div>

          </motion.div>
        </div>
      </section>

      {/* Google Reviews Testimonials */}
      <GoogleReviewsSection />
    </div>
  );
}
