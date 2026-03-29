import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";
import { Topbar } from "@/components/layout/topbar";
import { CustomerForm } from "@/components/forms/customer-form";
import { InvoiceStatusBadge } from "@/components/ui/badge";
import { formatCurrency, formatDate } from "@/lib/utils";
import Link from "next/link";
import { FileText, CreditCard } from "lucide-react";

export const metadata = { title: "Customer" };

export default async function CustomerDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const session = await auth();
  if (!session?.user) return null;
  const { id } = await params;

  const customer = await prisma.customer.findFirst({
    where: { id, organizationId: session.user.organizationId },
    include: {
      invoices: {
        orderBy: { createdAt: "desc" },
        take: 10,
      },
      payments: {
        orderBy: { paymentDate: "desc" },
        take: 5,
        include: { invoice: { select: { invoiceNumber: true } } },
      },
    },
  });

  if (!customer) notFound();

  return (
    <div>
      <Topbar title={customer.displayName} />
      <div className="p-6 grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Edit form */}
        <div className="lg:col-span-2">
          <CustomerForm customer={customer} />
        </div>

        {/* Sidebar stats */}
        <div className="space-y-4">
          {/* Balance card */}
          <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-5 space-y-4">
            <h3 className="font-semibold text-gray-900 text-sm">Account Summary</h3>
            <div className="grid grid-cols-2 gap-3">
              <div className="bg-gray-50 rounded-lg p-3">
                <p className="text-xs text-gray-500">Outstanding</p>
                <p className="font-bold text-red-600 mt-0.5">
                  {formatCurrency(Number(customer.outstandingBalance))}
                </p>
              </div>
              <div className="bg-gray-50 rounded-lg p-3">
                <p className="text-xs text-gray-500">Invoices</p>
                <p className="font-bold text-gray-900 mt-0.5">{customer.invoices.length}</p>
              </div>
            </div>
            {customer.gstin && (
              <div>
                <p className="text-xs text-gray-500">GSTIN</p>
                <p className="text-sm font-mono text-gray-700 mt-0.5">{customer.gstin}</p>
              </div>
            )}
          </div>

          {/* Recent invoices */}
          <div className="bg-white rounded-xl border border-gray-200 shadow-sm">
            <div className="px-5 py-4 border-b border-gray-100 flex items-center justify-between">
              <h3 className="font-semibold text-gray-900 text-sm flex items-center gap-1.5">
                <FileText className="w-4 h-4 text-gray-400" /> Recent Invoices
              </h3>
              <Link href={`/invoices?customerId=${customer.id}`} className="text-xs text-blue-600 hover:underline">
                All
              </Link>
            </div>
            <div className="divide-y divide-gray-100">
              {customer.invoices.length === 0 ? (
                <p className="px-5 py-6 text-sm text-gray-400 text-center">No invoices</p>
              ) : (
                customer.invoices.map((inv) => (
                  <Link
                    key={inv.id}
                    href={`/invoices/${inv.id}`}
                    className="flex items-center justify-between px-5 py-3 hover:bg-gray-50 transition-colors"
                  >
                    <div>
                      <p className="text-sm font-medium text-gray-800">{inv.invoiceNumber}</p>
                      <p className="text-xs text-gray-500">{formatDate(inv.issueDate)}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-semibold text-gray-900">{formatCurrency(Number(inv.total))}</p>
                      <InvoiceStatusBadge status={inv.status} />
                    </div>
                  </Link>
                ))
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
