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
  }, [user, isLoaded]);

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
        className="space-y-5 text-primary"
      >
        <h2 className="text-2xl font-bold text-center">📝 Register</h2>

        {error && <p className="text-red-800 text-sm text-center">{error}</p>}

        <input
          name="email"
          type="email"
          placeholder="Email"
          autoComplete="email"
          value={email}
          onChange={(e) => setEmail(e.target.value.trim())}
          required
          className="w-full p-2 border rounded-xl text-center focus:outline-none focus:ring-2 focus:ring-accent"
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
          className={`w-full bg-green-600 text-white py-2 rounded-xl hover:scale-105 transition-all cursor-pointer ${
            loading ? "opacity-50 cursor-not-allowed" : ""
          }`}
        >
          {loading ? "Registering…" : "Register"}
        </button>
        <p className="mt-4 text-sm text-center">
          Already have an account?{" "}
          <a
            href="/login"
            className="text-green-800 underline hover:text-green-600"
          >
            Login here
          </a>
        </p>
      </form>
    </AuthLayout>
  );
}
