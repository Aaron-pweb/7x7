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
    <header className="fixed top-4 left-0 right-0 z-[100] w-full px-4 md:px-8 pointer-events-none">
      <div className="relative max-w-5xl mx-auto">
        {/* Separated Blur Background Layer */}
        <div className={`absolute inset-0 rounded-full pointer-events-none transition-all duration-300 ${
          scrolled 
            ? "bg-surface/90 backdrop-blur-md shadow-lg border border-primary/20" 
            : "bg-surface/80 backdrop-blur-md shadow-sm border border-surface-variant/30"
        }`} />
        
        {/* Interactive Content Layer */}
        <div className="relative pointer-events-auto flex items-center justify-between px-4 md:px-8 py-3 rounded-full">
          {/* Logo */}
          <Link href="/" className="flex items-center hover:opacity-80 transition-opacity">
            <Logo className="h-7 md:h-9 w-auto" />
          </Link>

          {/* Auth Actions */}
          <div className="flex items-center gap-2 md:gap-4">
            <SignInModal triggerLabel="Sign Up" defaultIsSignUp={true} variant="outline" />
          </div>
        </div>
      </div>
    </header>
  );
}
