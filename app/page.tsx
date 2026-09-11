"use client";

import Link from "next/link";
import { motion, type Variants } from "motion/react";
import { Sparkles, NotebookPen, ShieldCheck } from "lucide-react";
import HeroIllustration from "./components/HeroIllustration";

const features = [
  {
    icon: Sparkles,
    title: "AI-powered autofill",
    description:
      "Paste a job posting and Astra extracts the title, company, and status for you.",
  },
  {
    icon: NotebookPen,
    title: "Stay organised",
    description:
      "Custom notes and live status tracking for every application, all in one place.",
  },
  {
    icon: ShieldCheck,
    title: "Your data, your server",
    description:
      "Self-hosted with your own database — no third-party lock-in.",
  },
];

const heroContainer = {
  hidden: {},
  show: {
    transition: { staggerChildren: 0.12, delayChildren: 0.05 },
  },
} satisfies Variants;

const heroItem = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0, transition: { duration: 0.45, ease: "easeOut" } },
} satisfies Variants;

const heroIllustration = {
  hidden: { opacity: 0, scale: 0.9, rotate: -3 },
  show: {
    opacity: 1,
    scale: 1,
    rotate: 0,
    transition: { duration: 0.6, ease: "easeOut" },
  },
} satisfies Variants;

const featuresContainer = {
  hidden: {},
  show: {
    transition: { staggerChildren: 0.1, delayChildren: 0.5 },
  },
} satisfies Variants;

const featureItem = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0, transition: { duration: 0.4, ease: "easeOut" } },
} satisfies Variants;

export default function HomePage() {
  return (
    <main id="main" className="min-h-screen bg-background px-4 sm:px-8">
      <div className="mx-auto max-w-6xl py-16 sm:py-24">
        <motion.div
          initial="hidden"
          animate="show"
          variants={heroContainer}
          className="grid lg:grid-cols-2 gap-12 items-center"
        >
          <div className="text-center lg:text-left">
            <motion.div variants={heroItem}>
              <Link
                href="/"
                className="flex items-center gap-1.5 justify-center lg:justify-start mb-6 rounded focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent"
              >
                <span className="text-2xl font-extrabold text-light">Astra</span>
                <span className="text-2xl font-extrabold text-accent">AI</span>
                <span className="w-2 h-2 rounded-full bg-yellow ml-1" aria-hidden="true" />
              </Link>
            </motion.div>

            <motion.h1
              variants={heroItem}
              className="text-4xl sm:text-5xl font-extrabold tracking-tight leading-[1.1] text-light"
            >
              Track every application.
              <br />
              Land your dream job.
            </motion.h1>

            <motion.p
              variants={heroItem}
              className="mt-5 text-base sm:text-lg text-light/80 max-w-md mx-auto lg:mx-0 leading-relaxed"
            >
              A quirky, AI-powered job tracker — paste a posting and let
              Astra fill in the details, or add roles by hand and keep every
              status, note, and deadline in one place.
            </motion.p>

            <motion.div
              variants={heroItem}
              className="mt-8 flex gap-3 justify-center lg:justify-start"
            >
              <Link href="/register">
                <button className="px-6 py-2.5 rounded-xl bg-accent text-primary font-bold shadow-lg hover:opacity-90 transition cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent">
                  Get started
                </button>
              </Link>
              <Link href="/login">
                <button className="px-6 py-2.5 rounded-xl border border-light/40 text-light font-semibold hover:bg-light/10 transition cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent">
                  Log in
                </button>
              </Link>
            </motion.div>
          </div>

          <motion.div variants={heroIllustration}>
            <HeroIllustration />
          </motion.div>
        </motion.div>

        <motion.div
          initial="hidden"
          animate="show"
          variants={featuresContainer}
          className="mt-20 sm:mt-28 grid sm:grid-cols-3 gap-6"
        >
          {features.map(({ icon: Icon, title, description }) => (
            <motion.div
              key={title}
              variants={featureItem}
              className="rounded-2xl border border-light/15 bg-light/5 p-6 text-center sm:text-left"
            >
              <Icon
                className="w-6 h-6 text-accent mx-auto sm:mx-0 mb-3"
                aria-hidden="true"
              />
              <h2 className="text-light font-semibold mb-1">{title}</h2>
              <p className="text-sm text-light/70 leading-relaxed">
                {description}
              </p>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </main>
  );
}
