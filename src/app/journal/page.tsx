import { redirect } from "next/navigation";
import { createClient } from "@/utils/supabase/server";
import { ShaderBackground } from "@/components/ShaderBackground";
import { JournalForm } from "@/components/journal/JournalForm";
import { JournalReadOnly } from "@/components/journal/JournalReadOnly";
import prisma from "@/utils/prisma";

export const dynamic = "force-dynamic";

export default async function JournalPage({
  searchParams,
}: {
  searchParams: { [key: string]: string | string[] | undefined };
}) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    redirect("/");
  }

  const requestedDay = parseInt(searchParams.day as string);
  
  if (isNaN(requestedDay) || requestedDay < 1 || requestedDay > 10) {
    redirect("/dashboard");
  }

  // Fetch the active challenge
  const activeChallenge = await prisma.challenge.findFirst({
    where: {
      userId: user.id,
      status: "ACTIVE"
    },
    include: {
      entries: {
        include: {
          responses: true
        }
      }
    }
  });

  if (!activeChallenge) {
    redirect("/dashboard");
  }

  // Determine the current day the user should be on
  const currentDayNumber = activeChallenge.entries.length + 1;

  // Prevent users from jumping ahead
  if (requestedDay > currentDayNumber) {
    redirect(`/journal?day=${currentDayNumber}`);
  }

  // If the requested day is already completed, show a read-only view
  const completedEntry = activeChallenge.entries.find((e: any) => e.dayNumber === requestedDay);
  if (completedEntry) {
    return (
      <div className="relative min-h-[100dvh] flex flex-col bg-background text-on-background selection:bg-primary-container selection:text-on-primary-container">
        <ShaderBackground />
        <main className="flex-grow flex flex-col items-center relative z-10 px-4 md:px-8 w-full max-w-5xl mx-auto">
          <JournalReadOnly 
            dayNumber={completedEntry.dayNumber}
            completedAt={completedEntry.completedAt}
            responses={completedEntry.responses}
          />
        </main>
      </div>
    );
  }

  return (
    <div className="relative min-h-[100dvh] flex flex-col bg-background text-on-background selection:bg-primary-container selection:text-on-primary-container">
      <ShaderBackground />
      
      <main className="flex-grow flex flex-col items-center justify-center relative z-10 px-4 md:px-8 w-full max-w-5xl mx-auto">
        <JournalForm 
          challengeId={activeChallenge.id} 
          dayNumber={requestedDay} 
          userId={user.id} 
        />
      </main>
    </div>
  );
}
