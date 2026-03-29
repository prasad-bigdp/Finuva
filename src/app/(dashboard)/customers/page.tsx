import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { Topbar } from "@/components/layout/topbar";
import { InvoiceStatusBadge } from "@/components/ui/badge";
import { formatCurrency } from "@/lib/utils";
import Link from "next/link";
import { Plus, Users, Mail, Phone, Building2, Search } from "lucide-react";

export const metadata = { title: "Customers" };

export default async function CustomersPage({
  searchParams,
}: {
  searchParams: Promise<{ search?: string; page?: string }>;
}) {
  const session = await auth();
  if (!session?.user) return null;
  const resolvedSearchParams = await searchParams;

  const search = resolvedSearchParams.search ?? "";
  const page = Number(resolvedSearchParams.page ?? 1);
  const limit = 20;
  const orgId = session.user.organizationId;

  const where = {
    organizationId: orgId,
    isActive: true,
    ...(search && {
      OR: [
        { displayName: { contains: search, mode: "insensitive" as const } },
        { email: { contains: search, mode: "insensitive" as const } },
        { companyName: { contains: search, mode: "insensitive" as const } },
      ],
    }),
  };

  const [customers, total] = await Promise.all([
    prisma.customer.findMany({
      where,
      orderBy: { displayName: "asc" },
      skip: (page - 1) * limit,
      take: limit,
      include: { _count: { select: { invoices: true } } },
    }),
    prisma.customer.count({ where }),
  ]);

  return (
    <div>
      <Topbar
        title="Customers"
        actions={
          <Link
            href="/customers/new"
            className="inline-flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors cursor-pointer"
          >
            <Plus className="w-4 h-4" /> New Customer
          </Link>
        }
      />

      <div className="p-6 space-y-4">
        {/* Search */}
        <div className="bg-white rounded-xl border border-gray-200 shadow-sm">
          <div className="p-4 border-b border-gray-100">
            <form method="GET" className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                name="search"
                defaultValue={search}
                placeholder="Search by name, company, email…"
                className="w-full pl-9 pr-4 py-2 rounded-lg border border-gray-300 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
              />
            </form>
          </div>

          {/* Table */}
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-gray-200 bg-gray-50">
                  <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Name</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Company</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Contact</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Invoices</th>
                  <th className="px-4 py-3 text-right text-xs font-semibold text-gray-500 uppercase tracking-wider">Outstanding</th>
                  <th className="px-4 py-3"></th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {customers.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="px-4 py-16 text-center">
                      <Users className="w-10 h-10 text-gray-300 mx-auto mb-3" />
                      <p className="text-gray-500 font-medium">No customers yet</p>
                      <p className="text-gray-400 text-xs mt-1">Add your first customer to get started</p>
                    </td>
                  </tr>
                ) : (
                  customers.map((c) => (
                    <tr key={c.id} className="hover:bg-gray-50 transition-colors">
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-full bg-blue-100 text-blue-700 flex items-center justify-center font-semibold text-sm flex-shrink-0">
                            {c.displayName[0].toUpperCase()}
                          </div>
                          <span className="font-medium text-gray-900">{c.displayName}</span>
                        </div>
                      </td>
                      <td className="px-4 py-3 text-gray-600">
                        {c.companyName ? (
                          <span className="flex items-center gap-1">
                            <Building2 className="w-3 h-3 text-gray-400" /> {c.companyName}
                          </span>
                        ) : (
                          <span className="text-gray-300">—</span>
                        )}
                      </td>
                      <td className="px-4 py-3 text-gray-600">
                        <div className="space-y-0.5">
                          {c.email && (
                            <div className="flex items-center gap-1 text-xs">
                              <Mail className="w-3 h-3 text-gray-400" /> {c.email}
                            </div>
                          )}
                          {c.phone && (
                            <div className="flex items-center gap-1 text-xs">
                              <Phone className="w-3 h-3 text-gray-400" /> {c.phone}
                            </div>
                          )}
                        </div>
                      </td>
                      <td className="px-4 py-3 text-gray-600">{c._count.invoices}</td>
                      <td className="px-4 py-3 text-right font-medium text-gray-900">
                        {formatCurrency(Number(c.outstandingBalance))}
                      </td>
                      <td className="px-4 py-3 text-right">
                        <Link
                          href={`/customers/${c.id}`}
                          className="text-blue-600 hover:underline text-sm font-medium"
                        >
                          View
                        </Link>
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
              <span>
                Showing {(page - 1) * limit + 1}–{Math.min(page * limit, total)} of {total}
              </span>
              <div className="flex gap-2">
                {page > 1 && (
                  <Link
                    href={`?search=${search}&page=${page - 1}`}
                    className="px-3 py-1 rounded-lg border border-gray-300 hover:bg-gray-50"
                  >
                    ← Prev
                  </Link>
                )}
                {page * limit < total && (
                  <Link
                    href={`?search=${search}&page=${page + 1}`}
                    className="px-3 py-1 rounded-lg border border-gray-300 hover:bg-gray-50"
                  >
                    Next →
                  </Link>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
