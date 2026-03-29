import Link from "next/link";
import { redirect } from "next/navigation";
import {
  ArrowRight,
  BadgeCheck,
  Bot,
  CreditCard,
  FileText,
  IndianRupee,
  LineChart,
  RefreshCw,
  ShieldCheck,
  Sparkles,
  Users,
} from "lucide-react";
import { auth } from "@/lib/auth";

const features = [
  {
    icon: Bot,
    title: "Invoice automation",
    description:
      "Turn repeat billing, follow-ups, and due-date nudges into automated flows instead of admin work.",
  },
  {
    icon: IndianRupee,
    title: "GST-ready billing",
    description:
      "Generate clean GST-friendly invoices with India-focused fields, tax handling, and professional formatting.",
  },
  {
    icon: CreditCard,
    title: "Payment tracking",
    description:
      "Track paid, partial, overdue, and pending invoices in one live workspace with instant status visibility.",
  },
  {
    icon: RefreshCw,
    title: "Recurring invoices",
    description:
      "Set schedules once and let Finexa create recurring invoices and reminders automatically.",
  },
];

const steps = [
  {
    title: "Set up your workspace",
    copy: "Add your business details, GST info, customers, and services in a few guided steps.",
  },
  {
    title: "Send polished invoices",
    copy: "Create branded invoices in seconds, share them instantly, and keep every payment thread organized.",
  },
  {
    title: "Track and automate collections",
    copy: "Monitor cash flow, mark paid invoices, and automate recurring billing and reminders from one dashboard.",
  },
];

const testimonials = [
  {
    quote:
      "Finexa made invoicing feel invisible. We send faster, follow up less, and always know what's still pending.",
    name: "Riya Sharma",
    role: "Founder, Pixelmint Studio",
  },
  {
    quote:
      "I used to manage invoices in three tools. Finexa replaced all of them with one clean workflow.",
    name: "Arjun Patel",
    role: "Freelance Product Designer",
  },
  {
    quote:
      "The GST-ready flow is what sold us. It feels built for Indian businesses, not adapted as an afterthought.",
    name: "Neha Rao",
    role: "Operations Lead, Lantern Growth",
  },
];

const pricing = [
  {
    tier: "Free",
    price: "Rs 0",
    desc: "For freelancers and solo operators starting out.",
    features: ["Unlimited customers", "Basic invoices", "Payment status tracking"],
    cta: "Start Free",
  },
  {
    tier: "Pro",
    price: "Rs 999",
    desc: "For growing teams who want automation and control.",
    features: ["GST-ready invoicing", "Recurring invoices", "Reminder automation"],
    cta: "Choose Pro",
    featured: true,
  },
  {
    tier: "Business",
    price: "Custom",
    desc: "For agencies and multi-user operations with volume.",
    features: ["Team workflows", "Priority support", "Advanced reporting"],
    cta: "Talk to Sales",
  },
];

const faqs = [
  {
    q: "Is Finexa built for Indian GST workflows?",
    a: "Yes. Finexa is designed for GST-friendly invoicing with business details, tax-ready invoice layouts, and payment tracking suited to Indian billing operations.",
  },
  {
    q: "Can I manage recurring invoices?",
    a: "Yes. You can create schedules for repeating invoices and let Finexa automate creation and reminder flows.",
  },
  {
    q: "Does it work for freelancers and agencies?",
    a: "Yes. The product is structured for solo operators, agencies, and growing businesses that want faster invoicing and cleaner collections.",
  },
  {
    q: "Can I track partial payments and overdue invoices?",
    a: "Yes. Finexa tracks invoice states including partial, paid, and overdue so your receivables stay visible in real time.",
  },
];

