import type { Metadata } from "next";
import { Inter, Playfair_Display } from "next/font/google";
import "./globals.css";
import { cn } from "@/lib/utils";
import { Providers } from "@/components/providers";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

const playfair = Playfair_Display({
  subsets: ["latin"],
  variable: "--font-playfair",
});

export const metadata: Metadata = {
  title: "Homestay Alvira | Tiga Kota, Satu Kenyamanan",
  description: "Pengalaman menginap premium dengan pilihan akomodasi beragam di Sidoarjo, Surabaya, dan Batu.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning className={cn(inter.variable, playfair.variable)}>
      <body className="font-sans antialiased min-h-screen flex flex-col bg-background text-foreground relative">
        <Providers>
          {children}
        </Providers>
      </body>
    </html>
  );
}
