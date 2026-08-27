import { redirect } from "next/navigation";
import { createClient } from "@/utils/supabase/server";
import { DashboardHeader } from "@/components/dashboard/DashboardHeader";
import { ShaderBackground } from "@/components/ShaderBackground";
import prisma from "@/utils/prisma";
import Link from "next/link";
import { JoinChallengeButton } from "@/components/dashboard/JoinChallengeButton";

export const dynamic = "force-dynamic";

export default async function DashboardPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    redirect("/");
  }


  // Fetch all available challenge templates
  const templates = await prisma.challengeTemplate.findMany({
    orderBy: { createdAt: 'desc' }
  });

  // Fetch the user's active challenges
  const activeChallenges = await prisma.userChallenge.findMany({
    where: { userId: user.id, status: "ACTIVE" },
    include: { template: true, entries: true }
  });

  // Fetch user's completed entries for streak calculation
  const completedEntries = await prisma.dailyEntry.findMany({
    where: { userId: user.id, completedAt: { not: null } },
    orderBy: { completedAt: 'desc' },
    select: { completedAt: true }
  });

  let realStreak = 0;
  if (completedEntries.length > 0) {
    const dates = [...new Set(completedEntries.map(e => e.completedAt!.toISOString().split('T')[0]))];
    const today = new Date().toISOString().split('T')[0];
    const yesterdayDate = new Date();
    yesterdayDate.setDate(yesterdayDate.getDate() - 1);
    const yesterday = yesterdayDate.toISOString().split('T')[0];

    if (dates[0] === today || dates[0] === yesterday) {
      realStreak = 1;
      let currentDate = new Date(dates[0]);
      
      for (let i = 1; i < dates.length; i++) {
        const prevDate = new Date(currentDate);
        prevDate.setDate(prevDate.getDate() - 1);
        
        if (dates[i] === prevDate.toISOString().split('T')[0]) {
          realStreak++;
          currentDate = prevDate;
        } else {
          break;
        }
      }
    }
  }

  return (
    <div className="relative min-h-[100dvh] flex flex-col bg-background text-on-background selection:bg-primary-container selection:text-on-primary-container">
      <ShaderBackground />
      <DashboardHeader streak={realStreak} />
      
      <main className="flex-grow flex flex-col items-center relative z-10 px-4 md:px-8 pt-[calc(env(safe-area-inset-top)+100px)] md:pt-[130px] pb-[calc(env(safe-area-inset-bottom)+20px)] pb-16 w-full max-w-5xl mx-auto gap-10 md:gap-14">
        
        {/* Active Challenges */}
        <section className="w-full">
          <h2 className="text-2xl font-headline-md font-bold text-on-surface mb-6">Your Active Journeys</h2>
          
          {activeChallenges.length === 0 ? (
            <div className="py-12 px-6 bg-surface-variant/20 rounded-3xl border border-white/5 text-center flex flex-col items-center justify-center">
              <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mb-4">
                <svg className="w-8 h-8 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 002-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-on-surface mb-2">No Active Journeys</h3>
              <p className="text-on-surface-variant max-w-md mx-auto">
                You haven&apos;t started any journaling challenges yet. Browse the discover section below to begin your first journey!
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {activeChallenges.map( (challenge: typeof activeChallenges[0]) => {
                const completedDays = challenge.entries.length;
                const progress = (completedDays / challenge.template.duration) * 100;
                const nextDay = completedDays + 1;
                const isFinished = completedDays >= challenge.template.duration;

                return (
                  <div key={challenge.id} className="bg-surface/50 backdrop-blur-md rounded-3xl border border-primary/20 p-6 flex flex-col justify-between hover:border-primary/40 transition-colors">
                    <div>
                      <h3 className="text-xl font-bold font-headline-md text-primary mb-2">{challenge.template.title}</h3>
                      <p className="text-sm text-on-surface-variant mb-4">Day {completedDays} of {challenge.template.duration} completed</p>
                      
                      <div className="w-full h-2 bg-on-surface/10 rounded-full mb-6 overflow-hidden">
                        <div className="h-full bg-primary rounded-full transition-all duration-1000" style={{ width: `${progress}%` }} />
                      </div>
                    </div>

                    {!isFinished ? (
                      <Link 
                        href={`/journal?challengeId=${challenge.id}&day=${nextDay}`}
                        className="w-full py-3 bg-primary text-on-primary font-bold rounded-xl text-center hover:bg-primary/90 transition-colors"
                      >
                        Begin Day {nextDay}
                      </Link>
                    ) : (
                      <div className="w-full py-3 bg-secondary/20 text-secondary font-bold rounded-xl text-center">
                        Challenge Completed! 🎉
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </section>

        {/* Discover Challenges */}
        <section className="w-full">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-headline-md font-bold text-on-surface">Discover Challenges</h2>
            <Link href="/admin" className="text-sm text-primary hover:underline">Go to Admin Panel</Link>
          </div>

          {templates.length === 0 ? (
            <div className="py-12 px-6 bg-surface-variant/20 rounded-3xl border border-white/5 text-center flex flex-col items-center justify-center">
              <div className="w-16 h-16 bg-secondary/10 rounded-full flex items-center justify-center mb-4">
                <svg className="w-8 h-8 text-secondary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-on-surface mb-2">Check Back Later</h3>
              <p className="text-on-surface-variant max-w-md mx-auto">
                No new challenges are currently available. Check back soon for more journaling templates!
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {templates.map( (template: typeof templates[0]) => {
                const isActive = activeChallenges.some( (c: typeof activeChallenges[0]) => c.challengeTemplateId === template.id);
                return (
                  <div key={template.id} className="bg-surface/30 rounded-2xl border border-white/10 p-5 flex flex-col">
                    <h3 className="font-bold text-lg mb-2">{template.title}</h3>
                    <p className="text-sm text-on-surface-variant mb-4 line-clamp-2 flex-grow">{template.description}</p>
                    <p className="text-xs font-bold text-primary mb-4">{template.duration} Days • {Array.isArray(template.prompts) ? template.prompts.length : 0} Prompts/Day</p>
                    
                    {isActive ? (
                      <div className="py-2 text-center text-sm font-bold text-secondary bg-secondary/10 rounded-lg">Already Joined</div>
                    ) : (
                      <JoinChallengeButton templateId={template.id} userId={user.id} />
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </section>

      </main>
    </div>
  );
}
