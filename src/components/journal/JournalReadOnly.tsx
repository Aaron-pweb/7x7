"use client";

import { motion } from "framer-motion";
import { ChevronLeft } from "lucide-react";
import Link from "next/link";
import { format } from "date-fns";

interface ReadOnlyProps {
  dayNumber: number;
  completedAt: Date | string | null;
  responses: {
    promptIndex: number;
    promptText: string;
    answerText: string;
  }[];
}

export function JournalReadOnly({ dayNumber, completedAt, responses }: ReadOnlyProps) {
  const dateStr = completedAt ? format(new Date(completedAt), "MMMM d, yyyy") : "Unknown Date";

  // Sort responses by index just in case
  const sortedResponses = [...responses].sort((a, b) => a.promptIndex - b.promptIndex);

  return (
    <div className="w-full max-w-3xl mx-auto flex flex-col pt-8 pb-20">
      <div className="flex items-center justify-between mb-12">
        <Link 
          href="/dashboard"
          className="text-on-surface-variant hover:text-on-surface transition-colors flex items-center gap-1"
        >
          <ChevronLeft className="w-4 h-4" />
          <span className="text-sm font-medium">Back to Dashboard</span>
        </Link>
        <div className="text-right">
          <h2 className="text-xl font-headline-md font-bold text-on-surface">Day {dayNumber}</h2>
          <p className="text-xs text-on-surface-variant uppercase tracking-widest">{dateStr}</p>
        </div>
      </div>

      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col gap-12"
      >
        {sortedResponses.map((res, i) => (
          <div key={res.promptIndex} className="flex flex-col gap-4">
            <span className="text-primary font-bold text-xs uppercase tracking-widest">
              Question {i + 1}
            </span>
            <h3 className="text-xl md:text-2xl font-serif text-on-surface">
              {res.promptText}
            </h3>
            <div className="pl-4 border-l-2 border-primary/20">
              <p className="text-lg md:text-xl font-handwriting text-on-surface-variant whitespace-pre-wrap leading-relaxed">
                {res.answerText}
              </p>
            </div>
          </div>
        ))}
      </motion.div>
    </div>
  );
}
