// GET /api/customers   — list all customers for org
// POST /api/customers  — create customer
import { NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";
import { getRequiredSession } from "@/lib/auth";
import { customerSchema } from "@/lib/validations";
import { apiSuccess, apiError } from "@/lib/utils";

export async function GET(req: NextRequest) {
  try {
    const session = await getRequiredSession();
    const orgId = session.user.organizationId;

    const { searchParams } = new URL(req.url);
    const search = searchParams.get("search") ?? "";
    const page = Number(searchParams.get("page") ?? 1);
    const limit = Number(searchParams.get("limit") ?? 20);

    const where = {
      organizationId: orgId,
      isActive: true,
      ...(search && {
        OR: [
          { displayName: { contains: search, mode: "insensitive" as const } },
          { email: { contains: search, mode: "insensitive" as const } },
          { companyName: { contains: search, mode: "insensitive" as const } },
        ],
      }),
    };

    const [customers, total] = await Promise.all([
      prisma.customer.findMany({
        where,
        orderBy: { displayName: "asc" },
        skip: (page - 1) * limit,
        take: limit,
      }),
      prisma.customer.count({ where }),
    ]);

    return apiSuccess({ customers, total, page, limit });
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
    const parsed = customerSchema.safeParse(body);
    if (!parsed.success) return apiError(parsed.error.errors[0].message, 422);

    const customer = await prisma.customer.create({
      data: { ...parsed.data, organizationId: orgId },
    });

    return apiSuccess(customer, 201);
  } catch (err: any) {
    if (err.message === "Unauthorized") return apiError("Unauthorized", 401);
    return apiError("Internal server error", 500);
  }
}
