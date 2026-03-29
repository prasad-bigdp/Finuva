import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { Topbar } from "@/components/layout/topbar";
import { InvoiceCreateForm } from "@/components/forms/invoice-create-form";

export const metadata = { title: "New Invoice" };

export default async function NewInvoicePage() {
  const session = await auth();
  if (!session?.user) return null;

  const [customers, items] = await Promise.all([
    prisma.customer.findMany({
      where: { organizationId: session.user.organizationId, isActive: true },
      orderBy: { displayName: "asc" },
      select: { id: true, displayName: true, email: true, gstin: true, billingState: true },
    }),
    prisma.item.findMany({
      where: { organizationId: session.user.organizationId, isActive: true },
      orderBy: { name: "asc" },
      select: { id: true, name: true, rate: true, taxRate: true, unit: true, description: true, hsnSac: true },
    }),
  ]);

  return (
    <div>
      <Topbar title="New Invoice" />
      <div className="p-6">
        <InvoiceCreateForm customers={customers} items={items} />
      </div>
    </div>
  );
}
