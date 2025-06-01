"use client";

import { useAuth } from "../context/AuthContext";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";
import { motion } from "framer-motion";
import ConfirmModal from "../components/ConfirmModal";

export default function LogoutButton() {
  const { logout } = useAuth();
  const router = useRouter();
  const [modalOpen, setModalOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleConfirm = async () => {
    setLoading(true);
    try {
      await logout();
      toast.success("Logged out successfully.");
      router.push("/login");
    } catch {
      toast.error("Logout failed. Try again.");
    } finally {
      setLoading(false);
      setModalOpen(false);
    }
  };

  return (
    <>
      <motion.button
        whileTap={{ scale: 0.94 }}
        onClick={() => setModalOpen(true)}
        aria-label="Log out"
        className="bg-red-600 text-white px-4 py-2 rounded-xl hover:bg-red-700 transition cursor-pointer shadow-md focus:outline-none focus:ring-2 focus:ring-red-400"
      >
        Logout
      </motion.button>

      <ConfirmModal
        open={modalOpen}
        title="Log out?"
        message="Are you sure you want to log out?"
        confirmLabel="Log out"
        cancelLabel="Cancel"
        loading={loading}
        onConfirm={handleConfirm}
        onCancel={() => setModalOpen(false)}
      />
    </>
  );
}
