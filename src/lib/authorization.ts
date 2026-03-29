import { prisma } from "@/lib/prisma";
import { getRequiredSession } from "@/lib/auth";

export async function requireSessionWithOrg() {
  return getRequiredSession();
}

export async function requireAdminSession() {
  const session = await getRequiredSession();
  if (session.user.role !== "ADMIN") {
    throw new Error("Forbidden");
  }
  return session;
}

export async function assertCustomerInOrg(customerId: string, organizationId: string) {
  const customer = await prisma.customer.findFirst({
    where: { id: customerId, organizationId, isActive: true },
    select: { id: true },
  });

  if (!customer) {
    throw new Error("Customer not found");
  }
}

export async function assertOptionalCustomerInOrg(
  customerId: string | null | undefined,
  organizationId: string
) {
  if (!customerId) return;
  await assertCustomerInOrg(customerId, organizationId);
}

export async function assertItemsInOrg(
  itemIds: string[],
  organizationId: string
) {
  const ids = [...new Set(itemIds.filter(Boolean))];
  if (!ids.length) return;

  const count = await prisma.item.count({
    where: {
      id: { in: ids },
      organizationId,
      isActive: true,
    },
  });

  if (count !== ids.length) {
    throw new Error("Item not found");
  }
}
