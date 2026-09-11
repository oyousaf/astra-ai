"use client";

import { useState } from "react";
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
      await login(email, password);
      toast.success("🎉 Welcome back!");
      router.push("/dashboard");
    } catch (err: unknown) {
      const message =
        err &&
        typeof err === "object" &&
        "response" in err &&
        (err as ApiError).response?.data?.error
          ? (err as ApiError).response!.data!.error!
          : (err as Error).message || "Login failed";
      setError(message);
      toast.error(message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <AuthLayout>
      <form
        name="login"
        onSubmit={handleSubmit}
        className="space-y-4 text-primary"
      >
        <div className="text-center mb-2">
          <h1 className="text-2xl font-extrabold tracking-tight">Log in</h1>
          <p className="text-sm text-primary/70 mt-1">
            Welcome back — keep tracking your applications.
          </p>
        </div>

        {error && <p className="text-red-800 text-sm text-center">{error}</p>}

        <input
          name="email"
          type="email"
          placeholder="Email"
          autoComplete="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          className="input-style text-center"
        />

        <div className="relative">
          <input
            name="password"
            type={showPassword ? "text" : "password"}
            placeholder="Password"
            autoComplete="current-password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            className="input-style text-center"
          />
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-3 top-2 text-sm text-primary underline cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent rounded"
            aria-pressed={showPassword}
            aria-label={showPassword ? "Hide password" : "Show password"}
          >
            {showPassword ? "Hide" : "Show"}
          </button>
        </div>

        <button
          type="submit"
          disabled={loading}
          className={`w-full bg-primary text-accent py-2.5 rounded-xl font-bold shadow-md hover:opacity-90 transition cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent ${
            loading ? "opacity-50 cursor-not-allowed" : ""
          }`}
        >
          {loading ? "Logging in..." : "Log in"}
        </button>
        <p className="text-sm text-center text-primary/70">
          Don&apos;t have an account?{" "}
          <a
            href="/register"
            className="text-secondary font-semibold underline hover:opacity-80"
          >
            Register here
          </a>
        </p>
      </form>
    </AuthLayout>
  );
}
