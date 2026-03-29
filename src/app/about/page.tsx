import Link from "next/link";
import { ArrowRight, FileText, Sparkles, Users, Bot, ShieldCheck, LineChart } from "lucide-react";

const team = [
  {
    name: "Priya Nair",
    role: "Co-founder & CEO",
    bio: "Former fintech lead with 8 years building billing infrastructure for scale-ups across India.",
  },
  {
    name: "Rohan Mehta",
    role: "Co-founder & CTO",
    bio: "Ex-engineer at a leading payments company, passionate about making financial tooling fast and accessible.",
  },
  {
    name: "Sneha Kulkarni",
    role: "Head of Product",
    bio: "Designed workflows for thousands of freelancers and agencies before joining Finexa.",
  },
];

const values = [
  {
    icon: ShieldCheck,
    title: "Reliability first",
    desc: "Billing workflows fail businesses at the worst moments. We build for accuracy and consistency at every layer.",
  },
  {
    icon: LineChart,
    title: "Clarity over complexity",
    desc: "Every screen in Finexa is designed to show the information that matters, with zero visual noise.",
  },
  {
    icon: Users,
    title: "Built for India",
    desc: "GST, INR, Indian business workflows — Finexa is designed from the ground up for how India does billing.",
  },
  {
    icon: Bot,
    title: "Automate the boring parts",
    desc: "Reminders, recurring invoices, status updates — Finexa handles the repetition so your team doesn't have to.",
  },
];

export default function AboutPage() {
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
            <Link href="/about" className="font-semibold text-[#7B4FD4]">About</Link>
            <Link href="/contact" className="transition hover:text-[#7B4FD4]">Contact</Link>
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
        <div className="mx-auto max-w-3xl text-center">
          <p className="text-sm font-semibold uppercase tracking-[0.26em] text-[#8B7FB0]">Our story</p>
          <h1 className="mt-4 text-5xl font-bold tracking-[-0.04em] text-[#1E1847] sm:text-6xl">
            Built by people who hated <span className="finuva-gradient-text">invoice chaos.</span>
          </h1>
          <p className="mt-6 text-lg leading-8 text-[#5F598E]">
            Finexa started as an internal tool for a small agency that was drowning in spreadsheets, follow-up emails, and
            late payments. We turned that pain into a product that works for every team that invoices for a living.
          </p>
        </div>
      </section>

      {/* Mission */}
      <section className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
        <div className="glass-panel rounded-[40px] p-10 lg:p-14">
          <div className="grid gap-10 lg:grid-cols-2 lg:items-center">
            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.26em] text-[#8B7FB0]">Mission</p>
              <h2 className="mt-4 text-4xl font-bold tracking-[-0.03em] text-[#1E1847]">
                Make billing invisible for every Indian business.
              </h2>
              <p className="mt-4 text-lg leading-8 text-[#605A8E]">
                We believe billing should take minutes, not hours. That collections should be predictable, not stressful.
                And that every business — from solo freelancers to 50-person agencies — deserves professional-grade invoicing
                without enterprise complexity.
              </p>
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              {[
                ["1,400+", "Businesses using Finexa"],
                ["Rs 42Cr+", "Invoices processed"],
                ["3.2 days", "Avg. collection time"],
                ["48 hrs/mo", "Admin time saved per team"],
              ].map(([value, label]) => (
                <div key={label} className="rounded-[24px] border border-[#EFEAFF] bg-white/80 p-5">
                  <p className="text-3xl font-bold text-[#1E1847]">{value}</p>
                  <p className="mt-1 text-sm text-[#8B7FB0]">{label}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Values */}
      <section className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8">
        <div className="mb-12 max-w-2xl">
          <p className="text-sm font-semibold uppercase tracking-[0.26em] text-[#8B7FB0]">What we stand for</p>
          <h2 className="mt-4 text-4xl font-bold tracking-[-0.03em] text-[#1E1847]">The values that shape the product.</h2>
        </div>
        <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-4">
          {values.map(({ icon: Icon, title, desc }) => (
            <div key={title} className="glass-panel rounded-[28px] p-6">
              <div className="finuva-gradient flex h-12 w-12 items-center justify-center rounded-2xl text-white shadow-[0_16px_35px_rgba(123,79,212,0.22)]">
                <Icon className="h-5 w-5" />
              </div>
              <h3 className="mt-5 text-xl font-bold text-[#1E1847]">{title}</h3>
              <p className="mt-3 text-sm leading-7 text-[#605A8E]">{desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Team */}
      <section className="mx-auto max-w-7xl px-4 py-10 pb-24 sm:px-6 lg:px-8">
        <div className="mb-12 text-center">
          <p className="text-sm font-semibold uppercase tracking-[0.26em] text-[#8B7FB0]">Team</p>
          <h2 className="mt-4 text-4xl font-bold tracking-[-0.03em] text-[#1E1847]">The people behind Finexa.</h2>
        </div>
        <div className="grid gap-5 md:grid-cols-3">
          {team.map((member) => (
            <div key={member.name} className="glass-panel rounded-[28px] p-7">
              <div className="finuva-gradient flex h-14 w-14 items-center justify-center rounded-2xl text-xl font-bold text-white">
                {member.name[0]}
              </div>
              <h3 className="mt-5 text-xl font-bold text-[#1E1847]">{member.name}</h3>
              <p className="mt-1 text-sm font-semibold text-[#7B4FD4]">{member.role}</p>
              <p className="mt-3 text-sm leading-7 text-[#605A8E]">{member.bio}</p>
            </div>
          ))}
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
