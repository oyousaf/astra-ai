"use client";

import { useAuth } from "../context/AuthContext";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";
import { motion } from "framer-motion";

export default function LogoutButton() {
  const { logout } = useAuth();
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const handleLogout = async () => {
    if (!window.confirm("Are you sure you want to log out?")) return;
    setLoading(true);
    try {
      await logout();
      toast.success("Logged out successfully.");
      router.push("/login");
    } catch (err) {
      toast.error("Logout failed. Try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <motion.button
      whileTap={{ scale: 0.94 }}
      onClick={handleLogout}
      aria-label="Log out"
      disabled={loading}
      className={`
        bg-red-600 text-white px-4 py-2 rounded-xl
        hover:bg-red-700 transition cursor-pointer shadow-md
        focus:outline-none focus:ring-2 focus:ring-red-400
        ${loading ? "opacity-60 cursor-not-allowed" : ""}
      `}
    >
      {loading ? "Logging out..." : "Logout"}
    </motion.button>
  );
}
