import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { Topbar } from "@/components/layout/topbar";
import { formatCurrency, formatDate } from "@/lib/utils";
import { InvoiceStatusBadge } from "@/components/ui/badge";
import { RevenueChart } from "@/components/reports/revenue-chart";
import Link from "next/link";
import { TrendingUp, AlertCircle, Users, FileText } from "lucide-react";
import { startOfMonth, endOfMonth, subMonths } from "date-fns";

export const metadata = { title: "Reports" };

async function getReportData(orgId: string) {
  const now = new Date();

  const [
    totalRevenue,
    thisMonthRevenue,
    lastMonthRevenue,
    unpaidInvoices,
    overdueInvoices,
    topCustomers,
    monthlyRevenue,
  ] = await Promise.all([
    prisma.payment.aggregate({ where: { organizationId: orgId }, _sum: { amount: true } }),
    prisma.payment.aggregate({
      where: { organizationId: orgId, paymentDate: { gte: startOfMonth(now), lte: endOfMonth(now) } },
      _sum: { amount: true },
    }),
    prisma.payment.aggregate({
      where: { organizationId: orgId, paymentDate: { gte: startOfMonth(subMonths(now, 1)), lte: endOfMonth(subMonths(now, 1)) } },
      _sum: { amount: true },
    }),
    prisma.invoice.findMany({
      where: { organizationId: orgId, status: { in: ["SENT", "VIEWED", "PARTIALLY_PAID"] } },
      include: { customer: { select: { displayName: true } } },
      orderBy: { dueDate: "asc" },
    }),
    prisma.invoice.findMany({
      where: {
        organizationId: orgId,
        status: { in: ["SENT", "VIEWED", "PARTIALLY_PAID", "OVERDUE"] },
        dueDate: { lt: now },
      },
      include: { customer: { select: { displayName: true } } },
      orderBy: { dueDate: "asc" },
    }),
    prisma.customer.findMany({
      where: { organizationId: orgId, isActive: true },
      select: {
        id: true,
        displayName: true,
        outstandingBalance: true,
        _count: { select: { invoices: true } },
        invoices: { where: { status: "PAID" }, select: { total: true } },
      },
      orderBy: { outstandingBalance: "desc" },
      take: 10,
    }),
    prisma.$queryRaw<{ month: string; revenue: number }[]>`
      SELECT
        TO_CHAR(DATE_TRUNC('month', "paymentDate"), 'Mon YYYY') as month,
        SUM(amount)::float as revenue
      FROM payments
      WHERE "organizationId" = ${orgId}
        AND "paymentDate" >= ${subMonths(now, 5)}
      GROUP BY DATE_TRUNC('month', "paymentDate")
      ORDER BY DATE_TRUNC('month', "paymentDate") ASC
    `,
  ]);

  return {
    totalRevenue: Number(totalRevenue._sum.amount ?? 0),
    thisMonthRevenue: Number(thisMonthRevenue._sum.amount ?? 0),
    lastMonthRevenue: Number(lastMonthRevenue._sum.amount ?? 0),
    unpaidInvoices,
    overdueInvoices,
    topCustomers: topCustomers.map((c) => ({
      id: c.id,
      name: c.displayName,
      invoiceCount: c._count.invoices,
      totalPaid: c.invoices.reduce((s, i) => s + Number(i.total), 0),
      outstanding: Number(c.outstandingBalance),
    })),
    monthlyRevenue,
  };
}

