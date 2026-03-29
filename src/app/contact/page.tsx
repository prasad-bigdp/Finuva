"use client";

import Link from "next/link";
import { useState } from "react";
import { ArrowRight, FileText, Mail, MapPin, MessageSquare, Phone, Sparkles } from "lucide-react";

export default function ContactPage() {
  const [form, setForm] = useState({ name: "", email: "", subject: "", message: "" });
  const [submitted, setSubmitted] = useState(false);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    // In production, wire this to an API route or email service
    setSubmitted(true);
  }

  return (
    <main className="min-h-screen overflow-hidden">
      {/* Navbar */}
      <section className="relative mx-auto max-w-7xl px-4 pb-0 pt-6 sm:px-6 lg:px-8">
        <div className="glass-panel sticky top-4 z-30 flex items-center justify-between rounded-[28px] px-5 py-4">
          <Link href="/" className="flex items-center gap-3">
            <div className="finuva-gradient flex h-11 w-11 items-center justify-center rounded-2xl text-white shadow-[0_16px_35px_rgba(123,79,212,0.28)]">
              <Sparkles className="h-5 w-5" />
            </div>
            <div>
              <p className="text-xs uppercase tracking-[0.24em] text-[#8B7FB0]">AI Billing Platform</p>
              <p className="text-xl font-bold text-[#1E1847]">Finexa</p>
            </div>
          </Link>

          <nav className="hidden items-center gap-8 text-sm font-medium text-[#5E578A] md:flex">
            <Link href="/" className="transition hover:text-[#7B4FD4]">Home</Link>
            <Link href="/about" className="transition hover:text-[#7B4FD4]">About</Link>
            <Link href="/contact" className="font-semibold text-[#7B4FD4]">Contact</Link>
            <a href="/#features" className="transition hover:text-[#7B4FD4]">Features</a>
            <a href="/#pricing" className="transition hover:text-[#7B4FD4]">Pricing</a>
          </nav>

          <div className="flex items-center gap-3">
            <Link
              href="/login"
              className="hidden rounded-2xl border border-[#E5E2F5] bg-white/70 px-4 py-2 text-sm font-semibold text-[#5E578A] transition hover:-translate-y-0.5 hover:text-[#7B4FD4] sm:inline-flex"
            >
              Sign In
            </Link>
            <Link
              href="/register"
              className="finuva-gradient inline-flex items-center gap-2 rounded-2xl px-4 py-2 text-sm font-semibold text-white shadow-[0_18px_35px_rgba(123,79,212,0.24)] transition hover:-translate-y-0.5"
            >
              Start Free Trial
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </div>
      </section>

      {/* Hero */}
      <section className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-2xl text-center">
          <p className="text-sm font-semibold uppercase tracking-[0.26em] text-[#8B7FB0]">Get in touch</p>
          <h1 className="mt-4 text-5xl font-bold tracking-[-0.04em] text-[#1E1847] sm:text-6xl">
            We&apos;d love to <span className="finuva-gradient-text">hear from you.</span>
          </h1>
          <p className="mt-6 text-lg leading-8 text-[#5F598E]">
            Whether you have a question about features, pricing, or anything else — our team is ready to help.
          </p>
        </div>
      </section>

      {/* Contact Section */}
      <section className="mx-auto max-w-7xl px-4 pb-24 sm:px-6 lg:px-8">
        <div className="grid gap-8 lg:grid-cols-[1fr_1.6fr]">
          {/* Contact Info */}
          <div className="space-y-5">
            <div className="glass-panel rounded-[28px] p-6">
              <div className="finuva-gradient flex h-12 w-12 items-center justify-center rounded-2xl text-white shadow-[0_16px_35px_rgba(123,79,212,0.22)]">
                <Mail className="h-5 w-5" />
              </div>
              <h3 className="mt-5 text-xl font-bold text-[#1E1847]">Email us</h3>
              <p className="mt-2 text-sm text-[#605A8E]">Our team replies within 24 hours on business days.</p>
              <p className="mt-3 font-semibold text-[#7B4FD4]">hello@finexa.in</p>
            </div>

            <div className="glass-panel rounded-[28px] p-6">
              <div className="finuva-gradient flex h-12 w-12 items-center justify-center rounded-2xl text-white shadow-[0_16px_35px_rgba(123,79,212,0.22)]">
                <Phone className="h-5 w-5" />
              </div>
              <h3 className="mt-5 text-xl font-bold text-[#1E1847]">Call us</h3>
              <p className="mt-2 text-sm text-[#605A8E]">Mon–Fri, 10am to 6pm IST.</p>
              <p className="mt-3 font-semibold text-[#7B4FD4]">+91 98765 43210</p>
            </div>

            <div className="glass-panel rounded-[28px] p-6">
              <div className="finuva-gradient flex h-12 w-12 items-center justify-center rounded-2xl text-white shadow-[0_16px_35px_rgba(123,79,212,0.22)]">
                <MapPin className="h-5 w-5" />
              </div>
              <h3 className="mt-5 text-xl font-bold text-[#1E1847]">Visit us</h3>
              <p className="mt-2 text-sm text-[#605A8E]">Our office is open for scheduled meetings.</p>
              <p className="mt-3 text-sm font-semibold text-[#7B4FD4]">Koramangala, Bangalore, India</p>
            </div>
          </div>

          {/* Contact Form */}
          <div className="glass-panel rounded-[32px] p-8">
            {submitted ? (
              <div className="flex h-full flex-col items-center justify-center py-12 text-center">
                <div className="finuva-gradient flex h-16 w-16 items-center justify-center rounded-[22px] text-white shadow-[0_14px_40px_rgba(123,79,212,0.30)]">
                  <MessageSquare className="h-7 w-7" />
                </div>
                <h2 className="mt-6 text-3xl font-bold text-[#1E1847]">Message sent!</h2>
                <p className="mt-3 text-base text-[#605A8E]">
                  Thanks for reaching out. We&apos;ll get back to you within 24 hours.
                </p>
                <button
                  onClick={() => { setSubmitted(false); setForm({ name: "", email: "", subject: "", message: "" }); }}
                  className="mt-8 rounded-2xl border border-[#E5E2F5] bg-white/70 px-6 py-3 text-sm font-semibold text-[#5E578A] transition hover:text-[#7B4FD4]"
                >
                  Send another message
                </button>
              </div>
            ) : (
              <>
                <h2 className="text-2xl font-bold text-[#1E1847]">Send us a message</h2>
                <p className="mt-1 text-sm text-[#8B7FB0]">Fill in the form and we&apos;ll be in touch.</p>
                <form onSubmit={handleSubmit} className="mt-6 space-y-4">
                  <div className="grid gap-4 sm:grid-cols-2">
                    <div className="space-y-1">
                      <label className="block text-sm font-medium text-[#1E1847]">Full name</label>
                      <input
                        type="text"
                        required
                        value={form.name}
                        onChange={(e) => setForm({ ...form, name: e.target.value })}
                        placeholder="Your name"
                        className="block w-full rounded-2xl border border-[#D8D0F0] bg-white/70 px-4 py-3 text-sm shadow-sm placeholder:text-[#A09BBF] focus:border-[#7B4FD4] focus:outline-none focus:ring-2 focus:ring-[#7B4FD4]/15"
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="block text-sm font-medium text-[#1E1847]">Email</label>
                      <input
                        type="email"
                        required
                        value={form.email}
                        onChange={(e) => setForm({ ...form, email: e.target.value })}
                        placeholder="you@company.com"
                        className="block w-full rounded-2xl border border-[#D8D0F0] bg-white/70 px-4 py-3 text-sm shadow-sm placeholder:text-[#A09BBF] focus:border-[#7B4FD4] focus:outline-none focus:ring-2 focus:ring-[#7B4FD4]/15"
                      />
                    </div>
                  </div>
                  <div className="space-y-1">
                    <label className="block text-sm font-medium text-[#1E1847]">Subject</label>
                    <input
                      type="text"
                      required
                      value={form.subject}
                      onChange={(e) => setForm({ ...form, subject: e.target.value })}
                      placeholder="How can we help?"
                      className="block w-full rounded-2xl border border-[#D8D0F0] bg-white/70 px-4 py-3 text-sm shadow-sm placeholder:text-[#A09BBF] focus:border-[#7B4FD4] focus:outline-none focus:ring-2 focus:ring-[#7B4FD4]/15"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="block text-sm font-medium text-[#1E1847]">Message</label>
                    <textarea
                      required
                      rows={5}
                      value={form.message}
                      onChange={(e) => setForm({ ...form, message: e.target.value })}
                      placeholder="Tell us more..."
                      className="block w-full rounded-2xl border border-[#D8D0F0] bg-white/70 px-4 py-3 text-sm shadow-sm placeholder:text-[#A09BBF] focus:border-[#7B4FD4] focus:outline-none focus:ring-2 focus:ring-[#7B4FD4]/15 resize-none"
                    />
                  </div>
                  <button
                    type="submit"
                    className="w-full rounded-2xl py-3 text-sm font-semibold text-white shadow-[0_14px_30px_rgba(123,79,212,0.28)] transition-all duration-300 hover:-translate-y-0.5"
                    style={{ background: "linear-gradient(135deg, #5B9AF5, #7B4FD4)" }}
                  >
                    Send Message
                  </button>
                </form>
              </>
            )}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="mx-auto flex max-w-7xl flex-col gap-4 px-4 pb-10 text-sm text-[#7D76A8] sm:px-6 lg:flex-row lg:items-center lg:justify-between lg:px-8">
        <div className="flex items-center gap-3">
          <div className="finuva-gradient flex h-10 w-10 items-center justify-center rounded-2xl text-white">
            <FileText className="h-4 w-4" />
          </div>
          <div>
            <p className="font-semibold text-[#1E1847]">Finexa</p>
            <p>AI-powered invoicing and billing for modern businesses.</p>
          </div>
        </div>
        <div className="flex flex-wrap items-center gap-5">
          <Link href="/" className="transition hover:text-[#7B4FD4]">Home</Link>
          <Link href="/about" className="transition hover:text-[#7B4FD4]">About</Link>
          <Link href="/contact" className="transition hover:text-[#7B4FD4]">Contact</Link>
        </div>
      </footer>
    </main>
  );
}
