"use client";

import { useAuth } from "../context/AuthContext";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function ProtectedRoute({
  children,
}: {
  children: React.ReactNode;
}) {
  const { token, isLoaded } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (isLoaded && !token) {
      router.replace("/login");
    }
  }, [token, isLoaded, router]);

  if (!isLoaded) return null;
  if (!token) return null;

  return <>{children}</>;
}
