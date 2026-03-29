import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { Topbar } from "@/components/layout/topbar";
import { InvoiceStatusBadge } from "@/components/ui/badge";
import { formatCurrency, formatDate } from "@/lib/utils";
import Link from "next/link";
import { Plus, FileText, Search } from "lucide-react";
import { Prisma } from "@prisma/client";

export const metadata = { title: "Invoices" };

const STATUSES = ["ALL", "DRAFT", "SENT", "VIEWED", "PARTIALLY_PAID", "PAID", "OVERDUE", "CANCELLED"];

export default async function InvoicesPage({
  searchParams,
}: {
  searchParams: Promise<{ status?: string; search?: string; page?: string }>;
}) {
  const session = await auth();
  if (!session?.user) return null;
  const resolvedSearchParams = await searchParams;

  const orgId = session.user.organizationId;
  const status = resolvedSearchParams.status ?? "ALL";
  const search = resolvedSearchParams.search ?? "";
  const page = Number(resolvedSearchParams.page ?? 1);
  const limit = 20;

  const where: Prisma.InvoiceWhereInput = {
    organizationId: orgId,
    ...(status !== "ALL" && { status: status as any }),
    ...(search && {
      OR: [
        { invoiceNumber: { contains: search, mode: "insensitive" } },
        { customer: { displayName: { contains: search, mode: "insensitive" } } },
      ],
    }),
  };

  const [invoices, total] = await Promise.all([
    prisma.invoice.findMany({
      where,
      include: { customer: { select: { displayName: true } } },
      orderBy: { createdAt: "desc" },
      skip: (page - 1) * limit,
      take: limit,
    }),
    prisma.invoice.count({ where }),
  ]);

  return (
    <div>
      <Topbar
        title="Invoices"
        actions={
          <Link
            href="/invoices/new"
            className="inline-flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors cursor-pointer"
          >
            <Plus className="w-4 h-4" /> New Invoice
          </Link>
        }
      />

      <div className="p-6">
        <div className="bg-white rounded-xl border border-gray-200 shadow-sm">
          {/* Filters */}
          <div className="p-4 border-b border-gray-100 space-y-3">
            <form method="GET" className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                name="search"
                defaultValue={search}
                placeholder="Search by invoice number or customer…"
                className="w-full pl-9 pr-4 py-2 rounded-lg border border-gray-300 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
              />
              <input type="hidden" name="status" value={status} />
            </form>
            <div className="flex gap-1 flex-wrap">
              {STATUSES.map((s) => (
                <Link
                  key={s}
                  href={`?status=${s}&search=${search}`}
                  className={`px-3 py-1 rounded-full text-xs font-medium transition-colors ${
                    status === s
                      ? "bg-blue-600 text-white"
                      : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                  }`}
                >
                  {s === "ALL" ? "All" : s.replace(/_/g, " ")}
                </Link>
              ))}
            </div>
          </div>

          {/* Table */}
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-gray-200 bg-gray-50">
                  <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Invoice #</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Customer</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Date</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Due Date</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Status</th>
                  <th className="px-4 py-3 text-right text-xs font-semibold text-gray-500 uppercase tracking-wider">Amount</th>
                  <th className="px-4 py-3 text-right text-xs font-semibold text-gray-500 uppercase tracking-wider">Balance Due</th>
                  <th className="px-4 py-3"></th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {invoices.length === 0 ? (
                  <tr>
                    <td colSpan={8} className="px-4 py-16 text-center">
                      <FileText className="w-10 h-10 text-gray-300 mx-auto mb-3" />
                      <p className="text-gray-500 font-medium">No invoices found</p>
                      <p className="text-gray-400 text-xs mt-1">Create your first invoice to get started</p>
                    </td>
                  </tr>
                ) : (
                  invoices.map((inv) => {
                    const isOverdue =
                      new Date(inv.dueDate) < new Date() &&
                      !["PAID", "CANCELLED", "VOID"].includes(inv.status);
                    return (
                      <tr key={inv.id} className="hover:bg-gray-50 transition-colors">
                        <td className="px-4 py-3 font-mono font-medium text-blue-700">
                          <Link href={`/invoices/${inv.id}`} className="hover:underline">
                            {inv.invoiceNumber}
                          </Link>
                        </td>
                        <td className="px-4 py-3 text-gray-700">{inv.customer.displayName}</td>
                        <td className="px-4 py-3 text-gray-600">{formatDate(inv.issueDate)}</td>
                        <td className={`px-4 py-3 ${isOverdue ? "text-red-600 font-medium" : "text-gray-600"}`}>
                          {formatDate(inv.dueDate)}
                          {isOverdue && <span className="ml-1 text-xs">⚠</span>}
                        </td>
                        <td className="px-4 py-3"><InvoiceStatusBadge status={inv.status} /></td>
                        <td className="px-4 py-3 text-right font-medium text-gray-900">
                          {formatCurrency(Number(inv.total))}
                        </td>
                        <td className={`px-4 py-3 text-right font-medium ${Number(inv.balanceDue) > 0 ? "text-red-600" : "text-green-600"}`}>
                          {formatCurrency(Number(inv.balanceDue))}
                        </td>
                        <td className="px-4 py-3 text-right">
                          <Link href={`/invoices/${inv.id}`} className="text-blue-600 hover:underline text-sm font-medium">
                            View
                          </Link>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          {total > limit && (
            <div className="px-4 py-3 border-t border-gray-200 flex items-center justify-between text-sm text-gray-500">
              <span>Showing {(page - 1) * limit + 1}–{Math.min(page * limit, total)} of {total}</span>
              <div className="flex gap-2">
                {page > 1 && (
                  <Link href={`?status=${status}&search=${search}&page=${page - 1}`} className="px-3 py-1 rounded-lg border border-gray-300 hover:bg-gray-50">← Prev</Link>
                )}
                {page * limit < total && (
                  <Link href={`?status=${status}&search=${search}&page=${page + 1}`} className="px-3 py-1 rounded-lg border border-gray-300 hover:bg-gray-50">Next →</Link>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
