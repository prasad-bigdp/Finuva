import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { Topbar } from "@/components/layout/topbar";
import { formatDate } from "@/lib/utils";
import { RecurringCreateModal } from "@/components/recurring/recurring-create-modal";
import { RefreshCw } from "lucide-react";

export const metadata = { title: "Recurring Invoices" };

const STATUS_COLORS: Record<string, string> = {
  ACTIVE: "bg-green-100 text-green-700",
  PAUSED: "bg-yellow-100 text-yellow-700",
  EXPIRED: "bg-gray-100 text-gray-500",
  CANCELLED: "bg-red-100 text-red-600",
};

const FREQ_LABELS: Record<string, string> = {
  DAILY: "Daily",
  WEEKLY: "Weekly",
  BIWEEKLY: "Every 2 Weeks",
  MONTHLY: "Monthly",
  QUARTERLY: "Quarterly",
  HALF_YEARLY: "Every 6 Months",
  YEARLY: "Yearly",
};

export default async function RecurringPage() {
  const session = await auth();
  if (!session?.user) return null;

  const [recurring, customers] = await Promise.all([
    prisma.recurringInvoice.findMany({
      where: { organizationId: session.user.organizationId },
      include: { customer: { select: { displayName: true } } },
      orderBy: { createdAt: "desc" },
    }),
    prisma.customer.findMany({
      where: { organizationId: session.user.organizationId, isActive: true },
      orderBy: { displayName: "asc" },
      select: { id: true, displayName: true },
    }),
  ]);

  return (
    <div>
      <Topbar
        title="Recurring Invoices"
        actions={<RecurringCreateModal customers={customers} />}
      />

      <div className="p-6">
        <div className="bg-white rounded-xl border border-gray-200 shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-gray-200 bg-gray-50">
                  <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Customer</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Frequency</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Start Date</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Next Run</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Status</th>
                  <th className="px-4 py-3 text-right text-xs font-semibold text-gray-500 uppercase tracking-wider">Created</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {recurring.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="px-4 py-16 text-center">
                      <RefreshCw className="w-10 h-10 text-gray-300 mx-auto mb-3" />
                      <p className="text-gray-500 font-medium">No recurring invoices</p>
                      <p className="text-gray-400 text-xs mt-1">Set up automatic billing schedules</p>
                    </td>
                  </tr>
                ) : (
                  recurring.map((r) => (
                    <tr key={r.id} className="hover:bg-gray-50 transition-colors">
                      <td className="px-4 py-3 font-medium text-gray-900">{r.customer.displayName}</td>
                      <td className="px-4 py-3 text-gray-600">{FREQ_LABELS[r.frequency]}</td>
                      <td className="px-4 py-3 text-gray-600">{formatDate(r.startDate)}</td>
                      <td className="px-4 py-3 text-gray-600">{formatDate(r.nextRunDate)}</td>
                      <td className="px-4 py-3">
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${STATUS_COLORS[r.status] ?? ""}`}>
                          {r.status}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-right text-gray-500 text-xs">{formatDate(r.createdAt)}</td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
