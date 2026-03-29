import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { Topbar } from "@/components/layout/topbar";
import { StatCard } from "@/components/ui/card";
import { InvoiceStatusBadge } from "@/components/ui/badge";
import { formatCurrency, isOverdue } from "@/lib/utils";
import Link from "next/link";
import { DollarSign, FileText, AlertTriangle, Users, Clock } from "lucide-react";
import { startOfMonth, endOfMonth, subMonths } from "date-fns";

export const metadata = { title: "Dashboard" };

async function getDashboardData(orgId: string) {
  const now = new Date();
  const thisMonthStart = startOfMonth(now);
  const thisMonthEnd = endOfMonth(now);
  const lastMonthStart = startOfMonth(subMonths(now, 1));
  const lastMonthEnd = endOfMonth(subMonths(now, 1));

  const [
    totalRevenue,
    thisMonthRevenue,
    lastMonthRevenue,
    unpaid,
    overdue,
    totalCustomers,
    recentInvoices,
  ] = await Promise.all([
    prisma.payment.aggregate({ where: { organizationId: orgId }, _sum: { amount: true } }),
    prisma.payment.aggregate({
      where: { organizationId: orgId, paymentDate: { gte: thisMonthStart, lte: thisMonthEnd } },
      _sum: { amount: true },
    }),
    prisma.payment.aggregate({
      where: { organizationId: orgId, paymentDate: { gte: lastMonthStart, lte: lastMonthEnd } },
      _sum: { amount: true },
    }),
    prisma.invoice.aggregate({
      where: { organizationId: orgId, status: { in: ["SENT", "VIEWED", "PARTIALLY_PAID", "OVERDUE"] } },
      _sum: { balanceDue: true },
      _count: true,
    }),
    prisma.invoice.count({
      where: {
        organizationId: orgId,
        status: { in: ["SENT", "VIEWED", "PARTIALLY_PAID", "OVERDUE"] },
        dueDate: { lt: now },
      },
    }),
    prisma.customer.count({ where: { organizationId: orgId, isActive: true } }),
    prisma.invoice.findMany({
      where: { organizationId: orgId },
      include: { customer: { select: { displayName: true } } },
      orderBy: { createdAt: "desc" },
      take: 8,
    }),
  ]);

  return { totalRevenue, thisMonthRevenue, lastMonthRevenue, unpaid, overdue, totalCustomers, recentInvoices };
}

