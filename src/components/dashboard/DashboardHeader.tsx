"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { createClient } from "@/utils/supabase/client";
import { Logo } from "@/components/Logo";
import { useState, useEffect } from "react";
import type { User } from "@supabase/supabase-js";

interface DashboardHeaderProps {
  streak?: number;
}

export function DashboardHeader({ streak = 0 }: DashboardHeaderProps) {
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const supabase = createClient();
    supabase.auth.getUser().then(({ data }) => {
      setUser(data.user);
    });
  }, []);

  const handleSignOut = async () => {
    setLoading(true);
    const supabase = createClient();
    await supabase.auth.signOut();
    router.push("/");
    router.refresh();
  };

  const userEmail = user?.email || "Scholar";
  const displayName = userEmail.split("@")[0];

  return (
    <header className="fixed top-4 md:top-6 left-1/2 -translate-x-1/2 z-50 w-[94vw] max-w-6xl transition-all duration-300">
      <div className="flex items-center justify-between px-5 md:px-8 py-2.5 md:py-3 rounded-full bg-surface/75 backdrop-blur-2xl border border-primary/10 shadow-[0_8px_30px_rgb(0,0,0,0.04)]">
        
        {/* Brand Logo */}
        <Link href="/dashboard" className="flex items-center group transition-transform duration-200 hover:scale-[1.02]">
          <Logo className="h-8 md:h-10 w-auto" />
        </Link>

        {/* Right Actions: Streak + User Menu */}
        <div className="flex items-center gap-2 md:gap-4">
          
          {/* Streak Indicator */}
          {streak > 0 && (
            <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-primary/10 border border-primary/20 text-primary text-[12px] md:text-[13px] font-semibold">
              <span>🔥</span>
              <span>{streak} Day{streak > 1 ? "s" : ""}</span>
            </div>
          )}

          {/* User Profile Pill */}
          <div className="flex items-center gap-2 pl-2 border-l border-surface-variant/50">
            <span className="hidden sm:inline-block text-[13px] text-on-surface-variant font-medium max-w-[120px] truncate">
              {displayName}
            </span>
            <button
              onClick={handleSignOut}
              disabled={loading}
              className="text-[12px] md:text-[13px] text-secondary hover:text-primary font-medium px-3 py-1.5 rounded-full hover:bg-primary/5 transition-colors"
              title="Sign Out"
            >
              {loading ? "..." : "Sign Out"}
            </button>
          </div>

        </div>
      </div>
    </header>
  );
}
