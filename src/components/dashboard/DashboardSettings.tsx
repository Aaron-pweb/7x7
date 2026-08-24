"use client";

import { useState, useTransition } from "react";
import { Settings, X, AlertTriangle } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { abandonActiveChallenge } from "@/app/actions/journal";
import { useRouter } from "next/navigation";

export function DashboardSettings({ userId }: { userId: string }) {
  const [isOpen, setIsOpen] = useState(false);
  const [isPending, startTransition] = useTransition();
  const router = useRouter();

  const handleRestart = () => {
    startTransition(async () => {
      await abandonActiveChallenge(userId);
      setIsOpen(false);
      router.refresh();
    });
  };

  return (
    <>
      <button 
        onClick={() => setIsOpen(true)}
        className="p-2 rounded-full hover:bg-surface-variant/50 transition-colors text-on-surface-variant hover:text-on-surface"
      >
        <Settings className="w-5 h-5" />
      </button>

      <AnimatePresence>
        {isOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-background/80 backdrop-blur-sm z-40"
              onClick={() => setIsOpen(false)}
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-md bg-surface border border-white/10 rounded-2xl p-6 shadow-2xl z-50"
            >
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-bold font-headline-md text-on-surface">Journey Settings</h2>
                <button 
                  onClick={() => setIsOpen(false)}
                  className="p-1 rounded-full hover:bg-surface-variant/50 text-on-surface-variant"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="flex flex-col gap-6">
                <div className="p-4 rounded-xl bg-error/10 border border-error/20 flex flex-col gap-3">
                  <div className="flex items-center gap-2 text-error font-bold">
                    <AlertTriangle className="w-5 h-5" />
                    Abandon Journey
                  </div>
                  <p className="text-sm text-on-surface-variant">
                    Did you miss a few days? You can archive your current 10-day challenge and start fresh from Day 1. Your old entries will be saved in your archive.
                  </p>
                  <button
                    onClick={handleRestart}
                    disabled={isPending}
                    className="w-full py-2.5 rounded-lg bg-error text-white font-medium hover:bg-error/90 transition-colors disabled:opacity-50 mt-2"
                  >
                    {isPending ? "Archiving..." : "Restart 10-Day Journey"}
                  </button>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