function DashboardPreview() {
  return (
    <div className="glass-panel animate-rise relative overflow-hidden rounded-[36px] border border-white/60 p-4 shadow-[0_30px_80px_rgba(76,59,140,0.10)]">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(91,154,245,0.18),transparent_28%),radial-gradient(circle_at_bottom_right,rgba(224,64,160,0.16),transparent_24%)]" />
      <div className="relative overflow-hidden rounded-[28px] border border-[#E6E0FF] bg-white">
        <div className="flex items-center justify-between border-b border-[#F0EBFF] px-5 py-4">
          <div>
            <p className="text-xs uppercase tracking-[0.26em] text-[#8B7FB0]">Finexa Dashboard</p>
            <h3 className="mt-2 text-xl font-bold text-[#1E1847]">Revenue, invoices, and collections in one place.</h3>
          </div>
          <div className="rounded-2xl bg-[linear-gradient(135deg,#5B9AF5,#7B4FD4)] px-4 py-2 text-sm font-semibold text-white">
            92% on-time collection
          </div>
        </div>

        <div className="grid gap-4 p-5 lg:grid-cols-[0.78fr_1.22fr]">
          <div className="space-y-4">
            <div className="rounded-[24px] border border-[#EFEAFF] bg-[#FBFAFF] p-4">
              <p className="text-xs uppercase tracking-[0.2em] text-[#8B7FB0]">Collections</p>
              <p className="mt-3 text-3xl font-bold text-[#1E1847]">Rs 8.42L</p>
              <p className="mt-1 text-sm text-[#6E68A4]">Received this month</p>
              <div className="mt-4 h-2 overflow-hidden rounded-full bg-[#E8E2FF]">
                <div className="h-full w-[74%] rounded-full bg-[linear-gradient(90deg,#5B9AF5,#7B4FD4)]" />
              </div>
            </div>

            <div className="rounded-[24px] border border-[#EFEAFF] bg-white p-4">
              <div className="flex items-center justify-between">
                <p className="text-sm font-semibold text-[#1E1847]">Payment status</p>
                <span className="rounded-full bg-[#EEF6FF] px-2.5 py-1 text-xs font-medium text-[#4B8FEA]">
                  Live
                </span>
              </div>
              <div className="mt-4 space-y-3">
                {[
                  ["Paid", "124", "bg-[#E7FAEF] text-[#2B9A63]"],
                  ["Partial", "18", "bg-[#FFF4E9] text-[#D58431]"],
                  ["Overdue", "09", "bg-[#FFECEF] text-[#D84B72]"],
                ].map(([label, value, color]) => (
                  <div key={label} className="flex items-center justify-between rounded-2xl border border-[#F0EBFF] p-3">
                    <div className="flex items-center gap-3">
                      <span className={`rounded-full px-2.5 py-1 text-xs font-semibold ${color}`}>{label}</span>
                    </div>
                    <span className="text-sm font-bold text-[#1E1847]">{value}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <div className="rounded-[24px] border border-[#EFEAFF] bg-[#FCFBFF] p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-semibold text-[#1E1847]">Revenue analytics</p>
                  <p className="text-xs text-[#8B7FB0]">Invoices, payments, and growth trend</p>
                </div>
                <LineChart className="h-5 w-5 text-[#7B4FD4]" />
              </div>
              <div className="mt-5 flex h-44 items-end gap-3">
                {[34, 48, 41, 63, 58, 79, 71, 94].map((h, i) => (
                  <div key={i} className="flex flex-1 flex-col items-center gap-2">
                    <div
                      className="w-full rounded-t-[16px] bg-[linear-gradient(180deg,#5B9AF5_0%,#7B4FD4_72%,#E040A0_100%)]"
                      style={{ height: `${h}%` }}
                    />
                    <span className="text-[10px] uppercase tracking-[0.18em] text-[#A29BC5]">
                      {["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug"][i]}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            <div className="rounded-[24px] border border-[#EFEAFF] bg-white p-4">
              <div className="flex items-center justify-between">
                <p className="text-sm font-semibold text-[#1E1847]">Invoices</p>
                <span className="text-xs font-medium text-[#7B4FD4]">See all</span>
              </div>
              <div className="mt-4 space-y-3">
                {[
                  ["INV-2048", "Studio Alora", "Paid"],
                  ["INV-2052", "Aster Labs", "Partial"],
                  ["INV-2059", "Northfield Media", "Overdue"],
                ].map(([invoice, customer, status]) => (
                  <div key={invoice} className="grid grid-cols-[1fr_1fr_auto] items-center gap-3 rounded-2xl border border-[#F0EBFF] p-3">
                    <div>
                      <p className="text-sm font-semibold text-[#1E1847]">{invoice}</p>
                      <p className="text-xs text-[#8B7FB0]">{customer}</p>
                    </div>
                    <p className="text-sm text-[#605A8E]">Rs 12,800</p>
                    <span
                      className={`rounded-full px-2.5 py-1 text-xs font-semibold ${
                        status === "Paid"
                          ? "bg-[#E7FAEF] text-[#2B9A63]"
                          : status === "Partial"
                            ? "bg-[#FFF4E9] text-[#D58431]"
                            : "bg-[#FFECEF] text-[#D84B72]"
                      }`}
                    >
                      {status}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default async function HomePage() {
  const session = await auth();
  if (session?.user) {
    redirect("/dashboard");
  }

  return (
    <main className="min-h-screen overflow-hidden">
      <section className="relative mx-auto max-w-7xl px-4 pb-24 pt-6 sm:px-6 lg:px-8">
        <div className="glass-panel animate-rise sticky top-4 z-30 flex items-center justify-between rounded-[28px] px-5 py-4">
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
            <Link href="/" className="transition hover:text-[#7B4FD4]">
              Home
            </Link>
            <Link href="/about" className="transition hover:text-[#7B4FD4]">
              About
            </Link>
            <Link href="/contact" className="transition hover:text-[#7B4FD4]">
              Contact
            </Link>
            <a href="#features" className="transition hover:text-[#7B4FD4]">
              Features
            </a>
            <a href="#pricing" className="transition hover:text-[#7B4FD4]">
              Pricing
            </a>
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

        <div className="relative pt-16 lg:pt-24">
          <div className="mx-auto max-w-4xl text-center">
            <div className="animate-rise inline-flex items-center gap-2 rounded-full border border-[#E7E2F8] bg-white/75 px-4 py-2 text-sm font-medium text-[#6D67A3] shadow-sm">
              <BadgeCheck className="h-4 w-4 text-[#7B4FD4]" />
              Trusted by founders, freelancers, and finance teams moving faster.
            </div>
            <h1 className="font-display animate-rise stagger-1 mt-8 text-5xl font-bold tracking-[-0.04em] text-[#1E1847] sm:text-6xl lg:text-7xl">
              Smart Invoicing. <span className="finuva-gradient-text">Simplified.</span>
            </h1>
            <p className="animate-rise stagger-2 mx-auto mt-6 max-w-2xl text-lg leading-8 text-[#5F598E]">
              Create, send, and track invoices in seconds with Finexa. Automate GST-ready billing, keep payments visible,
              and turn collections into a workflow that finally feels effortless.
            </p>

            <div className="animate-rise stagger-3 mt-8 flex flex-col items-center justify-center gap-4 sm:flex-row">
              <Link
                href="/register"
                className="finuva-gradient inline-flex items-center gap-2 rounded-[20px] px-6 py-3 text-base font-semibold text-white shadow-[0_24px_45px_rgba(123,79,212,0.26)] transition hover:-translate-y-0.5"
              >
                Start Free Trial
                <ArrowRight className="h-4 w-4" />
              </Link>
              <Link
                href="/login"
                className="inline-flex items-center gap-2 rounded-[20px] border border-[#E5E2F5] bg-white/80 px-6 py-3 text-base font-semibold text-[#514B81] transition hover:-translate-y-0.5 hover:text-[#7B4FD4]"
              >
                View Live Product
              </Link>
            </div>

            <p className="animate-rise stagger-4 mt-5 text-sm text-[#877FB1]">
              No credit card required. Built for India-focused billing teams and global service businesses.
            </p>
          </div>

          <div className="mt-14 lg:mt-20">
            <DashboardPreview />
          </div>
        </div>
      </section>

      <section id="features" className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8">
        <div className="mb-12 max-w-2xl">
          <p className="text-sm font-semibold uppercase tracking-[0.26em] text-[#8B7FB0]">Why Finexa</p>
          <h2 className="mt-4 text-4xl font-bold tracking-[-0.03em] text-[#1E1847]">
            Built for teams that want less admin and faster collections.
          </h2>
          <p className="mt-4 text-lg text-[#605A8E]">
            Finexa combines polished invoicing, payment visibility, GST clarity, and repeatable automation in one focused
            workspace.
          </p>
        </div>

        <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-4">
          {features.map(({ icon: Icon, title, description }, index) => (
            <div
              key={title}
              className={`glass-panel animate-rise rounded-[28px] p-6 ${index === 1 ? "md:-translate-y-3" : ""}`}
            >
              <div className="finuva-gradient flex h-12 w-12 items-center justify-center rounded-2xl text-white shadow-[0_16px_35px_rgba(123,79,212,0.22)]">
                <Icon className="h-5 w-5" />
              </div>
              <h3 className="mt-5 text-xl font-bold text-[#1E1847]">{title}</h3>
              <p className="mt-3 text-sm leading-7 text-[#605A8E]">{description}</p>
            </div>
          ))}
        </div>
      </section>

      <section id="how-it-works" className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8">
        <div className="grid gap-10 lg:grid-cols-[0.9fr_1.1fr]">
          <div className="glass-panel rounded-[32px] p-8">
            <p className="text-sm font-semibold uppercase tracking-[0.26em] text-[#8B7FB0]">How it works</p>
            <h2 className="mt-4 text-4xl font-bold tracking-[-0.03em] text-[#1E1847]">
              From first invoice to paid status in three clear steps.
            </h2>
            <p className="mt-4 text-lg text-[#605A8E]">
              Finexa is designed to remove billing friction without adding complexity to your finance stack.
            </p>
            <div className="mt-8 rounded-[24px] border border-[#ECE8FB] bg-white/75 p-5">
              <div className="grid gap-4 sm:grid-cols-3">
                {[
                  ["Invoices sent", "1,482"],
                  ["Avg. collection time", "3.2 days"],
                  ["Saved admin hours", "48/mo"],
                ].map(([label, value]) => (
                  <div key={label} className="rounded-2xl bg-[#FAF8FF] p-4">
                    <p className="text-xs uppercase tracking-[0.2em] text-[#8B7FB0]">{label}</p>
                    <p className="mt-2 text-2xl font-bold text-[#1E1847]">{value}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="space-y-4">
            {steps.map((step, i) => (
              <div key={step.title} className="glass-panel rounded-[28px] p-6">
                <div className="flex items-start gap-4">
                  <div className="finuva-gradient flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-2xl text-lg font-bold text-white">
                    {i + 1}
                  </div>
                  <div>
                    <h3 className="text-2xl font-bold text-[#1E1847]">{step.title}</h3>
                    <p className="mt-3 text-base leading-7 text-[#605A8E]">{step.copy}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8">
        <div className="mb-12 flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
          <div className="max-w-2xl">
            <p className="text-sm font-semibold uppercase tracking-[0.26em] text-[#8B7FB0]">What users say</p>
            <h2 className="mt-4 text-4xl font-bold tracking-[-0.03em] text-[#1E1847]">
              Teams choose Finexa when billing has become a drag on growth.
            </h2>
          </div>
          <p className="max-w-xl text-base text-[#605A8E]">
            Designed to feel simple on day one and dependable every month after that.
          </p>
        </div>

        <div className="grid gap-5 lg:grid-cols-3">
          {testimonials.map((t) => (
            <div key={t.name} className="glass-panel rounded-[28px] p-6">
              <p className="text-lg leading-8 text-[#403A73]">"{t.quote}"</p>
              <div className="mt-6 flex items-center gap-3">
                <div className="finuva-gradient flex h-11 w-11 items-center justify-center rounded-2xl text-sm font-bold text-white">
                  {t.name[0]}
                </div>
                <div>
                  <p className="font-semibold text-[#1E1847]">{t.name}</p>
                  <p className="text-sm text-[#7D76A8]">{t.role}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      <section id="pricing" className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-3xl text-center">
          <p className="text-sm font-semibold uppercase tracking-[0.26em] text-[#8B7FB0]">Pricing</p>
          <h2 className="mt-4 text-4xl font-bold tracking-[-0.03em] text-[#1E1847]">
            Start free. Scale without rebuilding your billing stack.
          </h2>
          <p className="mt-4 text-lg text-[#605A8E]">
            Clear plans for solo operators, growing teams, and businesses with recurring billing needs.
          </p>
        </div>

        <div className="mt-12 grid gap-5 lg:grid-cols-3">
          {pricing.map((plan) => (
            <div
              key={plan.tier}
              className={`rounded-[32px] p-[1px] ${
                plan.featured ? "finuva-gradient shadow-[0_22px_55px_rgba(123,79,212,0.22)]" : "glass-panel"
              }`}
            >
              <div className={`h-full rounded-[31px] ${plan.featured ? "bg-white" : "bg-transparent"} p-7`}>
                <div className="flex items-center justify-between">
                  <h3 className="text-2xl font-bold text-[#1E1847]">{plan.tier}</h3>
                  {plan.featured && (
                    <span className="rounded-full bg-[#F0EBFF] px-3 py-1 text-xs font-semibold text-[#7B4FD4]">
                      Most Popular
                    </span>
                  )}
                </div>
                <p className="mt-3 text-sm leading-7 text-[#605A8E]">{plan.desc}</p>
                <div className="mt-6 flex items-end gap-2">
                  <span className="text-5xl font-bold tracking-[-0.04em] text-[#1E1847]">{plan.price}</span>
                  {plan.price !== "Custom" && <span className="pb-2 text-sm text-[#8B7FB0]">/ month</span>}
                </div>
                <ul className="mt-6 space-y-3">
                  {plan.features.map((feature) => (
                    <li key={feature} className="flex items-center gap-3 text-sm text-[#514B81]">
                      <ShieldCheck className="h-4 w-4 text-[#7B4FD4]" />
                      {feature}
                    </li>
                  ))}
                </ul>
                <Link
                  href={plan.tier === "Business" ? "/login" : "/register"}
                  className={`mt-8 inline-flex w-full items-center justify-center gap-2 rounded-[20px] px-5 py-3 text-sm font-semibold transition hover:-translate-y-0.5 ${
                    plan.featured
                      ? "finuva-gradient text-white"
                      : "border border-[#E5E2F5] bg-white/75 text-[#514B81]"
                  }`}
                >
                  {plan.cta}
                </Link>
              </div>
            </div>
          ))}
        </div>
      </section>

      <section id="faq" className="mx-auto max-w-5xl px-4 py-20 sm:px-6 lg:px-8">
        <div className="text-center">
          <p className="text-sm font-semibold uppercase tracking-[0.26em] text-[#8B7FB0]">FAQ</p>
          <h2 className="mt-4 text-4xl font-bold tracking-[-0.03em] text-[#1E1847]">
            Questions teams ask before switching billing platforms.
          </h2>
        </div>

        <div className="mt-12 space-y-4">
          {faqs.map((faq) => (
            <div key={faq.q} className="glass-panel rounded-[26px] p-6">
              <h3 className="text-lg font-bold text-[#1E1847]">{faq.q}</h3>
              <p className="mt-3 text-sm leading-7 text-[#605A8E]">{faq.a}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 pb-24 pt-10 sm:px-6 lg:px-8">
        <div className="finuva-gradient relative overflow-hidden rounded-[40px] px-8 py-12 text-white shadow-[0_30px_70px_rgba(123,79,212,0.28)] sm:px-12">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(255,255,255,0.28),transparent_24%),radial-gradient(circle_at_bottom_left,rgba(255,255,255,0.16),transparent_24%)]" />
          <div className="relative flex flex-col gap-8 lg:flex-row lg:items-center lg:justify-between">
            <div className="max-w-2xl">
              <p className="text-sm font-semibold uppercase tracking-[0.26em] text-white/80">Final CTA</p>
              <h2 className="mt-4 text-4xl font-bold tracking-[-0.03em]">
                Stop wrestling with invoices. Start billing with confidence.
              </h2>
              <p className="mt-4 text-lg leading-8 text-white/84">
                Finexa gives you the speed of a startup tool and the structure serious billing operations actually need.
              </p>
            </div>
            <div className="flex flex-col gap-4 sm:flex-row">
              <Link
                href="/register"
                className="inline-flex items-center justify-center gap-2 rounded-[20px] bg-white px-6 py-3 text-base font-semibold text-[#4F44A8] transition hover:-translate-y-0.5"
              >
                Start Free Trial
                <ArrowRight className="h-4 w-4" />
              </Link>
              <Link
                href="/login"
                className="inline-flex items-center justify-center gap-2 rounded-[20px] border border-white/30 px-6 py-3 text-base font-semibold text-white transition hover:-translate-y-0.5"
              >
                Talk to Sales
              </Link>
            </div>
          </div>
        </div>
      </section>

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
          <span className="inline-flex items-center gap-2">
            <Users className="h-4 w-4" />
            Built for businesses, freelancers, and agencies
          </span>
          <span className="inline-flex items-center gap-2">
            <Bot className="h-4 w-4" />
            Automation-first workflows
          </span>
        </div>
      </footer>
    </main>
  );
}
