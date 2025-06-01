"use client";

import { useState } from "react";
import { loginUser } from "../lib/api";
import { useAuth } from "../context/AuthContext";
import { useRouter } from "next/navigation";
import AuthLayout from "../components/AuthLayout";
import { toast } from "sonner";
import { ApiError } from "@/types";

export default function LoginPage() {
  const { login } = useAuth();
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const res = await loginUser(email, password);
      login(res.data.token);
      toast.success("🎉 Welcome back!");
      router.push("/dashboard");
    } catch (err: unknown) {
      let message = "Login failed";
      if (
        err &&
        typeof err === "object" &&
        "response" in err &&
        (err as ApiError).response?.data?.error
      ) {
        message = (err as ApiError).response!.data!.error!;
      }
      setError(message);
      toast.error(message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <AuthLayout>
      <form onSubmit={handleSubmit} className="space-y-5 text-primary">
        <h2 className="text-2xl font-bold text-center">🚪 Login</h2>

        {error && <p className="text-red-800 text-sm text-center">{error}</p>}

        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          className="w-full p-2 border rounded-xl text-center focus:outline-none focus:ring-2 focus:ring-accent"
        />

        <div className="relative">
          <input
            type={showPassword ? "text" : "password"}
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            className="w-full p-2 border rounded-xl text-center focus:outline-none focus:ring-2 focus:ring-accent"
          />
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-3 top-2 text-sm text-primary underline cursor-pointer"
            tabIndex={-1}
          >
            {showPassword ? "Hide" : "Show"}
          </button>
        </div>

        <button
          type="submit"
          disabled={loading}
          className={`w-full bg-primary text-accent py-2 rounded-xl hover:scale-105 transition-all cursor-pointer ${
            loading ? "opacity-50 cursor-not-allowed" : ""
          }`}
        >
          {loading ? "Logging in..." : "Login"}
        </button>
        <p className="mt-4 text-sm text-center">
          Don&apos;t have an account?{" "}
          <a
            href="/register"
            className="text-violet-800 underline hover:text-violet-600"
          >
            Register here
          </a>
        </p>
      </form>
    </AuthLayout>
  );
}
