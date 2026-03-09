import Link from "next/link";

export function Footer() {
  return (
    <footer className="w-full border-t bg-background py-10 text-sm">
      <div className="container mx-auto px-4 sm:px-8 grid grid-cols-1 md:grid-cols-4 gap-8">
        <div className="flex flex-col space-y-4">
          <span className="font-serif text-2xl font-bold text-primary">Homestay Alvira</span>
          <p className="text-muted-foreground leading-relaxed">
            Tiga kota, satu kenyamanan. Pengalaman menginap premium dari homestay hingga villa mewah, semua dalam genggaman Anda.
          </p>
        </div>
        <div className="flex flex-col space-y-4">
          <h3 className="font-semibold text-foreground">Properti Kami</h3>
          <Link href="/properties/sidoarjo" className="text-muted-foreground hover:text-primary">Homestay Sidoarjo</Link>
          <Link href="/properties/surabaya" className="text-muted-foreground hover:text-primary">Kost Eksklusif Surabaya</Link>
          <Link href="/properties/batu" className="text-muted-foreground hover:text-primary">Villa Premium Batu</Link>
        </div>
        <div className="flex flex-col space-y-4">
          <h3 className="font-semibold text-foreground">Bantuan</h3>
          <Link href="/faq" className="text-muted-foreground hover:text-primary">FAQ</Link>
          <Link href="/terms" className="text-muted-foreground hover:text-primary">Syarat & Ketentuan</Link>
          <Link href="/privacy" className="text-muted-foreground hover:text-primary">Kebijakan Privasi</Link>
        </div>
        <div className="flex flex-col space-y-4">
          <h3 className="font-semibold text-foreground">Kontak</h3>
          <p className="text-muted-foreground">Admin: +62 812-3456-7890</p>
          <p className="text-muted-foreground">Email: info@alvirahomestay.com</p>
        </div>
      </div>
      <div className="container mx-auto px-4 sm:px-8 mt-10 border-t pt-6 text-center text-muted-foreground">
        <p>&copy; {new Date().getFullYear()} Homestay Alvira. All rights reserved.</p>
      </div>
    </footer>
  );
}
