// GET/PUT/DELETE /api/invoices/:id
import { NextRequest } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { getRequiredSession } from "@/lib/auth";
import { apiSuccess, apiError } from "@/lib/utils";

const invoiceUpdateSchema = z.object({
  status: z.enum(["DRAFT", "SENT", "CANCELLED"]).optional(),
  notes: z.string().optional(),
  terms: z.string().optional(),
  dueDate: z.string().optional(),
});

export async function GET(
  _: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getRequiredSession();
    const { id } = await params;
    const invoice = await prisma.invoice.findFirst({
      where: { id, organizationId: session.user.organizationId },
      include: {
        customer: true,
        items: { orderBy: { sortOrder: "asc" } },
        payments: { orderBy: { paymentDate: "desc" } },
      },
    });
    if (!invoice) return apiError("Invoice not found", 404);

    return apiSuccess(invoice);
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
    const invoice = await prisma.invoice.findFirst({
      where: { id, organizationId: session.user.organizationId },
    });
    if (!invoice) return apiError("Invoice not found", 404);
    if (invoice.status === "PAID") return apiError("Cannot edit a paid invoice", 400);

    const body = await req.json();
    const parsed = invoiceUpdateSchema.safeParse(body);
    if (!parsed.success) return apiError(parsed.error.errors[0].message, 422);

    const data: Record<string, unknown> = { ...parsed.data };
    if (data.dueDate) data.dueDate = new Date(String(data.dueDate));
    if (parsed.data.status === "SENT" && !invoice.sentAt) data.sentAt = new Date();

    const updated = await prisma.invoice.update({
      where: { id },
      data,
    });
    return apiSuccess(updated);
  } catch (err: any) {
    if (err.message === "Unauthorized") return apiError("Unauthorized", 401);
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
    const invoice = await prisma.invoice.findFirst({
      where: { id, organizationId: session.user.organizationId },
    });
    if (!invoice) return apiError("Invoice not found", 404);
    if (invoice.status === "PAID") return apiError("Cannot delete a paid invoice", 400);

    await prisma.$transaction(async (tx) => {
      await tx.invoice.update({
        where: { id },
        data: { status: "VOID" },
      });

      if (Number(invoice.balanceDue) > 0) {
        await tx.customer.update({
          where: { id: invoice.customerId },
          data: { outstandingBalance: { decrement: invoice.balanceDue } },
        });
      }
    });

    return apiSuccess({ voided: true });
  } catch (err: any) {
    if (err.message === "Unauthorized") return apiError("Unauthorized", 401);
    return apiError("Internal server error", 500);
  }
}
