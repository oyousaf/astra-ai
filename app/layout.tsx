import "./globals.css";
import { ReactNode } from "react";

import { Toaster } from "sonner";
import { AuthProvider } from "./context/AuthContext";

export const metadata = {
  title: "Astra AI",
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en-gb">
      <head>
        <link rel="icon" href="/favicon.ico" sizes="any" />
        <link rel="icon" href="/favicon.png" type="image/png" sizes="32x32" />
      </head>
      <body className="bg-primary text-primary">
        <AuthProvider>{children}</AuthProvider>
        <Toaster richColors position="top-right" />
      </body>
    </html>
  );
}
