import prisma from "@/utils/prisma";
import { AdminForm } from "@/components/admin/AdminForm";
import { format } from "date-fns";
import { deleteChallengeTemplate } from "@/app/actions/journal";
import { Trash2 } from "lucide-react";
import Link from "next/link";

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
        <h1 className="text-3xl font-bold font-headline-md mb-2 text-on-background">Manage Challenges</h1>
        <p className="text-on-surface-variant">Create and monitor challenge templates.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Creation Form */}
        <div className="lg:col-span-1">
          <h2 className="text-xl font-bold mb-4 text-on-surface">Create New Template</h2>
          <AdminForm />
        </div>

        {/* Existing Templates Table */}
        <div className="lg:col-span-2 flex flex-col gap-4">
          <h2 className="text-xl font-bold mb-4 text-on-surface">Existing Templates</h2>
          
          <div className="bg-surface border border-surface-variant rounded-2xl overflow-hidden shadow-sm">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm">
                <thead className="bg-surface-variant/30 border-b border-surface-variant">
                  <tr>
                    <th className="px-6 py-4 font-medium text-on-surface-variant">Title</th>
                    <th className="px-6 py-4 font-medium text-on-surface-variant">Duration</th>
                    <th className="px-6 py-4 font-medium text-on-surface-variant">Participants</th>
                    <th className="px-6 py-4 font-medium text-on-surface-variant">Created</th>
                    <th className="px-6 py-4 font-medium text-on-surface-variant text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-surface-variant">
                  {templates.map( (t: typeof templates[0]) => (
                    <tr key={t.id} className="hover:bg-surface-variant/10 transition-colors">
                      <td className="px-6 py-4 font-medium text-on-surface">{t.title}</td>
                      <td className="px-6 py-4 text-on-surface-variant">{t.duration} Days</td>
                      <td className="px-6 py-4 text-on-surface-variant">
                        <Link href={`/admin/challenges/${t.id}`} className="inline-block hover:opacity-80 transition-opacity">
                          <span className="bg-primary/10 text-primary px-2 py-1 rounded-md font-bold text-xs">
                            {t._count.userChallenges} Users
                          </span>
                        </Link>
                      </td>
                      <td className="px-6 py-4 text-on-surface-variant">{format(new Date(t.createdAt), "MMM d, yyyy")}</td>
                      <td className="px-6 py-4 text-right">
                        <form action={async () => {
                          "use server";
                          await deleteChallengeTemplate(t.id);
                        }}>
                          <button type="submit" className="p-2 text-error hover:bg-error/10 rounded-lg transition-colors" title="Delete template">
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </form>
                      </td>
                    </tr>
                  ))}
                  {templates.length === 0 && (
                    <tr>
                      <td colSpan={5} className="px-6 py-8 text-center text-on-surface-variant">No templates found.</td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
