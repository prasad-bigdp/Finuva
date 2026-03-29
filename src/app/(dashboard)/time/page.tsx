import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { Topbar } from "@/components/layout/topbar";
import { formatCurrency, formatDate } from "@/lib/utils";
import { TimeEntryModal } from "@/components/time/time-entry-modal";
import { Clock } from "lucide-react";

export const metadata = { title: "Time Tracking" };

export default async function TimeTrackingPage({
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

  const [entries, total, totalHours, customers] = await Promise.all([
    prisma.timeEntry.findMany({
      where: { organizationId: orgId },
      orderBy: { date: "desc" },
      skip: (page - 1) * limit,
      take: limit,
    }),
    prisma.timeEntry.count({ where: { organizationId: orgId } }),
    prisma.timeEntry.aggregate({
      where: { organizationId: orgId },
      _sum: { hours: true, amount: true },
    }),
    prisma.customer.findMany({
      where: { organizationId: orgId, isActive: true },
      select: { id: true, displayName: true },
      orderBy: { displayName: "asc" },
    }),
  ]);

  return (
    <div>
      <Topbar
        title="Time Tracking"
        actions={<TimeEntryModal customers={customers} />}
      />

      <div className="p-6 space-y-4">
        {/* Summary */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-5">
            <p className="text-sm text-gray-500">Total Hours Logged</p>
            <p className="text-2xl font-bold text-gray-900 mt-1">
              {Number(totalHours._sum.hours ?? 0).toFixed(2)} hrs
            </p>
          </div>
          <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-5">
            <p className="text-sm text-gray-500">Billable Value</p>
            <p className="text-2xl font-bold text-blue-700 mt-1">
              {formatCurrency(Number(totalHours._sum.amount ?? 0))}
            </p>
          </div>
          <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-5">
            <p className="text-sm text-gray-500">Entries</p>
            <p className="text-2xl font-bold text-gray-900 mt-1">{total}</p>
          </div>
        </div>

        <div className="bg-white rounded-xl border border-gray-200 shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-gray-200 bg-gray-50">
                  <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Date</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Description</th>
                  <th className="px-4 py-3 text-right text-xs font-semibold text-gray-500 uppercase tracking-wider">Hours</th>
                  <th className="px-4 py-3 text-right text-xs font-semibold text-gray-500 uppercase tracking-wider">Rate (₹/hr)</th>
                  <th className="px-4 py-3 text-right text-xs font-semibold text-gray-500 uppercase tracking-wider">Amount</th>
                  <th className="px-4 py-3 text-center text-xs font-semibold text-gray-500 uppercase tracking-wider">Billed</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {entries.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="px-4 py-16 text-center">
                      <Clock className="w-10 h-10 text-gray-300 mx-auto mb-3" />
                      <p className="text-gray-500 font-medium">No time entries yet</p>
                      <p className="text-gray-400 text-xs mt-1">Log hours worked to track billable time</p>
                    </td>
                  </tr>
                ) : (
                  entries.map((e) => (
                    <tr key={e.id} className="hover:bg-gray-50 transition-colors">
                      <td className="px-4 py-3 text-gray-600">{formatDate(e.date)}</td>
                      <td className="px-4 py-3 text-gray-900 font-medium">{e.description}</td>
                      <td className="px-4 py-3 text-right text-gray-700">{Number(e.hours).toFixed(2)}</td>
                      <td className="px-4 py-3 text-right text-gray-700">{formatCurrency(Number(e.rate))}</td>
                      <td className="px-4 py-3 text-right font-semibold text-gray-900">
                        {formatCurrency(Number(e.amount))}
                      </td>
                      <td className="px-4 py-3 text-center">
                        {e.isBilled ? (
                          <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-700">Billed</span>
                        ) : (
                          <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-600">Unbilled</span>
                        )}
                      </td>
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
