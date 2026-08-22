"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import type { ChallengeData, DailyEntryData } from "@/types/journal";
import { SEVEN_PROMPTS } from "@/types/journal";

interface ChallengeArchiveProps {
  pastChallenges: ChallengeData[];
}

export function ChallengeArchive({ pastChallenges }: ChallengeArchiveProps) {
  const [selectedEntry, setSelectedEntry] = useState<DailyEntryData | null>(null);

  if (!pastChallenges || pastChallenges.length === 0) {
    return (
      <section className="w-full flex flex-col gap-4">
        <h3 className="text-[20px] md:text-[24px] font-headline-sm font-bold text-on-surface">
          Past Reflections Archive
        </h3>
        <div className="p-8 md:p-12 rounded-2xl border border-surface-variant/40 bg-surface/30 backdrop-blur-md text-center flex flex-col items-center gap-2">
          <span className="text-3xl mb-1">📖</span>
          <p className="text-[15px] text-on-surface-variant font-medium">
            Your archive is empty right now.
          </p>
          <p className="text-[13px] text-secondary max-w-sm">
            Completed 10-day reflection cycles and daily entries will be safely preserved here.
          </p>
        </div>
      </section>
    );
  }

  return (
    <section className="w-full flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <h3 className="text-[20px] md:text-[24px] font-headline-sm font-bold text-on-surface">
          Past Reflections Archive
        </h3>
        <span className="text-[13px] text-on-surface-variant">
          {pastChallenges.length} Challenge{pastChallenges.length > 1 ? "s" : ""}
        </span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
        {pastChallenges.map((challenge, idx) => (
          <motion.div
            key={challenge.id || idx}
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: idx * 0.1 }}
            className="p-6 rounded-2xl bg-surface/60 backdrop-blur-xl border border-surface-variant/40 hover:border-primary/30 transition-all duration-300 shadow-sm hover:shadow-md flex flex-col justify-between gap-4"
          >
            <div className="flex flex-col gap-2">
              <div className="flex items-center justify-between text-[12px] text-on-surface-variant">
                <span>
                  {new Date(challenge.startDate).toLocaleDateString(undefined, {
                    month: "short",
                    day: "numeric",
                    year: "numeric",
                  })}
                </span>
                <span className="px-2.5 py-0.5 rounded-full bg-surface-variant/50 text-secondary text-[11px] font-semibold">
                  {challenge.status}
                </span>
              </div>

              <h4 className="text-[18px] font-headline-sm font-bold text-on-surface">
                10-Day Reflection Cycle
              </h4>

              <p className="text-[13px] text-secondary">
                {challenge.completedDays} / 10 days completed
              </p>
            </div>

            {/* Daily Entry Thumbnails */}
            <div className="flex flex-wrap gap-1.5 pt-2">
              {challenge.entries.map((entry) => (
                <button
                  key={entry.dayNumber}
                  onClick={() => setSelectedEntry(entry)}
                  className="px-2.5 py-1 rounded-lg bg-surface-variant/40 hover:bg-primary hover:text-on-primary text-on-surface text-[12px] font-medium transition-colors"
                  title={`View Day ${entry.dayNumber} Answers`}
                >
                  Day {entry.dayNumber}
                </button>
              ))}
            </div>
          </motion.div>
        ))}
      </div>

      {/* Answer Inspection Modal (Safe mobile viewport & scroll) */}
      <AnimatePresence>
        {selectedEntry && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[9999] flex items-center justify-center p-4 bg-surface/80 backdrop-blur-xl"
            onClick={() => setSelectedEntry(null)}
          >
            <motion.div
              initial={{ scale: 0.95, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.95, y: 20 }}
              className="w-full max-w-2xl max-h-[85vh] overflow-y-auto rounded-2xl bg-surface p-6 md:p-8 border border-primary/20 shadow-2xl flex flex-col gap-6"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center justify-between border-b border-surface-variant/40 pb-4">
                <div>
                  <span className="text-[12px] font-semibold uppercase tracking-wider text-primary">
                    Archive Entry
                  </span>
                  <h3 className="text-[22px] font-headline-md font-bold text-on-surface">
                    Day {selectedEntry.dayNumber} Reflection
                  </h3>
                </div>
                <button
                  onClick={() => setSelectedEntry(null)}
                  className="p-2 rounded-full hover:bg-surface-variant text-on-surface-variant text-[18px]"
                >
                  ✕
                </button>
              </div>

              {/* 7 Answers List */}
              <div className="flex flex-col gap-5">
                {SEVEN_PROMPTS.map((prompt) => {
                  const resp = selectedEntry.responses.find(
                    (r) => r.promptIndex === prompt.id
                  );
                  return (
                    <div key={prompt.id} className="flex flex-col gap-1.5">
                      <span className="text-[12px] font-bold text-primary uppercase tracking-wider">
                        Prompt {prompt.id}: {prompt.category}
                      </span>
                      <p className="text-[14px] font-medium text-on-surface">
                        {prompt.prompt}
                      </p>
                      <div className="p-3.5 rounded-xl bg-background border border-surface-variant/30 text-[14px] text-on-surface leading-relaxed">
                        {resp?.answerText || (
                          <span className="italic text-secondary">
                            No response recorded for this prompt.
                          </span>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}
