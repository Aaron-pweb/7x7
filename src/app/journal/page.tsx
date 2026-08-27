import { redirect } from "next/navigation";
import { createClient } from "@/utils/supabase/server";
import { ShaderBackground } from "@/components/ShaderBackground";
import { JournalForm } from "@/components/journal/JournalForm";
import { JournalReadOnly } from "@/components/journal/JournalReadOnly";
import prisma from "@/utils/prisma";

export const dynamic = "force-dynamic";

type Props = {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>
}

export default async function JournalPage(props: Props) {
  const searchParams = await props.searchParams;
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    redirect("/");
  }

  const requestedDay = parseInt(searchParams.day as string);
  const challengeId = searchParams.challengeId as string;
  
  if (isNaN(requestedDay) || requestedDay < 1 || !challengeId) {
    redirect("/dashboard");
  }

  // Fetch the specific user challenge
  const activeChallenge = await prisma.userChallenge.findUnique({
    where: { id: challengeId },
    include: {
      template: true,
      entries: {
        include: {
          responses: true
        }
      }
    }
  });

  if (!activeChallenge || activeChallenge.userId !== user.id) {
    redirect("/dashboard");
  }

  // Determine the current day the user should be on
  const currentDayNumber = activeChallenge.entries.length + 1;

  // Prevent jumping ahead
  if (requestedDay > currentDayNumber) {
    redirect(`/journal?challengeId=${challengeId}&day=${currentDayNumber}`);
  }

  // If the requested day is already completed, show read-only view
  const completedEntry = activeChallenge.entries.find((e: typeof activeChallenge.entries[0]) => e.dayNumber === requestedDay);
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

  const prompts = activeChallenge.template.prompts as string[];

  return (
    <div className="relative min-h-[100dvh] flex flex-col bg-background text-on-background selection:bg-primary-container selection:text-on-primary-container">
      <ShaderBackground />
      
      <main className="flex-grow flex flex-col items-center justify-center relative z-10 px-4 md:px-8 w-full max-w-5xl mx-auto">
        <JournalForm 
          userChallengeId={activeChallenge.id} 
          dayNumber={requestedDay} 
          userId={user.id}
          prompts={prompts}
        />
      </main>
    </div>
  );
}
