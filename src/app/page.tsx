"use client";

import { motion } from "framer-motion";
import { ShaderBackground } from "@/components/ShaderBackground";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { SignInModal } from "@/components/SignInModal";

export default function LandingPage() {
  return (
    <div className="relative min-h-screen flex flex-col bg-background text-on-background w-full">
      <ShaderBackground />
      <Navbar />
      
      <main className="flex-grow flex flex-col items-center justify-center relative z-20 px-4 pt-32 pb-20 w-full min-h-screen">
        <section className="w-full max-w-4xl mx-auto text-center flex flex-col items-center gap-6 md:gap-10">
          
          <h1 className="font-headline-md text-3xl sm:text-4xl md:text-6xl text-on-surface leading-tight font-bold w-full">
            Same <span className="font-sans font-black tracking-tighter bg-on-surface text-primary px-3 py-1 rounded-xl shadow-lg inline-block my-1">questions</span><br/> 
            Every day<br/> 
            Different <span className="font-handwriting font-bold tracking-wide text-2xl sm:text-3xl md:text-4xl leading-none bg-primary text-on-surface px-3 py-1 rounded-xl shadow-lg inline-block mt-2">answers.</span>
          </h1>
          
          <p className="text-base sm:text-lg md:text-xl text-on-surface-variant max-w-2xl mx-auto leading-relaxed px-2">
            A minimalist approach to self-reflection. By answering the same prompts daily, 
            you uncover patterns in your thinking and build a disciplined habit of clarity.
          </p>

          <div className="pt-6 md:pt-8 w-full z-30 relative">
            <SignInModal triggerLabel="Begin Today" defaultIsSignUp={true} variant="primary" />
          </div>
          
        </section>
      </main>

      <Footer />
    </div>
  );
}
