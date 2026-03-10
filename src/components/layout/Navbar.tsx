"use client";

import Link from "next/link";
import { useState } from "react";
import { Menu, X, User, ChevronDown } from "lucide-react";

export function Navbar() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <nav className="sticky top-0 z-50 w-full border-b bg-background/80 backdrop-blur-md supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto px-4 sm:px-8 flex h-16 items-center justify-between">
        <Link href="/" className="flex items-center space-x-2 relative z-50">
          <span className="font-serif text-xl sm:text-2xl font-bold text-primary tracking-tight">
            Homestay Alvira
          </span>
        </Link>

        {/* Desktop Navigation */}
        <div className="hidden md:flex items-center space-x-8 text-sm font-medium">
          <Link href="/" className="text-foreground/80 hover:text-primary transition-colors">
            Beranda
          </Link>

          <div className="relative group">
            <Link href="/properties" className="flex items-center text-foreground/80 hover:text-primary transition-colors py-4">
              Properti <ChevronDown className="w-4 h-4 ml-1 opacity-50 group-hover:opacity-100 transition-opacity" />
            </Link>
            <div className="absolute top-full left-0 hidden group-hover:flex flex-col bg-white border shadow-lg rounded-xl overflow-hidden min-w-[200px] animate-in slide-in-from-top-2">
              <Link href="/properties/sidoarjo" className="px-4 py-3 hover:bg-muted text-foreground/80 hover:text-primary transition-colors">
                Homestay Sidoarjo
              </Link>
              <Link href="/properties/surabaya" className="px-4 py-3 hover:bg-muted text-foreground/80 hover:text-primary transition-colors border-t border-border/50">
                Kost Surabaya
              </Link>
              <Link href="/properties/batu" className="px-4 py-3 hover:bg-muted text-foreground/80 hover:text-primary transition-colors border-t border-border/50">
                Villa Batu
              </Link>
            </div>
          </div>

          <Link href="/#tentang" className="text-foreground/80 hover:text-primary transition-colors">
            Tentang
          </Link>
          <Link href="/kontak" className="text-foreground/80 hover:text-primary transition-colors">
            Kontak
          </Link>
        </div>

        <div className="flex items-center space-x-3">
          <Link
            href="/admin/login"
            className="hidden md:flex items-center text-xs font-semibold text-muted-foreground hover:text-primary transition-colors px-3 py-2 rounded-md hover:bg-muted/50"
          >
            <User className="w-4 h-4 mr-1.5" />
            Login Admin
          </Link>

          {/* Mobile Hamburger Button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden inline-flex items-center justify-center w-10 h-10 rounded-lg text-foreground hover:bg-muted transition-colors relative z-50"
            aria-label="Toggle menu"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Menu Dropdown */}
      {mobileMenuOpen && (
        <div className="md:hidden fixed inset-0 top-16 bg-background/95 backdrop-blur-lg animate-in slide-in-from-right duration-200 z-40 overflow-y-auto">
          <div className="container mx-auto px-4 py-6 flex flex-col space-y-4">
            <Link
              href="/"
              onClick={() => setMobileMenuOpen(false)}
              className="px-4 py-3 rounded-lg text-base font-semibold text-foreground hover:text-primary hover:bg-primary/5 transition-colors"
            >
              Beranda
            </Link>

            <div className="flex flex-col space-y-1">
              <Link
                href="/properties"
                onClick={() => setMobileMenuOpen(false)}
                className="px-4 py-3 rounded-lg text-base font-semibold text-foreground hover:text-primary hover:bg-primary/5 transition-colors"
              >
                Semua Properti
              </Link>
              <div className="pl-8 flex flex-col space-y-1 border-l-2 border-muted ml-6">
                <Link
                  href="/properties/sidoarjo"
                  onClick={() => setMobileMenuOpen(false)}
                  className="py-2 text-sm text-muted-foreground hover:text-primary transition-colors"
                >
                  Homestay Sidoarjo
                </Link>
                <Link
                  href="/properties/surabaya"
                  onClick={() => setMobileMenuOpen(false)}
                  className="py-2 text-sm text-muted-foreground hover:text-primary transition-colors"
                >
                  Kost Surabaya
                </Link>
                <Link
                  href="/properties/batu"
                  onClick={() => setMobileMenuOpen(false)}
                  className="py-2 text-sm text-muted-foreground hover:text-primary transition-colors"
                >
                  Villa Batu
                </Link>
              </div>
            </div>

            <Link
              href="/#tentang"
              onClick={() => setMobileMenuOpen(false)}
              className="px-4 py-3 rounded-lg text-base font-semibold text-foreground hover:text-primary hover:bg-primary/5 transition-colors"
            >
              Tentang
            </Link>

            <Link
              href="/kontak"
              onClick={() => setMobileMenuOpen(false)}
              className="px-4 py-3 rounded-lg text-base font-semibold text-foreground hover:text-primary hover:bg-primary/5 transition-colors"
            >
              Kontak
            </Link>

            <div className="pt-6 mt-2 border-t flex flex-col items-center">
              <Link
                href="/admin/login"
                onClick={() => setMobileMenuOpen(false)}
                className="flex items-center justify-center w-full px-4 py-3 rounded-lg text-sm font-medium text-muted-foreground bg-muted/30 hover:bg-muted transition-colors"
              >
                <User className="w-4 h-4 mr-2" />
                Login Admin
              </Link>

              <a
                href="https://wa.me/6281231646523"
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => setMobileMenuOpen(false)}
                className="mt-4 flex items-center justify-center w-full px-4 py-3 rounded-lg text-sm font-semibold bg-[#25D366] text-white hover:bg-[#128C7E] transition-colors"
              >
                Chat WhatsApp Admin
              </a>
            </div>
          </div>
        </div>
      )}
    </nav>
  );
}
