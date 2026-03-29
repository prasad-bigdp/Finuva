// GET/PUT/DELETE /api/customers/:id
import { NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";
import { getRequiredSession } from "@/lib/auth";
import { customerSchema } from "@/lib/validations";
import { apiSuccess, apiError } from "@/lib/utils";

async function getCustomerOrFail(id: string, orgId: string) {
  const customer = await prisma.customer.findFirst({
    where: { id, organizationId: orgId },
  });
  if (!customer) throw new Error("Not found");
  return customer;
}

export async function GET(
  _: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getRequiredSession();
    const { id } = await params;
    const customer = await prisma.customer.findFirst({
      where: { id, organizationId: session.user.organizationId },
      include: {
        invoices: {
          orderBy: { createdAt: "desc" },
          take: 10,
          select: { id: true, invoiceNumber: true, total: true, status: true, dueDate: true },
        },
      },
    });
    if (!customer) return apiError("Customer not found", 404);
    return apiSuccess(customer);
  } catch (err: any) {
    if (err.message === "Unauthorized") return apiError("Unauthorized", 401);
    return apiError("Internal server error", 500);
  }
}

export async function PUT(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getRequiredSession();
    const { id } = await params;
    await getCustomerOrFail(id, session.user.organizationId);

    const body = await req.json();
    const parsed = customerSchema.safeParse(body);
    if (!parsed.success) return apiError(parsed.error.errors[0].message, 422);

    const customer = await prisma.customer.update({
      where: { id },
      data: parsed.data,
    });
    return apiSuccess(customer);
  } catch (err: any) {
    if (err.message === "Unauthorized") return apiError("Unauthorized", 401);
    if (err.message === "Not found") return apiError("Customer not found", 404);
    return apiError("Internal server error", 500);
  }
}

export async function DELETE(
  _: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getRequiredSession();
    const { id } = await params;
    await getCustomerOrFail(id, session.user.organizationId);

    await prisma.customer.update({
      where: { id },
      data: { isActive: false },
    });
    return apiSuccess({ deleted: true });
  } catch (err: any) {
    if (err.message === "Unauthorized") return apiError("Unauthorized", 401);
    if (err.message === "Not found") return apiError("Customer not found", 404);
    return apiError("Internal server error", 500);
  }
}
