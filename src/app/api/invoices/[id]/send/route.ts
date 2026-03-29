// POST /api/invoices/:id/send — email invoice to customer
import { NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";
import { getRequiredSession } from "@/lib/auth";
import { sendEmail, invoiceEmailTemplate } from "@/lib/email";
import { apiSuccess, apiError, formatCurrency, formatDate } from "@/lib/utils";
import { renderInvoicePdf } from "@/lib/pdf";

export async function POST(
  _: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getRequiredSession();
    const { id } = await params;
    const invoice = await prisma.invoice.findFirst({
      where: { id, organizationId: session.user.organizationId },
      include: {
        customer: true,
        organization: true,
        items: {
          orderBy: { sortOrder: "asc" },
        },
      },
    });
    if (!invoice) return apiError("Invoice not found", 404);
    if (!invoice.customer.email) return apiError("Customer has no email address", 400);

    const viewUrl = `${process.env.NEXT_PUBLIC_APP_URL}/invoices/${invoice.id}`;
    const pdfUrl = `${process.env.NEXT_PUBLIC_APP_URL}/api/invoices/${invoice.id}/pdf`;
    const pdfBuffer = await renderInvoicePdf(invoice as any);

    await sendEmail({
      to: invoice.customer.email,
      subject: `Invoice ${invoice.invoiceNumber} from ${invoice.organization.name}`,
      html: invoiceEmailTemplate({
        customerName: invoice.customer.displayName,
        invoiceNumber: invoice.invoiceNumber,
        amount: formatCurrency(Number(invoice.balanceDue)),
        dueDate: formatDate(invoice.dueDate),
        orgName: invoice.organization.name,
        viewUrl,
      }),
      attachments: [
        {
          filename: `${invoice.invoiceNumber}.pdf`,
          content: pdfBuffer,
          contentType: "application/pdf",
        },
      ],
    });

    await prisma.invoice.update({
      where: { id },
      data: { status: "SENT", sentAt: new Date(), pdfUrl },
    });

    return apiSuccess({ sent: true });
  } catch (err: any) {
    if (err.message === "Unauthorized") return apiError("Unauthorized", 401);
    console.error("[INVOICE SEND]", err);
    return apiError("Failed to send email", 500);
  }
}
