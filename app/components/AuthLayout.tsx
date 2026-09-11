"use client";

import { motion } from "motion/react";

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <main
      id="main"
      className="min-h-screen flex items-center justify-center bg-background px-4"
    >
      <motion.div
        initial={{ opacity: 0, y: -12, scale: 0.97 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: -12, scale: 0.97 }}
        transition={{ duration: 0.4 }}
        className="w-full max-w-md bg-light border border-accent rounded-2xl shadow-xl p-8"
      >
        {children}
      </motion.div>
    </main>
  );
}
