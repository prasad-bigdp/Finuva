import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";
import { Topbar } from "@/components/layout/topbar";
import { InvoiceStatusBadge } from "@/components/ui/badge";
import { formatCurrency, formatDate } from "@/lib/utils";
import { InvoiceActions } from "@/components/invoice/invoice-actions";
import { PaymentModal } from "@/components/invoice/payment-modal";
import { CreditCard } from "lucide-react";

export const metadata = { title: "Invoice" };

export default async function InvoiceDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const session = await auth();
  if (!session?.user) return null;
  const { id } = await params;

  const invoice = await prisma.invoice.findFirst({
    where: { id, organizationId: session.user.organizationId },
    include: {
      customer: true,
      items: { orderBy: { sortOrder: "asc" } },
      payments: { orderBy: { paymentDate: "desc" } },
      organization: true,
    },
  });

  if (!invoice) notFound();

  const canPay = !["PAID", "VOID", "CANCELLED"].includes(invoice.status) && Number(invoice.balanceDue) > 0;

  return (
    <div>
      <Topbar title={invoice.invoiceNumber} actions={<InvoiceActions invoice={invoice} canPay={canPay} />} />

      <div className="grid grid-cols-1 gap-6 px-3 pb-6 pt-5 lg:grid-cols-3 lg:px-6">
        <div className="lg:col-span-2 space-y-4">
          <div className="glass-panel animate-rise rounded-[32px] p-8 print:shadow-none">
            <div className="mb-8 flex items-start justify-between">
              <div>
                <h2 className="font-display text-4xl text-[#14281f]">{invoice.organization.name}</h2>
                {invoice.organization.address && <p className="mt-2 text-sm text-[#62655f]">{invoice.organization.address}</p>}
                {invoice.organization.gstin && <p className="mt-1 text-xs font-mono text-[#7d725f]">GSTIN: {invoice.organization.gstin}</p>}
              </div>
              <div className="text-right">
                <p className="font-display text-5xl leading-none text-[#143829]">Invoice</p>
                <p className="mt-2 font-mono text-sm font-bold text-[#5b655d]">{invoice.invoiceNumber}</p>
                <div className="mt-3">
                  <InvoiceStatusBadge status={invoice.status} />
                </div>
              </div>
            </div>

            <div className="mb-8 grid gap-6 md:grid-cols-2">
              <div className="rounded-[24px] border border-[#eadfcd] bg-white/55 p-5">
                <p className="text-xs font-semibold uppercase tracking-[0.24em] text-[#857a64]">Bill To</p>
                <p className="mt-3 font-semibold text-[#13291f]">{invoice.customer.displayName}</p>
                {invoice.customer.companyName && <p className="text-sm text-[#62655f]">{invoice.customer.companyName}</p>}
                {invoice.customer.billingAddress && <p className="text-sm text-[#62655f]">{invoice.customer.billingAddress}</p>}
                {invoice.customer.billingCity && (
                  <p className="text-sm text-[#62655f]">
                    {invoice.customer.billingCity}, {invoice.customer.billingState} {invoice.customer.billingPincode}
                  </p>
                )}
                {invoice.customer.gstin && <p className="mt-2 text-xs font-mono text-[#7d725f]">GSTIN: {invoice.customer.gstin}</p>}
              </div>
              <div className="rounded-[24px] bg-[#143829] p-5 text-[#fff8eb]">
                <div className="space-y-3 text-sm">
                  <div className="flex justify-between">
                    <span className="text-[#d6d0c2]">Issue date</span>
                    <span>{formatDate(invoice.issueDate)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-[#d6d0c2]">Due date</span>
                    <span>{formatDate(invoice.dueDate)}</span>
                  </div>
                  {invoice.placeOfSupply && (
                    <div className="flex justify-between">
                      <span className="text-[#d6d0c2]">Place of supply</span>
                      <span>{invoice.placeOfSupply}</span>
                    </div>
                  )}
                </div>
              </div>
            </div>

            <div className="mb-6 overflow-x-auto rounded-[24px] border border-[#eadfcd]">
              <table className="w-full text-sm">
                <thead>
                  <tr className="bg-[#123524] text-[#fff8eb]">
                    <th className="px-4 py-3 text-left text-xs uppercase tracking-[0.2em]">Item</th>
                    <th className="px-4 py-3 text-left text-xs uppercase tracking-[0.2em]">HSN/SAC</th>
                    <th className="px-4 py-3 text-right text-xs uppercase tracking-[0.2em]">Qty</th>
                    <th className="px-4 py-3 text-right text-xs uppercase tracking-[0.2em]">Rate</th>
                    <th className="px-4 py-3 text-right text-xs uppercase tracking-[0.2em]">GST%</th>
                    <th className="px-4 py-3 text-right text-xs uppercase tracking-[0.2em]">Amount</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#eee5d9] bg-white/50">
                  {invoice.items.map((item) => (
                    <tr key={item.id}>
                      <td className="px-4 py-4">
                        <p className="font-medium text-[#13291f]">{item.name}</p>
                        {item.description && <p className="text-xs text-[#6d7068]">{item.description}</p>}
                      </td>
                      <td className="px-4 py-4 text-xs font-mono text-[#6d7068]">{item.hsnSac ?? "-"}</td>
                      <td className="px-4 py-4 text-right text-[#4d514a]">{Number(item.quantity)} {item.unit}</td>
                      <td className="px-4 py-4 text-right text-[#4d514a]">{formatCurrency(Number(item.rate))}</td>
                      <td className="px-4 py-4 text-right text-[#4d514a]">{Number(item.taxRate)}%</td>
                      <td className="px-4 py-4 text-right font-semibold text-[#13291f]">{formatCurrency(Number(item.amount))}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="mb-6 flex justify-end">
              <div className="w-72 rounded-[24px] border border-[#eadfcd] bg-white/55 p-5 text-sm">
                <div className="flex justify-between py-1 text-[#64675f]">
                  <span>Subtotal</span>
                  <span>{formatCurrency(Number(invoice.subtotal))}</span>
                </div>
                {Number(invoice.discountAmount) > 0 && (
                  <div className="flex justify-between py-1 text-green-700">
                    <span>Discount</span>
                    <span>- {formatCurrency(Number(invoice.discountAmount))}</span>
                  </div>
                )}
                {Number(invoice.cgst) > 0 && (
                  <div className="flex justify-between py-1 text-[#64675f]">
                    <span>CGST</span>
                    <span>{formatCurrency(Number(invoice.cgst))}</span>
                  </div>
                )}
                {Number(invoice.sgst) > 0 && (
                  <div className="flex justify-between py-1 text-[#64675f]">
                    <span>SGST</span>
                    <span>{formatCurrency(Number(invoice.sgst))}</span>
                  </div>
                )}
                {Number(invoice.igst) > 0 && (
                  <div className="flex justify-between py-1 text-[#64675f]">
                    <span>IGST</span>
                    <span>{formatCurrency(Number(invoice.igst))}</span>
                  </div>
                )}
                <div className="mt-2 flex justify-between border-t border-[#ddd1bc] pt-3 text-base font-semibold text-[#13291f]">
                  <span>Total</span>
                  <span>{formatCurrency(Number(invoice.total))}</span>
                </div>
                {Number(invoice.amountPaid) > 0 && (
                  <div className="flex justify-between py-2 text-green-700">
                    <span>Amount Paid</span>
                    <span>- {formatCurrency(Number(invoice.amountPaid))}</span>
                  </div>
                )}
                <div className="flex justify-between border-t border-[#ddd1bc] pt-3 font-semibold text-red-600">
                  <span>Balance Due</span>
                  <span>{formatCurrency(Number(invoice.balanceDue))}</span>
                </div>
              </div>
            </div>

            {(invoice.notes || invoice.terms) && (
              <div className="grid gap-4 border-t border-[#e9decb] pt-5 text-sm md:grid-cols-2">
                {invoice.notes && (
                  <div>
                    <p className="font-semibold text-[#34473c]">Notes</p>
                    <p className="mt-2 whitespace-pre-line text-[#62655f]">{invoice.notes}</p>
                  </div>
                )}
                {invoice.terms && (
                  <div>
                    <p className="font-semibold text-[#34473c]">Terms & Conditions</p>
                    <p className="mt-2 whitespace-pre-line text-[#62655f]">{invoice.terms}</p>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>

        <div className="space-y-4">
          <div className="glass-panel animate-rise rounded-[30px] p-5">
            <h3 className="font-semibold text-[#13291f]">Payment Summary</h3>
            <div className="mt-4 grid grid-cols-2 gap-3">
              <div className="rounded-[20px] bg-white/60 p-4">
                <p className="text-xs text-[#827963]">Invoice Total</p>
                <p className="mt-1 font-semibold text-[#13291f]">{formatCurrency(Number(invoice.total))}</p>
              </div>
              <div className="rounded-[20px] bg-green-50 p-4">
                <p className="text-xs text-[#827963]">Paid</p>
                <p className="mt-1 font-semibold text-green-700">{formatCurrency(Number(invoice.amountPaid))}</p>
              </div>
              <div className="col-span-2 rounded-[20px] bg-red-50 p-4">
                <p className="text-xs text-[#827963]">Balance Due</p>
                <p className="mt-1 text-lg font-semibold text-red-600">{formatCurrency(Number(invoice.balanceDue))}</p>
              </div>
            </div>
            {canPay && <div className="mt-4">{<PaymentModal invoiceId={invoice.id} balanceDue={Number(invoice.balanceDue)} />}</div>}
          </div>

          {invoice.payments.length > 0 && (
            <div className="glass-panel animate-rise rounded-[30px]">
              <div className="border-b border-[#eadfcd] px-5 py-4">
                <h3 className="flex items-center gap-1.5 text-sm font-semibold text-[#13291f]">
                  <CreditCard className="h-4 w-4 text-[#7d715b]" /> Payments
                </h3>
              </div>
              <div className="divide-y divide-[#eee5d9]">
                {invoice.payments.map((pmt) => (
                  <div key={pmt.id} className="flex items-center justify-between px-5 py-4">
                    <div>
                      <p className="text-sm font-medium text-[#13291f]">{formatDate(pmt.paymentDate)}</p>
                      <p className="text-xs text-[#6b6f67]">{pmt.method.replace(/_/g, " ")}</p>
                    </div>
                    <p className="text-sm font-semibold text-green-700">{formatCurrency(Number(pmt.amount))}</p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
