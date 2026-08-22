"use client";

import { motion } from "framer-motion";
import { ShaderBackground } from "@/components/ShaderBackground";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { SignInModal } from "@/components/SignInModal";

export default function LandingPage() {
  return (
    <div className="relative min-h-screen flex flex-col bg-background text-on-background selection:bg-primary-container selection:text-on-primary-container">
      <ShaderBackground />
      <Navbar />
      
      <main className="flex-grow flex flex-col items-center justify-center relative z-10 px-6 pt-32 pb-16">
        <section className="max-w-4xl mx-auto text-center flex flex-col items-center gap-8 md:gap-10">
          
          <motion.div 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: "easeOut" }}
            className="inline-block px-4 py-1.5 rounded-full border border-primary/20 bg-primary/5 backdrop-blur-sm mb-2"
          >
            <span className="font-label-caps text-[12px] uppercase tracking-widest text-primary">
              The 10-Day Challenge
            </span>
          </motion.div>

          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: "easeOut", delay: 0.1 }}
            className="font-display-lg-mobile text-[40px] md:font-headline-md md:text-[64px] text-on-surface leading-[1.1] font-bold"
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
            <SignInModal />
            <p className="text-[11px] md:text-[12px] font-semibold text-secondary-fixed-dim mt-6 uppercase tracking-widest">
              No credit card required. Free forever.
            </p>
          </motion.div>
          
        </section>

        {/* Feature Teasers */}
        <section id="how-it-works" className="w-full max-w-5xl mx-auto mt-32 md:mt-40 grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8">
          {[
            {
              title: "7 Prompts",
              desc: "Carefully designed questions to probe your gratitude, challenges, and aspirations.",
            },
            {
              title: "10 Days",
              desc: "A brief, highly-focused commitment. Long enough to build a habit, short enough to complete.",
            },
            {
              title: "Clear Insights",
              desc: "Review your journey on Day 10 to see how your mindset evolved over the challenge.",
            }
          ].map((feature, idx) => (
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ duration: 0.5, delay: idx * 0.15 }}
              key={idx} 
              className="glass-panel p-6 md:p-8 rounded-2xl text-center flex flex-col items-center gap-4 hover:-translate-y-1 transition-transform duration-300"
            >
              <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center text-primary font-headline-sm text-[20px] font-bold">
                {idx + 1}
              </div>
              <h3 className="font-headline-sm text-[18px] md:text-[20px] text-on-surface">{feature.title}</h3>
              <p className="text-[14px] md:text-[15px] text-secondary leading-relaxed">{feature.desc}</p>
            </motion.div>
          ))}
        </section>

      </main>

      <Footer />
    </div>
  );
}
