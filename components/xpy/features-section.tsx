"use client";

import { motion } from "framer-motion";
import { Box, Shield, Truck, Headphones, CreditCard, RotateCcw } from "lucide-react";

const features = [
  {
    icon: Box,
    title: "3D Product View",
    description: "Explore products from every angle with our immersive 3D viewer technology.",
  },
  {
    icon: Shield,
    title: "Secure Payments",
    description: "Bank-level encryption protects every transaction you make.",
  },
  {
    icon: Truck,
    title: "Express Delivery",
    description: "Get your orders delivered within 24-48 hours worldwide.",
  },
  {
    icon: Headphones,
    title: "24/7 Support",
    description: "Our expert team is always ready to assist you anytime.",
  },
  {
    icon: CreditCard,
    title: "Flexible Payments",
    description: "Multiple payment options including crypto and buy-now-pay-later.",
  },
  {
    icon: RotateCcw,
    title: "Easy Returns",
    description: "30-day hassle-free returns on all products, no questions asked.",
  },
];

export function FeaturesSection() {
  return (
    <section id="about" className="relative py-24 overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 grid-pattern opacity-30" />
      
      <div className="container mx-auto px-4 relative z-10">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl md:text-5xl font-bold mb-4">
            <span className="text-foreground">Why Choose </span>
            <span className="text-primary text-glow-cyan">XPY</span>
          </h2>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            Experience shopping like never before with cutting-edge features designed for the future.
          </p>
        </motion.div>

        {/* Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((feature, index) => (
            <motion.div
              key={feature.title}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              whileHover={{ y: -5, scale: 1.02 }}
              className="group"
            >
              <div className="glass-card rounded-2xl p-6 h-full transition-all duration-300 group-hover:border-primary/40">
                {/* Icon */}
                <motion.div
                  whileHover={{ rotate: [0, -10, 10, 0] }}
                  transition={{ duration: 0.5 }}
                  className="w-14 h-14 rounded-xl bg-primary/10 flex items-center justify-center mb-4 group-hover:glow-cyan-sm transition-all"
                >
                  <feature.icon className="w-7 h-7 text-primary" />
                </motion.div>

                {/* Content */}
                <h3 className="text-xl font-semibold text-foreground mb-2">{feature.title}</h3>
                <p className="text-muted-foreground text-sm leading-relaxed">{feature.description}</p>

                {/* Hover Indicator */}
                <motion.div
                  initial={{ width: 0 }}
                  whileHover={{ width: "100%" }}
                  className="h-[2px] bg-primary mt-4 rounded-full"
                />
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
