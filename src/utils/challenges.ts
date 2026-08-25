import prisma from "@/utils/prisma";
import { unstable_cache } from "next/cache";

export const getCachedChallenges = unstable_cache(
  async () => {
    return await prisma.challengeTemplate.findMany({
      orderBy: { createdAt: "desc" },
    });
  },
  ["challenge-templates"],
  { revalidate: 3600, tags: ["challenges"] }
);
