"use client";

import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { createClient } from "@/utils/supabase/client";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";

export function AuthForm() {
  const searchParams = useSearchParams();
  const mode = searchParams.get("mode");
  const isSignUp = mode === "signup";
  
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const router = useRouter();
  const supabase = createClient();

  useEffect(() => {
    const checkUser = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        router.push("/dashboard");
      }
    };
    checkUser();
  }, [supabase, router]);

  const handleEmailAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      if (isSignUp) {
        const { error: signUpError } = await supabase.auth.signUp({
          email,
          password,
          options: {
            emailRedirectTo: `${window.location.origin}/auth/callback`,
          },
        });
        if (signUpError) throw signUpError;
        alert("Check your email for the confirmation link!");
        router.push("/");
      } else {
        const { error: signInError } = await supabase.auth.signInWithPassword({
          email,
          password,
        });
        if (signInError) throw signInError;
        router.push("/dashboard");
        router.refresh();
      }
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleAuth = async () => {
    try {
      const { error: googleError } = await supabase.auth.signInWithOAuth({
        provider: "google",
        options: {
          redirectTo: `${window.location.origin}/auth/callback`,
        },
      });
      if (googleError) throw googleError;
    } catch (err: any) {
      setError(err.message);
    }
  };

  return (
    <>
      <Link 
        href="/"
        className="absolute top-4 right-4 p-2 text-on-surface-variant hover:text-primary transition-colors rounded-full hover:bg-primary/5 z-20"
        aria-label="Back to home"
      >
        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
        </svg>
      </Link>

      <div className="flex flex-col gap-1 text-center mt-2 mb-4">
        <h1 className="text-2xl sm:text-3xl font-headline-md text-on-surface leading-tight">
          {isSignUp ? "Create Account" : "Welcome Back"}
        </h1>
        <p className="text-[13px] sm:text-[15px] text-on-surface-variant">
          {isSignUp ? "Start your journaling journey today." : "Enter your credentials to access your journal."}
        </p>
      </div>

      <div className="min-h-[36px] w-full flex items-center justify-center mb-2">
        <AnimatePresence mode="wait">
          {error && (
            <motion.div 
              initial={{ opacity: 0, y: -5 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className="w-full px-3 py-2 bg-error/10 border border-error/20 text-error rounded-md text-[13px] text-center font-medium"
            >
              {error}
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <form onSubmit={handleEmailAuth} className="flex flex-col gap-4">
        <div className="flex flex-col gap-1.5">
          <label className="text-[11px] font-semibold text-on-surface-variant uppercase tracking-widest">
            Email Address
          </label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full bg-transparent border-0 border-b border-surface-variant px-0 py-1.5 text-[15px] sm:text-[16px] text-on-surface focus:ring-0 focus:border-primary transition-colors duration-300 placeholder-secondary-fixed-dim outline-none"
            placeholder="scholar@example.edu"
            required
          />
        </div>

        <div className="flex flex-col gap-1.5">
          <label className="text-[11px] font-semibold text-on-surface-variant uppercase tracking-widest">
            Password
          </label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full bg-transparent border-0 border-b border-surface-variant px-0 py-1.5 text-[15px] sm:text-[16px] text-on-surface focus:ring-0 focus:border-primary transition-colors duration-300 placeholder-secondary-fixed-dim outline-none"
            placeholder="••••••••"
            required
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-primary text-on-primary py-3 mt-2 text-[15px] font-medium hover:bg-primary/90 transition-colors duration-300 rounded disabled:opacity-50 relative overflow-hidden shadow-sm"
        >
          {loading ? "Authenticating..." : (isSignUp ? "Create Account" : "Log In")}
        </button>
      </form>

      <div className="relative flex py-4 items-center">
        <div className="flex-grow border-t border-surface-variant"></div>
        <span className="flex-shrink-0 mx-4 text-on-surface-variant font-label-caps text-[11px] uppercase tracking-widest">OR</span>
        <div className="flex-grow border-t border-surface-variant"></div>
      </div>

      <button
        onClick={handleGoogleAuth}
        disabled={loading}
        className="w-full flex items-center justify-center gap-3 bg-surface border border-surface-variant px-4 py-3 text-on-surface font-body-md text-[14px] hover:bg-surface-variant transition-colors duration-300 rounded disabled:opacity-50 shadow-sm"
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
      
      <div className="mt-4 text-center text-[13px] text-on-surface-variant font-body-md">
        {isSignUp ? (
          <>
            Already have an account?{" "}
            <Link href="/login?mode=login" className="text-primary font-semibold hover:underline underline-offset-4">
              Log in
            </Link>
          </>
        ) : (
          <>
            Don't have an account?{" "}
            <Link href="/login?mode=signup" className="text-primary font-semibold hover:underline underline-offset-4">
              Sign up
            </Link>
          </>
        )}
      </div>
    </>
  );
}
