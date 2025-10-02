"use client";
import Link from "next/link";
import { useState } from "react";
import { useAuth } from "../context/AuthContext";
import { useRouter } from "next/navigation";

export default function SignInPage() {
  const { login, loading, error } = useAuth();
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [formError, setFormError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError(null);
    const ok = await login(email, password);
    if (ok) {
      router.push("/dashboard");
    } else {
      setFormError("Invalid email or password");
    }
  };

  return (
    <div className="w-full min-h-[70vh] flex flex-col items-center justify-start bg-black text-white pt-20 sm:pt-32 px-4">
      <div className="bg-neutral-900 rounded-2xl sm:rounded-3xl shadow-xl p-6 sm:p-8 w-full max-w-md border border-neutral-800 flex flex-col items-center">
        <h2 className="text-2xl sm:text-3xl font-bold mb-4 sm:mb-6 text-cyan-400">Sign In</h2>
        <form className="w-full flex flex-col gap-3 sm:gap-4" onSubmit={handleSubmit}>
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="bg-neutral-800 border border-neutral-700 rounded-lg px-4 py-2.5 sm:py-3 text-base sm:text-lg text-white focus:outline-none focus:ring-2 focus:ring-cyan-500"
            required
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="bg-neutral-800 border border-neutral-700 rounded-lg px-4 py-2.5 sm:py-3 text-base sm:text-lg text-white focus:outline-none focus:ring-2 focus:ring-cyan-500"
            required
          />
          <button
            type="submit"
            className="bg-cyan-500 text-black font-semibold rounded-lg px-4 py-2.5 sm:py-3 text-base sm:text-lg hover:bg-cyan-400 transition mt-2 disabled:opacity-60"
            disabled={loading}
          >
            {loading ? "Signing In..." : "Sign In"}
          </button>
        </form>
        {(formError || error) && <p className="text-red-400 mt-3 text-sm sm:text-base">{formError || error}</p>}
        <p className="text-neutral-400 mt-4 text-sm sm:text-base text-center">
          Don't have an account?{' '}
          <Link href="/signup" className="text-cyan-400 hover:underline">Sign Up</Link>
        </p>
      </div>
    </div>
  );
} 