// GET /api/invoices   — list invoices (filterable by status)
// POST /api/invoices  — create invoice with line items
import { NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";
import { getRequiredSession } from "@/lib/auth";
import { invoiceSchema } from "@/lib/validations";
import { apiSuccess, apiError, calculateInvoiceTotals, generateInvoiceNumber } from "@/lib/utils";
import { Prisma } from "@prisma/client";
import { assertItemsInOrg } from "@/lib/authorization";

export async function GET(req: NextRequest) {
  try {
    const session = await getRequiredSession();
    const orgId = session.user.organizationId;
    const { searchParams } = new URL(req.url);

    const status = searchParams.get("status");
    const customerId = searchParams.get("customerId");
    const search = searchParams.get("search") ?? "";
    const page = Number(searchParams.get("page") ?? 1);
    const limit = Number(searchParams.get("limit") ?? 20);

    const where: Prisma.InvoiceWhereInput = {
      organizationId: orgId,
      ...(status && status !== "ALL" && { status: status as any }),
      ...(customerId && { customerId }),
      ...(search && {
        OR: [
          { invoiceNumber: { contains: search, mode: "insensitive" } },
          { customer: { displayName: { contains: search, mode: "insensitive" } } },
        ],
      }),
    };

    const [invoices, total] = await Promise.all([
      prisma.invoice.findMany({
        where,
        include: {
          customer: { select: { displayName: true, email: true } },
          _count: { select: { payments: true } },
        },
        orderBy: { createdAt: "desc" },
        skip: (page - 1) * limit,
        take: limit,
      }),
      prisma.invoice.count({ where }),
    ]);

    return apiSuccess({ invoices, total, page, limit });
  } catch (err: any) {
    if (err.message === "Unauthorized") return apiError("Unauthorized", 401);
    return apiError("Internal server error", 500);
  }
}

export async function POST(req: NextRequest) {
  try {
    const session = await getRequiredSession();
    const orgId = session.user.organizationId;

    const body = await req.json();
    const parsed = invoiceSchema.safeParse(body);
    if (!parsed.success) return apiError(parsed.error.errors[0].message, 422);

    const {
      customerId,
      issueDate,
      dueDate,
      items,
      discountType = "PERCENT",
      discountValue = 0,
      placeOfSupply,
      isInterState = false,
      notes,
      terms,
      status = "DRAFT",
    } = parsed.data;

    // Verify customer belongs to org
    const customer = await prisma.customer.findFirst({
      where: { id: customerId, organizationId: orgId },
    });
    if (!customer) return apiError("Customer not found", 404);
    await assertItemsInOrg(
      items.map((item) => item.itemId).filter(Boolean) as string[],
      orgId
    );

    // Calculate totals
    const totals = calculateInvoiceTotals(
      items.map((i) => ({
        quantity: i.quantity,
        rate: i.rate,
        discount: i.discount ?? 0,
        taxRate: i.taxRate ?? 0,
      })),
      discountType,
      discountValue,
      isInterState
    );

    const invoice = await prisma.$transaction(async (tx) => {
      const org = await tx.organization.update({
        where: { id: orgId },
        data: { invoiceCounter: { increment: 1 } },
      });
      const invoiceNumber = generateInvoiceNumber(org.invoicePrefix, org.invoiceCounter - 1);

      const created = await tx.invoice.create({
        data: {
          organizationId: orgId,
          customerId,
          invoiceNumber,
          status: status as any,
          issueDate: new Date(issueDate),
          dueDate: new Date(dueDate),
          subtotal: totals.subtotal,
          discountType: discountType as any,
          discountValue,
          discountAmount: totals.discountAmount,
          cgst: totals.cgst,
          sgst: totals.sgst,
          igst: totals.igst,
          totalTax: totals.totalTax,
          total: totals.total,
          amountPaid: 0,
          balanceDue: totals.total,
          currency: "INR",
          placeOfSupply,
          isInterState,
          notes,
          terms,
          items: {
            create: items.map((item, idx) => {
              const lineSubtotal = item.quantity * item.rate;
              const lineDiscount = (lineSubtotal * (item.discount ?? 0)) / 100;
              const lineAfterDiscount = lineSubtotal - lineDiscount;
              const lineTax = (lineAfterDiscount * (item.taxRate ?? 0)) / 100;
              return {
                itemId: item.itemId ?? null,
                name: item.name,
                description: item.description,
                quantity: item.quantity,
                unit: item.unit,
                rate: item.rate,
                discount: item.discount ?? 0,
                taxRate: item.taxRate ?? 0,
                taxAmount: lineTax,
                amount: lineAfterDiscount + lineTax,
                hsnSac: item.hsnSac,
                sortOrder: idx,
              };
            }),
          },
        },
        include: {
          customer: true,
          items: true,
        },
      });

      await tx.customer.update({
        where: { id: customerId },
        data: { outstandingBalance: { increment: totals.total } },
      });

      return created;
    });

    return apiSuccess(invoice, 201);
  } catch (err: any) {
    if (err.message === "Unauthorized") return apiError("Unauthorized", 401);
    if (err.message === "Item not found") return apiError("Item not found", 404);
    console.error("[INVOICE CREATE]", err);
    return apiError("Internal server error", 500);
  }
}
