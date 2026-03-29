"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import {
  LayoutDashboard,
  Users,
  Package,
  FileText,
  CreditCard,
  BarChart2,
  Settings,
  Receipt,
  Clock,
  RefreshCw,
  LogOut,
} from "lucide-react";
import { signOut } from "next-auth/react";
import { useLoading } from "@/components/providers/loading-provider";

const navItems = [
  { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { href: "/customers", label: "Customers", icon: Users },
  { href: "/items", label: "Items", icon: Package },
  { href: "/invoices", label: "Invoices", icon: FileText },
  { href: "/payments", label: "Payments", icon: CreditCard },
  { href: "/recurring", label: "Recurring", icon: RefreshCw },
  { href: "/expenses", label: "Expenses", icon: Receipt },
  { href: "/time", label: "Time Tracking", icon: Clock },
  { href: "/reports", label: "Reports", icon: BarChart2 },
  { href: "/settings", label: "Settings", icon: Settings },
];

export function Sidebar({ orgName }: { orgName: string }) {
  const pathname = usePathname();
  const { start } = useLoading();

  return (
    <aside className="fixed inset-y-3 left-3 z-50 hidden w-72 overflow-hidden rounded-[28px] border border-white/10 bg-[#120B2E] text-white shadow-[0_30px_80px_rgba(9,5,30,0.48)] lg:flex lg:flex-col">
      {/* Ambient gradient overlays */}
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(91,154,245,0.18),transparent_35%),radial-gradient(circle_at_bottom_right,rgba(224,64,160,0.14),transparent_35%)]" />

      {/* Logo / Brand header */}
      <div className="relative flex items-center gap-3 border-b border-white/10 px-6 py-5">
        <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-2xl shadow-lg shadow-purple-950/30"
          style={{ background: "linear-gradient(135deg, #5B9AF5 0%, #7B4FD4 55%, #E040A0 100%)" }}>
          <FileText className="h-4 w-4 text-white" />
        </div>
        <div className="overflow-hidden">
          <p className="truncate text-xl font-bold leading-none tracking-tight text-white">Finuva</p>
          <p className="truncate pt-1 text-xs uppercase tracking-[0.22em] text-purple-200/60">
            {orgName}
          </p>
        </div>
      </div>

      {/* Navigation */}
      <nav className="relative flex-1 space-y-1 overflow-y-auto px-4 py-5 scrollbar-thin">
        {navItems.map(({ href, label, icon: Icon }) => {
          const active = pathname === href || pathname.startsWith(href + "/");
          return (
            <Link
              key={href}
              href={href}
              onClick={() => { if (!active) start(); }}
              className={cn(
                "group flex items-center gap-3 rounded-2xl px-4 py-3 text-sm font-medium transition-all duration-300",
                active
                  ? "bg-white/12 text-white shadow-[inset_0_1px_0_rgba(255,255,255,0.10)]"
                  : "text-purple-100/65 hover:bg-white/6 hover:text-white"
              )}
            >
              <span
                className={cn(
                  "flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-xl transition-all duration-300",
                  active
                    ? "text-white shadow-md shadow-purple-900/30"
                    : "bg-white/6 text-purple-100/70 group-hover:bg-white/10"
                )}
                style={active ? { background: "linear-gradient(135deg, #5B9AF5, #7B4FD4)" } : undefined}
              >
                <Icon className="h-4 w-4" />
              </span>
              {label}
            </Link>
          );
        })}
      </nav>

      {/* Sign Out */}
      <div className="relative border-t border-white/10 px-4 py-4">
        <button
          onClick={() => signOut({ callbackUrl: "/login" })}
          className="flex w-full items-center gap-3 rounded-2xl px-4 py-3 text-sm font-medium text-purple-100/65 transition-all duration-300 hover:bg-white/6 hover:text-white"
        >
          <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-white/6">
            <LogOut className="h-4 w-4" />
          </span>
          Sign Out
        </button>
      </div>
    </aside>
  );
}
