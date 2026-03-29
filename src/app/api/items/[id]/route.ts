import { NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";
import { getRequiredSession } from "@/lib/auth";
import { itemSchema } from "@/lib/validations";
import { apiSuccess, apiError } from "@/lib/utils";

export async function GET(
  _: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getRequiredSession();
    const { id } = await params;
    const item = await prisma.item.findFirst({
      where: { id, organizationId: session.user.organizationId },
    });
    if (!item) return apiError("Item not found", 404);
    return apiSuccess(item);
  } catch {
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
    const existing = await prisma.item.findFirst({
      where: { id, organizationId: session.user.organizationId },
    });
    if (!existing) return apiError("Item not found", 404);

    const body = await req.json();
    const parsed = itemSchema.safeParse(body);
    if (!parsed.success) return apiError(parsed.error.errors[0].message, 422);

    const item = await prisma.item.update({
      where: { id },
      data: parsed.data,
    });
    return apiSuccess(item);
  } catch {
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
    const existing = await prisma.item.findFirst({
      where: { id, organizationId: session.user.organizationId },
    });
    if (!existing) return apiError("Item not found", 404);

    await prisma.item.update({ where: { id }, data: { isActive: false } });
    return apiSuccess({ deleted: true });
  } catch {
    return apiError("Internal server error", 500);
  }
}
