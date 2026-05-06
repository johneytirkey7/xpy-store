import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { CartProvider } from "../context/CartContext";
import { GlobalUI } from "@/components/xpy/global-ui"; // 🔥 Manager ko bula liya

const geistSans = Geist({ variable: "--font-geist-sans", subsets: ["latin"] });
const geistMono = Geist_Mono({ variable: "--font-geist-mono", subsets: ["latin"] });

export const metadata: Metadata = {
  title: "XPY Store",
  description: "Next Generation Commerce",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}>
      <body className="min-h-full flex flex-col bg-space-dark text-foreground">
        <CartProvider>
          <GlobalUI /> {/* 🔥 Yahan sab aayega (Nav + Modals) har page par! */}
          {children}
        </CartProvider>
      </body>
    </html>
  );
}