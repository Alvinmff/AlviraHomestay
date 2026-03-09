import Link from "next/link";
import { Button } from "@/components/ui/button";

export function Navbar() {
  return (
    <nav className="sticky top-0 z-50 w-full border-b bg-background/80 backdrop-blur-md supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto px-4 sm:px-8 flex h-16 items-center justify-between">
        <Link href="/" className="flex items-center space-x-2">
          <span className="font-serif text-2xl font-bold text-primary tracking-tight">
            Homestay Alvira
          </span>
        </Link>
        <div className="hidden md:flex items-center space-x-6 text-sm font-medium">
          <Link href="/properties/sidoarjo" className="text-foreground/80 hover:text-primary transition-colors">
            Sidoarjo
          </Link>
          <Link href="/properties/surabaya" className="text-foreground/80 hover:text-primary transition-colors">
            Surabaya
          </Link>
          <Link href="/properties/batu" className="text-foreground/80 hover:text-primary transition-colors">
            Villa Batu
          </Link>
        </div>
        <div className="flex items-center space-x-4">
          <Button variant="default" className="hidden md:inline-flex bg-primary hover:bg-primary/90 text-primary-foreground font-semibold">
            Pesan Sekarang
          </Button>
          {/* Mobile Menu Button can go here */}
        </div>
      </div>
    </nav>
  );
}
