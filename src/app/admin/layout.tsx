import { createClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";
import prisma from "@/utils/prisma";
import Link from "next/link";
import { Users, LayoutDashboard, PlusCircle, ArrowLeft } from "lucide-react";

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) redirect("/");

  const dbUser = await prisma.user.findUnique({ where: { id: user.id } });
  if (dbUser?.role !== "ADMIN") {
    redirect("/dashboard");
  }

  return (
    <div className="min-h-[100dvh] flex bg-[#111111] text-white">
      {/* Sidebar */}
      <aside className="w-64 border-r border-white/10 flex flex-col p-6 sticky top-0 h-screen">
        <div className="mb-10 flex flex-col gap-2">
          <h1 className="text-2xl font-bold font-headline-md tracking-tight">Admin</h1>
          <p className="text-sm text-white/50">{user.email}</p>
        </div>

        <nav className="flex flex-col gap-2 flex-grow">
          <Link href="/admin" className="flex items-center gap-3 p-3 rounded-lg hover:bg-white/5 transition-colors">
            <LayoutDashboard className="w-5 h-5 text-primary" />
            <span className="font-medium">Overview</span>
          </Link>
          <Link href="/admin/challenges" className="flex items-center gap-3 p-3 rounded-lg hover:bg-white/5 transition-colors">
            <PlusCircle className="w-5 h-5 text-primary" />
            <span className="font-medium">Challenges</span>
          </Link>
          <Link href="/admin/users" className="flex items-center gap-3 p-3 rounded-lg hover:bg-white/5 transition-colors">
            <Users className="w-5 h-5 text-primary" />
            <span className="font-medium">Users</span>
          </Link>
        </nav>

        <div className="mt-auto pt-6 border-t border-white/10">
          <Link href="/dashboard" className="flex items-center gap-3 p-3 rounded-lg hover:bg-white/5 transition-colors text-white/70 hover:text-white">
            <ArrowLeft className="w-5 h-5" />
            <span className="font-medium">Exit Admin</span>
          </Link>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-grow p-10 overflow-y-auto">
        <div className="max-w-5xl mx-auto">
          {children}
        </div>
      </main>
    </div>
  );
}
