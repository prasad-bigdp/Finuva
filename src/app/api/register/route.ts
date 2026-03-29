// POST /api/register — create user + organization
import { NextRequest } from "next/server";
import bcrypt from "bcryptjs";
import { prisma } from "@/lib/prisma";
import { registerSchema } from "@/lib/validations";
import { apiSuccess, apiError } from "@/lib/utils";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const parsed = registerSchema.safeParse(body);
    if (!parsed.success) {
      return apiError(parsed.error.errors[0].message, 422);
    }

    const { name, email, password, organizationName } = parsed.data;

    const existing = await prisma.user.findUnique({ where: { email } });
    if (existing) return apiError("Email already in use", 409);

    const hash = await bcrypt.hash(password, 12);

    const org = await prisma.organization.create({
      data: {
        name: organizationName,
        users: {
          create: {
            name,
            email,
            password: hash,
            role: "ADMIN",
          },
        },
      },
      include: { users: true },
    });

    const user = org.users[0];

    return apiSuccess({ userId: user.id, organizationId: org.id }, 201);
  } catch (err: any) {
    console.error("[REGISTER]", err);
    return apiError("Internal server error", 500);
  }
}
