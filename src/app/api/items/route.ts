// GET /api/items   — list items
// POST /api/items  — create item
import { NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";
import { getRequiredSession } from "@/lib/auth";
import { itemSchema } from "@/lib/validations";
import { apiSuccess, apiError } from "@/lib/utils";

export async function GET(req: NextRequest) {
  try {
    const session = await getRequiredSession();
    const orgId = session.user.organizationId;

    const { searchParams } = new URL(req.url);
    const search = searchParams.get("search") ?? "";
    const type = searchParams.get("type");

    const items = await prisma.item.findMany({
      where: {
        organizationId: orgId,
        isActive: true,
        ...(search && { name: { contains: search, mode: "insensitive" } }),
        ...(type && { type: type as "PRODUCT" | "SERVICE" }),
      },
      orderBy: { name: "asc" },
    });

    return apiSuccess(items);
  } catch (err: any) {
    if (err.message === "Unauthorized") return apiError("Unauthorized", 401);
    return apiError("Internal server error", 500);
  }
}

export async function POST(req: NextRequest) {
  try {
    const session = await getRequiredSession();
    const body = await req.json();
    const parsed = itemSchema.safeParse(body);
    if (!parsed.success) return apiError(parsed.error.errors[0].message, 422);

    const item = await prisma.item.create({
      data: { ...parsed.data, organizationId: session.user.organizationId },
    });
    return apiSuccess(item, 201);
  } catch (err: any) {
    if (err.message === "Unauthorized") return apiError("Unauthorized", 401);
    return apiError("Internal server error", 500);
  }
}
