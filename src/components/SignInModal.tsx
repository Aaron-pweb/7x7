"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { createClient } from "@/utils/supabase/client";
import { createPortal } from "react-dom";

export function SignInModal({ 
  defaultIsSignUp = false, 
  triggerLabel, 
  variant = "primary" 
}: { 
  defaultIsSignUp?: boolean; 
  triggerLabel?: string; 
  variant?: "primary" | "outline" | "ghost" 
}) {
  const router = useRouter();
  const supabase = createClient();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  const [isSignUp, setIsSignUp] = useState(defaultIsSignUp);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [user, setUser] = useState<any>(null);
  const [mounted, setMounted] = useState(false);
  
  const emailInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    setMounted(true);
    supabase.auth.getUser().then(({ data: { user } }) => {
      setUser(user);
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (_event, session) => {
        setUser(session?.user || null);
      }
    );

    return () => subscription.unsubscribe();
  }, [supabase.auth]);

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
      setTimeout(() => emailInputRef.current?.focus(), 100);
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isOpen]);

  const handleEmailAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    
    let authError;

    if (isSignUp) {
      const { error } = await supabase.auth.signUp({ email, password });
      authError = error;
    } else {
      const { error } = await supabase.auth.signInWithPassword({ email, password });
      authError = error;
    }

    if (authError) {
      setError(authError.message);
      setLoading(false);
    } else {
      router.push("/journal");
    }
  };

  const handleGoogleAuth = async () => {
    setLoading(true);
    setError(null);
    const { error } = await supabase.auth.signInWithOAuth({
      provider: "google",
      options: {
        redirectTo: `${window.location.origin}/auth/callback`,
      },
    });

    if (error) {
      setError(error.message);
      setLoading(false);
    }
  };

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    router.push("/");
  };

  // Determine button styles based on variant
  let buttonClasses = "";
  if (variant === "primary") {
    buttonClasses = "group relative px-6 py-2.5 md:px-8 md:py-3 bg-transparent border border-primary text-primary text-[16px] md:text-[18px] overflow-hidden transition-all duration-300 hover:bg-primary hover:text-on-primary rounded";
  } else if (variant === "outline") {
    buttonClasses = "px-4 py-2 border border-surface-variant text-on-surface hover:bg-surface-variant transition-colors rounded text-[14px]";
  } else {
    buttonClasses = "px-4 py-2 text-secondary hover:text-primary transition-colors text-[14px]";
  }

  if (user) {
    if (variant === "ghost") return null; // Don't show multiple sign out buttons
    return (
      <div className="flex items-center gap-3 md:gap-4">
        <button
          onClick={() => router.push("/dashboard")}
          className="px-4 py-2 bg-primary text-on-primary font-body-md text-[13px] md:text-[14px] rounded hover:bg-primary-container transition-colors"
        >
          Dashboard
        </button>
        <button
          onClick={handleSignOut}
          className="text-[13px] md:text-[14px] text-secondary hover:text-primary transition-colors"
        >
          Sign Out
        </button>
      </div>
    );
  }

  const modalContent = (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
          className="fixed inset-0 z-[9999] flex items-center justify-center p-4 backdrop-blur-md bg-[#120F0F]/40"
          onClick={() => setIsOpen(false)}
        >
          <motion.div
            initial={{ y: 30, opacity: 0, scale: 0.95 }}
            animate={{ y: 0, opacity: 1, scale: 1 }}
            exit={{ y: 20, opacity: 0, scale: 0.95 }}
            transition={{ type: "spring", damping: 25, stiffness: 350 }}
            className="w-full max-w-md bg-surface/95 backdrop-blur-3xl border border-primary/10 p-8 md:p-10 relative overflow-hidden flex flex-col gap-6 rounded-2xl shadow-[0_20px_60px_-15px_rgba(167,50,28,0.15)]"
            onClick={(e) => e.stopPropagation()}
          >
            
            <button 
              onClick={() => setIsOpen(false)}
              className="absolute top-6 right-6 p-2 text-on-surface-variant hover:text-primary transition-colors rounded-full hover:bg-primary/5"
              aria-label="Close modal"
            >
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>

            <div className="flex flex-col gap-2 text-center mt-2">
              <h1 className="text-[28px] md:text-[32px] font-headline-md text-on-surface leading-tight">
                {isSignUp ? "Create Account" : "Welcome Back"}
              </h1>
              <p className="text-[14px] md:text-[16px] text-on-surface-variant">
                {isSignUp ? "Start your journaling journey today." : "Enter your credentials to access your journal."}
              </p>
            </div>



            {/* Reserved Space to Prevent Layout Shift */}
            <div className="h-10 w-full flex items-center justify-center -my-2">
              <AnimatePresence mode="wait">
                {error && (
                  <motion.div 
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0 }}
                    className="w-full px-3 py-2 bg-error/10 border border-error/20 text-error rounded-md text-[13px] text-center font-medium"
                  >
                    {error}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            <form onSubmit={handleEmailAuth} className="flex flex-col gap-5">
              <div className="flex flex-col gap-2">
                <label className="text-[11px] md:text-[12px] font-semibold text-on-surface-variant uppercase tracking-widest">
                  Email Address
                </label>
                <input
                  ref={emailInputRef}
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full bg-transparent border-0 border-b border-surface-variant px-0 py-2 text-[16px] text-on-surface focus:ring-0 focus:border-primary transition-colors duration-300 placeholder-secondary-fixed-dim outline-none"
                  placeholder="scholar@example.edu"
                  required
                />
              </div>

              <div className="flex flex-col gap-2">
                <label className="text-[11px] md:text-[12px] font-semibold text-on-surface-variant uppercase tracking-widest">
                  Password
                </label>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full bg-transparent border-0 border-b border-surface-variant px-0 py-2 text-[16px] text-on-surface focus:ring-0 focus:border-primary transition-colors duration-300 placeholder-secondary-fixed-dim outline-none"
                  placeholder="••••••••"
                  required
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-primary text-on-primary py-3.5 mt-2 text-[16px] font-medium hover:bg-primary/90 transition-colors duration-300 rounded disabled:opacity-50 relative overflow-hidden shadow-sm"
              >
                {loading ? (
                  <span className="flex items-center justify-center gap-2">
                    <svg className="animate-spin h-5 w-5 text-on-primary" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Authenticating...
                  </span>
                ) : (
                  isSignUp ? "Create Account" : "Log In"
                )}
              </button>
            </form>

            <div className="relative flex py-1 items-center">
              <div className="flex-grow border-t border-surface-variant"></div>
              <span className="flex-shrink-0 mx-4 text-on-surface-variant font-label-caps text-[11px] uppercase tracking-widest">OR</span>
              <div className="flex-grow border-t border-surface-variant"></div>
            </div>

            <button
              onClick={handleGoogleAuth}
              disabled={loading}
              className="w-full flex items-center justify-center gap-3 bg-surface border border-surface-variant px-4 py-3.5 text-on-surface font-body-md text-[15px] hover:bg-surface-variant transition-colors duration-300 rounded disabled:opacity-50 shadow-sm"
              type="button"
            >
              <svg className="w-5 h-5" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"></path>
                <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"></path>
                <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"></path>
                <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"></path>
              </svg>
              Continue with Google
            </button>
            
            <div className="mt-2 text-center text-[13px] md:text-[14px] text-on-surface-variant font-body-md">
              {isSignUp ? (
                <>
                  Already have an account?{" "}
                  <button onClick={() => setIsSignUp(false)} className="text-primary font-semibold hover:underline underline-offset-4">
                    Log in
                  </button>
                </>
              ) : (
                <>
                  Don't have an account?{" "}
                  <button onClick={() => setIsSignUp(true)} className="text-primary font-semibold hover:underline underline-offset-4">
                    Sign up
                  </button>
                </>
              )}
            </div>
            
            
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );

  return (
    <>
      <button
        onClick={() => {
          setIsSignUp(defaultIsSignUp);
          setIsOpen(true);
        }}
        className={buttonClasses}
      >
        <span className="relative z-10">{triggerLabel || (defaultIsSignUp ? "Sign Up" : "Log In")}</span>
      </button>

      {mounted && createPortal(modalContent, document.body)}
    </>
  );
}
