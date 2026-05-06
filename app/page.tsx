"use client";

import { HeroSection } from "@/components/xpy/hero-section";
import { FeaturesSection } from "@/components/xpy/features-section";
import { ProductsSection } from "@/components/xpy/products-section";
import { Footer } from "@/components/xpy/footer";

export default function HomePage() {
  return (
    <main className="min-h-screen bg-background overflow-x-hidden">
      <HeroSection />
      <FeaturesSection />
      <ProductsSection />
      <Footer />
    </main>
  );
}