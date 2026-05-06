"use client";

import { useState, useEffect, useRef } from "react";
import { ShoppingBag, User, LogOut, ShieldCheck, BellRing } from "lucide-react";
import { AuthModal } from "./auth-modals";
import { AdminPanel } from "./admin-panel";
import { CartDrawer } from "./cart-drawer";
import { useCart } from "../../context/CartContext";
import Link from "next/link";
import { motion } from "framer-motion";
import { toast } from "sonner"; 

export function GlobalUI() {
  const [user, setUser] = useState<any>(null);
  const [isAuthOpen, setIsAuthOpen] = useState(false);
  const [authType, setAuthType] = useState<"login" | "signup">("login"); 
  const [isAdminOpen, setIsAdminOpen] = useState(false);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const { cart } = useCart();

  // 🔥 NAYA: Sound bajane ke liye Audio reference
  const audioRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    // Page load hote hi public folder se wo 'Fahhh' wala sound utha lenge
    if (typeof window !== "undefined") {
      audioRef.current = new Audio("/notification.mp3");
    }

    const checkUser = () => {
      const storedUserName = localStorage.getItem("userName");
      const storedUserRole = localStorage.getItem("userRole");

      if (storedUserName) {
        setUser({
          name: storedUserName,
          role: storedUserRole || "USER"
        });
      } else {
        setUser(null);
      }
    };

    checkUser();
    window.addEventListener("user-login", checkUser);
    return () => window.removeEventListener("user-login", checkUser);
  }, []);

  // 🔥 NAYA JADOO: Background Order Checker (Sirf Admin Ke Liye)
  useEffect(() => {
    // Agar user admin nahi hai, toh check mat karo
    if (!user || user.role !== "ADMIN") return;

    const checkNewOrders = async () => {
      try {
        const res = await fetch("/api/orders");
        const orders = await res.json();
        
        if (orders && orders.length > 0) {
          // Database se sabse naye order ki ID nikali
          const latestOrderId = orders[0].id; 
          // Browser ki memory check ki ki admin ne aakhri konsa order dekha tha
          const lastSeenId = localStorage.getItem("lastSeenOrderId");

          // Agar naya order ID pichle wale se bada hai, iska matlab naya order aaya hai!
          if (!lastSeenId || latestOrderId > Number(lastSeenId)) {
            
            // 1. Fahhh wala Sound Bajao! 🔊
            if (audioRef.current) {
              audioRef.current.play().catch(e => console.log("Browser ne sound block kiya", e));
            }
            
            // 2. Green color ka mast notification dikhao
            toast.success(`🔔 Naya Order Aaya Hai! (Order #${latestOrderId})`, {
              duration: 5000,
              style: { backgroundColor: '#22c55e', color: 'white', border: 'none' }
            });
            
            // 3. Browser ki memory update kar do taaki baar-baar na baje
            localStorage.setItem("lastSeenOrderId", latestOrderId.toString());
          }
        }
      } catch (error) {
        console.error("Order check failed");
      }
    };

    // CONDITION 1: Jab admin offline tha aur achanak online aaya (Turant check karega)
    checkNewOrders();

    // CONDITION 2: Jab admin site khol ke online baitha hai (Har 10 second mein chup-chaap check karega)
    const interval = setInterval(checkNewOrders, 10000);

    return () => clearInterval(interval);
  }, [user]);

  const handleLogout = () => {
    localStorage.removeItem("userName");
    localStorage.removeItem("userRole");
    localStorage.removeItem("cart"); 
    setUser(null);
    window.location.reload(); 
  };

  return (
    <>
      {/* Top Navbar */}
      <header className="fixed top-0 w-full z-50 bg-background/80 backdrop-blur-md border-b border-border">
        <div className="container mx-auto px-4 h-20 flex items-center justify-between">
          
          <Link href="/" className="flex items-center gap-2">
            <div className="w-10 h-10 bg-primary text-primary-foreground font-bold flex items-center justify-center rounded-xl">X</div>
            <span className="text-xl font-bold tracking-widest text-foreground">XPY</span>
          </Link>

          <nav className="hidden md:flex items-center gap-8 text-sm font-medium text-muted-foreground">
            <Link href="/#products" className="hover:text-foreground transition-colors">Products</Link>
            <Link href="/#about" className="hover:text-foreground transition-colors">About</Link>
            <Link href="/#contact" className="hover:text-foreground transition-colors">Contact</Link>
          </nav>

          <div className="flex items-center gap-4">
            
            {user ? (
              <>
                <button onClick={() => setIsCartOpen(true)} className="relative p-2.5 rounded-full bg-secondary/50 text-foreground hover:bg-secondary transition-colors flex items-center justify-center">
                  <ShoppingBag className="w-5 h-5" />
                  {cart.length > 0 && (
                    <span className="absolute top-0 right-0 w-5 h-5 bg-primary text-primary-foreground text-xs font-bold flex items-center justify-center rounded-full transform translate-x-1 -translate-y-1">
                      {cart.length}
                    </span>
                  )}
                </button>

                {user.role === "ADMIN" && (
                  <button onClick={() => setIsAdminOpen(true)} className="relative p-2.5 rounded-full bg-primary/10 text-primary hover:bg-primary/20 transition-colors flex items-center justify-center" title="Admin Panel">
                    <ShieldCheck className="w-5 h-5" />
                    {/* Chota sa dot notification ke liye */}
                    <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full animate-pulse" />
                  </button>
                )}

                <div className="flex items-center gap-3 pl-2 md:pl-4 md:border-l border-border">
                  <span className="text-sm font-medium text-foreground bg-secondary/50 px-3 py-1.5 rounded-full hidden md:block">
                    Hi, {user.name.split(" ")[0]}
                  </span>
                  <button onClick={handleLogout} className="p-2.5 rounded-full bg-destructive/10 text-destructive hover:bg-destructive/20 transition-colors" title="Logout">
                    <LogOut className="w-5 h-5" />
                  </button>
                </div>
              </>
            ) : (
              <motion.button 
                whileHover={{ scale: 1.05 }} 
                whileTap={{ scale: 0.95 }}
                onClick={() => {
                  setAuthType("login"); 
                  setIsAuthOpen(true);
                }} 
                className="px-6 py-2.5 rounded-full bg-primary text-primary-foreground font-bold hover:opacity-90 transition-opacity"
              >
                Login / Sign Up
              </motion.button>
            )}

          </div>
        </div>
      </header>

      {/* Modals & Drawers */}
      <AuthModal 
        isOpen={isAuthOpen} 
        onClose={() => setIsAuthOpen(false)} 
        type={authType}
        onSwitchType={() => setAuthType(authType === "login" ? "signup" : "login")}
      />
      <AdminPanel isOpen={isAdminOpen} onClose={() => setIsAdminOpen(false)} />
      <CartDrawer isOpen={isCartOpen} onClose={() => setIsCartOpen(false)} />
    </>
  );
}