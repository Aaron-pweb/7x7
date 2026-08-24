import prisma from "@/utils/prisma";
import { AdminForm } from "@/components/admin/AdminForm";
import { format } from "date-fns";

export const dynamic = "force-dynamic";

export default async function ChallengesPage() {
  const templates = await prisma.challengeTemplate.findMany({
    orderBy: { createdAt: "desc" },
    include: {
      _count: {
        select: { userChallenges: true }
      }
    }
  });

  return (
    <div className="flex flex-col gap-10">
      <div>
        <h1 className="text-3xl font-bold font-headline-md mb-2">Manage Challenges</h1>
        <p className="text-white/60">Create and monitor challenge templates.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Creation Form */}
        <div className="lg:col-span-1">
          <h2 className="text-xl font-bold mb-4">Create New Template</h2>
          <AdminForm />
        </div>

        {/* Existing Templates Table */}
        <div className="lg:col-span-2 flex flex-col gap-4">
          <h2 className="text-xl font-bold mb-4">Existing Templates</h2>
          
          <div className="bg-white/5 border border-white/10 rounded-2xl overflow-hidden">
            <table className="w-full text-left text-sm">
              <thead className="bg-white/5 border-b border-white/10">
                <tr>
                  <th className="px-6 py-4 font-medium text-white/50">Title</th>
                  <th className="px-6 py-4 font-medium text-white/50">Duration</th>
                  <th className="px-6 py-4 font-medium text-white/50">Participants</th>
                  <th className="px-6 py-4 font-medium text-white/50">Created</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/10">
                {templates.map( (t: any) => (
                  <tr key={t.id} className="hover:bg-white/5 transition-colors">
                    <td className="px-6 py-4 font-medium">{t.title}</td>
                    <td className="px-6 py-4 text-white/70">{t.duration} Days</td>
                    <td className="px-6 py-4 text-white/70">{t._count.userChallenges} Users</td>
                    <td className="px-6 py-4 text-white/70">{format(new Date(t.createdAt), "MMM d, yyyy")}</td>
                  </tr>
                ))}
                {templates.length === 0 && (
                  <tr>
                    <td colSpan={4} className="px-6 py-8 text-center text-white/50">No templates found.</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

      </div>
    </div>
  );
}
