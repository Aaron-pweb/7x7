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

  // SYNC USER: Ensure the user exists in our database so foreign keys don't break
  await prisma.user.upsert({
    where: { id: user.id },
    update: { email: user.email! },
    create: { id: user.id, email: user.email!, role: "ADMIN" } // Defaulting to ADMIN for your testing
  });

  // Fetch all available challenge templates
  const templates = await prisma.challengeTemplate.findMany({
    orderBy: { createdAt: 'desc' }
  });

  // Fetch the user's active challenges
  const activeChallenges = await prisma.userChallenge.findMany({
    where: { userId: user.id, status: "ACTIVE" },
    include: { template: true, entries: true }
  });

  // Find overall streak (simplified for this demo: max streak of any active challenge)
  const maxStreak = activeChallenges.reduce((max: number, c: any) => Math.max(max, c.entries.length), 0);

  return (
    <div className="relative min-h-[100dvh] flex flex-col bg-background text-on-background selection:bg-primary-container selection:text-on-primary-container">
      <ShaderBackground />
      <DashboardHeader streak={maxStreak} />
      
      <main className="flex-grow flex flex-col items-center relative z-10 px-4 md:px-8 pt-[calc(env(safe-area-inset-top)+100px)] md:pt-[130px] pb-[calc(env(safe-area-inset-bottom)+20px)] pb-16 w-full max-w-5xl mx-auto gap-10 md:gap-14">
        
        {/* Active Challenges */}
        <section className="w-full">
          <h2 className="text-2xl font-headline-md font-bold text-on-surface mb-6">Your Active Journeys</h2>
          
          {activeChallenges.length === 0 ? (
            <div className="p-8 bg-surface-variant/30 rounded-2xl border border-white/5 text-center">
              <p className="text-on-surface-variant mb-4">You haven't joined any challenges yet.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {activeChallenges.map( (challenge: any) => {
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

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {templates.map( (template: any) => {
              const isActive = activeChallenges.some( (c: any) => c.challengeTemplateId === template.id);
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
        </section>

      </main>
    </div>
  );
}
