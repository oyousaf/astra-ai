import "./globals.css";
import { ReactNode } from "react";
import { Quicksand } from "next/font/google";
import { MotionConfig } from "motion/react";

import { Toaster } from "sonner";
import { AuthProvider } from "./context/AuthContext";

const quicksand = Quicksand({
  subsets: ["latin"],
  weight: ["400", "600", "700"],
  variable: "--font-quicksand",
  display: "swap",
});

export const metadata = {
  title: "Astra AI",
  description:
    "Astra AI is a quirky, AI-powered job application tracker — organise every opportunity, keep notes, and never miss a step in your job hunt.",
  openGraph: {
    title: "Astra AI",
    description:
      "A quirky, AI-powered job application tracker for your job hunt.",
    siteName: "Astra AI",
    type: "website",
  },
  icons: {
    icon: [
      { url: "/favicon.ico" },
      { url: "/favicon.png", type: "image/png", sizes: "32x32" },
    ],
  },
};

export const viewport = {
  themeColor: "#5b21b6",
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en-gb" className={quicksand.variable}>
      <body className="bg-primary text-primary">
        <a
          href="#main"
          className="sr-only focus:not-sr-only focus:fixed focus:top-4 focus:left-4 focus:z-[100] focus:bg-accent focus:text-primary focus:px-4 focus:py-2 focus:rounded-xl"
        >
          Skip to content
        </a>
        <MotionConfig reducedMotion="user">
          <AuthProvider>{children}</AuthProvider>
        </MotionConfig>
        <Toaster richColors position="top-right" />
        <div id="datepicker-portal"></div>
      </body>
    </html>
  );
}
