import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { WhatsAppButton } from "@/components/floating/WhatsAppButton";
import { LivingBackground } from "@/components/animations/LivingBackground";

export default function PublicLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <LivingBackground />
      <Navbar />
      <main className="flex-1 pt-[72px]">{children}</main>
      <Footer />
      <WhatsAppButton />
    </>
  );
}
