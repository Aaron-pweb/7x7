"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { createClient } from "@/utils/supabase/client";

interface SignInModalProps {
  triggerLabel?: string;
  defaultIsSignUp?: boolean;
  variant?: "primary" | "secondary" | "outline" | "ghost";
}

export function SignInModal({ triggerLabel, defaultIsSignUp = false, variant = "primary" }: SignInModalProps) {
  const [user, setUser] = useState<any>(null);
  const supabase = createClient();

  useEffect(() => {
    supabase.auth.getUser().then(({ data: { user } }) => {
      setUser(user);
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
    });

    return () => subscription.unsubscribe();
  }, [supabase.auth]);

  let buttonClasses = "transition-all duration-300 font-medium ";
  if (variant === "primary") {
    buttonClasses += "px-6 py-2.5 md:px-8 md:py-3 bg-primary text-on-primary text-[16px] md:text-[18px] rounded shadow-lg hover:bg-primary/90 hover:shadow-[0_8px_30px_rgba(167,50,28,0.3)]";
  } else if (variant === "secondary") {
    buttonClasses += "px-6 py-2.5 md:px-8 md:py-3 bg-surface-variant text-on-surface-variant text-[16px] md:text-[18px] rounded shadow-sm hover:bg-surface-variant/80";
  } else if (variant === "outline") {
    buttonClasses += "px-4 py-2 border border-primary text-primary text-[14px] md:text-[16px] rounded hover:bg-primary/5";
  } else if (variant === "ghost") {
    buttonClasses += "px-4 py-2 text-on-surface hover:text-primary text-[14px] md:text-[16px] rounded hover:bg-surface-variant/50";
  }

  if (user) {
    if (variant === "primary") {
      return (
        <Link href="/dashboard" className={buttonClasses}>
          <span className="relative z-10">Go to Dashboard</span>
        </Link>
      );
    }
    if (triggerLabel === "Sign Up") {
      return null;
    }
    if (triggerLabel === "Log In") {
      return (
        <button
          onClick={async () => {
            await supabase.auth.signOut();
            window.location.reload();
          }}
          className={buttonClasses}
        >
          <span className="relative z-10">Sign Out</span>
        </button>
      );
    }
  }

  return (
    <Link 
      href={`/login?mode=${defaultIsSignUp ? 'signup' : 'login'}`}
      className={buttonClasses}
    >
      <span className="relative z-10">{triggerLabel || (defaultIsSignUp ? "Sign Up" : "Log In")}</span>
    </Link>
  );
}
