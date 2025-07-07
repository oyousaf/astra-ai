"use client";

import { useAuth } from "../context/AuthContext";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function ProtectedRoute({
  children,
}: {
  children: React.ReactNode;
}) {
  const { user, isLoaded } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (isLoaded && !user) {
      router.replace("/login");
    }
  }, [user, isLoaded]);

  // ⏳ Show loading state until auth is hydrated
  if (!isLoaded) return <p>Loading...</p>;

  // ⛔ Block render during redirect
  if (!user) return null;

  return <>{children}</>;
}
