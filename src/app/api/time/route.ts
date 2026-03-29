// GET /api/time   — list time entries
// POST /api/time  — create time entry
import { NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";
import { getRequiredSession } from "@/lib/auth";
import { apiSuccess, apiError } from "@/lib/utils";
import { z } from "zod";
import { assertOptionalCustomerInOrg } from "@/lib/authorization";

const timeEntrySchema = z.object({
  description: z.string().min(1, "Description is required"),
  hours: z.coerce.number().min(0.01),
  rate: z.coerce.number().min(0),
  amount: z.coerce.number().min(0),
  date: z.string().min(1),
  customerId: z.string().optional(),
});

export async function GET(req: NextRequest) {
  try {
    const session = await getRequiredSession();
    const orgId = session.user.organizationId;
    const { searchParams } = new URL(req.url);
    const page = Number(searchParams.get("page") ?? 1);
    const limit = Number(searchParams.get("limit") ?? 20);

    const [entries, total] = await Promise.all([
      prisma.timeEntry.findMany({
        where: { organizationId: orgId },
        orderBy: { date: "desc" },
        skip: (page - 1) * limit,
        take: limit,
      }),
      prisma.timeEntry.count({ where: { organizationId: orgId } }),
    ]);

    return apiSuccess({ entries, total, page, limit });
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
    const parsed = timeEntrySchema.safeParse(body);
    if (!parsed.success) return apiError(parsed.error.errors[0].message, 422);

    const { description, hours, rate, amount, date, customerId } = parsed.data;
    await assertOptionalCustomerInOrg(customerId, orgId);

    const entry = await prisma.timeEntry.create({
      data: {
        organizationId: orgId,
        description,
        hours,
        rate,
        amount,
        date: new Date(date),
        customerId: customerId || null,
      },
    });

    return apiSuccess(entry, 201);
  } catch (err: any) {
    if (err.message === "Unauthorized") return apiError("Unauthorized", 401);
    if (err.message === "Customer not found") return apiError("Customer not found", 404);
    console.error("[TIME ENTRY]", err);
    return apiError("Internal server error", 500);
  }
}
