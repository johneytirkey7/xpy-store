"use client";

import { motion } from "framer-motion";
import { Globe, Mail, MessageCircle, Phone } from "lucide-react";

export function Footer() {
  const links = {
    Product: ["Features", "Pricing", "Changelog", "Documentation"],
    Company: ["About", "Careers", "Press", "Partners"],
    Resources: ["Blog", "Community", "Support", "API"],
    Legal: ["Privacy", "Terms", "Cookies", "Licenses"],
  };

const socials = [
  { icon: Globe, href: "#" },
  { icon: Mail, href: "#" },
  { icon: MessageCircle, href: "#" },
  { icon: Phone, href: "#" },
];

  return (
    <footer id="contact" className="relative py-16 border-t border-border">
      <div className="absolute inset-0 grid-pattern opacity-20" />
      
      <div className="container mx-auto px-4 relative z-10">
        <div className="grid grid-cols-2 md:grid-cols-5 gap-8 mb-12">
          {/* Brand */}
          <div className="col-span-2 md:col-span-1">
            <motion.div
              whileHover={{ scale: 1.05 }}
              className="flex items-center gap-2 mb-4"
            >
              <div className="w-10 h-10 bg-primary rounded-lg flex items-center justify-center glow-cyan-sm">
                <span className="text-primary-foreground font-bold text-lg">X</span>
              </div>
              <span className="text-2xl font-bold text-foreground">XPY</span>
            </motion.div>
            <p className="text-muted-foreground text-sm mb-4">
              The future of e-commerce, today.
            </p>
            <div className="flex gap-3">
              {socials.map((social, index) => (
                <motion.a
                  key={index}
                  href={social.href}
                  whileHover={{ scale: 1.1, y: -2 }}
                  whileTap={{ scale: 0.9 }}
                  className="w-10 h-10 rounded-lg bg-secondary/50 flex items-center justify-center text-muted-foreground hover:text-primary hover:bg-primary/10 transition-colors"
                >
                  <social.icon className="w-5 h-5" />
                </motion.a>
              ))}
            </div>
          </div>

          {/* Links */}
          {Object.entries(links).map(([category, items]) => (
            <div key={category}>
              <h4 className="font-semibold text-foreground mb-4">{category}</h4>
              <ul className="space-y-2">
                {items.map((item) => (
                  <li key={item}>
                    <motion.a
                      href="#"
                      whileHover={{ x: 4 }}
                      className="text-sm text-muted-foreground hover:text-primary transition-colors"
                    >
                      {item}
                    </motion.a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Bottom */}
        <div className="pt-8 border-t border-border flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-sm text-muted-foreground">
            {new Date().getFullYear()} XPY. All rights reserved.
          </p>
          <p className="text-sm text-muted-foreground">
            Designed for the{" "}
            <span className="text-primary">future</span>
          </p>
        </div>
      </div>
    </footer>
  );
}
