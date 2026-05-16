"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Logo from "@/components/Logo";
import { register, login } from "@/lib/api";

export default function RegisterPage() {
  const router = useRouter();
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null);
  const [submitting, setSubmitting] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();
    setError(null);
    setSubmitting(true);
    try {
      await register(email, password, fullName);
      await login(email, password);
      router.push("/verify");
    } catch (err) {
      setError(err.message || "Registration failed");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-6">
      <div className="w-full max-w-md">
        <div className="flex flex-col items-center mb-8 gap-4">
          <Logo size={64} />
          <h1 className="text-2xl font-bold text-[var(--color-text-primary)]">
            Create Operator Account
          </h1>
          <p className="text-sm text-[var(--color-text-secondary)]">
            Register to manage your fleet
          </p>
        </div>

        <form
          onSubmit={handleSubmit}
          className="bg-[var(--color-bg-secondary)] border border-[var(--color-border-subtle)] rounded-lg p-8 flex flex-col gap-5"
        >
          <div className="flex flex-col gap-2">
            <label className="text-xs font-semibold tracking-wider text-[var(--color-text-muted)]">
              FULL NAME
            </label>
            <input
              type="text"
              required
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              placeholder="Enter legal name"
              className="bg-[var(--color-bg-tertiary)] border border-[var(--color-border-default)] rounded-md px-4 py-3 text-sm text-[var(--color-text-primary)] placeholder:text-[var(--color-text-muted)] focus:border-[var(--color-accent-cyan)] focus:outline-none transition-colors"
            />
          </div>

          <div className="flex flex-col gap-2">
            <label className="text-xs font-semibold tracking-wider text-[var(--color-text-muted)]">
              EMAIL ADDRESS
            </label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="official@domain.com"
              className="bg-[var(--color-bg-tertiary)] border border-[var(--color-border-default)] rounded-md px-4 py-3 text-sm text-[var(--color-text-primary)] placeholder:text-[var(--color-text-muted)] focus:border-[var(--color-accent-cyan)] focus:outline-none transition-colors"
            />
          </div>

          <div className="flex flex-col gap-2">
            <label className="text-xs font-semibold tracking-wider text-[var(--color-text-muted)]">
              PASSWORD
            </label>
            <input
              type="password"
              required
              minLength={8}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="At least 8 characters"
              className="bg-[var(--color-bg-tertiary)] border border-[var(--color-border-default)] rounded-md px-4 py-3 text-sm text-[var(--color-text-primary)] placeholder:text-[var(--color-text-muted)] focus:border-[var(--color-accent-cyan)] focus:outline-none transition-colors"
            />
          </div>

          {error && (
            <div className="text-xs text-[var(--color-status-danger)] bg-[var(--color-status-danger)]/10 border border-[var(--color-status-danger)]/40 rounded-md px-3 py-2">
              {error}
            </div>
          )}

          <button
            type="submit"
            disabled={submitting}
            className="bg-[var(--color-accent-cyan)] hover:bg-[var(--color-accent-cyan-dim)] disabled:opacity-50 disabled:cursor-not-allowed text-[var(--color-bg-primary)] font-semibold text-sm py-3 rounded-md transition-colors"
          >
            {submitting ? "Creating account..." : "Create Account"}
          </button>

          <div className="text-xs text-[var(--color-text-muted)] text-center">
            Already have an account?{" "}
            <Link href="/login" className="text-[var(--color-accent-cyan)] hover:underline">
              Sign in
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
}