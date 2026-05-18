import { ReactNode } from "react";
import { Sidebar } from "@/components/admin/sidebar";
import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import { User } from "lucide-react";
import { prisma } from "@/lib/prisma";

export default async function AdminLayout({ children }: { children: ReactNode }) {
  const session = await auth();

  // jika belum login redirect ke login
  if (!session?.user) {
    redirect("/admin/login");
  }

  // Fetch real-time counts for badges
  const pendingBookingsCount = await prisma.booking.count({
    where: { status: "INQUIRY" }
  });

  const totalReviewsCount = await prisma.review.count();

  return (
    <div className="flex min-h-screen bg-background text-foreground">
      <Sidebar pendingBookings={pendingBookingsCount} totalReviews={totalReviewsCount} />

      <div className="flex-1 flex flex-col min-w-0">
        <header className="h-20 bg-background border-b border-border/50 flex items-center justify-between px-8">
          <div className="flex items-center gap-2 text-sm">
            <span className="font-semibold ml-10 lg:ml-0">Dashboard</span>
          </div>

          <div className="flex items-center gap-3">
            <User className="w-4 h-4" />
            <span>{session.user.name || "Admin"}</span>
          </div>
        </header>

        <main className="flex-1 p-4 sm:p-6 lg:p-8 w-full min-w-0 overflow-x-hidden">
          {children}
        </main>
      </div>
    </div>
  );
}