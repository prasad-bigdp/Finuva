// GET /api/settings   — get org settings
// PUT /api/settings   — update org settings
import { NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";
import { getRequiredSession } from "@/lib/auth";
import { orgSettingsSchema } from "@/lib/validations";
import { apiSuccess, apiError } from "@/lib/utils";

export async function GET() {
  try {
    const session = await getRequiredSession();
    const org = await prisma.organization.findUnique({
      where: { id: session.user.organizationId },
    });
    return apiSuccess(org);
  } catch (err: any) {
    if (err.message === "Unauthorized") return apiError("Unauthorized", 401);
    return apiError("Internal server error", 500);
  }
}

export async function PUT(req: NextRequest) {
  try {
    const session = await getRequiredSession();
    if (session.user.role !== "ADMIN") return apiError("Admin only", 403);

    const body = await req.json();
    const parsed = orgSettingsSchema.safeParse(body);
    if (!parsed.success) return apiError(parsed.error.errors[0].message, 422);

    const org = await prisma.organization.update({
      where: { id: session.user.organizationId },
      data: parsed.data,
    });
    return apiSuccess(org);
  } catch (err: any) {
    if (err.message === "Unauthorized") return apiError("Unauthorized", 401);
    return apiError("Internal server error", 500);
  }
}
