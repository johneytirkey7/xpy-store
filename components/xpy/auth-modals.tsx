"use client";

import { motion, AnimatePresence } from "framer-motion";
import { X, Mail, Lock, User, Eye, EyeOff, KeyRound } from "lucide-react";
import { useState } from "react";

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  type: "login" | "signup";
  onSwitchType: () => void;
}

export function AuthModal({ isOpen, onClose, type, onSwitchType }: AuthModalProps) {
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (type === "signup") {
      try {
        const res = await fetch("/api/signup", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            name: formData.name,
            email: formData.email,
            password: formData.password,
          }),
        });

        const data = await res.json();

        if (res.ok) {
          alert("Mubarak ho bhai! Account successfully ban gaya! 🎉");
          localStorage.setItem("userName", data.user.name);
          // NAYI LINE: Signup ke time default USER role save hoga
          localStorage.setItem("userRole", data.user.role || "USER"); 
          setFormData({ name: "", email: "", password: "", confirmPassword: "" }); 
          onClose(); 
          window.location.reload(); 
        } else {
          alert("Error: " + data.error);
        }
      } catch (error) {
        alert("Bhai kuch network error aa gaya!");
      }
    } else {
      try {
        const res = await fetch("/api/login", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            email: formData.email,
            password: formData.password,
          }),
        });

        const data = await res.json();

        if (res.ok) {
          alert("Welcome Back " + data.user.name + "! Login Successful! 🚀");
          localStorage.setItem("userName", data.user.name);
          // NAYI LINE: Login ke time database se aaya hua role save hoga
          localStorage.setItem("userRole", data.user.role); 
          setFormData({ name: "", email: "", password: "", confirmPassword: "" }); 
          onClose(); 
          window.location.reload(); 
        } else {
          alert("Error: " + data.error);
        }
      } catch (error) {
        alert("Bhai kuch network error aa gaya!");
      }
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[100] flex items-center justify-center p-4"
        >
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-space-dark/80 backdrop-blur-sm"
          />

          {/* Modal Container */}
          <motion.div
            initial={{ scale: 0.9, opacity: 0, rotateX: -10 }}
            animate={{ scale: 1, opacity: 1, rotateX: 0 }}
            exit={{ scale: 0.9, opacity: 0, rotateX: 10 }}
            transition={{ type: "spring", damping: 25, stiffness: 300 }}
            className="relative w-full max-w-md"
            style={{ perspective: "1000px" }}
          >
            {/* Orbiting 3D Key */}
            <motion.div
              animate={{ rotateZ: 360 }}
              transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
              className="absolute -top-16 left-1/2 -translate-x-1/2 w-32 h-32"
              style={{ transformStyle: "preserve-3d" }}
            >
              <motion.div
                animate={{ y: [0, -10, 0], rotateY: [0, 180, 360] }}
                transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2"
              >
                <div className="w-16 h-16 rounded-xl bg-primary/20 glass flex items-center justify-center glow-cyan">
                  <KeyRound className="w-8 h-8 text-primary" />
                </div>
              </motion.div>
              
              {/* Orbiting particles */}
              {[...Array(4)].map((_, i) => (
                <motion.div
                  key={i}
                  className="absolute w-2 h-2 bg-primary rounded-full"
                  style={{
                    top: "50%",
                    left: "50%",
                    transform: `rotate(${i * 90}deg) translateX(50px)`,
                  }}
                  animate={{ opacity: [0.3, 1, 0.3], scale: [0.8, 1.2, 0.8] }}
                  transition={{ duration: 2, repeat: Infinity, delay: i * 0.5 }}
                />
              ))}
            </motion.div>

            {/* Modal Card */}
            <div className="glass rounded-3xl p-8 border border-primary/20 bg-black/50">
              {/* Close Button */}
              <motion.button
                whileHover={{ scale: 1.1, rotate: 90 }}
                whileTap={{ scale: 0.9 }}
                onClick={onClose}
                className="absolute top-4 right-4 w-10 h-10 rounded-full bg-secondary/50 flex items-center justify-center text-muted-foreground hover:text-white transition-colors"
              >
                <X className="w-5 h-5" />
              </motion.button>

              {/* Header */}
              <div className="text-center mb-8 mt-4">
                <motion.h2
                  key={type}
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="text-2xl font-bold text-white mb-2"
                >
                  {type === "login" ? "Welcome Back" : "Create Account"}
                </motion.h2>
                <p className="text-gray-400 text-sm">
                  {type === "login"
                    ? "Sign in to continue your journey"
                    : "Join the future of shopping"}
                </p>
              </div>

              {/* Form */}
              <form onSubmit={handleSubmit} className="space-y-4">
                {/* Name Field (Sign Up only) */}
                <AnimatePresence mode="wait">
                  {type === "signup" && (
                        <motion.div
                          initial={{ opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: "auto" }}
                          exit={{ opacity: 0, height: 0 }}
                          className="overflow-hidden"
                        >
                          <label className="block text-sm font-medium text-gray-300 mb-2">
                            Full Name
                          </label>
                          <div className="relative">
                            <User className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
                            <input
                              type="text"
                              required
                              placeholder="Enter your name"
                              value={formData.name}
                              onChange={(e) =>
                                setFormData({ ...formData, name: e.target.value })
                              }
                              className="w-full pl-12 pr-4 py-3 rounded-xl bg-gray-900/50 border border-gray-800 text-white placeholder:text-gray-500 focus:outline-none focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 transition-all"
                            />
                            <div className="absolute inset-0 rounded-xl opacity-0 focus-within:opacity-100 pointer-events-none shadow-[0_0_15px_rgba(6,182,212,0.2)] transition-opacity" />
                          </div>
                        </motion.div>
                  )}
                </AnimatePresence>

                {/* Email Field */}
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Email Address
                  </label>
                  <div className="relative group">
                    <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500 group-focus-within:text-cyan-500 transition-colors" />
                    <input
                      type="email"
                      required
                      placeholder="Enter your email"
                      value={formData.email}
                      onChange={(e) =>
                        setFormData({ ...formData, email: e.target.value })
                      }
                      className="w-full pl-12 pr-4 py-3 rounded-xl bg-gray-900/50 border border-gray-800 text-white placeholder:text-gray-500 focus:outline-none focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 transition-all"
                    />
                  </div>
                </div>

                {/* Password Field */}
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Password
                  </label>
                  <div className="relative group">
                    <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500 group-focus-within:text-cyan-500 transition-colors" />
                    <input
                      type={showPassword ? "text" : "password"}
                      required
                      placeholder="Enter your password"
                      value={formData.password}
                      onChange={(e) =>
                        setFormData({ ...formData, password: e.target.value })
                      }
                      className="w-full pl-12 pr-12 py-3 rounded-xl bg-gray-900/50 border border-gray-800 text-white placeholder:text-gray-500 focus:outline-none focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 transition-all"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 hover:text-white transition-colors"
                    >
                      {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                    </button>
                  </div>
                </div>

                {/* Confirm Password Field (Sign Up only) */}
                <AnimatePresence mode="wait">
                  {type === "signup" && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: "auto" }}
                      exit={{ opacity: 0, height: 0 }}
                      className="overflow-hidden"
                    >
                      <label className="block text-sm font-medium text-gray-300 mb-2">
                        Confirm Password
                      </label>
                      <div className="relative group">
                        <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500 group-focus-within:text-cyan-500 transition-colors" />
                        <input
                          type={showPassword ? "text" : "password"}
                          required
                          placeholder="Confirm your password"
                          value={formData.confirmPassword}
                          onChange={(e) =>
                            setFormData({
                              ...formData,
                              confirmPassword: e.target.value,
                            })
                          }
                          className="w-full pl-12 pr-4 py-3 rounded-xl bg-gray-900/50 border border-gray-800 text-white placeholder:text-gray-500 focus:outline-none focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 transition-all"
                        />
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>

                {/* Submit Button */}
                <motion.button
                  type="submit"
                  whileHover={{
                    scale: 1.02,
                    boxShadow: "0 0 20px rgba(6,182,212,0.4)",
                  }}
                  whileTap={{ scale: 0.98 }}
                  className="w-full py-4 rounded-xl bg-cyan-500 text-black font-bold mt-6"
                >
                  {type === "login" ? "Sign In" : "Create Account"}
                </motion.button>
              </form>

              {/* Switch Type */}
              <p className="text-center mt-6 text-sm text-gray-400">
                {type === "login" ? (
                  <>
                    {"Don't have an account? "}
                    <button
                      type="button"
                      onClick={onSwitchType}
                      className="text-cyan-500 hover:text-cyan-400 font-medium transition-colors"
                    >
                      Sign Up
                    </button>
                  </>
                ) : (
                  <>
                    Already have an account?{" "}
                    <button
                      type="button"
                      onClick={onSwitchType}
                      className="text-cyan-500 hover:text-cyan-400 font-medium transition-colors"
                    >
                      Sign In
                    </button>
                  </>
                )}
              </p>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}