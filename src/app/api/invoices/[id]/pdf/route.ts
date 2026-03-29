import { NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";
import { getRequiredSession } from "@/lib/auth";
import { renderInvoicePdf } from "@/lib/pdf";
import { apiError } from "@/lib/utils";

export async function GET(
  _: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getRequiredSession();
    const { id } = await params;
    const invoice = await prisma.invoice.findFirst({
      where: { id, organizationId: session.user.organizationId },
      include: {
        organization: {
          select: {
            name: true,
            address: true,
            city: true,
            state: true,
            pincode: true,
            gstin: true,
            email: true,
            phone: true,
          },
        },
        customer: {
          select: {
            displayName: true,
            companyName: true,
            billingAddress: true,
            billingCity: true,
            billingState: true,
            billingPincode: true,
            gstin: true,
            email: true,
            phone: true,
          },
        },
        items: {
          orderBy: { sortOrder: "asc" },
          select: {
            id: true,
            name: true,
            description: true,
            quantity: true,
            unit: true,
            rate: true,
            discount: true,
            taxRate: true,
            amount: true,
            hsnSac: true,
          },
        },
      },
    });

    if (!invoice) return apiError("Invoice not found", 404);

    const pdfBuffer = await renderInvoicePdf(invoice as any);

    return new Response(pdfBuffer as BodyInit, {
      headers: {
        "Content-Type": "application/pdf",
        "Content-Disposition": `inline; filename="${invoice.invoiceNumber}.pdf"`,
      },
    });
  } catch (err: any) {
    if (err.message === "Unauthorized") return apiError("Unauthorized", 401);
    return apiError("Failed to generate PDF", 500);
  }
}
