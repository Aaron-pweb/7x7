"use server";

import prisma from "@/utils/prisma";
import { revalidatePath } from "next/cache";

// Admin Actions
export async function createChallengeTemplate(data: { title: string; description: string; duration: number; prompts: string[] }) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error("Unauthorized");
  
  const dbUser = await prisma.user.findUnique({ where: { id: user.id } });
  if (dbUser?.role !== "ADMIN" && dbUser?.role !== "SUPERADMIN") throw new Error("Forbidden");

  await prisma.challengeTemplate.create({
    data: {
      title: data.title,
      description: data.description,
      duration: data.duration,
      prompts: data.prompts,
    }
  });
  revalidatePath("/dashboard");
  revalidatePath("/admin");
}

// User Actions
export async function joinChallenge(userId: string, templateId: string) {
  // Check if they already have an active challenge for this template
  const existing = await prisma.userChallenge.findFirst({
    where: { userId, challengeTemplateId: templateId, status: "ACTIVE" }
  });

  if (existing) return { error: "Already active in this challenge." };

  await prisma.userChallenge.create({
    data: {
      userId,
      challengeTemplateId: templateId,
      status: "ACTIVE"
    }
  });

  revalidatePath("/dashboard");
  return { success: true };
}

export async function abandonUserChallenge(userId: string, userChallengeId: string) {
  await prisma.userChallenge.update({
    where: { id: userChallengeId, userId },
    data: { status: "ABANDONED", endDate: new Date() }
  });
  revalidatePath("/dashboard");
}

export async function saveDailyEntry(data: {
  userId: string;
  userChallengeId: string;
  dayNumber: number;
  answers: { promptText: string; answerText: string }[];
}) {
  await prisma.dailyEntry.create({
    data: {
      userChallengeId: data.userChallengeId,
      userId: data.userId,
      dayNumber: data.dayNumber,
      completedAt: new Date(),
      responses: {
        create: data.answers
      }
    }
  });
  revalidatePath("/dashboard");
  return { success: true };
}

import { createClient } from "@/utils/supabase/server";

export async function deleteChallengeTemplate(id: string) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error("Unauthorized");
  
  const dbUser = await prisma.user.findUnique({ where: { id: user.id } });
  if (dbUser?.role !== "ADMIN" && dbUser?.role !== "SUPERADMIN") throw new Error("Forbidden");

  await prisma.challengeTemplate.delete({ where: { id } });
  revalidatePath("/admin/challenges");
  revalidatePath("/dashboard");
  revalidatePath("/");
}

export async function deleteUser(id: string) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error("Unauthorized");
  
  const dbUser = await prisma.user.findUnique({ where: { id: user.id } });
  if (dbUser?.role !== "SUPERADMIN") throw new Error("Forbidden");

  await prisma.user.delete({ where: { id } });
  revalidatePath("/admin/users");
}

export async function toggleAdminRole(id: string, currentRole: string) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error("Unauthorized");
  
  const dbUser = await prisma.user.findUnique({ where: { id: user.id } });
  if (dbUser?.role !== "SUPERADMIN") throw new Error("Forbidden");

  await prisma.user.update({
    where: { id },
    data: { role: currentRole === "ADMIN" ? "USER" : "ADMIN" }
  });
  revalidatePath("/admin/users");
}
