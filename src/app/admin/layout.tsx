import { createClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";
import prisma from "@/utils/prisma";
import AdminLayoutClient from "./AdminLayoutClient";

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) redirect("/");

  const dbUser = await prisma.user.findUnique({ where: { id: user.id } });
  if (dbUser?.role !== "ADMIN") {
    redirect("/dashboard");
  }

  return <AdminLayoutClient userEmail={user.email || ""}>{children}</AdminLayoutClient>;
}
