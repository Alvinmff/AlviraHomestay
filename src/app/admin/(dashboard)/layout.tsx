import { ReactNode } from "react";
import { Sidebar } from "@/components/admin/sidebar";
import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import { User } from "lucide-react";

export default async function AdminLayout({ children }: { children: ReactNode }) {
  const session = await auth();

  // jika belum login redirect ke login
  if (!session?.user) {
    redirect("/admin/login");
  }

  return (
    <div className="flex min-h-screen bg-[#F8FAF9]">
      <Sidebar />

      <div className="flex-1 flex flex-col min-w-0">
        <header className="h-16 bg-white border-b flex items-center justify-between px-4 sm:px-8">
          <div className="flex items-center gap-2 text-sm">
            <span className="font-semibold ml-10 lg:ml-0">Dashboard</span>
          </div>

          <div className="flex items-center gap-3">
            <User className="w-4 h-4" />
            <span>{session.user.name || "Admin"}</span>
          </div>
        </header>

        <main className="flex-1 p-4 sm:p-6 lg:p-8">
          {children}
        </main>
      </div>
    </div>
  );
}