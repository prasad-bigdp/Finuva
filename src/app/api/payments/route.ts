// GET /api/payments   — list payments
// POST /api/payments  — record a payment
import { NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";
import { getRequiredSession } from "@/lib/auth";
import { paymentSchema } from "@/lib/validations";
import { apiSuccess, apiError } from "@/lib/utils";
import { sendEmail, paymentThankyouTemplate } from "@/lib/email";
import { formatCurrency } from "@/lib/utils";

export async function GET(req: NextRequest) {
  try {
    const session = await getRequiredSession();
    const orgId = session.user.organizationId;
    const { searchParams } = new URL(req.url);
    const page = Number(searchParams.get("page") ?? 1);
    const limit = Number(searchParams.get("limit") ?? 20);

    const [payments, total] = await Promise.all([
      prisma.payment.findMany({
        where: { organizationId: orgId },
        include: {
          invoice: { select: { invoiceNumber: true } },
          customer: { select: { displayName: true } },
        },
        orderBy: { paymentDate: "desc" },
        skip: (page - 1) * limit,
        take: limit,
      }),
      prisma.payment.count({ where: { organizationId: orgId } }),
    ]);

    return apiSuccess({ payments, total, page, limit });
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
    const parsed = paymentSchema.safeParse(body);
    if (!parsed.success) return apiError(parsed.error.errors[0].message, 422);

    const { invoiceId, amount, paymentDate, method, reference, notes } = parsed.data;

    // Verify invoice belongs to org
    const invoice = await prisma.invoice.findFirst({
      where: { id: invoiceId, organizationId: orgId },
      include: { customer: true, organization: true },
    });
    if (!invoice) return apiError("Invoice not found", 404);

    const payAmt = Number(amount);
    const balanceDue = Number(invoice.balanceDue);

    if (payAmt > balanceDue) {
      return apiError(`Payment cannot exceed balance due (${balanceDue})`, 400);
    }

    const newPaid = Number(invoice.amountPaid) + payAmt;
    const newBalance = balanceDue - payAmt;
    const newStatus =
      newBalance <= 0
        ? "PAID"
        : newPaid > 0
        ? "PARTIALLY_PAID"
        : invoice.status;

    // Create payment + update invoice in a transaction
    const payment = await prisma.$transaction(async (tx) => {
      const pmt = await tx.payment.create({
        data: {
          organizationId: orgId,
          invoiceId,
          customerId: invoice.customerId,
          amount: payAmt,
          paymentDate: new Date(paymentDate),
          method: method as any,
          reference,
          notes,
        },
      });

      await tx.invoice.update({
        where: { id: invoiceId },
        data: {
          amountPaid: newPaid,
          balanceDue: newBalance,
          status: newStatus as any,
        },
      });

      // Update customer outstanding balance
      await tx.customer.update({
        where: { id: invoice.customerId },
        data: { outstandingBalance: { decrement: payAmt } },
      });

      return pmt;
    });

    // Send thank-you email if fully paid
    if (newStatus === "PAID" && invoice.customer.email) {
      await sendEmail({
        to: invoice.customer.email,
        subject: `Payment received — ${invoice.invoiceNumber}`,
        html: paymentThankyouTemplate({
          customerName: invoice.customer.displayName,
          invoiceNumber: invoice.invoiceNumber,
          amount: formatCurrency(payAmt),
          orgName: invoice.organization.name,
        }),
      }).catch(console.error); // non-blocking
    }

    return apiSuccess(payment, 201);
  } catch (err: any) {
    if (err.message === "Unauthorized") return apiError("Unauthorized", 401);
    console.error("[PAYMENT]", err);
    return apiError("Internal server error", 500);
  }
}