export default async function DashboardPage() {
  const session = await auth();
  if (!session?.user) return null;

  const data = await getDashboardData(session.user.organizationId);
  const thisMo = Number(data.thisMonthRevenue._sum.amount ?? 0);
  const lastMo = Number(data.lastMonthRevenue._sum.amount ?? 0);
  const trendPct = lastMo > 0 ? (((thisMo - lastMo) / lastMo) * 100).toFixed(1) : "—";

  return (
    <div>
      <Topbar title="Dashboard" userName={session.user.name ?? ""} />

      <div className="space-y-6 px-3 pb-6 pt-5 lg:px-6">
        {/* Hero section */}
        <section className="glass-panel animate-rise overflow-hidden rounded-[32px] p-7">
          <div className="grid gap-8 lg:grid-cols-[1.4fr_0.8fr]">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.32em] text-[#8B7FB0]">Finance cockpit</p>
              <h2 className="mt-3 max-w-2xl text-5xl font-bold leading-[0.95] tracking-tight text-[#1E1847]">
                Elegant billing operations for a faster close.
              </h2>
              <p className="mt-4 max-w-xl text-sm leading-6 text-[#6B6B8A]">
                Track receivables, send polished invoices, and keep your organization&apos;s cash flow visible in one modern workspace.
              </p>
            </div>
            <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-1">
              <div
                className="rounded-[24px] p-5 text-white shadow-[0_18px_40px_rgba(123,79,212,0.22)]"
                style={{ background: "linear-gradient(135deg, #5B9AF5 0%, #7B4FD4 55%, #E040A0 100%)" }}
              >
                <p className="text-xs font-semibold uppercase tracking-[0.28em] text-purple-100/80">Collected</p>
                <p className="mt-3 text-3xl font-bold">{formatCurrency(Number(data.totalRevenue._sum.amount ?? 0))}</p>
                <p className="mt-2 text-xs text-white/70">All-time revenue received across your org.</p>
              </div>
              <div className="rounded-[24px] border border-[#E5E2F5] bg-white/70 p-5">
                <p className="text-xs font-semibold uppercase tracking-[0.28em] text-[#8B7FB0]">Customers</p>
                <p className="mt-3 text-3xl font-bold text-[#1E1847]">{data.totalCustomers}</p>
                <p className="mt-2 text-xs text-[#6B6B8A]">Active customer accounts with invoice history.</p>
              </div>
            </div>
          </div>
        </section>

        {/* Stat cards */}
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <StatCard
            title="Total Revenue"
            value={formatCurrency(Number(data.totalRevenue._sum.amount ?? 0))}
            subtitle="All time"
            icon={<DollarSign className="h-5 w-5" />}
          />
          <StatCard
            title="This Month"
            value={formatCurrency(thisMo)}
            trendValue={lastMo > 0 ? `${trendPct}% vs last month` : undefined}
            trend={thisMo >= lastMo ? "up" : "down"}
            icon={<DollarSign className="h-5 w-5" />}
          />
          <StatCard
            title="Unpaid Invoices"
            value={formatCurrency(Number(data.unpaid._sum.balanceDue ?? 0))}
            subtitle={`${data.unpaid._count} invoices`}
            icon={<Clock className="h-5 w-5" />}
          />
          <StatCard
            title="Overdue"
            value={String(data.overdue)}
            subtitle="invoices past due"
            icon={<AlertTriangle className="h-5 w-5" />}
          />
        </div>

        <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
          {/* Recent Invoices */}
          <div className="glass-panel animate-rise stagger-1 lg:col-span-2 rounded-[30px]">
            <div className="flex items-center justify-between border-b border-[#E5E2F5] px-6 py-5">
              <h2 className="flex items-center gap-2 font-semibold text-[#1E1847]">
                <FileText className="h-4 w-4 text-[#8B7FB0]" /> Recent Invoices
              </h2>
              <Link href="/invoices" className="text-sm font-medium text-[#7B4FD4] hover:underline">
                View all →
              </Link>
            </div>
            <div className="divide-y divide-[#EDE8FF]">
              {data.recentInvoices.length === 0 ? (
                <p className="px-6 py-10 text-center text-sm text-[#8B7FB0]">No invoices yet.</p>
              ) : (
                data.recentInvoices.map((inv) => (
                  <Link
                    key={inv.id}
                    href={`/invoices/${inv.id}`}
                    className="flex items-center justify-between px-6 py-4 transition-colors hover:bg-[#F3EEFF]/50"
                  >
                    <div>
                      <p className="text-sm font-semibold text-[#1E1847]">{inv.invoiceNumber}</p>
                      <p className="text-xs text-[#6B6B8A]">{inv.customer.displayName}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-bold text-[#1E1847]">{formatCurrency(Number(inv.total))}</p>
                      <div className="mt-1 flex items-center justify-end gap-2">
                        <InvoiceStatusBadge status={inv.status} />
                        {isOverdue(inv.dueDate) && inv.status !== "PAID" && (
                          <span className="text-xs text-red-500">Overdue</span>
                        )}
                      </div>
                    </div>
                  </Link>
                ))
              )}
            </div>
          </div>

          {/* Quick Actions */}
          <div className="glass-panel animate-rise stagger-2 rounded-[30px]">
            <div className="border-b border-[#E5E2F5] px-6 py-5">
              <h2 className="font-semibold text-[#1E1847]">Quick Actions</h2>
            </div>
            <div className="space-y-3 p-6">
              {[
                {
                  href: "/invoices/new",
                  label: "New Invoice",
                  icon: FileText,
                  gradient: "linear-gradient(135deg, #5B9AF5, #7B4FD4)",
                },
                {
                  href: "/customers/new",
                  label: "Add Customer",
                  icon: Users,
                  gradient: "linear-gradient(135deg, #7B4FD4, #E040A0)",
                },
                {
                  href: "/payments",
                  label: "Record Payment",
                  icon: DollarSign,
                  gradient: "linear-gradient(135deg, #5B9AF5, #38B2AC)",
                },
                {
                  href: "/reports",
                  label: "View Reports",
                  icon: AlertTriangle,
                  gradient: "linear-gradient(135deg, #E040A0, #7B4FD4)",
                },
              ].map(({ href, label, icon: Icon, gradient }) => (
                <Link
                  key={href}
                  href={href}
                  className="flex items-center gap-3 rounded-[22px] border border-[#E5E2F5] bg-white/45 p-4 transition-all duration-300 hover:-translate-y-0.5 hover:border-[#C9ADFF] hover:bg-white/80"
                >
                  <div
                    className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-2xl text-white shadow-[0_10px_24px_rgba(123,79,212,0.20)]"
                    style={{ background: gradient }}
                  >
                    <Icon className="h-4 w-4" />
                  </div>
                  <span className="text-sm font-medium text-[#1E1847]">{label}</span>
                </Link>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
