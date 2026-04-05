"use client";

import Link from "next/link";
import { Instagram, Youtube, Phone, Mail, MapPin } from "lucide-react";
import { formatPhoneForWA, generateWALink, WA_TEMPLATES } from "@/lib/utils";

export function Footer() {

  return (
    <footer className="w-full border-t bg-[#F8FAF9] dark:bg-zinc-950 py-16 text-sm">
      <div className="container mx-auto px-4 sm:px-8 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10">

        {/* Brand */}
        <div className="flex flex-col space-y-4 lg:col-span-2">
          <Link href="/" className="flex items-center gap-2 w-fit">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/uploads/logo.png" alt="Homestay Alvira" className="h-12 w-auto object-contain" />
            <span className="font-serif text-2xl font-bold text-primary">Homestay Alvira</span>
          </Link>
          <p className="text-muted-foreground leading-relaxed max-w-sm">
            Tiga kota, satu kenyamanan. Pengalaman menginap premium dari homestay hingga villa mewah, semua dalam genggaman Anda.
          </p>
          <div className="flex items-center space-x-4 pt-2">
            <a href="https://instagram.com/alvira.homestay" target="_blank" rel="noopener noreferrer" className="w-10 h-10 rounded-full bg-white dark:bg-zinc-900 border dark:border-zinc-800 flex items-center justify-center text-muted-foreground hover:text-[#bc1888] hover:border-[#bc1888] transition-colors shadow-sm">
              <Instagram className="w-5 h-5" />
            </a>
            <a href="https://youtube.com/@alvirahomestay" target="_blank" rel="noopener noreferrer" className="w-10 h-10 rounded-full bg-white dark:bg-zinc-900 border dark:border-zinc-800 flex items-center justify-center text-muted-foreground hover:text-[#FF0000] hover:border-[#FF0000] transition-colors shadow-sm">
              <Youtube className="w-5 h-5" />
            </a>
            <a href="https://tiktok.com/@alvira_stay" target="_blank" rel="noopener noreferrer" className="w-10 h-10 rounded-full bg-white dark:bg-zinc-900 border dark:border-zinc-800 flex items-center justify-center text-muted-foreground hover:text-black dark:hover:text-white hover:border-black dark:hover:border-white transition-colors shadow-sm">
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64 2.93 2.93 0 0 1 .88.13V9.4a6.84 6.84 0 0 0-1-.05A6.33 6.33 0 0 0 5 20.1a6.34 6.34 0 0 0 10.86-4.43v-7a8.16 8.16 0 0 0 4.77 1.52v-3.4a4.85 4.85 0 0 1-1-.1z" /></svg>
            </a>
          </div>
        </div>

        {/* Cepat */}
        <div className="flex flex-col space-y-4">
          <h3 className="font-semibold text-foreground text-base mb-2">Navigasi Cepat</h3>
          <Link href="/" className="text-muted-foreground hover:text-primary transition-colors inline-block w-fit">Beranda</Link>
          <Link href="/properties" className="text-muted-foreground hover:text-primary transition-colors inline-block w-fit">Semua Properti</Link>
          <Link href="/kontak" className="text-muted-foreground hover:text-primary transition-colors inline-block w-fit">Kontak Kami</Link>
          <Link href="/faq" className="text-muted-foreground hover:text-primary transition-colors inline-block w-fit">FAQ</Link>
        </div>

        {/* Properti */}
        <div className="flex flex-col space-y-4">
          <h3 className="font-semibold text-foreground text-base mb-2">Properti Kami</h3>
          <Link href="/properties/sidoarjo" className="text-muted-foreground hover:text-primary transition-colors inline-block w-fit">Homestay Sidoarjo</Link>
          <Link href="/properties/surabaya" className="text-muted-foreground hover:text-primary transition-colors inline-block w-fit">Kost Eksklusif Surabaya</Link>
          <Link href="/properties/batu" className="text-muted-foreground hover:text-primary transition-colors inline-block w-fit">Villa Premium Batu</Link>
        </div>

        {/* Kontak */}
        <div className="flex flex-col space-y-4">
          <h3 className="font-semibold text-foreground text-base mb-2">Hubungi Kami</h3>
          <a href="tel:081231646523" className="flex items-start text-muted-foreground hover:text-primary transition-colors group">
            <Phone className="w-4 h-4 mr-2 mt-0.5 shrink-0 group-hover:text-primary" />
            <span>0812-3164-6523<br /><span className="text-xs opacity-70">(Telepon)</span></span>
          </a>
          <a href={generateWALink("081231646523", WA_TEMPLATES.general)} target="_blank" rel="noopener noreferrer" className="flex items-start text-muted-foreground hover:text-primary transition-colors group">
            <svg className="w-4 h-4 mr-2 mt-0.5 shrink-0 group-hover:text-primary" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"></path></svg>
            <span>0812-3164-6523<br /><span className="text-xs opacity-70 text-[#25D366] font-medium">(WhatsApp - Online 24 Jam)</span></span>
          </a>
          <a href="mailto:alvirahomestay@gmail.com" className="flex items-start text-muted-foreground hover:text-primary transition-colors group">
            <Mail className="w-4 h-4 mr-2 mt-0.5 shrink-0 group-hover:text-primary" />
            <span>alvirahomestay@gmail.com<br /><span className="text-xs opacity-70">(Email)</span></span>
          </a>
        </div>
      </div>


      <div className="container mx-auto px-4 sm:px-8 mt-8 flex flex-col md:flex-row items-center justify-between gap-4 pt-6 text-muted-foreground text-xs">
        <p>&copy; {new Date().getFullYear()} Homestay Alvira. All rights reserved.</p>
        <div className="flex space-x-4">
          <Link href="/terms" className="hover:text-primary transition-colors">Syarat & Ketentuan</Link>
          <Link href="/privacy" className="hover:text-primary transition-colors">Kebijakan Privasi</Link>
        </div>
      </div>
    </footer>
  );
}
