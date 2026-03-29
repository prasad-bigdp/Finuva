// GET /api/expenses   — list expenses
// POST /api/expenses  — create expense
import { NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";
import { getRequiredSession } from "@/lib/auth";
import { expenseSchema } from "@/lib/validations";
import { apiSuccess, apiError } from "@/lib/utils";
import { assertOptionalCustomerInOrg } from "@/lib/authorization";

export async function GET(req: NextRequest) {
  try {
    const session = await getRequiredSession();
    const orgId = session.user.organizationId;
    const { searchParams } = new URL(req.url);
    const page = Number(searchParams.get("page") ?? 1);
    const limit = Number(searchParams.get("limit") ?? 20);
    const status = searchParams.get("status");

    const [expenses, total] = await Promise.all([
      prisma.expense.findMany({
        where: {
          organizationId: orgId,
          ...(status && { status: status as any }),
        },
        include: {
          customer: { select: { displayName: true } },
        },
        orderBy: { expenseDate: "desc" },
        skip: (page - 1) * limit,
        take: limit,
      }),
      prisma.expense.count({ where: { organizationId: orgId } }),
    ]);

    return apiSuccess({ expenses, total, page, limit });
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
    const parsed = expenseSchema.safeParse(body);
    if (!parsed.success) return apiError(parsed.error.errors[0].message, 422);

    const { amount, taxAmount = 0, ...rest } = parsed.data;
    await assertOptionalCustomerInOrg(rest.customerId, orgId);
    const totalAmount = Number(amount) + Number(taxAmount);

    const expense = await prisma.expense.create({
      data: {
        ...rest,
        amount,
        taxAmount,
        totalAmount,
        organizationId: orgId,
        expenseDate: rest.expenseDate ? new Date(rest.expenseDate) : new Date(),
        customerId: rest.customerId || null,
      },
    });

    return apiSuccess(expense, 201);
  } catch (err: any) {
    if (err.message === "Unauthorized") return apiError("Unauthorized", 401);
    if (err.message === "Customer not found") return apiError("Customer not found", 404);
    return apiError("Internal server error", 500);
  }
}
