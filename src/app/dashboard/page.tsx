import { redirect } from "next/navigation";
import { createClient } from "@/utils/supabase/server";
import { ShaderBackground } from "@/components/ShaderBackground";
import { DashboardHeader } from "@/components/dashboard/DashboardHeader";
import { ActiveChallengeCard } from "@/components/dashboard/ActiveChallengeCardClient";
import { ChallengeArchive } from "@/components/dashboard/ChallengeArchive";
import { Footer } from "@/components/Footer";
import { getDashboardData } from "@/app/actions/journal";

export const dynamic = "force-dynamic";

export default async function DashboardPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    redirect("/");
  }

  // Fetch from Prisma
  const { activeChallenge, pastChallenges } = await getDashboardData(user.id);
  const streak = activeChallenge ? activeChallenge.completedDays : 0;

  return (
    <div className="relative min-h-[100dvh] flex flex-col bg-background text-on-background selection:bg-primary-container selection:text-on-primary-container">
      <ShaderBackground />
      <DashboardHeader streak={streak} />

      <main className="flex-grow flex flex-col items-center relative z-10 px-4 md:px-8 pt-[100px] md:pt-[130px] pb-16 w-full max-w-5xl mx-auto gap-10 md:gap-14">
        
        {/* Welcome Section */}
        <section className="w-full flex flex-col gap-2 text-left">
          <span className="font-label-caps text-[12px] uppercase tracking-widest text-primary font-bold">
            Personal Sanctuary
          </span>
          <h1 className="text-[28px] md:text-[40px] font-headline-md font-bold text-on-surface">
            Welcome, {user.email ? user.email.split("@")[0] : "Scholar"}
          </h1>
          <p className="text-[14px] md:text-[16px] text-on-surface-variant max-w-xl">
            Ten consecutive days of focused, honest reflection. Consistency builds clarity.
          </p>
        </section>

        <ActiveChallengeCard
          challenge={activeChallenge as any}
          userId={user.id}
        />
        
        <ChallengeArchive pastChallenges={pastChallenges as any} />

      </main>

      <Footer />
    </div>
  );
}