export default async function ReportsPage() {
  const session = await auth();
  if (!session?.user) return null;

  const data = await getReportData(session.user.organizationId);
  const trendPct =
    data.lastMonthRevenue > 0
      ? (((data.thisMonthRevenue - data.lastMonthRevenue) / data.lastMonthRevenue) * 100).toFixed(1)
      : null;

  const totalUnpaid = data.unpaidInvoices.reduce((s, i) => s + Number(i.balanceDue), 0);
  const totalOverdue = data.overdueInvoices.reduce((s, i) => s + Number(i.balanceDue), 0);

  return (
    <div>
      <Topbar title="Reports & Analytics" />

      <div className="p-6 space-y-6">
        {/* KPI Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {[
            {
              label: "Total Revenue",
              value: formatCurrency(data.totalRevenue),
              sub: "All time",
              icon: TrendingUp,
              color: "bg-green-50 text-green-600",
            },
            {
              label: "This Month",
              value: formatCurrency(data.thisMonthRevenue),
              sub: trendPct ? `${trendPct}% vs last month` : "No comparison",
              icon: TrendingUp,
              color: "bg-blue-50 text-blue-600",
            },
            {
              label: "Unpaid",
              value: formatCurrency(totalUnpaid),
              sub: `${data.unpaidInvoices.length} invoices`,
              icon: FileText,
              color: "bg-orange-50 text-orange-600",
            },
            {
              label: "Overdue",
              value: formatCurrency(totalOverdue),
              sub: `${data.overdueInvoices.length} invoices`,
              icon: AlertCircle,
              color: "bg-red-50 text-red-600",
            },
          ].map(({ label, value, sub, icon: Icon, color }) => (
            <div key={label} className="bg-white rounded-xl border border-gray-200 shadow-sm p-5">
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-500">{label}</p>
                  <p className="text-2xl font-bold text-gray-900 mt-1">{value}</p>
                  <p className="text-xs text-gray-500 mt-0.5">{sub}</p>
                </div>
                <div className={`p-2.5 rounded-lg ${color}`}>
                  <Icon className="w-5 h-5" />
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Revenue Chart */}
        <div className="bg-white rounded-xl border border-gray-200 shadow-sm">
          <div className="px-6 py-4 border-b border-gray-200">
            <h2 className="font-semibold text-gray-900">Revenue — Last 6 Months</h2>
          </div>
          <div className="p-6">
            <RevenueChart data={data.monthlyRevenue} />
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Top Customers */}
          <div className="bg-white rounded-xl border border-gray-200 shadow-sm">
            <div className="px-6 py-4 border-b border-gray-200 flex items-center justify-between">
              <h2 className="font-semibold text-gray-900 flex items-center gap-2">
                <Users className="w-4 h-4 text-gray-500" /> Top Customers
              </h2>
            </div>
            <div className="divide-y divide-gray-100">
              {data.topCustomers.length === 0 ? (
                <p className="px-6 py-8 text-sm text-gray-400 text-center">No customer data yet</p>
              ) : (
                data.topCustomers.map((c, i) => (
                  <div key={c.id} className="flex items-center justify-between px-6 py-3">
                    <div className="flex items-center gap-3">
                      <span className="w-6 h-6 rounded-full bg-blue-100 text-blue-700 text-xs font-bold flex items-center justify-center">
                        {i + 1}
                      </span>
                      <div>
                        <Link href={`/customers/${c.id}`} className="text-sm font-medium text-gray-900 hover:underline">
                          {c.name}
                        </Link>
                        <p className="text-xs text-gray-500">{c.invoiceCount} invoices</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-semibold text-green-700">{formatCurrency(c.totalPaid)}</p>
                      {c.outstanding > 0 && (
                        <p className="text-xs text-red-500">{formatCurrency(c.outstanding)} due</p>
                      )}
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>

          {/* Overdue Invoices */}
          <div className="bg-white rounded-xl border border-gray-200 shadow-sm">
            <div className="px-6 py-4 border-b border-gray-200 flex items-center justify-between">
              <h2 className="font-semibold text-gray-900 flex items-center gap-2">
                <AlertCircle className="w-4 h-4 text-red-500" /> Overdue Invoices
              </h2>
              <Link href="/invoices?status=OVERDUE" className="text-xs text-blue-600 hover:underline">View all</Link>
            </div>
            <div className="divide-y divide-gray-100">
              {data.overdueInvoices.length === 0 ? (
                <p className="px-6 py-8 text-sm text-gray-400 text-center">No overdue invoices</p>
              ) : (
                data.overdueInvoices.slice(0, 6).map((inv) => (
                  <div key={inv.id} className="flex items-center justify-between px-6 py-3">
                    <div>
                      <Link href={`/invoices/${inv.id}`} className="text-sm font-mono font-medium text-blue-700 hover:underline">
                        {inv.invoiceNumber}
                      </Link>
                      <p className="text-xs text-gray-500">{inv.customer.displayName}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-semibold text-red-600">{formatCurrency(Number(inv.balanceDue))}</p>
                      <p className="text-xs text-gray-500">Due {formatDate(inv.dueDate)}</p>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>

        {/* Unpaid Invoices Table */}
        {data.unpaidInvoices.length > 0 && (
          <div className="bg-white rounded-xl border border-gray-200 shadow-sm">
            <div className="px-6 py-4 border-b border-gray-200">
              <h2 className="font-semibold text-gray-900">Unpaid Invoices</h2>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-gray-200 bg-gray-50">
                    <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase">Invoice #</th>
                    <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase">Customer</th>
                    <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase">Due Date</th>
                    <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase">Status</th>
                    <th className="px-4 py-3 text-right text-xs font-semibold text-gray-500 uppercase">Balance Due</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {data.unpaidInvoices.map((inv) => (
                    <tr key={inv.id} className="hover:bg-gray-50">
                      <td className="px-4 py-3">
                        <Link href={`/invoices/${inv.id}`} className="text-blue-600 hover:underline font-mono text-sm">
                          {inv.invoiceNumber}
                        </Link>
                      </td>
                      <td className="px-4 py-3 text-gray-700">{inv.customer.displayName}</td>
                      <td className="px-4 py-3 text-gray-600">{formatDate(inv.dueDate)}</td>
                      <td className="px-4 py-3"><InvoiceStatusBadge status={inv.status} /></td>
                      <td className="px-4 py-3 text-right font-semibold text-red-600">
                        {formatCurrency(Number(inv.balanceDue))}
                      </td>
                    </tr>
                  ))}
                </tbody>
                <tfoot>
                  <tr className="bg-gray-50 border-t border-gray-200">
                    <td colSpan={4} className="px-4 py-3 text-sm font-semibold text-gray-700">Total Unpaid</td>
                    <td className="px-4 py-3 text-right font-bold text-red-600">{formatCurrency(totalUnpaid)}</td>
                  </tr>
                </tfoot>
              </table>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
