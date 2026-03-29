import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { Topbar } from "@/components/layout/topbar";
import { formatCurrency, formatDate } from "@/lib/utils";
import Link from "next/link";
import { CreditCard } from "lucide-react";

export const metadata = { title: "Payments" };

const METHOD_LABELS: Record<string, string> = {
  CASH: "Cash",
  CHEQUE: "Cheque",
  BANK_TRANSFER: "Bank Transfer",
  UPI: "UPI",
  CARD: "Card",
  RAZORPAY: "Razorpay",
  STRIPE: "Stripe",
  OTHER: "Other",
};

export default async function PaymentsPage({
  searchParams,
}: {
  searchParams: Promise<{ page?: string }>;
}) {
  const session = await auth();
  if (!session?.user) return null;
  const resolvedSearchParams = await searchParams;

  const page = Number(resolvedSearchParams.page ?? 1);
  const limit = 20;
  const orgId = session.user.organizationId;

  const [payments, total, totalReceived] = await Promise.all([
    prisma.payment.findMany({
      where: { organizationId: orgId },
      include: {
        invoice: { select: { invoiceNumber: true } },
        customer: { select: { displayName: true } },
      },
      orderBy: { paymentDate: "desc" },
      skip: (page - 1) * limit,
      take: limit,
    }),
    prisma.payment.count({ where: { organizationId: orgId } }),
    prisma.payment.aggregate({
      where: { organizationId: orgId },
      _sum: { amount: true },
    }),
  ]);

  return (
    <div>
      <Topbar title="Payments Received" />

      <div className="p-6 space-y-4">
        {/* Summary */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-5">
            <p className="text-sm text-gray-500">Total Received</p>
            <p className="text-2xl font-bold text-green-700 mt-1">
              {formatCurrency(Number(totalReceived._sum.amount ?? 0))}
            </p>
          </div>
          <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-5">
            <p className="text-sm text-gray-500">Total Transactions</p>
            <p className="text-2xl font-bold text-gray-900 mt-1">{total}</p>
          </div>
        </div>

        {/* Table */}
        <div className="bg-white rounded-xl border border-gray-200 shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-gray-200 bg-gray-50">
                  <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Date</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Customer</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Invoice</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Method</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Reference</th>
                  <th className="px-4 py-3 text-right text-xs font-semibold text-gray-500 uppercase tracking-wider">Amount</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {payments.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="px-4 py-16 text-center">
                      <CreditCard className="w-10 h-10 text-gray-300 mx-auto mb-3" />
                      <p className="text-gray-500 font-medium">No payments recorded yet</p>
                    </td>
                  </tr>
                ) : (
                  payments.map((pmt) => (
                    <tr key={pmt.id} className="hover:bg-gray-50 transition-colors">
                      <td className="px-4 py-3 text-gray-600">{formatDate(pmt.paymentDate)}</td>
                      <td className="px-4 py-3 font-medium text-gray-900">{pmt.customer.displayName}</td>
                      <td className="px-4 py-3">
                        <Link
                          href={`/invoices/${pmt.invoiceId}`}
                          className="text-blue-600 hover:underline font-mono text-sm"
                        >
                          {pmt.invoice.invoiceNumber}
                        </Link>
                      </td>
                      <td className="px-4 py-3">
                        <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-700">
                          {METHOD_LABELS[pmt.method] ?? pmt.method}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-gray-600 text-xs font-mono">
                        {pmt.reference ?? <span className="text-gray-300">—</span>}
                      </td>
                      <td className="px-4 py-3 text-right font-semibold text-green-700">
                        {formatCurrency(Number(pmt.amount))}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          {total > limit && (
            <div className="px-4 py-3 border-t border-gray-200 flex items-center justify-between text-sm text-gray-500">
              <span>Showing {(page - 1) * limit + 1}–{Math.min(page * limit, total)} of {total}</span>
              <div className="flex gap-2">
                {page > 1 && <Link href={`?page=${page - 1}`} className="px-3 py-1 rounded-lg border border-gray-300 hover:bg-gray-50">← Prev</Link>}
                {page * limit < total && <Link href={`?page=${page + 1}`} className="px-3 py-1 rounded-lg border border-gray-300 hover:bg-gray-50">Next →</Link>}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
