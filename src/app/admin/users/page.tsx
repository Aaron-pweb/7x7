import prisma from "@/utils/prisma";
import { format } from "date-fns";

export const dynamic = "force-dynamic";

export default async function UsersPage() {
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
        <h1 className="text-3xl font-bold font-headline-md mb-2">Platform Users</h1>
        <p className="text-white/60">View and manage all registered users.</p>
      </div>

      <div className="bg-white/5 border border-white/10 rounded-2xl overflow-hidden">
        <table className="w-full text-left text-sm">
          <thead className="bg-white/5 border-b border-white/10">
            <tr>
              <th className="px-6 py-4 font-medium text-white/50">Email</th>
              <th className="px-6 py-4 font-medium text-white/50">Role</th>
              <th className="px-6 py-4 font-medium text-white/50">Active Journeys</th>
              <th className="px-6 py-4 font-medium text-white/50">Total Entries</th>
              <th className="px-6 py-4 font-medium text-white/50">Joined At</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/10">
            {users.map( (u: any) => (
              <tr key={u.id} className="hover:bg-white/5 transition-colors">
                <td className="px-6 py-4 font-medium">{u.email}</td>
                <td className="px-6 py-4 text-white/70">
                  <span className={`px-2 py-1 rounded-md text-xs font-bold ${u.role === 'ADMIN' ? 'bg-primary/20 text-primary' : 'bg-white/10 text-white/70'}`}>
                    {u.role}
                  </span>
                </td>
                <td className="px-6 py-4 text-white/70">{u._count.userChallenges}</td>
                <td className="px-6 py-4 text-white/70">{u._count.dailyEntries}</td>
                <td className="px-6 py-4 text-white/70">{format(new Date(u.createdAt), "MMM d, yyyy")}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
