"use client";

import { motion } from "framer-motion";
import { ShaderBackground } from "@/components/ShaderBackground";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { SignInModal } from "@/components/SignInModal";

export default function LandingPage() {
  return (
    <div className="relative min-h-[100dvh] flex flex-col bg-background text-on-background selection:bg-primary-container selection:text-on-primary-container overflow-hidden">
      <ShaderBackground />
      <Navbar />
      
      <main className="flex-grow flex flex-col items-center justify-center relative z-10 px-4 pt-[100px] md:pt-[160px] pb-10 md:pb-20 w-full overflow-hidden">
        <section className="w-full max-w-4xl mx-auto text-center flex flex-col items-center gap-6 md:gap-10">
          
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: "easeOut", delay: 0.1 }}
            className="font-headline-md text-[32px] sm:text-[48px] md:text-[64px] text-on-surface leading-[1.3] font-bold max-w-full"
          >
            Same <span className="font-sans font-black tracking-tighter bg-on-surface text-primary px-3 md:px-4 py-1 rounded-xl shadow-lg inline-block my-1 md:my-0">questions</span><br/> 
            Every day<br/> 
            Different <span className="font-handwriting font-bold tracking-wide text-[24px] sm:text-[32px] md:text-[44px] leading-[0.5] align-baseline bg-primary text-on-surface px-3 md:px-4 py-1 rounded-xl shadow-lg inline-block my-1 md:my-0 mt-2 md:mt-0">answers.</span>
          </motion.h1>
          
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: "easeOut", delay: 0.2 }}
            className="text-[15px] sm:text-[18px] md:text-[20px] text-on-surface-variant max-w-2xl mx-auto leading-relaxed px-2 md:px-0"
          >
            A minimalist approach to self-reflection. By answering the same prompts daily, 
            you uncover patterns in your thinking and build a disciplined habit of clarity.
          </motion.p>

          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6, ease: "easeOut", delay: 0.4 }}
            className="pt-6 md:pt-8 w-full px-4 md:px-0"
          >
            <SignInModal triggerLabel="Begin Today" defaultIsSignUp={true} variant="primary" />
          </motion.div>
          
        </section>
      </main>

      <Footer />
    </div>
  );
}
