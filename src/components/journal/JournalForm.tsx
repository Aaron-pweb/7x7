"use client";

import { useState, useRef, useTransition } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Check } from "lucide-react";
import { saveDailyEntry } from "@/actions/journal";

interface Props {
  userChallengeId: string;
  dayNumber: number;
  userId: string;
  prompts: string[];
}

export function JournalForm({ userChallengeId, dayNumber, userId, prompts }: Props) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [answers, setAnswers] = useState<string[]>(Array(prompts.length).fill(""));
  const [isPending, startTransition] = useTransition();
  const inputRef = useRef<HTMLTextAreaElement>(null);

  const isLastPrompt = currentIndex === prompts.length - 1;

  const handleNext = () => {
    if (currentIndex < prompts.length - 1) {
      setCurrentIndex(prev => prev + 1);
      setTimeout(() => inputRef.current?.focus(), 100);
    }
  };

  const handleBack = () => {
    if (currentIndex > 0) {
      setCurrentIndex(prev => prev - 1);
      setTimeout(() => inputRef.current?.focus(), 100);
    }
  };

  const handleSubmit = () => {
    startTransition(async () => {
      const formattedAnswers = prompts.map((promptText, idx) => ({
        promptText,
        answerText: answers[idx]
      }));
      await saveDailyEntry({ userId, userChallengeId, dayNumber, answers: formattedAnswers });
    });
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && (e.metaKey || e.ctrlKey)) {
      if (isLastPrompt) {
        handleSubmit();
      } else {
        handleNext();
      }
    }
  };

  return (
    <div className="w-full max-w-2xl flex flex-col items-center">
      
      {/* Header Info */}
      <div className="w-full flex items-center justify-between mb-12">
        <span className="text-sm font-bold text-on-surface-variant uppercase tracking-widest">
          Day {dayNumber}
        </span>
        <div className="flex gap-2">
          {prompts.map((_, idx) => (
            <div 
              key={idx}
              className={`h-1.5 rounded-full transition-all duration-500 ${
                idx === currentIndex ? "w-8 bg-primary" : idx < currentIndex ? "w-2 bg-primary/50" : "w-2 bg-white/10"
              }`}
            />
          ))}
        </div>
        <span className="text-sm font-bold text-on-surface-variant">
          {currentIndex + 1} / {prompts.length}
        </span>
      </div>

      <div className="w-full relative h-[400px] flex flex-col">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentIndex}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.3, ease: "easeInOut" }}
            className="absolute inset-0 flex flex-col"
          >
            <h2 className="text-2xl md:text-3xl font-serif text-on-surface mb-8 leading-tight">
              {prompts[currentIndex]}
            </h2>
            
            <textarea
              ref={inputRef}
              value={answers[currentIndex]}
              onChange={(e) => {
                const newAnswers = [...answers];
                newAnswers[currentIndex] = e.target.value;
                setAnswers(newAnswers);
              }}
              onKeyDown={handleKeyDown}
              className="appearance-none flex-grow w-full bg-transparent text-xl md:text-2xl font-handwriting text-on-surface-variant placeholder:text-on-surface-variant/30 resize-none outline-none leading-relaxed"
              placeholder="Write your reflection here..."
              autoFocus
            />
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Navigation */}
      <div className="w-full flex items-center justify-between mt-8 border-t border-white/10 pt-6">
        <button
          onClick={handleBack}
          disabled={currentIndex === 0 || isPending}
          className="px-6 py-3 text-sm font-bold text-on-surface-variant hover:text-on-surface disabled:opacity-30 transition-colors"
        >
          Previous
        </button>

        {!isLastPrompt ? (
          <button
            onClick={handleNext}
            disabled={!answers[currentIndex].trim()}
            className="px-8 py-3 bg-primary text-on-primary rounded-full font-bold hover:bg-primary/90 transition-all disabled:opacity-50 disabled:hover:bg-primary"
          >
            Next Prompt
          </button>
        ) : (
          <button
            onClick={handleSubmit}
            disabled={!answers[currentIndex].trim() || isPending}
            className="px-8 py-3 bg-secondary text-on-secondary rounded-full font-bold flex items-center gap-2 hover:bg-secondary/90 transition-all disabled:opacity-50"
          >
            {isPending ? "Saving..." : "Complete Day"}
            {!isPending && <Check className="w-4 h-4" />}
          </button>
        )}
      </div>

    </div>
  );
}
