import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { Topbar } from "@/components/layout/topbar";
import { formatCurrency, formatDate } from "@/lib/utils";
import { ExpenseCreateModal } from "@/components/expenses/expense-create-modal";
import { Receipt } from "lucide-react";

export const metadata = { title: "Expenses" };

const STATUS_COLORS: Record<string, string> = {
  UNBILLED: "bg-gray-100 text-gray-600",
  BILLED: "bg-blue-100 text-blue-700",
  REIMBURSED: "bg-green-100 text-green-700",
};

export default async function ExpensesPage({
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

  const [expenses, total, totalAmount, customers] = await Promise.all([
    prisma.expense.findMany({
      where: { organizationId: orgId },
      include: { customer: { select: { displayName: true } } },
      orderBy: { expenseDate: "desc" },
      skip: (page - 1) * limit,
      take: limit,
    }),
    prisma.expense.count({ where: { organizationId: orgId } }),
    prisma.expense.aggregate({ where: { organizationId: orgId }, _sum: { totalAmount: true } }),
    prisma.customer.findMany({
      where: { organizationId: orgId, isActive: true },
      select: { id: true, displayName: true },
      orderBy: { displayName: "asc" },
    }),
  ]);

  return (
    <div>
      <Topbar
        title="Expenses"
        actions={<ExpenseCreateModal customers={customers} />}
      />

      <div className="p-6 space-y-4">
        {/* Summary */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-5">
            <p className="text-sm text-gray-500">Total Expenses</p>
            <p className="text-2xl font-bold text-red-600 mt-1">
              {formatCurrency(Number(totalAmount._sum.totalAmount ?? 0))}
            </p>
          </div>
          <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-5">
            <p className="text-sm text-gray-500">Total Records</p>
            <p className="text-2xl font-bold text-gray-900 mt-1">{total}</p>
          </div>
        </div>

        <div className="bg-white rounded-xl border border-gray-200 shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-gray-200 bg-gray-50">
                  <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Date</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Category</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Vendor</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Customer</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Status</th>
                  <th className="px-4 py-3 text-right text-xs font-semibold text-gray-500 uppercase tracking-wider">Amount</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {expenses.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="px-4 py-16 text-center">
                      <Receipt className="w-10 h-10 text-gray-300 mx-auto mb-3" />
                      <p className="text-gray-500 font-medium">No expenses recorded</p>
                    </td>
                  </tr>
                ) : (
                  expenses.map((exp) => (
                    <tr key={exp.id} className="hover:bg-gray-50 transition-colors">
                      <td className="px-4 py-3 text-gray-600">{formatDate(exp.expenseDate)}</td>
                      <td className="px-4 py-3 font-medium text-gray-900">{exp.category}</td>
                      <td className="px-4 py-3 text-gray-600">
                        {exp.vendor ?? <span className="text-gray-300">—</span>}
                      </td>
                      <td className="px-4 py-3 text-gray-600">
                        {exp.customer?.displayName ?? <span className="text-gray-300">—</span>}
                      </td>
                      <td className="px-4 py-3">
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${STATUS_COLORS[exp.status]}`}>
                          {exp.status}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-right font-semibold text-red-600">
                        {formatCurrency(Number(exp.totalAmount))}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

          {total > limit && (
            <div className="px-4 py-3 border-t border-gray-200 flex justify-between text-sm text-gray-500">
              <span>Showing {(page - 1) * limit + 1}–{Math.min(page * limit, total)} of {total}</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
