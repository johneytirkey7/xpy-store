"use client";

import { motion, AnimatePresence } from "framer-motion";
import { X, Trash2, ShoppingBag, ArrowRight } from "lucide-react"; 
import { useCart } from "../../context/CartContext";
import { useRouter } from "next/navigation";

interface CartDrawerProps {
  isOpen: boolean;
  onClose: () => void;
}

export function CartDrawer({ isOpen, onClose }: CartDrawerProps) {
  // 🔥 ERROR 1 FIX: updateQuantity yahan se hata diya
  const { cart, removeFromCart } = useCart(); 
  const router = useRouter();

  // 🔥 Yahan bhi item ko 'any' de diya taaki error na aaye
  const totalAmount = cart.reduce((total, item: any) => total + item.price * (item.quantity || 1), 0);

  const handleCheckoutClick = () => {
    if (cart.length === 0) return;
    onClose(); 
    router.push("/checkout"); 
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 z-[100] bg-space-dark/80 backdrop-blur-sm"
          />

          {/* Drawer */}
          <motion.div
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", damping: 25, stiffness: 200 }}
            className="fixed top-0 right-0 h-full w-full md:w-[450px] z-[101] bg-background border-l border-border flex flex-col shadow-2xl"
          >
            {/* Header */}
            <div className="flex items-center justify-between p-6 border-b border-border">
              <h2 className="text-xl font-bold text-foreground flex items-center gap-2">
                <ShoppingBag className="w-5 h-5 text-primary" />
                Your Cart
                <span className="bg-primary/20 text-primary text-sm px-2 py-0.5 rounded-full ml-2">
                  {cart.length} items
                </span>
              </h2>
              <motion.button
                whileHover={{ scale: 1.1, rotate: 90 }}
                whileTap={{ scale: 0.9 }}
                onClick={onClose}
                className="w-10 h-10 rounded-full bg-secondary/50 flex items-center justify-center text-muted-foreground hover:text-foreground transition-colors"
              >
                <X className="w-5 h-5" />
              </motion.button>
            </div>

            {/* Cart Items */}
            <div className="flex-1 overflow-y-auto p-6 space-y-4">
              {cart.length === 0 ? (
                <div className="h-full flex flex-col items-center justify-center text-muted-foreground space-y-4">
                  <ShoppingBag className="w-16 h-16 opacity-20" />
                  <p className="text-lg font-medium">Your cart is empty</p>
                  <button onClick={onClose} className="text-primary hover:underline text-sm">
                    Continue Shopping
                  </button>
                </div>
              ) : (
                // 🔥 ERROR 2 & 3 FIX: Yahan (item: any) likh diya
                cart.map((item: any) => ( 
                  <motion.div
                    key={item.id}
                    layout
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.9 }}
                    className="flex gap-4 p-4 rounded-2xl bg-secondary/30 border border-border group"
                  >
                    <div className="w-20 h-20 rounded-xl bg-primary/10 flex items-center justify-center flex-shrink-0 overflow-hidden">
                      {/* 🔥 ImageUrl fix */}
                      {item.imageUrl || item.image ? (
                        <img src={item.imageUrl || item.image} alt={item.name} className="w-full h-full object-cover" />
                      ) : (
                        <span className="text-primary font-bold text-xs">Image</span>
                      )}
                    </div>
                    <div className="flex-1 flex flex-col justify-between py-1">
                      <div className="flex justify-between items-start mb-1">
                        <h3 className="font-semibold text-foreground line-clamp-1 pr-4">{item.name}</h3>
                        <motion.button
                          whileHover={{ scale: 1.1 }}
                          whileTap={{ scale: 0.9 }}
                          onClick={() => removeFromCart(item.id)}
                          className="text-muted-foreground hover:text-destructive transition-colors p-1"
                        >
                          <Trash2 className="w-4 h-4" />
                        </motion.button>
                      </div>
                      <div className="flex items-center justify-between mt-auto">
                        <p className="text-primary font-bold">${item.price}</p>
                        <span className="text-sm text-muted-foreground font-medium">Qty: {item.quantity || 1}</span>
                      </div>
                    </div>
                  </motion.div>
                ))
              )}
            </div>

            {/* Footer */}
            {cart.length > 0 && (
              <div className="p-6 bg-secondary/30 border-t border-border">
                <div className="flex justify-between items-center mb-6">
                  <span className="text-muted-foreground font-medium">Total Amount</span>
                  <span className="text-2xl font-bold text-foreground">
                    ${totalAmount.toFixed(2)}
                  </span>
                </div>
                
                <motion.button
                  onClick={handleCheckoutClick}
                  whileHover={{ scale: 1.02, boxShadow: "0 0 20px oklch(0.75 0.18 195 / 0.3)" }}
                  whileTap={{ scale: 0.98 }}
                  className="w-full py-4 rounded-xl bg-primary text-primary-foreground font-bold flex items-center justify-center gap-2 glow-cyan-sm transition-all"
                >
                  Checkout Now <ArrowRight className="w-5 h-5" />
                </motion.button>
              </div>
            )}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}