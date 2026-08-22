"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { SignInModal } from "./SignInModal";
import { Logo } from "./Logo";

export function Navbar() {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <header className="fixed top-6 left-1/2 -translate-x-1/2 z-50 w-[92vw] max-w-5xl transition-all duration-300">
      <div 
        className={`flex items-center justify-between px-6 md:px-8 py-3 rounded-full transition-all duration-500 ${
          scrolled 
            ? "bg-surface/70 backdrop-blur-2xl border border-primary/10 shadow-[0_8px_30px_rgb(0,0,0,0.04)]" 
            : "bg-surface/40 backdrop-blur-lg border border-surface-variant/30 shadow-sm"
        }`}
      >
        {/* Logo */}
        <Link href="/" className="flex items-center group transition-transform duration-200 hover:scale-[1.02]">
          <Logo className="h-7 md:h-8 w-auto" />
        </Link>

        {/* Desktop Links - Hidden on Mobile */}
        <nav className="hidden md:flex items-center gap-8 font-body-md text-[14px]">
        </nav>

        {/* Auth Actions */}
        <div className="flex items-center gap-3 md:gap-4">
          <SignInModal triggerLabel="Log In" defaultIsSignUp={false} variant="ghost" />
          <SignInModal triggerLabel="Sign Up" defaultIsSignUp={true} variant="outline" />
        </div>
      </div>
    </header>
  );
}
