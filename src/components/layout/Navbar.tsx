"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import { Menu, X, ChevronDown, ArrowRight } from "lucide-react";
import { DayNightToggle } from "@/components/ui/day-night-toggle";
import { usePathname } from "next/navigation";

export function Navbar() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    const handleScroll = () => {
      const isScrolled = window.scrollY > 20;
      setScrolled(isScrolled);
      // Debug log for internal monitoring
      console.log("Navbar Scroll Status:", { isScrolled, y: window.scrollY });
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    if (mobileMenuOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [mobileMenuOpen]);

  const isHome = pathname === "/";
  const useWhiteText = isHome && !scrolled && !mobileMenuOpen;

  const getLinkClassName = (href: string) => {
    return `relative transition-colors duration-300 py-2 group ${useWhiteText ? "text-white/90 hover:text-white" : "text-foreground/70 hover:text-primary"
      }`;
  };

  const Underline = ({ active }: { active: boolean }) => (
    <span
      className={`absolute bottom-0 left-0 h-[2px] transition-all duration-300 ${useWhiteText ? "bg-white" : "bg-primary"
        } ${active ? "w-full" : "w-0 group-hover:w-full"}`}
    />
  );

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-[100] transition-all duration-500 ease-out ${
        mobileMenuOpen
          ? "h-screen bg-background dark:bg-zinc-950/95"
          : scrolled || !isHome 
          ? "bg-background/95 dark:bg-zinc-950/90 backdrop-blur-md border-b border-border/50 shadow-sm" 
          : "bg-transparent border-transparent"
      }`}
    >
      <div className="container mx-auto px-4 sm:px-3 flex h-20 items-center justify-between">
        <Link href="/" className="flex items-center gap-3 relative z-[110] group">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/logo.png" alt="Homestay Alvira" className="h-10 w-auto object-contain transition-transform duration-300 group-hover:scale-105" />
          <span className={`font-serif text-xl sm:text-2xl font-bold tracking-tight transition-colors duration-500 ${useWhiteText ? "text-white" : "text-primary"
            }`}>
            Homestay Alvira
          </span>
        </Link>

        {/* Desktop Navigation */}
        <div className="hidden md:flex items-center space-x-10 text-sm font-medium">
          <Link href="/" className={getLinkClassName("/")}>
            Beranda
            <Underline active={pathname === "/"} />
          </Link>

          <div className="relative group">
            <Link
              href="/#destinasi"
              className={`flex items-center transition-colors duration-300 py-4 relative ${useWhiteText ? "text-white/90 hover:text-white" : "text-foreground/70 hover:text-primary"
                }`}
            >
              Properti
              <ChevronDown className={`w-3.5 h-3.5 ml-1 transition-all duration-300 ${useWhiteText ? "opacity-70 group-hover:opacity-100 group-hover:translate-y-0.5" : "opacity-40"}`} />
              <Underline active={pathname === "/" && typeof window !== "undefined" && window.location.hash === "#destinasi"} />
            </Link>
            <div className="absolute top-[80%] left-1/2 -translate-x-1/2 pt-2 hidden group-hover:flex flex-col">
              <div className="bg-card/95 backdrop-blur-xl border border-border/50 shadow-lg shadow-black/[0.04] rounded-2xl overflow-hidden min-w-[220px] animate-in fade-in slide-in-from-top-2 duration-300">
                <Link href="/properties/sidoarjo" className="px-5 py-3.5 block hover:bg-accent/50 text-foreground/70 hover:text-primary transition-all duration-300 text-sm">
                  Homestay Sidoarjo
                </Link>
                <div className="mx-4 border-t border-border/30" />
                <Link href="/properties/surabaya" className="px-5 py-3.5 block hover:bg-accent/50 text-foreground/70 hover:text-primary transition-all duration-300 text-sm">
                  Kost Surabaya
                </Link>
                <div className="mx-4 border-t border-border/30" />
                <Link href="/properties/batu" className="px-5 py-3.5 block hover:bg-accent/50 text-foreground/70 hover:text-primary transition-all duration-300 text-sm">
                  Villa Batu
                </Link>
              </div>
            </div>
          </div>

          <Link href="/#tentang" className={getLinkClassName("/#tentang")}>
            Tentang
            <Underline active={pathname === "/#tentang"} />
          </Link>
          <Link href="/kontak" className={getLinkClassName("/kontak")}>
            Kontak
            <Underline active={pathname === "/kontak"} />
          </Link>
        </div>

        <div className="flex items-center space-x-3 relative z-[110]">
          <DayNightToggle />

          {/* Mobile Hamburger Button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className={`md:hidden inline-flex items-center justify-center w-10 h-10 rounded-xl transition-all duration-300 ${useWhiteText ? "text-white hover:bg-white/10" : "text-foreground/70 hover:bg-muted/50"
              }`}
            aria-label="Toggle menu"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Menu Drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden absolute inset-0 top-0 bg-background dark:bg-zinc-950/95 animate-in fade-in slide-in-from-right duration-500 z-[90] overflow-y-auto">
          <div className="container mx-auto px-6 pt-32 pb-12 flex flex-col space-y-2">
            <Link
              href="/"
              onClick={() => setMobileMenuOpen(false)}
              className="px-4 py-4 rounded-xl text-lg font-bold text-foreground hover:text-primary hover:bg-accent/30 transition-all duration-300 flex items-center justify-between"
            >
              Beranda
              <ArrowRight className="w-4 h-4 opacity-30" />
            </Link>

            <div className="flex flex-col">
              <Link
                href="/#destinasi"
                onClick={() => setMobileMenuOpen(false)}
                className="px-4 py-4 rounded-xl text-lg font-bold text-foreground hover:text-primary hover:bg-accent/30 transition-all duration-300 flex items-center justify-between"
              >
                Semua Properti
                <ArrowRight className="w-4 h-4 opacity-30" />
              </Link>
              <div className="pl-6 flex flex-col space-y-1 border-l-2 border-primary/20 ml-6 mt-1 mb-4">
                <Link
                  href="/properties/sidoarjo"
                  onClick={() => setMobileMenuOpen(false)}
                  className="py-3 px-4 text-sm font-medium text-foreground/70 hover:text-primary transition-colors duration-300 rounded-lg hover:bg-accent/20"
                >
                  Homestay Sidoarjo
                </Link>
                <Link
                  href="/properties/surabaya"
                  onClick={() => setMobileMenuOpen(false)}
                  className="py-3 px-4 text-sm font-medium text-foreground/70 hover:text-primary transition-colors duration-300 rounded-lg hover:bg-accent/20"
                >
                  Kost Surabaya
                </Link>
                <Link
                  href="/properties/batu"
                  onClick={() => setMobileMenuOpen(false)}
                  className="py-3 px-4 text-sm font-medium text-foreground/70 hover:text-primary transition-colors duration-300 rounded-lg hover:bg-accent/20"
                >
                  Villa Batu
                </Link>
              </div>
            </div>

            <Link
              href="/#tentang"
              onClick={() => setMobileMenuOpen(false)}
              className="px-4 py-4 rounded-xl text-lg font-bold text-foreground hover:text-primary hover:bg-accent/30 transition-all duration-300 flex items-center justify-between"
            >
              Tentang
              <ArrowRight className="w-4 h-4 opacity-30" />
            </Link>

            <Link
              href="/kontak"
              onClick={() => setMobileMenuOpen(false)}
              className="px-4 py-4 rounded-xl text-lg font-bold text-foreground hover:text-primary hover:bg-accent/30 transition-all duration-300 flex items-center justify-between"
            >
              Kontak
              <ArrowRight className="w-4 h-4 opacity-30" />
            </Link>

            <div className="pt-8 mt-4 border-t border-border/30 flex flex-col items-center">
              <a
                href="https://wa.me/6281231646523"
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => setMobileMenuOpen(false)}
                className="mt-4 flex items-center justify-center w-full px-4 py-3.5 rounded-xl text-sm font-semibold bg-primary text-primary-foreground hover:bg-primary/90 transition-all duration-300 shadow-sm"
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
