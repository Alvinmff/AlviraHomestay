import Link from "next/link";

export default function PropertiesCatalog() {
  return (
    <div className="container mx-auto px-4 py-16">
      <h1 className="text-4xl font-serif font-bold text-primary mb-4 text-center">Katalog Properti</h1>
      <p className="text-muted-foreground text-center mb-12 max-w-2xl mx-auto">
        Jelajahi berbagai pilihan akomodasi premium dari Homestay Alvira di tiga kota pilihan di Jawa Timur.
      </p>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {["sidoarjo", "surabaya", "batu"].map((city) => (
          <div key={city} className="rounded-xl border bg-card p-6 shadow-sm hover:shadow-md transition-shadow">
            <h2 className="text-2xl font-serif font-semibold text-foreground capitalize mb-2">{city}</h2>
            <p className="text-muted-foreground mb-6 capitalize">Akomodasi terbaik di kota {city}.</p>
            <Link href={`/properties/${city}`} className="inline-flex items-center justify-center rounded-lg h-9 px-4 text-sm w-full bg-primary text-primary-foreground hover:bg-primary/90 transition-colors bg-clip-padding">
              Lihat Properti {city}
            </Link>
          </div>
        ))}
      </div>
    </div>
  );
}
