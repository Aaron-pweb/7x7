import prisma from "@/utils/prisma";
import { Users, FileText, Target } from "lucide-react";

export const dynamic = "force-dynamic";

export default async function AdminOverview() {
  const [totalUsers, totalTemplates, totalActiveChallenges, totalEntries] = await Promise.all([
    prisma.user.count(),
    prisma.challengeTemplate.count(),
    prisma.userChallenge.count({ where: { status: "ACTIVE" } }),
    prisma.dailyEntry.count()
  ]);

  return (
    <div className="flex flex-col gap-8">
      <div>
        <h1 className="text-3xl font-bold font-headline-md mb-2">Platform Overview</h1>
        <p className="text-white/60">Welcome to the 7x7 administrative dashboard.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white/5 border border-white/10 rounded-2xl p-6 flex flex-col gap-4">
          <Users className="w-8 h-8 text-primary" />
          <div>
            <p className="text-sm font-medium text-white/50">Total Users</p>
            <p className="text-3xl font-bold">{totalUsers}</p>
          </div>
        </div>
        
        <div className="bg-white/5 border border-white/10 rounded-2xl p-6 flex flex-col gap-4">
          <Target className="w-8 h-8 text-primary" />
          <div>
            <p className="text-sm font-medium text-white/50">Available Templates</p>
            <p className="text-3xl font-bold">{totalTemplates}</p>
          </div>
        </div>

        <div className="bg-white/5 border border-white/10 rounded-2xl p-6 flex flex-col gap-4">
          <Target className="w-8 h-8 text-secondary" />
          <div>
            <p className="text-sm font-medium text-white/50">Active User Journeys</p>
            <p className="text-3xl font-bold">{totalActiveChallenges}</p>
          </div>
        </div>

        <div className="bg-white/5 border border-white/10 rounded-2xl p-6 flex flex-col gap-4">
          <FileText className="w-8 h-8 text-primary" />
          <div>
            <p className="text-sm font-medium text-white/50">Total Daily Entries</p>
            <p className="text-3xl font-bold">{totalEntries}</p>
          </div>
        </div>
      </div>
    </div>
  );
}
