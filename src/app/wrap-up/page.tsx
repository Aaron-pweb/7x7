import { redirect } from "next/navigation";
import { createClient } from "@/utils/supabase/server";
import prisma from "@/utils/prisma";
import { ShaderBackground } from "@/components/ShaderBackground";
import Link from "next/link";
import { format } from "date-fns";

export const dynamic = "force-dynamic";

export default async function WrapUpPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    redirect("/");
  }

  // Fetch the most recently completed challenge
  const latestCompletedChallenge = await prisma.userChallenge.findFirst({
    where: { userId: user.id, status: "COMPLETED" },
    orderBy: { endDate: "desc" },
    include: {
      template: true,
      entries: {
        orderBy: { dayNumber: "asc" },
        include: { responses: true }
      }
    }
  });

  if (!latestCompletedChallenge) {
    return (
      <div className="relative min-h-[100dvh] flex flex-col bg-background text-on-background">
        <ShaderBackground />
        <div className="flex-grow flex flex-col items-center justify-center p-4 relative z-10 text-center">
          <h2 className="text-3xl font-bold font-headline-md mb-4 text-on-surface">No Completed Journeys Yet</h2>
          <p className="text-on-surface-variant mb-8 max-w-md">Complete a full challenge to unlock your reflection summary and see how your mindset has evolved.</p>
          <Link href="/dashboard" className="px-6 py-3 bg-primary text-on-primary font-bold rounded-xl hover:bg-primary/90 transition-colors">
            Back to Dashboard
          </Link>
        </div>
      </div>
    );
  }

  // Group responses by prompt instead of by day for better reading
  const allPrompts = latestCompletedChallenge.template.prompts as string[];
  
  return (
    <div className="relative min-h-[100dvh] flex flex-col bg-background text-on-background selection:bg-primary-container selection:text-on-primary-container pb-20">
      <ShaderBackground />
      
      <main className="flex-grow flex flex-col items-center relative z-10 px-4 md:px-8 pt-24 w-full max-w-4xl mx-auto">
        <div className="text-center mb-16">
          <span className="bg-primary/20 text-primary px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider mb-4 inline-block">
            Journey Completed
          </span>
          <h1 className="text-4xl md:text-5xl font-bold font-headline-md text-on-surface mb-4">
            {latestCompletedChallenge.template.title}
          </h1>
          <p className="text-on-surface-variant text-lg">
            Completed on {latestCompletedChallenge.endDate ? format(new Date(latestCompletedChallenge.endDate), "MMMM d, yyyy") : 'Recently'}
          </p>
        </div>

        <div className="w-full flex flex-col gap-12">
          {allPrompts.map((promptText, promptIndex) => {
            return (
              <div key={promptIndex} className="bg-surface/40 border border-surface-variant backdrop-blur-md rounded-3xl p-6 md:p-10 shadow-sm">
                <h3 className="text-2xl font-serif text-on-surface mb-8 border-b border-surface-variant pb-4">
                  {promptText}
                </h3>
                
                <div className="flex flex-col gap-6">
                  {latestCompletedChallenge.entries.map((entry) => {
                    const response = entry.responses.find(r => r.promptText === promptText);
                    if (!response || !response.answerText.trim()) return null;

                    return (
                      <div key={entry.id} className="flex gap-4">
                        <div className="w-16 flex-shrink-0 flex flex-col items-center">
                          <span className="text-xs font-bold text-on-surface-variant uppercase tracking-widest">Day</span>
                          <span className="text-xl font-bold text-primary">{entry.dayNumber}</span>
                        </div>
                        <div className="flex-grow bg-surface-variant/20 p-5 rounded-2xl rounded-tl-none">
                          <p className="text-lg font-handwriting text-on-surface-variant leading-relaxed">
                            {response.answerText}
                          </p>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </div>

        <div className="mt-16 text-center w-full">
          <Link href="/dashboard" className="inline-flex items-center gap-2 px-8 py-4 bg-primary text-on-primary font-bold rounded-xl hover:bg-primary/90 transition-transform hover:scale-105 shadow-lg text-lg">
            Start a New Journey
          </Link>
        </div>
      </main>
    </div>
  );
}
