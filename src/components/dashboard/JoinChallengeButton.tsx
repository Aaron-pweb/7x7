"use client";

import { useTransition } from "react";
import { joinChallenge } from "@/app/actions/journal";

export function JoinChallengeButton({ templateId, userId }: { templateId: string; userId: string }) {
  const [isPending, startTransition] = useTransition();

  const handleJoin = () => {
    startTransition(async () => {
      await joinChallenge(userId, templateId);
    });
  };

  return (
    <button 
      onClick={handleJoin}
      disabled={isPending}
      className="w-full py-2 bg-on-surface/5 hover:bg-on-surface/10 text-on-surface font-bold rounded-lg transition-colors disabled:opacity-50 text-sm"
    >
      {isPending ? "Joining..." : "Join Challenge"}
    </button>
  );
}
