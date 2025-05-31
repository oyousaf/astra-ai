"use client";

import { useAuth } from "../context/AuthContext";
import { useRouter } from "next/navigation";

export default function LogoutButton() {
  const { logout } = useAuth();
  const router = useRouter();

  const handleLogout = () => {
    logout();
    router.push("/login");
  };

  return (
    <button
      onClick={handleLogout}
      className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700 transition cursor-pointer shadow-md"
    >
      Logout
    </button>
  );
}
