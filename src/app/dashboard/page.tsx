"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/utils/supabase/client";
import { ShaderBackground } from "@/components/ShaderBackground";
import { DashboardHeader } from "@/components/dashboard/DashboardHeader";
import { ActiveChallengeCard } from "@/components/dashboard/ActiveChallengeCard";
import { ChallengeArchive } from "@/components/dashboard/ChallengeArchive";
import { Footer } from "@/components/Footer";
import type { ChallengeData } from "@/types/journal";
import type { User } from "@supabase/supabase-js";

// Initial starter challenge state for demonstration
const SAMPLE_CHALLENGE: ChallengeData = {
  id: "c-active-1",
  startDate: new Date().toISOString(),
  endDate: null,
  status: "ACTIVE",
  currentDay: 1,
  completedDays: 0,
  entries: [
    {
      id: "entry-1",
      dayNumber: 1,
      completedAt: null,
      responses: [],
    },
  ],
};

export default function DashboardPage() {
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [challenge, setChallenge] = useState<ChallengeData | null>(SAMPLE_CHALLENGE);
  const [pastChallenges, setPastChallenges] = useState<ChallengeData[]>([]);

  useEffect(() => {
    const supabase = createClient();
    supabase.auth.getUser().then(({ data: { user } }) => {
      if (!user) {
        // Redirect unauthenticated visitors to landing page
        router.push("/");
      } else {
        setUser(user);
        setLoading(false);
      }
    });
  }, [router]);

  const handleStartNewChallenge = () => {
    const newChallenge: ChallengeData = {
      id: `c-${Date.now()}`,
      startDate: new Date().toISOString(),
      endDate: null,
      status: "ACTIVE",
      currentDay: 1,
      completedDays: 0,
      entries: [
        {
          id: `entry-${Date.now()}-1`,
          dayNumber: 1,
          completedAt: null,
          responses: [],
        },
      ],
    };
    setChallenge(newChallenge);
  };

  if (loading) {
    return (
      <div className="min-h-[100dvh] flex items-center justify-center bg-background">
        <ShaderBackground />
        <div className="flex flex-col items-center gap-3 relative z-10">
          <div className="w-8 h-8 rounded-full border-2 border-primary border-t-transparent animate-spin" />
          <span className="text-[14px] text-on-surface-variant font-medium">
            Loading your sanctuary...
          </span>
        </div>
      </div>
    );
  }

  return (
    <div className="relative min-h-[100dvh] flex flex-col bg-background text-on-background selection:bg-primary-container selection:text-on-primary-container">
      <ShaderBackground />
      <DashboardHeader streak={challenge ? challenge.completedDays : 0} />

      <main className="flex-grow flex flex-col items-center relative z-10 px-4 md:px-8 pt-[100px] md:pt-[130px] pb-16 w-full max-w-5xl mx-auto gap-10 md:gap-14">
        
        {/* Welcome Section */}
        <section className="w-full flex flex-col gap-2 text-left">
          <span className="font-label-caps text-[12px] uppercase tracking-widest text-primary font-bold">
            Personal Sanctuary
          </span>
          <h1 className="text-[28px] md:text-[40px] font-headline-md font-bold text-on-surface">
            Welcome, {user?.email ? user.email.split("@")[0] : "Scholar"}
          </h1>
          <p className="text-[14px] md:text-[16px] text-on-surface-variant max-w-xl">
            Ten consecutive days of focused, honest reflection. Consistency builds clarity.
          </p>
        </section>

        {/* Active Challenge Card / Step Tracker */}
        <ActiveChallengeCard
          challenge={challenge}
          onStartChallenge={handleStartNewChallenge}
        />

        {/* Past Challenges Archive */}
        <ChallengeArchive pastChallenges={pastChallenges} />

      </main>

      <Footer />
    </div>
  );
}
