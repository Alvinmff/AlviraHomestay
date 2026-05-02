"use client";

import Link from "next/link";
import { Instagram, Youtube, Phone, Mail } from "lucide-react";
import { generateWALink, WA_TEMPLATES } from "@/lib/utils";

export function Footer() {

  return (
    <footer className="w-full border-t border-border/30 bg-card py-20 text-sm">
      <div className="container mx-auto px-4 sm:px-8 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-12">

        {/* Brand */}
        <div className="flex flex-col space-y-5 lg:col-span-2">
          <Link href="/" className="flex items-center gap-3 w-fit group">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="https://res.cloudinary.com/drq4p06mk/image/upload/v1777687112/alvira-static/logo.png" alt="Homestay Alvira" className="h-11 w-auto object-contain" />
            <span className="font-serif text-xl font-bold text-primary">Homestay Alvira</span>
          </Link>
          <p className="text-muted-foreground leading-relaxed max-w-sm text-sm">
            Tiga kota, satu kenyamanan. Pengalaman menginap premium dari homestay hingga villa mewah, semua dalam genggaman Anda.
          </p>
          <div className="flex items-center space-x-3 pt-2">
            <a href="https://instagram.com/alvira.homestay" target="_blank" rel="noopener noreferrer" className="w-10 h-10 rounded-xl bg-background border border-border/50 flex items-center justify-center text-muted-foreground hover:text-[#bc1888] hover:border-[#bc1888]/30 transition-all duration-300">
              <Instagram className="w-4 h-4" />
            </a>
            <a href="https://youtube.com/@alvirahomestay" target="_blank" rel="noopener noreferrer" className="w-10 h-10 rounded-xl bg-background border border-border/50 flex items-center justify-center text-muted-foreground hover:text-[#FF0000] hover:border-[#FF0000]/30 transition-all duration-300">
              <Youtube className="w-4 h-4" />
            </a>
            <a href="https://tiktok.com/@alvira_stay" target="_blank" rel="noopener noreferrer" className="w-10 h-10 rounded-xl bg-background border border-border/50 flex items-center justify-center text-muted-foreground hover:text-foreground hover:border-border transition-all duration-300">
              <svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 24 24"><path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64 2.93 2.93 0 0 1 .88.13V9.4a6.84 6.84 0 0 0-1-.05A6.33 6.33 0 0 0 5 20.1a6.34 6.34 0 0 0 10.86-4.43v-7a8.16 8.16 0 0 0 4.77 1.52v-3.4a4.85 4.85 0 0 1-1-.1z" /></svg>
            </a>
          </div>
        </div>

        {/* Quick Links */}
        <div className="flex flex-col space-y-4">
          <h3 className="font-serif font-semibold text-foreground text-base mb-1">Navigasi</h3>
          <Link href="/" className="text-muted-foreground hover:text-primary transition-colors duration-300 inline-block w-fit text-sm">Beranda</Link>
          <Link href="/properties" className="text-muted-foreground hover:text-primary transition-colors duration-300 inline-block w-fit text-sm">Semua Properti</Link>
          <Link href="/kontak" className="text-muted-foreground hover:text-primary transition-colors duration-300 inline-block w-fit text-sm">Kontak Kami</Link>
          <Link href="/faq" className="text-muted-foreground hover:text-primary transition-colors duration-300 inline-block w-fit text-sm">FAQ</Link>
        </div>

        {/* Properties */}
        <div className="flex flex-col space-y-4">
          <h3 className="font-serif font-semibold text-foreground text-base mb-1">Properti</h3>
          <Link href="/properties/sidoarjo" className="text-muted-foreground hover:text-primary transition-colors duration-300 inline-block w-fit text-sm">Homestay Sidoarjo</Link>
          <Link href="/properties/surabaya" className="text-muted-foreground hover:text-primary transition-colors duration-300 inline-block w-fit text-sm">Kost Eksklusif Surabaya</Link>
          <Link href="/properties/batu" className="text-muted-foreground hover:text-primary transition-colors duration-300 inline-block w-fit text-sm">Villa Premium Batu</Link>
        </div>

        {/* Contact */}
        <div className="flex flex-col space-y-4">
          <h3 className="font-serif font-semibold text-foreground text-base mb-1">Hubungi Kami</h3>
          <a href="tel:081231646523" className="flex items-start text-muted-foreground hover:text-primary transition-colors duration-300 group text-sm">
            <Phone className="w-4 h-4 mr-2.5 mt-0.5 shrink-0" />
            <span>0812-3164-6523<br /><span className="text-xs opacity-60">(Telepon)</span></span>
          </a>
          <a href={generateWALink("081231646523", WA_TEMPLATES.general)} target="_blank" rel="noopener noreferrer" className="flex items-start text-muted-foreground hover:text-primary transition-colors duration-300 group text-sm">
            <svg className="w-4 h-4 mr-2.5 mt-0.5 shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"></path></svg>
            <span>0812-3164-6523<br /><span className="text-xs text-primary/60 font-medium">(WhatsApp)</span></span>
          </a>
          <a href="mailto:alvirahomestay@gmail.com" className="flex items-start text-muted-foreground hover:text-primary transition-colors duration-300 group text-sm">
            <Mail className="w-4 h-4 mr-2.5 mt-0.5 shrink-0" />
            <span>alvirahomestay@gmail.com</span>
          </a>
        </div>
      </div>


      <div className="container mx-auto px-4 sm:px-8 mt-12 flex flex-col md:flex-row items-center justify-between gap-4 pt-8 border-t border-border/20 text-muted-foreground/60 text-xs">
        <p>&copy; {new Date().getFullYear()} Homestay Alvira. All rights reserved.</p>
        <div className="flex space-x-6">
          <Link href="/terms" className="hover:text-primary transition-colors duration-300">Syarat & Ketentuan</Link>
          <Link href="/privacy" className="hover:text-primary transition-colors duration-300">Kebijakan Privasi</Link>
        </div>
      </div>
    </footer>
  );
}
