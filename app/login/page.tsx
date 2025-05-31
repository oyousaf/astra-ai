"use client";

import { useState } from "react";
import { loginUser } from "../lib/api";
import { useAuth } from "../context/AuthContext";
import { useRouter } from "next/navigation";
import AuthLayout from "../components/AuthLayout";

export default function LoginPage() {
  const { login } = useAuth();
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    try {
      const res = await loginUser(email, password);
      login(res.data.token);
      router.push("/dashboard");
    } catch {
      setError("Invalid credentials");
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
          >
            {showPassword ? "Hide" : "Show"}
          </button>
        </div>

        <button
          type="submit"
          className="w-full bg-primary text-accent py-2 rounded-xl hover:scale-105 transition-all cursor-pointer"
        >
          Login
        </button>
        <p className="mt-4 text-sm text-center">
          Don't have an account?{" "}
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
