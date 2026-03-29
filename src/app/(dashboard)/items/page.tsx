import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { Topbar } from "@/components/layout/topbar";
import { formatCurrency } from "@/lib/utils";
import Link from "next/link";
import { Plus, Package, Search } from "lucide-react";

export const metadata = { title: "Items" };

export default async function ItemsPage({
  searchParams,
}: {
  searchParams: Promise<{ search?: string; type?: string }>;
}) {
  const session = await auth();
  if (!session?.user) return null;
  const resolvedSearchParams = await searchParams;

  const search = resolvedSearchParams.search ?? "";
  const type = resolvedSearchParams.type ?? "";
  const orgId = session.user.organizationId;

  const items = await prisma.item.findMany({
    where: {
      organizationId: orgId,
      isActive: true,
      ...(search && { name: { contains: search, mode: "insensitive" } }),
      ...(type && { type: type as "PRODUCT" | "SERVICE" }),
    },
    orderBy: { name: "asc" },
  });

  return (
    <div>
      <Topbar
        title="Items & Services"
        actions={
          <Link
            href="/items/new"
            className="inline-flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors cursor-pointer"
          >
            <Plus className="w-4 h-4" /> New Item
          </Link>
        }
      />

      <div className="p-6">
        <div className="bg-white rounded-xl border border-gray-200 shadow-sm">
          {/* Filters */}
          <div className="p-4 border-b border-gray-100 flex items-center gap-3 flex-wrap">
            <form method="GET" className="relative flex-1 min-w-48">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                name="search"
                defaultValue={search}
                placeholder="Search items…"
                className="w-full pl-9 pr-4 py-2 rounded-lg border border-gray-300 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
              />
            </form>
            <div className="flex gap-1">
              {(["", "PRODUCT", "SERVICE"] as const).map((t) => (
                <Link
                  key={t}
                  href={`?type=${t}&search=${search}`}
                  className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
                    type === t
                      ? "bg-blue-600 text-white"
                      : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                  }`}
                >
                  {t === "" ? "All" : t === "PRODUCT" ? "Products" : "Services"}
                </Link>
              ))}
            </div>
          </div>

          {/* Table */}
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-gray-200 bg-gray-50">
                  <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Name</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Type</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">SKU / Unit</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">HSN/SAC</th>
                  <th className="px-4 py-3 text-right text-xs font-semibold text-gray-500 uppercase tracking-wider">Rate</th>
                  <th className="px-4 py-3 text-right text-xs font-semibold text-gray-500 uppercase tracking-wider">Tax %</th>
                  <th className="px-4 py-3"></th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {items.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="px-4 py-16 text-center">
                      <Package className="w-10 h-10 text-gray-300 mx-auto mb-3" />
                      <p className="text-gray-500 font-medium">No items yet</p>
                      <p className="text-gray-400 text-xs mt-1">Add products and services to use in invoices</p>
                    </td>
                  </tr>
                ) : (
                  items.map((item) => (
                    <tr key={item.id} className="hover:bg-gray-50 transition-colors">
                      <td className="px-4 py-3">
                        <p className="font-medium text-gray-900">{item.name}</p>
                        {item.description && (
                          <p className="text-xs text-gray-500 truncate max-w-48">{item.description}</p>
                        )}
                      </td>
                      <td className="px-4 py-3">
                        <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${
                          item.type === "PRODUCT"
                            ? "bg-blue-100 text-blue-700"
                            : "bg-purple-100 text-purple-700"
                        }`}>
                          {item.type}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-gray-600">
                        {item.sku && <span className="font-mono text-xs">{item.sku}</span>}
                        {item.unit && <span className="text-xs text-gray-400"> / {item.unit}</span>}
                        {!item.sku && !item.unit && <span className="text-gray-300">—</span>}
                      </td>
                      <td className="px-4 py-3 text-gray-600 font-mono text-xs">
                        {item.hsnSac ?? <span className="text-gray-300">—</span>}
                      </td>
                      <td className="px-4 py-3 text-right font-semibold text-gray-900">
                        {formatCurrency(Number(item.rate))}
                      </td>
                      <td className="px-4 py-3 text-right text-gray-600">
                        {Number(item.taxRate)}%
                      </td>
                      <td className="px-4 py-3 text-right">
                        <Link
                          href={`/items/${item.id}`}
                          className="text-blue-600 hover:underline text-sm font-medium"
                        >
                          Edit
                        </Link>
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
