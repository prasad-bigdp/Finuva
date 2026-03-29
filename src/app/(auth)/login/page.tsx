"use client";
import { Suspense, useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { Eye, EyeOff } from "lucide-react";
import { useLoading } from "@/components/providers/loading-provider";

function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get("callbackUrl") ?? "/dashboard";

  const { start } = useLoading();
  const [form, setForm] = useState({ email: "", password: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPass, setShowPass] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);

    const result = await signIn("credentials", {
      email: form.email,
      password: form.password,
      redirect: false,
    });

    setLoading(false);
    if (result?.error) {
      setError("Invalid email or password");
      return;
    }

    start();
    router.push(callbackUrl);
    router.refresh();
  }

  return (
    <div className="w-full max-w-md">
      <div className="mb-8 text-center">
        {/* Finuva Logo Mark */}
        <div
          className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-[22px] shadow-[0_14px_40px_rgba(123,79,212,0.30)]"
          style={{ background: "linear-gradient(135deg, #5B9AF5 0%, #7B4FD4 55%, #E040A0 100%)" }}
        >
          <span className="text-2xl font-black text-white">F</span>
        </div>
        <h1 className="text-4xl font-bold tracking-tight text-[#1E1847]">Welcome back</h1>
        <p className="mt-2 text-sm text-[#6B6B8A]">Sign in to your Finuva account</p>
      </div>

      <div className="glass-panel rounded-[30px] p-8">
        {error && (
          <div className="mb-4 rounded-2xl border border-red-200 bg-red-50 p-3 text-sm text-red-700">{error}</div>
        )}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-1">
            <label className="block text-sm font-medium text-[#1E1847]">Email</label>
            <input
              type="email"
              required
              autoComplete="email"
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
              className="block w-full rounded-2xl border border-[#D8D0F0] bg-white/70 px-4 py-3 text-sm shadow-sm placeholder:text-[#A09BBF] focus:border-[#7B4FD4] focus:outline-none focus:ring-2 focus:ring-[#7B4FD4]/15"
              placeholder="you@company.com"
            />
          </div>

          <div className="space-y-1">
            <label className="block text-sm font-medium text-[#1E1847]">Password</label>
            <div className="relative">
              <input
                type={showPass ? "text" : "password"}
                required
                autoComplete="current-password"
                value={form.password}
                onChange={(e) => setForm({ ...form, password: e.target.value })}
                className="block w-full rounded-2xl border border-[#D8D0F0] bg-white/70 px-4 py-3 pr-11 text-sm shadow-sm placeholder:text-[#A09BBF] focus:border-[#7B4FD4] focus:outline-none focus:ring-2 focus:ring-[#7B4FD4]/15"
                placeholder="••••••••"
              />
              <button
                type="button"
                onClick={() => setShowPass(!showPass)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-[#A09BBF] transition hover:text-[#7B4FD4]"
              >
                {showPass ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </button>
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-2xl py-3 text-sm font-semibold text-white shadow-[0_14px_30px_rgba(123,79,212,0.28)] transition-all duration-300 hover:-translate-y-0.5 disabled:cursor-not-allowed disabled:opacity-60"
            style={{ background: "linear-gradient(135deg, #5B9AF5, #7B4FD4)" }}
          >
            {loading ? "Signing in..." : "Sign In"}
          </button>
        </form>
      </div>

      <p className="mt-6 text-center text-sm text-[#6B6B8A]">
        Don&apos;t have an account?{" "}
        <Link href="/register" className="font-semibold text-[#7B4FD4] hover:underline">
          Create one free
        </Link>
      </p>
    </div>
  );
}

export default function LoginPage() {
  return (
    <Suspense fallback={<div className="w-full max-w-md rounded-[30px] bg-white/70 p-8 text-sm text-[#6B6B8A]">Loading...</div>}>
      <LoginForm />
    </Suspense>
  );
}
