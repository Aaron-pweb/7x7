"use client";

import { motion } from "framer-motion";
import { ShaderBackground } from "@/components/ShaderBackground";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { SignInModal } from "@/components/SignInModal";

export default function LandingPage() {
  return (
    <div className="relative min-h-[100dvh] flex flex-col bg-background text-on-background selection:bg-primary-container selection:text-on-primary-container">
      <ShaderBackground />
      <Navbar />
      
      <main className="flex-grow flex flex-col items-center justify-center relative z-10 px-6 py-10 md:py-20">
        <section className="max-w-4xl mx-auto text-center flex flex-col items-center gap-8 md:gap-10">
          
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: "easeOut", delay: 0.1 }}
            className="font-headline-md text-[40px] md:text-[64px] text-on-surface leading-[1.1] font-bold"
          >
            Same questions.<br className="hidden md:block"/> Every day.<br className="hidden md:block"/> <span className="text-primary">Different answers.</span>
          </motion.h1>
          
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: "easeOut", delay: 0.2 }}
            className="text-[16px] md:text-[20px] text-on-surface-variant max-w-2xl mx-auto leading-relaxed px-4 md:px-0"
          >
            A minimalist approach to self-reflection. By answering the same 7 prompts daily, 
            you uncover patterns in your thinking and build a disciplined habit of clarity.
          </motion.p>

          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6, ease: "easeOut", delay: 0.4 }}
            className="pt-6 md:pt-8"
          >
            <SignInModal triggerLabel="Begin Today" defaultIsSignUp={true} variant="primary" />
            <p className="text-[11px] md:text-[12px] font-semibold text-secondary-fixed-dim mt-6 uppercase tracking-widest">
              No credit card required. Free forever.
            </p>
          </motion.div>
          
        </section>
      </main>

      <Footer />
    </div>
  );
}
