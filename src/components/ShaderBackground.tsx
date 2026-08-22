"use client";

import { motion } from "framer-motion";

export function ShaderBackground() {
  return (
    <div className="fixed inset-0 z-0 overflow-hidden bg-background pointer-events-none">
      {/* Animated Red Gradient Orbs - Intensified for flowing red glassmorphism */}
      <motion.div
        animate={{
          scale: [1, 1.4, 1],
          opacity: [0.6, 0.8, 0.6],
          x: [0, 80, 0],
          y: [0, -80, 0],
        }}
        transition={{
          duration: 15,
          repeat: Infinity,
          ease: "easeInOut",
        }}
        className="absolute -top-1/4 -right-1/4 w-[120%] h-[120%] max-w-5xl max-h-[1000px] bg-primary rounded-full mix-blend-multiply filter blur-[140px] opacity-60"
      />
      
      <motion.div
        animate={{
          scale: [1, 1.5, 1],
          opacity: [0.5, 0.7, 0.5],
          x: [0, -90, 0],
          y: [0, 90, 0],
        }}
        transition={{
          duration: 20,
          repeat: Infinity,
          ease: "easeInOut",
          delay: 2,
        }}
        className="absolute -bottom-1/4 -left-1/4 w-[120%] h-[120%] max-w-4xl max-h-[900px] bg-primary-container rounded-full mix-blend-multiply filter blur-[160px] opacity-50"
      />

      <motion.div
        animate={{
          scale: [1, 1.2, 1],
          opacity: [0.4, 0.6, 0.4],
          x: [40, -40, 40],
          y: [-40, 40, -40],
        }}
        transition={{
          duration: 18,
          repeat: Infinity,
          ease: "easeInOut",
          delay: 5,
        }}
        className="absolute top-1/4 left-1/4 w-full h-full max-w-3xl max-h-[800px] bg-primary/80 rounded-full mix-blend-multiply filter blur-[150px] opacity-40"
      />

      {/* Glassmorphic Overlay Texture */}
      <div className="absolute inset-0 bg-background/30 backdrop-blur-[60px]"></div>
      
      {/* Subtle Grain Overlay */}
      <div 
        className="absolute inset-0 opacity-[0.04]" 
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")`,
        }}
      ></div>
    </div>
  );
}
