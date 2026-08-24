import { createClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";
import { AdminForm } from "@/components/admin/AdminForm";
import { ShaderBackground } from "@/components/ShaderBackground";

export default async function AdminPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    redirect("/");
  }

  // NOTE: In a real app, you would verify user.role === "ADMIN" from your database.
  // For now, since you are the only user testing, we will let you see the admin page.

  return (
    <div className="relative min-h-[100dvh] flex flex-col bg-background text-on-background">
      <ShaderBackground />
      <main className="flex-grow flex flex-col relative z-10 px-4 pt-24 pb-16 w-full max-w-4xl mx-auto">
        <h1 className="text-4xl font-headline-md font-bold mb-8">Create New Challenge</h1>
        <AdminForm />
      </main>
    </div>
  );
}
