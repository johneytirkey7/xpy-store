"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useCart } from "../../context/CartContext";
import { toast } from "sonner";
import { CreditCard, MapPin, Package, ArrowLeft, CheckCircle2 } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function CheckoutPage() {
  const { cart } = useCart();
  const router = useRouter();
  const [isMounted, setIsMounted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [orderSuccess, setOrderSuccess] = useState(false);

  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    address: "",
    city: "",
    pinCode: "",
  });

  useEffect(() => {
    setIsMounted(true);
  }, []);

  const subtotal = cart.reduce((total, item: any) => total + item.price * (item.quantity || 1), 0);
  const delivery = subtotal > 0 ? 50 : 0; 
  const totalAmount = subtotal + delivery;

  // 🔥 YAHAN ASLI JADOO HUA HAI (API INTEGRATION) 🔥
  const handlePlaceOrder = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.fullName || !formData.address || !formData.city || !formData.pinCode) {
      toast.error("Bhai pehle poora address toh bharo!");
      return;
    }

    setIsSubmitting(true);

    try {
      // 1. Apni nayi API ko data bhej rahe hain
      const res = await fetch("/api/orders", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          fullName: formData.fullName,
          email: formData.email,
          address: formData.address,
          city: formData.city,
          pinCode: formData.pinCode,
          totalAmount: totalAmount,
          items: cart, // Poora cart ka data bhej diya
        }),
      });

      const data = await res.json();

      if (res.ok) {
        // 2. Agar sab sahi raha, toh Success dikhao
        setIsSubmitting(false);
        setOrderSuccess(true);
        toast.success("Mubarak ho! Order Database mein Save ho gaya! 🎉");

        // 3. 3 second baad cart khali karo aur home pe bhej do
        setTimeout(() => {
          localStorage.removeItem("cart"); 
          window.location.href = "/"; 
        }, 3000);
      } else {
        toast.error("Error: " + data.error);
        setIsSubmitting(false);
      }
    } catch (error) {
      toast.error("Network error aa gaya bhai!");
      setIsSubmitting(false);
    }
  };

  if (!isMounted) return null;

  if (cart.length === 0 && !orderSuccess) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-background">
        <Package className="w-20 h-20 text-muted-foreground mb-6" />
        <h1 className="text-3xl font-bold text-foreground mb-4">Cart Khali Hai Bhai!</h1>
        <p className="text-muted-foreground mb-8">Pehle kuch products toh add kar lo.</p>
        <Link href="/#products">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="px-6 py-3 rounded-xl bg-primary text-primary-foreground font-bold glow-cyan-sm"
          >
            Go to Shop
          </motion.button>
        </Link>
      </div>
    );
  }

  if (orderSuccess) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-background">
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: "spring", damping: 15 }}
        >
          <CheckCircle2 className="w-32 h-32 text-green-500 mb-6 drop-shadow-[0_0_15px_rgba(34,197,94,0.5)]" />
        </motion.div>
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-4xl font-bold text-foreground mb-4"
        >
          Order Confirmed! 🎉
        </motion.h1>
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="text-muted-foreground text-lg"
        >
          Home page par wapas le ja rahe hain... 🚀
        </motion.p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background pt-24 pb-12 px-4">
      <div className="container mx-auto max-w-6xl">
        <Link href="/">
          <button className="flex items-center gap-2 text-muted-foreground hover:text-primary transition-colors mb-8">
            <ArrowLeft className="w-5 h-5" /> Back to Store
          </button>
        </Link>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Left Column: Form */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            className="glass rounded-3xl p-8 border border-primary/20"
          >
            <h2 className="text-2xl font-bold text-foreground mb-6 flex items-center gap-2">
              <MapPin className="w-6 h-6 text-primary" /> Delivery Address
            </h2>

            <form onSubmit={handlePlaceOrder} className="space-y-5">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <div>
                  <label className="block text-sm font-medium text-muted-foreground mb-2">Full Name</label>
                  <input
                    type="text"
                    required
                    value={formData.fullName}
                    onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                    className="w-full px-4 py-3 rounded-xl bg-secondary/50 border border-border text-foreground focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all"
                    placeholder="Johney Tirkey"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-muted-foreground mb-2">Email</label>
                  <input
                    type="email"
                    required
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="w-full px-4 py-3 rounded-xl bg-secondary/50 border border-border text-foreground focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all"
                    placeholder="hello@example.com"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-muted-foreground mb-2">Full Address</label>
                <textarea
                  required
                  rows={3}
                  value={formData.address}
                  onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                  className="w-full px-4 py-3 rounded-xl bg-secondary/50 border border-border text-foreground focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all resize-none"
                  placeholder="Street name, House number, Locality..."
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <div>
                  <label className="block text-sm font-medium text-muted-foreground mb-2">City</label>
                  <input
                    type="text"
                    required
                    value={formData.city}
                    onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                    className="w-full px-4 py-3 rounded-xl bg-secondary/50 border border-border text-foreground focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all"
                    placeholder="Bhilai"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-muted-foreground mb-2">PIN Code</label>
                  <input
                    type="text"
                    required
                    value={formData.pinCode}
                    onChange={(e) => setFormData({ ...formData, pinCode: e.target.value })}
                    className="w-full px-4 py-3 rounded-xl bg-secondary/50 border border-border text-foreground focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all"
                    placeholder="490020"
                  />
                </div>
              </div>

              {/* Payment Method */}
              <div className="pt-4">
                <h3 className="text-lg font-bold text-foreground mb-4 flex items-center gap-2">
                  <CreditCard className="w-5 h-5 text-primary" /> Payment Method
                </h3>
                <div className="p-4 rounded-xl border-2 border-primary bg-primary/5 flex items-center justify-between">
                  <span className="font-medium text-foreground">Cash on Delivery (COD)</span>
                  <div className="w-4 h-4 rounded-full bg-primary ring-4 ring-primary/30" />
                </div>
              </div>

              <motion.button
                type="submit"
                disabled={isSubmitting}
                whileHover={{ scale: 1.02, boxShadow: "0 0 20px oklch(0.75 0.18 195 / 0.4)" }}
                whileTap={{ scale: 0.98 }}
                className={`w-full py-4 mt-4 rounded-xl font-bold text-lg text-primary-foreground flex items-center justify-center gap-2 glow-cyan-sm transition-all ${isSubmitting ? "bg-primary/50 cursor-not-allowed" : "bg-primary"}`}
              >
                {isSubmitting ? "Processing..." : `Place Order • $${totalAmount.toFixed(2)}`}
              </motion.button>
            </form>
          </motion.div>

          {/* Right Column: Order Summary */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            className="h-fit glass rounded-3xl p-8 border border-border"
          >
            <h2 className="text-2xl font-bold text-foreground mb-6">Order Summary</h2>
            
            <div className="space-y-4 mb-6 max-h-[300px] overflow-y-auto pr-2">
              {cart.map((item: any) => (
                <div key={item.id} className="flex items-center justify-between p-3 rounded-xl bg-secondary/30">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-md bg-primary/20 flex items-center justify-center flex-shrink-0 overflow-hidden">
                      {item.imageUrl || item.image ? (
                        <img src={item.imageUrl || item.image} alt={item.name} className="w-full h-full object-cover" />
                      ) : (
                        <Package className="w-6 h-6 text-primary" />
                      )}
                    </div>
                    <div>
                      <p className="font-semibold text-foreground truncate max-w-[150px]">{item.name}</p>
                      <p className="text-sm text-muted-foreground">Qty: {item.quantity || 1}</p>
                    </div>
                  </div>
                  <p className="font-bold text-primary">${(item.price * (item.quantity || 1)).toFixed(2)}</p>
                </div>
              ))}
            </div>

            <div className="space-y-3 pt-6 border-t border-border">
              <div className="flex justify-between text-muted-foreground">
                <span>Subtotal</span>
                <span>${subtotal.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-muted-foreground">
                <span>Delivery Charge</span>
                <span>${delivery.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-xl font-bold text-foreground pt-4 border-t border-border">
                <span>Total</span>
                <span className="text-primary">${totalAmount.toFixed(2)}</span>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}