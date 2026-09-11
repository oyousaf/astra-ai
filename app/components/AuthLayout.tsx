"use client";

import Link from "next/link";
import { motion } from "motion/react";

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <main
      id="main"
      className="min-h-screen flex flex-col items-center justify-center bg-background px-4"
    >
      <Link
        href="/"
        className="flex items-center gap-1.5 mb-6 rounded focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent"
      >
        <span className="text-xl font-extrabold text-light">Astra</span>
        <span className="text-xl font-extrabold text-accent">AI</span>
        <span className="w-1.5 h-1.5 rounded-full bg-yellow ml-0.5" aria-hidden="true" />
      </Link>

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
