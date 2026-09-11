"use client";

import { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import { useRouter } from "next/navigation";
import AuthLayout from "../components/AuthLayout";
import { toast } from "sonner";

export default function RegisterPage() {
  const { register, user, isLoaded } = useAuth();
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (isLoaded && user) {
      router.replace("/dashboard");
    }
  }, [user, isLoaded, router]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      await register(email, password);
      toast.success("🎉 Registration successful! Welcome aboard!");
    } catch (err) {
      const message =
        err instanceof Error ? err.message : "Registration failed";
      setError(message);
      toast.error(message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <AuthLayout>
      <form
        name="register"
        onSubmit={handleSubmit}
        className="space-y-4 text-primary"
      >
        <div className="text-center mb-2">
          <h1 className="text-2xl font-extrabold tracking-tight">
            Create your account
          </h1>
          <p className="text-sm text-primary/70 mt-1">
            Start tracking your applications in seconds.
          </p>
        </div>

        {error && <p className="text-red-800 text-sm text-center">{error}</p>}

        <input
          name="email"
          type="email"
          placeholder="Email"
          autoComplete="email"
          value={email}
          onChange={(e) => setEmail(e.target.value.trim())}
          required
          className="input-style text-center"
        />

        <div className="relative">
          <input
            name="password"
            type={showPassword ? "text" : "password"}
            placeholder="Password"
            autoComplete="new-password"
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
          className={`w-full bg-secondary text-white py-2.5 rounded-xl font-bold shadow-md hover:opacity-90 transition cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent ${
            loading ? "opacity-50 cursor-not-allowed" : ""
          }`}
        >
          {loading ? "Registering…" : "Register"}
        </button>
        <p className="text-sm text-center text-primary/70">
          Already have an account?{" "}
          <a
            href="/login"
            className="text-secondary font-semibold underline hover:opacity-80"
          >
            Log in here
          </a>
        </p>
      </form>
    </AuthLayout>
  );
}
