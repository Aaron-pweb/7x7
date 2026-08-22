"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import type { ChallengeData } from "@/types/journal";

interface ActiveChallengeCardProps {
  challenge: ChallengeData | null;
  onStartChallenge?: () => void;
}

export function ActiveChallengeCard({
  challenge,
  onStartChallenge,
}: ActiveChallengeCardProps) {
  // Empty state: User hasn't started a 10-day challenge yet
  if (!challenge) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
        className="w-full rounded-2xl md:rounded-3xl p-6 md:p-10 bg-surface/60 backdrop-blur-xl border border-primary/15 shadow-[0_8px_32px_rgba(167,50,28,0.06)] relative overflow-hidden"
      >
        <div className="max-w-xl flex flex-col gap-4 md:gap-5">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-primary/10 border border-primary/20 text-primary text-[12px] font-semibold w-fit">
            <span>✨</span>
            <span>Ready for Clarity</span>
          </div>

          <h2 className="text-[26px] md:text-[36px] font-headline-md font-bold text-on-surface leading-tight">
            Start Your 10-Day Reflection Journey
          </h2>

          <p className="text-[14px] md:text-[16px] text-on-surface-variant leading-relaxed">
            Dedicate 5 minutes every day to answer the same 7 essential prompts. Watch your patterns, thoughts, and emotional clarity evolve over 10 days.
          </p>

          <div className="pt-2">
            <button
              onClick={onStartChallenge}
              className="inline-flex items-center justify-center gap-2 px-7 py-3.5 rounded-xl bg-primary text-on-primary font-medium text-[15px] md:text-[16px] shadow-lg hover:bg-primary/90 hover:shadow-[0_8px_30px_rgba(167,50,28,0.3)] transition-all duration-300 transform active:scale-95"
            >
              <span>Begin Day 1</span>
              <span>→</span>
            </button>
          </div>
        </div>
      </motion.div>
    );
  }

  // Active Challenge State
  const currentDay = challenge.currentDay || 1;
  const isTodayCompleted = challenge.entries.some(
    (e) => e.dayNumber === currentDay && e.completedAt !== null
  );

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: "easeOut" }}
      className="w-full rounded-2xl md:rounded-3xl p-6 md:p-10 bg-surface/70 backdrop-blur-xl border border-primary/15 shadow-[0_8px_32px_rgba(167,50,28,0.06)] flex flex-col gap-6 md:gap-8 relative overflow-hidden"
    >
      {/* Top Banner: Day Progress + Badge */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <span className="px-3 py-1 rounded-full bg-primary/10 border border-primary/20 text-primary text-[12px] md:text-[13px] font-bold uppercase tracking-wider">
            Active Journey
          </span>
          <span className="text-[13px] text-on-surface-variant">
            Day {currentDay} of 10
          </span>
        </div>

        <div className="text-[12px] md:text-[13px] text-secondary font-medium">
          {challenge.completedDays} / 10 Completed ({Math.round((challenge.completedDays / 10) * 100)}%)
        </div>
      </div>

      {/* Headline & Encouragement */}
      <div className="flex flex-col gap-2">
        <h2 className="text-[24px] md:text-[34px] font-headline-md font-bold text-on-surface leading-snug">
          {isTodayCompleted ? (
            <>Day {currentDay} is <span className="text-primary font-serif italic">Complete</span> 🎉</>
          ) : (
            <>Ready for <span className="text-primary font-serif italic">Day {currentDay}</span></>
          )}
        </h2>
        <p className="text-[14px] md:text-[16px] text-on-surface-variant">
          {isTodayCompleted
            ? "You have completed today's reflection. Take a moment to rest, or review your answers below."
            : "7 focused questions are waiting for you today. Answer with raw honesty."}
        </p>
      </div>

      {/* 10-Day Visual Step Tracker (Touch-friendly & Responsive) */}
      <div className="flex flex-col gap-2">
        <div className="grid grid-cols-5 sm:grid-cols-10 gap-2 md:gap-3">
          {Array.from({ length: 10 }, (_, i) => i + 1).map((day) => {
            const entry = challenge.entries.find((e) => e.dayNumber === day);
            const isCompleted = entry && entry.completedAt !== null;
            const isCurrent = day === currentDay;
            const isLocked = day > currentDay;

            return (
              <Link
                key={day}
                href={isLocked ? "#" : `/journal?day=${day}`}
                className={`flex flex-col items-center justify-center p-2.5 md:p-3 rounded-xl border transition-all duration-200 text-center ${
                  isCompleted
                    ? "bg-primary text-on-primary border-primary shadow-sm hover:opacity-90"
                    : isCurrent
                    ? "bg-primary/10 border-primary text-primary font-bold ring-2 ring-primary/20"
                    : "bg-surface/50 border-surface-variant/40 text-on-surface-variant opacity-60 cursor-not-allowed"
                }`}
                onClick={(e) => {
                  if (isLocked) e.preventDefault();
                }}
              >
                <span className="text-[11px] uppercase tracking-wider font-semibold opacity-75">
                  Day
                </span>
                <span className="text-[16px] md:text-[18px] font-bold">
                  {day}
                </span>
                <span className="text-[10px] mt-0.5">
                  {isCompleted ? "✓" : isCurrent ? "Today" : "🔒"}
                </span>
              </Link>
            );
          })}
        </div>
      </div>

      {/* Action CTA Button */}
      <div className="pt-2 flex flex-col sm:flex-row items-center gap-4">
        <Link
          href={`/journal?day=${currentDay}`}
          className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-8 py-3.5 rounded-xl bg-primary text-on-primary font-medium text-[15px] md:text-[16px] shadow-lg hover:bg-primary/90 hover:shadow-[0_8px_30px_rgba(167,50,28,0.3)] transition-all duration-300 transform active:scale-95"
        >
          <span>{isTodayCompleted ? "Review Today's Journal" : `Begin Day ${currentDay}`}</span>
          <span>→</span>
        </Link>

        {challenge.completedDays === 10 && (
          <Link
            href="/wrap-up"
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl border border-primary text-primary hover:bg-primary/5 font-medium text-[15px] transition-colors"
          >
            <span>View 10-Day Wrap-Up Summary</span>
            <span>✨</span>
          </Link>
        )}
      </div>
    </motion.div>
  );
}
