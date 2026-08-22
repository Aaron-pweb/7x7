"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { SignInModal } from "./SignInModal";

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
    <header
      className={`fixed top-0 inset-x-0 z-50 transition-all duration-300 ${
        scrolled
          ? "py-3 bg-surface/70 backdrop-blur-xl border-b border-surface-variant/50 shadow-sm"
          : "py-5 bg-transparent border-b border-transparent"
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 md:px-6 flex items-center justify-between">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2 group">
          <span className="font-headline-sm text-[20px] md:text-[22px] font-bold text-primary group-hover:text-primary-container transition-colors">
            7x7
          </span>
          <span className="font-body-md text-on-surface-variant hidden sm:inline-block">
            Journal
          </span>
        </Link>

        {/* Desktop Links - Hidden on Mobile */}
        <nav className="hidden md:flex items-center gap-8 font-body-md text-[14px]">
          <Link href="#how-it-works" className="text-secondary hover:text-primary transition-colors">
            How it Works
          </Link>
        </nav>

        {/* Auth Actions */}
        <div className="flex items-center gap-3 md:gap-4">
          <SignInModal />
        </div>
      </div>
    </header>
  );
}
