"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Eye, EyeOff } from "lucide-react";

export default function RegisterPage() {
  const router = useRouter();
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    organizationName: "",
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPass, setShowPass] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const res = await fetch("/api/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const json = await res.json();
      if (!res.ok) {
        setError(json.error ?? "Registration failed");
        return;
      }
      router.push("/login?registered=1");
    } catch {
      setError("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  const field = (
    key: keyof typeof form,
    label: string,
    type = "text",
    placeholder = ""
  ) => (
    <div className="space-y-1">
      <label className="block text-sm font-medium text-[#1E1847]">{label}</label>
      <input
        type={type}
        required
        value={form[key]}
        onChange={(e) => setForm({ ...form, [key]: e.target.value })}
        className="block w-full rounded-2xl border border-[#D8D0F0] bg-white/70 px-4 py-3 text-sm shadow-sm placeholder:text-[#A09BBF] focus:border-[#7B4FD4] focus:outline-none focus:ring-2 focus:ring-[#7B4FD4]/15"
        placeholder={placeholder}
      />
    </div>
  );

  return (
    <div className="w-full max-w-md">
      <div className="mb-8 text-center">
        <div
          className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-[22px] shadow-[0_14px_40px_rgba(123,79,212,0.30)]"
          style={{ background: "linear-gradient(135deg, #5B9AF5 0%, #7B4FD4 55%, #E040A0 100%)" }}
        >
          <span className="text-2xl font-black text-white">F</span>
        </div>
        <h1 className="text-4xl font-bold tracking-tight text-[#1E1847]">Create your account</h1>
        <p className="mt-2 text-sm text-[#6B6B8A]">Start invoicing in minutes with Finuva</p>
      </div>

      <div className="glass-panel rounded-[30px] p-8">
        {error && (
          <div className="mb-4 rounded-2xl border border-red-200 bg-red-50 p-3 text-sm text-red-700">{error}</div>
        )}
        <form onSubmit={handleSubmit} className="space-y-4">
          {field("organizationName", "Business / Organization Name", "text", "Acme Corp")}
          {field("name", "Your Full Name", "text", "John Doe")}
          {field("email", "Work Email", "email", "john@acme.com")}

          <div className="space-y-1">
            <label className="block text-sm font-medium text-[#1E1847]">Password</label>
            <div className="relative">
              <input
                type={showPass ? "text" : "password"}
                required
                minLength={8}
                value={form.password}
                onChange={(e) => setForm({ ...form, password: e.target.value })}
                className="block w-full rounded-2xl border border-[#D8D0F0] bg-white/70 px-4 py-3 pr-11 text-sm shadow-sm placeholder:text-[#A09BBF] focus:border-[#7B4FD4] focus:outline-none focus:ring-2 focus:ring-[#7B4FD4]/15"
                placeholder="Min. 8 characters"
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
            className="mt-2 w-full rounded-2xl py-3 text-sm font-semibold text-white shadow-[0_14px_30px_rgba(123,79,212,0.28)] transition-all duration-300 hover:-translate-y-0.5 disabled:cursor-not-allowed disabled:opacity-60"
            style={{ background: "linear-gradient(135deg, #5B9AF5, #7B4FD4)" }}
          >
            {loading ? "Creating account..." : "Create Account"}
          </button>
        </form>
      </div>

      <p className="mt-6 text-center text-sm text-[#6B6B8A]">
        Already have an account?{" "}
        <Link href="/login" className="font-semibold text-[#7B4FD4] hover:underline">
          Sign in
        </Link>
      </p>
    </div>
  );
}
