"use client";
import Link from "next/link";
import { useState } from "react";
import { useAuth } from "../context/AuthContext";
import { useRouter } from "next/navigation";

export default function SignUpPage() {
  const { register, loading, error } = useAuth();
  const router = useRouter();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [formError, setFormError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [showValidation, setShowValidation] = useState(false);
  const [passwordErrors, setPasswordErrors] = useState({
    length: false,
    uppercase: false,
    lowercase: false,
    number: false,
    special: false,
    match: true,
  });

  const validatePassword = (password: string, confirmPassword: string) => {
    const errors = {
      length: password.length >= 6,
      uppercase: /[A-Z]/.test(password),
      lowercase: /[a-z]/.test(password),
      number: /[0-9]/.test(password),
      special: /[!@#$%^&*(),.?":{}|<>]/.test(password),
      match: password === confirmPassword,
    };
    setPasswordErrors(errors);
    return Object.values(errors).every(Boolean);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    if (name === "password") {
      setShowValidation(true);
      validatePassword(value, confirmPassword);
    } else if (name === "confirmPassword") {
      validatePassword(password, value);
    }
    
    if (name === "name") {
      setName(value);
    } else if (name === "email") {
      setEmail(value);
    } else if (name === "password") {
      setPassword(value);
    } else if (name === "confirmPassword") {
      setConfirmPassword(value);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError(null);
    setSuccess(false);
    if (!validatePassword(password, confirmPassword)) {
      setFormError("Please fix the password requirements");
      return;
    }
    const ok = await register(name, email, password);
    if (ok) {
      setSuccess(true);
      setTimeout(() => router.push("/signin"), 1200);
    } else {
      setFormError("Registration failed");
    }
  };

  return (
    <div className="w-full min-h-[70vh] flex flex-col items-center justify-start bg-black text-white pt-20 sm:pt-32 px-4">
      <div className="bg-neutral-900 rounded-2xl sm:rounded-3xl shadow-xl p-6 sm:p-8 w-full max-w-md border border-neutral-800 flex flex-col items-center">
        <h2 className="text-2xl sm:text-3xl font-bold mb-4 sm:mb-6 text-cyan-400">Sign Up</h2>
        <form className="w-full flex flex-col gap-3 sm:gap-4" onSubmit={handleSubmit}>
          <input
            type="text"
            placeholder="Name"
            value={name}
            onChange={handleChange}
            name="name"
            className="bg-neutral-800 border border-neutral-700 rounded-lg px-4 py-2.5 sm:py-3 text-base sm:text-lg text-white focus:outline-none focus:ring-2 focus:ring-cyan-500"
            required
          />
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={handleChange}
            name="email"
            className="bg-neutral-800 border border-neutral-700 rounded-lg px-4 py-2.5 sm:py-3 text-base sm:text-lg text-white focus:outline-none focus:ring-2 focus:ring-cyan-500"
            required
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={handleChange}
            name="password"
            className="bg-neutral-800 border border-neutral-700 rounded-lg px-4 py-2.5 sm:py-3 text-base sm:text-lg text-white focus:outline-none focus:ring-2 focus:ring-cyan-500"
            required
          />
          <input
            type="password"
            placeholder="Confirm Password"
            value={confirmPassword}
            onChange={handleChange}
            name="confirmPassword"
            className="bg-neutral-800 border border-neutral-700 rounded-lg px-4 py-2.5 sm:py-3 text-base sm:text-lg text-white focus:outline-none focus:ring-2 focus:ring-cyan-500"
            required
          />
          {showValidation && (
            <div className="mt-2 space-y-1">
              <p className={`text-xs sm:text-sm ${passwordErrors.length ? 'text-green-500' : 'text-red-500'}`}>
                • At least 6 characters
              </p>
              <p className={`text-xs sm:text-sm ${passwordErrors.uppercase ? 'text-green-500' : 'text-red-500'}`}>
                • At least one uppercase letter
              </p>
              <p className={`text-xs sm:text-sm ${passwordErrors.lowercase ? 'text-green-500' : 'text-red-500'}`}>
                • At least one lowercase letter
              </p>
              <p className={`text-xs sm:text-sm ${passwordErrors.number ? 'text-green-500' : 'text-red-500'}`}>
                • At least one number
              </p>
              <p className={`text-xs sm:text-sm ${passwordErrors.special ? 'text-green-500' : 'text-red-500'}`}>
                • At least one special character
              </p>
            </div>
          )}
          {showValidation && !passwordErrors.match && (
            <p className="text-red-500 text-sm sm:text-base">
              Passwords do not match
            </p>
          )}
          <button
            type="submit"
            className="bg-cyan-500 text-black font-semibold rounded-lg px-4 py-2.5 sm:py-3 text-base sm:text-lg hover:bg-cyan-400 transition mt-2 disabled:opacity-60"
            disabled={loading}
          >
            {loading ? "Signing Up..." : "Sign Up"}
          </button>
        </form>
        {(formError || error) && <p className="text-red-400 mt-3 text-sm sm:text-base">{formError || error}</p>}
        {success && <p className="text-green-400 mt-3 text-sm sm:text-base">Registration successful! Redirecting...</p>}
        <p className="text-neutral-400 mt-4 text-sm sm:text-base text-center">
          Already have an account?{' '}
          <Link href="/signin" className="text-cyan-400 hover:underline">Sign In</Link>
        </p>
      </div>
    </div>
  );
} 