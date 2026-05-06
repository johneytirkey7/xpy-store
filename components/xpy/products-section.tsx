"use client";

import { motion } from "framer-motion";
import { Star, ShoppingCart, Eye, Zap, Package } from "lucide-react";
import { useState, useEffect } from "react";
import { useCart } from "../../context/CartContext";
import Link from "next/link"; 
import { toast } from "sonner"; // 🔥 NAYA JADOO: Toast import kar liya

interface Product {
  id: number;
  name: string;
  price: number;
  description: string;
  imageUrl: string | null;
}

const bgGradients = [
  "from-cyan-500/20 to-blue-500/20",
  "from-primary/20 to-cyan-500/20",
  "from-blue-500/20 to-primary/20",
  "from-purple-500/20 to-cyan-500/20",
];

export function ProductsSection() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  
  const { addToCart } = useCart();

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const res = await fetch("/api/products");
        const data = await res.json();
        
        // 🔥 CRASH FIX: Check karo ki data Array hai ya nahi
        if (Array.isArray(data)) {
          setProducts(data);
        } else if (data && data.products && Array.isArray(data.products)) {
          setProducts(data.products); 
        } else {
          console.error("Bhai API se array nahi aaya!", data);
          setProducts([]); // Khali list set kar do taaki crash na ho
        }
      } catch (error) {
        console.error("Products load karne mein error aaya:", error);
        setProducts([]);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  const handleAddToCart = (product: Product) => {
    addToCart(product);
    // 🔥 Pura alert() hata kar toast lagaya
    toast.success(`${product.name} cart mein add ho gaya! 🛒`);
  };

  const handleBuyNow = (product: Product) => {
    addToCart(product);
    // 🔥 Pura alert() hata kar toast lagaya
    toast.success(`Mubarak ho! Tum seedha Checkout pe jaoge. (${product.name} selected) ⚡`);
  };

  return (
    <section id="products" className="relative py-24 overflow-hidden">
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-primary/5 rounded-full blur-3xl" />
      
      <div className="container mx-auto px-4 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl md:text-5xl font-bold mb-4">
            <span className="text-foreground">Featured </span>
            <span className="text-primary text-glow-cyan">Products</span>
          </h2>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            Discover our most innovative products crafted for the future.
          </p>
        </motion.div>

        {loading && (
          <div className="text-center py-12 text-primary font-bold text-xl animate-pulse">
            Database se products aa rahe hain... 🚀
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {/* 🔥 MAP FIX: Yahan Array.isArray add kiya hai crash rokne ke liye */}
          {Array.isArray(products) && products.map((product, index) => {
            const colorClass = bgGradients[index % bgGradients.length];

            return (
              <motion.div
                key={product.id}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.15 }}
                className="group"
              >
                <div className="glass-card rounded-2xl overflow-hidden flex flex-col h-full">
                  <Link href={`/product/${product.id}`} className="cursor-pointer">
                    <div className={`relative h-64 bg-gradient-to-br ${colorClass} overflow-hidden`}>
                      {product.imageUrl ? (
                        <img 
                          src={product.imageUrl} 
                          alt={product.name} 
                          className="w-full h-full object-cover opacity-90 mix-blend-overlay group-hover:scale-110 transition-transform duration-500"
                        />
                      ) : (
                        <motion.div
                          animate={{ y: [0, -10, 0] }}
                          transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
                          className="absolute inset-0 flex items-center justify-center"
                        >
                          <div className="w-20 h-20 bg-primary/20 rounded-full flex items-center justify-center border border-primary">
                             <Package className="w-8 h-8 text-primary" />
                          </div>
                        </motion.div>
                      )}
                      
                      <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                        <div className="p-3 bg-white/10 backdrop-blur-md rounded-full border border-white/20">
                          <Eye className="w-6 h-6 text-white" />
                        </div>
                      </div>
                    </div>
                  </Link>

                  <div className="p-6 flex flex-col flex-grow">
                    <Link href={`/product/${product.id}`}>
                      <h3 className="text-lg font-semibold text-foreground mb-2 truncate hover:text-primary transition-colors cursor-pointer" title={product.name}>
                        {product.name}
                      </h3>
                    </Link>
                    
                    <div className="flex items-center gap-2 mb-4">
                      <div className="flex items-center gap-1">
                        <Star className="w-4 h-4 fill-primary text-primary" />
                        <span className="text-sm text-foreground font-medium">4.5</span>
                      </div>
                      <span className="text-sm text-muted-foreground">(100+ reviews)</span>
                    </div>

                    <p className="text-sm text-muted-foreground mb-4 line-clamp-2 flex-grow" title={product.description}>
                      {product.description}
                    </p>

                    <div className="mb-4">
                      <p className="text-2xl font-bold text-primary">${product.price}</p>
                    </div>

                    <div className="flex gap-2 mt-auto">
                      <motion.button
                        onClick={() => handleAddToCart(product)}
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        className="flex-1 py-2.5 rounded-lg bg-secondary/80 hover:bg-secondary text-foreground text-sm font-medium flex items-center justify-center gap-2 transition-colors border border-border"
                      >
                        <ShoppingCart className="w-4 h-4" />
                        Add
                      </motion.button>
                      
                      <motion.button
                        onClick={() => handleBuyNow(product)}
                        whileHover={{ scale: 1.05, boxShadow: "0 0 20px oklch(0.75 0.18 195 / 0.4)" }}
                        whileTap={{ scale: 0.95 }}
                        className="flex-1 py-2.5 rounded-lg bg-primary text-primary-foreground text-sm font-bold flex items-center justify-center gap-2 glow-cyan-sm"
                      >
                        <Zap className="w-4 h-4 fill-current" />
                        Buy Now
                      </motion.button>
                    </div>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>

        {!loading && (!Array.isArray(products) || products.length === 0) && (
          <div className="text-center py-12 text-muted-foreground">
            Bhai abhi koi product nahi hai, jaake Admin Panel se add kar!
          </div>
        )}
      </div>
    </section>
  );
}