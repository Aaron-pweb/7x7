"use client";

import { motion } from "framer-motion";
import { Plus } from "lucide-react";
import { startNewChallenge } from "@/app/actions/journal";
import { useTransition } from "react";
import { useRouter } from "next/navigation";

export function EmptyState({ userId }: { userId: string }) {
  const [isPending, startTransition] = useTransition();
  const router = useRouter();

  const handleStart = () => {
    startTransition(async () => {
      await startNewChallenge(userId);
      router.refresh();
    });
  };

  return (
    <motion.div 
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="flex flex-col items-center justify-center p-12 mt-12 bg-surface rounded-2xl border border-white/5 text-center max-w-lg mx-auto"
    >
      <div className="w-16 h-16 bg-primary/20 rounded-full flex items-center justify-center mb-6">
        <Plus className="w-8 h-8 text-primary" />
      </div>
      <h3 className="text-2xl font-serif text-on-surface font-semibold mb-2">
        Begin Your Journey
      </h3>
      <p className="text-on-surface/60 mb-8 max-w-sm">
        Start your first 7-day challenge. Answer the same 7 questions every day to build clarity and see how you evolve.
      </p>
      
      <button
        onClick={handleStart}
        disabled={isPending}
        className="px-8 py-3 bg-primary text-white font-medium rounded-full hover:bg-primary/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
      >
        {isPending ? "Starting..." : "Start 7x7 Challenge"}
      </button>
    </motion.div>
  );
}
