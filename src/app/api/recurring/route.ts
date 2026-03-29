// GET /api/recurring   — list recurring invoices
// POST /api/recurring  — create recurring schedule
import { NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";
import { getRequiredSession } from "@/lib/auth";
import { recurringSchema } from "@/lib/validations";
import { apiSuccess, apiError } from "@/lib/utils";
import { addDays, addWeeks, addMonths, addQuarters, addYears } from "date-fns";
import { assertCustomerInOrg } from "@/lib/authorization";

function getNextRunDate(frequency: string, from: Date): Date {
  switch (frequency) {
    case "DAILY":      return addDays(from, 1);
    case "WEEKLY":     return addWeeks(from, 1);
    case "BIWEEKLY":   return addWeeks(from, 2);
    case "MONTHLY":    return addMonths(from, 1);
    case "QUARTERLY":  return addQuarters(from, 1);
    case "HALF_YEARLY":return addMonths(from, 6);
    case "YEARLY":     return addYears(from, 1);
    default:           return addMonths(from, 1);
  }
}

export async function GET(_: NextRequest) {
  try {
    const session = await getRequiredSession();
    const recurring = await prisma.recurringInvoice.findMany({
      where: { organizationId: session.user.organizationId },
      include: { customer: { select: { displayName: true } } },
      orderBy: { createdAt: "desc" },
    });
    return apiSuccess(recurring);
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
    const parsed = recurringSchema.safeParse(body);
    if (!parsed.success) return apiError(parsed.error.errors[0].message, 422);

    const { customerId, frequency, startDate, endDate, templateData } = parsed.data;
    const start = new Date(startDate);
    await assertCustomerInOrg(customerId, orgId);

    const recurring = await prisma.recurringInvoice.create({
      data: {
        organizationId: orgId,
        customerId,
        frequency: frequency as any,
        startDate: start,
        endDate: endDate ? new Date(endDate) : null,
        nextRunDate: start,
        templateData,
        status: "ACTIVE",
      },
    });

    return apiSuccess(recurring, 201);
  } catch (err: any) {
    if (err.message === "Unauthorized") return apiError("Unauthorized", 401);
    if (err.message === "Customer not found") return apiError("Customer not found", 404);
    return apiError("Internal server error", 500);
  }
}
