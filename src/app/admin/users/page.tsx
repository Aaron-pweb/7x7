import prisma from "@/utils/prisma";
import { format } from "date-fns";
import { deleteUser, toggleAdminRole } from "@/app/actions/journal";
import { Trash2, Shield, ShieldOff } from "lucide-react";
import { createClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";

export const dynamic = "force-dynamic";

export default async function UsersPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/");

  const dbUser = await prisma.user.findUnique({ where: { id: user.id } });
  if (dbUser?.role !== "SUPERADMIN") redirect("/admin");

  const users = await prisma.user.findMany({
    orderBy: { createdAt: "desc" },
    include: {
      _count: {
        select: { userChallenges: true, dailyEntries: true }
      }
    }
  });

  return (
    <div className="flex flex-col gap-10">
      <div>
        <h1 className="text-3xl font-bold font-headline-md mb-2 text-on-background">Platform Users</h1>
        <p className="text-on-surface-variant">View and manage all registered users.</p>
      </div>

      <div className="bg-surface border border-surface-variant rounded-2xl overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="bg-surface-variant/30 border-b border-surface-variant">
              <tr>
                <th className="px-6 py-4 font-medium text-on-surface-variant">Email</th>
                <th className="px-6 py-4 font-medium text-on-surface-variant">Role</th>
                <th className="px-6 py-4 font-medium text-on-surface-variant">Active Journeys</th>
                <th className="px-6 py-4 font-medium text-on-surface-variant">Total Entries</th>
                <th className="px-6 py-4 font-medium text-on-surface-variant">Joined At</th>
                <th className="px-6 py-4 font-medium text-on-surface-variant text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-surface-variant">
              {users.map( (u: any) => (
                <tr key={u.id} className="hover:bg-surface-variant/10 transition-colors">
                  <td className="px-6 py-4 font-medium text-on-surface">{u.email}</td>
                  <td className="px-6 py-4">
                    <span className={`px-2 py-1 rounded-md text-[10px] uppercase tracking-wider font-bold ${u.role === 'ADMIN' ? 'bg-primary/20 text-primary' : 'bg-surface-variant text-on-surface-variant'}`}>
                      {u.role}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-on-surface-variant">{u._count.userChallenges}</td>
                  <td className="px-6 py-4 text-on-surface-variant">{u._count.dailyEntries}</td>
                  <td className="px-6 py-4 text-on-surface-variant">{format(new Date(u.createdAt), "MMM d, yyyy")}</td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <form action={async () => {
                        "use server";
                        await toggleAdminRole(u.id, u.role);
                      }}>
                        <button type="submit" className="p-2 text-on-surface-variant hover:bg-surface-variant hover:text-on-surface rounded-lg transition-colors" title={u.role === "ADMIN" ? "Revoke Admin" : "Make Admin"}>
                          {u.role === "ADMIN" ? <ShieldOff className="w-4 h-4" /> : <Shield className="w-4 h-4" />}
                        </button>
                      </form>
                      <form action={async () => {
                        "use server";
                        await deleteUser(u.id);
                      }}>
                        <button type="submit" className="p-2 text-error hover:bg-error/10 rounded-lg transition-colors" title="Delete user">
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </form>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
