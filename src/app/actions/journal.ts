"use server";

import prisma from "@/utils/prisma";
import { revalidatePath } from "next/cache";

export async function startNewChallenge(userId: string) {
  // Check if user exists in our local DB, create if not (sync with Supabase)
  const user = await prisma.user.upsert({
    where: { id: userId },
    update: {},
    create: {
      id: userId,
      email: "user@example.com" // Placeholder, in a real app sync via Supabase hook or get from session
    }
  });

  // First, check if there is already an active challenge
  const activeChallenge = await prisma.challenge.findFirst({
    where: {
      userId,
      status: "ACTIVE"
    }
  });

  if (activeChallenge) {
    return { error: "You already have an active challenge." };
  }

  // Create new challenge
  const challenge = await prisma.challenge.create({
    data: {
      userId,
      status: "ACTIVE",
      startDate: new Date(),
    }
  });

  revalidatePath("/dashboard");
  return { success: true, challengeId: challenge.id };
}

export async function getDashboardData(userId: string) {
  const challenges = await prisma.challenge.findMany({
    where: { userId },
    orderBy: { createdAt: 'desc' },
    include: {
      entries: {
        include: {
          responses: true
        }
      }
    }
  });

  const activeChallenge = challenges.find((c: any) => c.status === "ACTIVE");
  const pastChallenges = challenges.filter((c: any) => c.status === "COMPLETED");

  // Transform data for UI if needed to match types
  const formatChallenge = (c: any) => ({
    ...c,
    currentDay: Math.min(10, c.entries.length + 1),
    completedDays: c.entries.length
  });

  return { 
    activeChallenge: activeChallenge ? formatChallenge(activeChallenge) : null, 
    pastChallenges: pastChallenges.map(formatChallenge) 
  };
}

export async function saveDailyEntry(challengeId: string, dayNumber: number, answers: { promptIndex: number, promptText: string, answerText: string }[], userId: string) {
  // Validate answers
  if (!answers || answers.length !== 7) {
    return { error: "You must provide exactly 7 answers." };
  }
  
  // Find challenge
  const challenge = await prisma.challenge.findUnique({
    where: { id: challengeId },
    include: { entries: true }
  });

  if (!challenge || challenge.status !== "ACTIVE") {
    return { error: "Challenge not found or not active." };
  }

  // Check if this day is already completed
  const existingEntry = challenge.entries.find((e: any) => e.dayNumber === dayNumber);
  if (existingEntry) {
    return { error: "You have already completed this day." };
  }

  // Calculate new completedDays
  const newCompletedDays = challenge.entries.length + 1;
  const isNowCompleted = newCompletedDays >= 10;

  // Run transaction
  await prisma.$transaction([
    // Create the entry
    prisma.dailyEntry.create({
      data: {
        challengeId,
        userId,
        dayNumber,
        completedAt: new Date(),
        responses: {
          create: answers.map(ans => ({
            promptIndex: ans.promptIndex,
            promptText: ans.promptText,
            answerText: ans.answerText
          }))
        }
      }
    }),
    // Update the challenge
    prisma.challenge.update({
      where: { id: challengeId },
      data: {
        status: isNowCompleted ? "COMPLETED" : "ACTIVE",
        endDate: isNowCompleted ? new Date() : null,
      }
    })
  ]);

  revalidatePath("/dashboard");
  revalidatePath("/journal");
  return { success: true };
}
