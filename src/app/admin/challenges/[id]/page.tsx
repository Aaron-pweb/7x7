import prisma from "@/utils/prisma";
import { format } from "date-fns";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import { notFound } from "next/navigation";

export const dynamic = "force-dynamic";

export default async function ChallengeParticipantsPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const template = await prisma.challengeTemplate.findUnique({
    where: { id },
    include: {
      userChallenges: {
        include: { user: true },
        orderBy: { startDate: "desc" }
      }
    }
  });

  if (!template) return notFound();

  return (
    <div className="flex flex-col gap-10">
      <div>
        <Link href="/admin/challenges" className="inline-flex items-center gap-2 text-primary hover:underline mb-4 font-medium">
          <ArrowLeft className="w-4 h-4" /> Back to Challenges
        </Link>
        <h1 className="text-3xl font-bold font-headline-md mb-2 text-on-background">{template.title} Participants</h1>
        <p className="text-on-surface-variant">View all users participating in this challenge.</p>
      </div>

      <div className="bg-surface border border-surface-variant rounded-2xl overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="bg-surface-variant/30 border-b border-surface-variant">
              <tr>
                <th className="px-6 py-4 font-medium text-on-surface-variant">User Email</th>
                <th className="px-6 py-4 font-medium text-on-surface-variant">Status</th>
                <th className="px-6 py-4 font-medium text-on-surface-variant">Joined At</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-surface-variant">
              {template.userChallenges.map((uc) => (
                <tr key={uc.id} className="hover:bg-surface-variant/10 transition-colors">
                  <td className="px-6 py-4 font-medium text-on-surface">{uc.user.email}</td>
                  <td className="px-6 py-4">
                    <span className={`px-2 py-1 rounded-md text-[10px] uppercase tracking-wider font-bold ${
                      uc.status === 'ACTIVE' ? 'bg-primary/20 text-primary' :
                      uc.status === 'COMPLETED' ? 'bg-green-500/20 text-green-400' :
                      'bg-surface-variant text-on-surface-variant'
                    }`}>
                      {uc.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-on-surface-variant">{format(new Date(uc.startDate), "MMM d, yyyy")}</td>
                </tr>
              ))}
              {template.userChallenges.length === 0 && (
                <tr>
                  <td colSpan={3} className="px-6 py-8 text-center text-on-surface-variant">No participants found.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
