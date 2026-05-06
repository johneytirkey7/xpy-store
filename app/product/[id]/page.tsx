"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { motion } from "framer-motion";
import { ShoppingCart, Zap, ChevronLeft, Star, ShieldCheck, Truck } from "lucide-react";
import Link from "next/link";
import { useCart } from "@/context/CartContext";

interface Product {
  id: number;
  name: string;
  price: number;
  description: string;
  imageUrl: string | null;
}

export default function ProductDetailPage() {
  const { id } = useParams();
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const { addToCart } = useCart();

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const res = await fetch(`/api/products`);
        const data = await res.json();
        // Sirf wahi product dhoondo jiski ID match karti hai
        const found = data.find((p: any) => p.id === Number(id));
        setProduct(found);
      } catch (err) {
        console.error("Error fetching product:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchProduct();
  }, [id]);

  if (loading) return <div className="h-screen flex items-center justify-center text-primary font-bold">Loading product details...</div>;
  if (!product) return <div className="h-screen flex items-center justify-center text-red-500">Bhai ye product mil nahi raha!</div>;

  return (
    <div className="min-h-screen bg-space-dark text-foreground pt-32 pb-12">
      <div className="container mx-auto px-4">
        {/* Back Button */}
        <Link href="/">
          <motion.button whileHover={{ x: -5 }} className="flex items-center gap-2 text-muted-foreground hover:text-primary mb-8">
            <ChevronLeft className="w-5 h-5" /> Back to Store
          </motion.button>
        </Link>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
          {/* Left: Product Image */}
          <motion.div 
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            className="glass rounded-3xl overflow-hidden p-4 border border-primary/20"
          >
            <div className="aspect-square rounded-2xl bg-secondary/30 relative overflow-hidden">
              {product.imageUrl ? (
                <img src={product.imageUrl} alt={product.name} className="w-full h-full object-cover" />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-primary/20 font-bold text-9xl">X</div>
              )}
            </div>
          </motion.div>

          {/* Right: Product Info */}
          <motion.div 
             initial={{ opacity: 0, x: 50 }}
             animate={{ opacity: 1, x: 0 }}
             className="space-y-6"
          >
            <div>
              <h1 className="text-4xl md:text-5xl font-bold mb-2">{product.name}</h1>
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-1 text-primary">
                  <Star className="w-5 h-5 fill-current" /> <span className="font-bold">4.8</span>
                </div>
                <span className="text-muted-foreground">| 120 Reviews</span>
              </div>
            </div>

            <p className="text-3xl font-bold text-primary">${product.price}</p>
            <p className="text-muted-foreground text-lg leading-relaxed">{product.description}</p>

            <div className="grid grid-cols-2 gap-4 py-6 border-y border-border">
              <div className="flex items-center gap-3">
                <Truck className="text-primary w-6 h-6" />
                <span className="text-sm">Free Delivery</span>
              </div>
              <div className="flex items-center gap-3">
                <ShieldCheck className="text-primary w-6 h-6" />
                <span className="text-sm">1 Year Warranty</span>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-4 pt-6">
              <button 
                onClick={() => { addToCart(product); alert("Added to cart! 🛒"); }}
                className="flex-1 py-4 rounded-xl bg-secondary hover:bg-secondary/80 font-bold flex items-center justify-center gap-2 transition-all border border-border"
              >
                <ShoppingCart className="w-5 h-5" /> Add to Cart
              </button>
              <button className="flex-1 py-4 rounded-xl bg-primary text-primary-foreground font-bold flex items-center justify-center gap-2 glow-cyan-sm hover:scale-[1.02] transition-all">
                <Zap className="w-5 h-5 fill-current" /> Buy It Now
              </button>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}