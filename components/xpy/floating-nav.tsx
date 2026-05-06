"use client";

import { motion, AnimatePresence } from "framer-motion";
import { Menu, X, ShoppingBag, User, LogOut } from "lucide-react";
import { useState, useEffect } from "react";
import { useCart } from "../../context/CartContext"; // 🔥 Memory se connect kiya
import Link from "next/link"; // 🔥 NAYA JADOO 1: Link import kiya

interface FloatingNavProps {
  onLoginClick: () => void;
  onSignupClick: () => void;
  onAdminClick: () => void;
  onCartClick: () => void; // 🔥 Naya Prop add kiya
}

export function FloatingNav({ 
  onLoginClick, 
  onSignupClick, 
  onAdminClick, 
  onCartClick // 🔥 Yahan destructured prop add kiya
}: FloatingNavProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [userName, setUserName] = useState<string | null>(null);
  const [userRole, setUserRole] = useState<string | null>(null);
  const [isMounted, setIsMounted] = useState(false);
  
  // 🔥 Cart ka data nikal liya (Sirf 'cart' array chahiye yahan count dikhane ke liye)
  const { cart } = useCart();

  // 🔥 Total items kitne hain cart mein?
  const cartItemCount = cart.reduce((total, item) => total + item.quantity, 0);

  useEffect(() => {
    setIsMounted(true); 
    const storedName = localStorage.getItem("userName");
    const storedRole = localStorage.getItem("userRole");

    if (storedName) setUserName(storedName);
    if (storedRole) setUserRole(storedRole);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("userName");
    localStorage.removeItem("userRole");
    setUserName(null);
    setUserRole(null);
    window.location.reload();
  };

  const handleAdminAccess = () => {
    if (userRole === "ADMIN") {
      onAdminClick();
    } else {
      alert("Bhai ye VIP area hai! Sirf store ka Malik (Admin) ise khol sakta hai. 🛑");
    }
  };

  // 🔥 NAYA JADOO 2: Sabme '/' laga diya taaki detail page se bhi Home pe aa sake
  const navItems = [
    { label: "Products", href: "/#products" },
    { label: "About", href: "/#about" },
    { label: "Contact", href: "/#contact" },
  ];

  if (!isMounted) {
    return null; 
  }

  return (
    <motion.nav
      initial={{ y: -100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.8, ease: "easeOut" }}
      className="fixed top-6 left-1/2 -translate-x-1/2 z-50 w-[95%] max-w-6xl"
    >
      <div className="glass rounded-2xl px-6 py-4">
        <div className="flex items-center justify-between">
          
          {/* 🔥 NAYA JADOO 3: Logo ko Link se wrap kar diya */}
          <Link href="/">
            <motion.div
              whileHover={{ scale: 1.05 }}
              className="flex items-center gap-2 cursor-pointer"
            >
              <div className="relative">
                <motion.div
                  animate={{ rotateY: [0, 360] }}
                  transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
                  style={{ transformStyle: "preserve-3d" }}
                  className="w-10 h-10 bg-primary rounded-lg flex items-center justify-center glow-cyan-sm"
                >
                  <span className="text-primary-foreground font-bold text-lg">X</span>
                </motion.div>
              </div>
              <span className="text-2xl font-bold text-foreground tracking-tight">XPY</span>
            </motion.div>
          </Link>

          {/* Desktop Nav */}
          <div className="hidden md:flex items-center gap-8">
            {navItems.map((item, index) => (
              <motion.a
                key={item.label}
                href={item.href}
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 * index }}
                whileHover={{ y: -2 }}
                className="text-muted-foreground hover:text-primary transition-colors text-sm font-medium"
              >
                {item.label}
              </motion.a>
            ))}
          </div>

          {/* Actions */}
          <div className="hidden md:flex items-center gap-3">
            
            {/* 🔥 SHOPPING BAG ICON (Ab Clickable hai) 🔥 */}
            <motion.div className="relative group">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={onCartClick} // 🔥 Yahan click event lagaya
                className="p-2 rounded-lg bg-secondary/50 text-muted-foreground hover:text-primary transition-colors relative"
              >
                <ShoppingBag className="w-5 h-5" />
                
                {/* Count Bubble */}
                <AnimatePresence>
                  {cartItemCount > 0 && (
                    <motion.span
                      initial={{ scale: 0, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      exit={{ scale: 0, opacity: 0 }}
                      className="absolute -top-1 -right-1 w-5 h-5 bg-primary text-primary-foreground text-[10px] font-bold rounded-full flex items-center justify-center border-2 border-space-dark shadow-lg shadow-primary/20"
                    >
                      {cartItemCount}
                    </motion.span>
                  )}
                </AnimatePresence>
              </motion.button>
            </motion.div>

            {/* ADMIN ACCESS ICON */}
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={handleAdminAccess}
              className="p-2 rounded-lg bg-secondary/50 text-muted-foreground hover:text-primary transition-colors"
              title="Admin Panel"
            >
              <User className="w-5 h-5" />
            </motion.button>

            {userName ? (
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-2 px-4 py-2 rounded-lg bg-secondary border border-border text-primary font-medium">
                  <User className="w-4 h-4" />
                  <span>Hi, {userName.split(" ")[0]}</span>
                </div>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={handleLogout}
                  className="p-2 rounded-lg bg-red-500/10 text-red-500 hover:bg-red-500/20 transition-colors flex items-center justify-center"
                  title="Logout"
                >
                  <LogOut className="w-5 h-5" />
                </motion.button>
              </div>
            ) : (
              <>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={onLoginClick}
                  className="px-4 py-2 rounded-lg bg-secondary text-secondary-foreground text-sm font-medium hover:bg-secondary/80 transition-colors"
                >
                  Login
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.05, boxShadow: "0 0 20px oklch(0.75 0.18 195 / 0.5)" }}
                  whileTap={{ scale: 0.95 }}
                  onClick={onSignupClick}
                  className="px-4 py-2 rounded-lg bg-primary text-primary-foreground text-sm font-medium glow-cyan-sm"
                >
                  Sign Up
                </motion.button>
              </>
            )}
          </div>

          {/* Mobile Menu Button */}
          <motion.button
            whileTap={{ scale: 0.9 }}
            onClick={() => setIsOpen(!isOpen)}
            className="md:hidden p-2 text-foreground"
          >
            {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </motion.button>
        </div>

        {/* Mobile Menu */}
        <motion.div
          initial={false}
          animate={{ height: isOpen ? "auto" : 0, opacity: isOpen ? 1 : 0 }}
          className="md:hidden overflow-hidden"
        >
          <div className="pt-4 pb-2 flex flex-col gap-4">
            {navItems.map((item) => (
              <a
                key={item.label}
                href={item.href}
                className="text-muted-foreground hover:text-primary transition-colors text-sm font-medium"
                onClick={() => setIsOpen(false)}
              >
                {item.label}
              </a>
            ))}
            <div className="flex gap-3 pt-2">
              {userName ? (
                <>
                  <div className="flex-1 px-4 py-2 rounded-lg bg-secondary border border-border text-primary font-medium text-center flex items-center justify-center gap-2">
                     <User className="w-4 h-4" /> Hi, {userName.split(" ")[0]}
                  </div>
                  <button
                    onClick={() => { handleLogout(); setIsOpen(false); }}
                    className="flex-none p-2 rounded-lg bg-red-500/10 text-red-500"
                  >
                    <LogOut className="w-5 h-5" />
                  </button>
                </>
              ) : (
                <>
                  <button
                    onClick={() => { onLoginClick(); setIsOpen(false); }}
                    className="flex-1 px-4 py-2 rounded-lg bg-secondary text-secondary-foreground text-sm font-medium"
                  >
                    Login
                  </button>
                  <button
                    onClick={() => { onSignupClick(); setIsOpen(false); }}
                    className="flex-1 px-4 py-2 rounded-lg bg-primary text-primary-foreground text-sm font-medium"
                  >
                    Sign Up
                  </button>
                </>
              )}
            </div>
          </div>
        </motion.div>
      </div>
    </motion.nav>
  );
}