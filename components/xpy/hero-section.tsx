"use client";

import { motion, AnimatePresence } from "framer-motion";
import { InteractiveProduct } from "./interactive-product";
import { ChevronDown, Sparkles, X } from "lucide-react";
import { useState } from "react";

export function HeroSection() {
  // 🔥 NAYA STATE: Video popup ko kholne aur band karne ke liye
  const [isVideoOpen, setIsVideoOpen] = useState(false);

  return (
    <>
      <section className="relative min-h-screen flex flex-col items-center justify-center overflow-hidden pt-24">
        {/* Background Grid */}
        <div className="absolute inset-0 grid-pattern opacity-50" />
        
        {/* Gradient Overlays */}
        <div className="absolute top-0 left-0 w-full h-64 bg-gradient-to-b from-background to-transparent" />
        <div className="absolute bottom-0 left-0 w-full h-64 bg-gradient-to-t from-background to-transparent" />
        
        {/* Floating Orbs Background */}
        <motion.div
          animate={{ x: [0, 100, 0], y: [0, -50, 0] }}
          transition={{ duration: 20, repeat: Infinity, ease: "easeInOut" }}
          className="absolute top-20 left-20 w-64 h-64 bg-primary/10 rounded-full blur-3xl"
        />
        <motion.div
          animate={{ x: [0, -100, 0], y: [0, 50, 0] }}
          transition={{ duration: 25, repeat: Infinity, ease: "easeInOut" }}
          className="absolute bottom-20 right-20 w-80 h-80 bg-primary/5 rounded-full blur-3xl"
        />

        {/* Content */}
        <div className="relative z-10 container mx-auto px-4">
          <div className="flex flex-col lg:flex-row items-center gap-8 lg:gap-16">
            {/* Text Content */}
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
              className="flex-1 text-center lg:text-left"
            >
              {/* Badge */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass-card mb-6"
              >
                <Sparkles className="w-4 h-4 text-primary" />
                <span className="text-sm text-muted-foreground">Next Generation Commerce</span>
              </motion.div>

              {/* Main Heading */}
              <motion.h1
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="text-4xl md:text-6xl lg:text-7xl font-bold leading-tight mb-6"
              >
                <span className="text-foreground">Experience</span>
                <br />
                <span className="text-primary text-glow-cyan">Future</span>
                <span className="text-foreground"> Shopping</span>
              </motion.h1>

              {/* Subtitle */}
              <motion.p
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
                className="text-lg md:text-xl text-muted-foreground max-w-xl mb-8 mx-auto lg:mx-0"
              >
                Immerse yourself in the next dimension of e-commerce. 
                Interactive 3D products, seamless experiences, limitless possibilities.
              </motion.p>

              {/* CTA Buttons */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 }}
                className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start"
              >
                <motion.button
                  whileHover={{ scale: 1.05, boxShadow: "0 0 30px oklch(0.75 0.18 195 / 0.5)" }}
                  whileTap={{ scale: 0.95 }}
                  className="px-8 py-4 rounded-xl bg-primary text-primary-foreground font-semibold glow-cyan"
                >
                  Explore Collection
                </motion.button>
                
                {/* 🔥 YAHAN ONCLICK FUNCTION LAGAYA HAI */}
                <motion.button
                  onClick={() => setIsVideoOpen(true)}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="px-8 py-4 rounded-xl glass-card text-foreground font-semibold relative overflow-hidden group"
                >
                  <span className="relative z-10 flex items-center gap-2">
                    ▶ Watch Demo
                  </span>
                  <div className="absolute inset-0 bg-primary/10 translate-y-full group-hover:translate-y-0 transition-transform duration-300" />
                </motion.button>
              </motion.div>

              {/* Stats */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.6 }}
                className="flex gap-8 mt-12 justify-center lg:justify-start"
              >
                {[
                  { value: "50K+", label: "Products" },
                  { value: "99%", label: "Satisfaction" },
                  { value: "24/7", label: "Support" },
                ].map((stat, index) => (
                  <motion.div
                    key={stat.label}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.7 + index * 0.1 }}
                    className="text-center"
                  >
                    <p className="text-2xl md:text-3xl font-bold text-primary">{stat.value}</p>
                    <p className="text-sm text-muted-foreground">{stat.label}</p>
                  </motion.div>
                ))}
              </motion.div>
            </motion.div>

            {/* 3D Product */}
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="flex-1"
            >
              <InteractiveProduct />
            </motion.div>
          </div>
        </div>

        {/* Scroll Indicator */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1 }}
          className="absolute bottom-8 left-1/2 -translate-x-1/2"
        >
          <motion.div
            animate={{ y: [0, 10, 0] }}
            transition={{ duration: 2, repeat: Infinity }}
            className="flex flex-col items-center gap-2 cursor-pointer"
          >
            <span className="text-xs text-muted-foreground uppercase tracking-widest">Scroll</span>
            <ChevronDown className="w-5 h-5 text-primary" />
          </motion.div>
        </motion.div>
      </section>

      {/* 🔥 NAYA JADOO: EPIC ROAST VIDEO POPUP 🔥 */}
      <AnimatePresence>
        {isVideoOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[200] flex items-center justify-center p-4"
          >
            {/* Dark Blur Backdrop */}
            <motion.div
              className="absolute inset-0 bg-black/80 backdrop-blur-md"
              onClick={() => setIsVideoOpen(false)}
            />

            {/* Video Container */}
            <motion.div
              initial={{ scale: 0.5, opacity: 0, y: 50 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.5, opacity: 0, y: 50 }}
              transition={{ type: "spring", damping: 25, stiffness: 300 }}
              className="relative w-full max-w-[400px] aspect-[9/16] rounded-3xl overflow-hidden border-2 border-primary shadow-[0_0_50px_rgba(6,182,212,0.4)] z-10 bg-black"
            >
              {/* Close Button */}
              <button
                onClick={() => setIsVideoOpen(false)}
                className="absolute top-4 right-4 z-20 w-10 h-10 rounded-full bg-black/50 text-white flex items-center justify-center hover:bg-primary transition-colors border border-white/20"
              >
                <X className="w-5 h-5" />
              </button>

              {/* YouTube iFrame */}
              <iframe
                width="100%"
                height="100%"
                src="https://www.youtube.com/embed/6ni-2xTaDww?autoplay=1"
                title="Raja Gujar Epic Roast"
                frameBorder="0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
                className="absolute inset-0"
              ></iframe>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}