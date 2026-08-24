"use client";

import { useState, useTransition } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useRouter } from "next/navigation";
import { saveDailyEntry } from "@/app/actions/journal";
import { SEVEN_PROMPTS } from "@/types/journal";
import { ArrowRight, Check, ChevronLeft } from "lucide-react";

interface JournalFormProps {
  challengeId: string;
  dayNumber: number;
  userId: string;
}

export function JournalForm({ challengeId, dayNumber, userId }: JournalFormProps) {
  const router = useRouter();
  const [currentStep, setCurrentStep] = useState(0);
  const [answers, setAnswers] = useState<string[]>(Array(7).fill(""));
  const [isPending, startTransition] = useTransition();

  const handleNext = () => {
    if (answers[currentStep].trim() === "") return;
    if (currentStep < 6) {
      setCurrentStep((prev) => prev + 1);
    } else {
      submitEntry();
    }
  };

  const handleBack = () => {
    if (currentStep > 0) {
      setCurrentStep((prev) => prev - 1);
    }
  };

  const submitEntry = () => {
    startTransition(async () => {
      const formattedAnswers = SEVEN_PROMPTS.map((prompt, index) => ({
        promptIndex: prompt.id,
        promptText: prompt.prompt,
        answerText: answers[index]
      }));
      
      const result = await saveDailyEntry(challengeId, dayNumber, formattedAnswers, userId);
      
      if (result.success) {
        router.push("/dashboard?completed=true");
      } else {
        alert(result.error);
      }
    });
  };

  const prompt = SEVEN_PROMPTS[currentStep];

  return (
    <div className="w-full max-w-2xl mx-auto flex flex-col items-center">
      {/* Progress Bar */}
      <div className="w-full flex items-center justify-between mb-12">
        <button 
          onClick={() => currentStep > 0 ? handleBack() : router.push("/dashboard")}
          className="text-on-surface-variant hover:text-on-surface transition-colors flex items-center gap-1"
        >
          <ChevronLeft className="w-4 h-4" />
          <span className="text-sm font-medium">{currentStep > 0 ? "Previous" : "Dashboard"}</span>
        </button>
        <div className="flex gap-2">
          {SEVEN_PROMPTS.map((_, idx) => (
            <div 
              key={idx} 
              className={`h-1.5 rounded-full transition-all duration-300 ${
                idx === currentStep ? "w-8 bg-primary" : 
                idx < currentStep ? "w-2 bg-primary/50" : "w-2 bg-white/10"
              }`}
            />
          ))}
        </div>
        <div className="w-[80px]" /> {/* Spacer to balance flex layout */}
      </div>

      {/* Main Form */}
      <div className="w-full relative h-[400px]">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentStep}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.3, ease: "easeOut" }}
            className="absolute inset-0 flex flex-col"
          >
            <span className="text-primary font-bold text-xs uppercase tracking-widest mb-4">
              Question {currentStep + 1} of 7 • {prompt.category}
            </span>
            <h2 className="text-2xl md:text-3xl font-serif text-on-surface mb-8 leading-tight">
              {prompt.prompt}
            </h2>
            
            <textarea
              autoFocus
              value={answers[currentStep]}
              onChange={(e) => {
                const newAnswers = [...answers];
                newAnswers[currentStep] = e.target.value;
                setAnswers(newAnswers);
              }}
              placeholder={prompt.placeholder}
              className="w-full flex-grow bg-transparent border-b-2 border-white/10 focus:border-primary resize-none outline-none text-lg text-on-surface placeholder:text-white/20 transition-colors py-4 font-handwriting leading-relaxed"
              onKeyDown={(e) => {
                if (e.key === "Enter" && !e.shiftKey) {
                  e.preventDefault();
                  handleNext();
                }
              }}
            />
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Action Area */}
      <div className="w-full mt-8 flex justify-end">
        <button
          onClick={handleNext}
          disabled={answers[currentStep].trim() === "" || isPending}
          className="flex items-center gap-2 px-8 py-3 bg-primary text-white font-medium rounded-full hover:bg-primary/90 transition-all disabled:opacity-50 disabled:cursor-not-allowed transform active:scale-95"
        >
          {isPending ? "Saving..." : currentStep === 6 ? "Finish Entry" : "Next Question"}
          {currentStep === 6 ? <Check className="w-5 h-5" /> : <ArrowRight className="w-5 h-5" />}
        </button>
      </div>
    </div>
  );
}
