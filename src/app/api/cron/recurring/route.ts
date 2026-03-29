// POST /api/cron/recurring — run by Vercel Cron or external cron service
// Vercel cron.json: { "crons": [{ "path": "/api/cron/recurring", "schedule": "0 6 * * *" }] }
import { NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";
import { apiSuccess, apiError, calculateInvoiceTotals, generateInvoiceNumber } from "@/lib/utils";
import { sendEmail, invoiceEmailTemplate } from "@/lib/email";
import { formatCurrency, formatDate } from "@/lib/utils";

// Protect with a secret token
function isAuthorized(req: NextRequest) {
  const token = req.headers.get("authorization")?.replace("Bearer ", "");
  return token === process.env.CRON_SECRET;
}

function getNextRunDate(frequency: string, from: Date): Date {
  const d = new Date(from);
  switch (frequency) {
    case "DAILY":      d.setDate(d.getDate() + 1); break;
    case "WEEKLY":     d.setDate(d.getDate() + 7); break;
    case "BIWEEKLY":   d.setDate(d.getDate() + 14); break;
    case "MONTHLY":    d.setMonth(d.getMonth() + 1); break;
    case "QUARTERLY":  d.setMonth(d.getMonth() + 3); break;
    case "HALF_YEARLY":d.setMonth(d.getMonth() + 6); break;
    case "YEARLY":     d.setFullYear(d.getFullYear() + 1); break;
  }
  return d;
}

export async function POST(req: NextRequest) {
  if (!isAuthorized(req)) return apiError("Unauthorized", 401);

  const now = new Date();
  let created = 0;
  let errors = 0;

  // Find all active recurring invoices due today or earlier
  const dues = await prisma.recurringInvoice.findMany({
    where: {
      status: "ACTIVE",
      nextRunDate: { lte: now },
    },
    include: {
      customer: true,
      organization: true,
    },
  });

  for (const recurring of dues) {
    try {
      const template = recurring.templateData as any;
      const isInterState = template.isInterState ?? false;
      const discountType = template.discountType ?? "PERCENT";
      const discountValue = template.discountValue ?? 0;

      const totals = calculateInvoiceTotals(
        template.items ?? [],
        discountType,
        discountValue,
        isInterState
      );

      // Get next invoice number
      const org = await prisma.organization.update({
        where: { id: recurring.organizationId },
        data: { invoiceCounter: { increment: 1 } },
      });
      const invoiceNumber = generateInvoiceNumber(org.invoicePrefix, org.invoiceCounter - 1);

      const dueDate = new Date(now);
      dueDate.setDate(dueDate.getDate() + (template.netTerms ?? 30));

      const invoice = await prisma.invoice.create({
        data: {
          organizationId: recurring.organizationId,
          customerId: recurring.customerId,
          invoiceNumber,
          status: "SENT",
          issueDate: now,
          dueDate,
          subtotal: totals.subtotal,
          discountType: discountType as any,
          discountValue,
          discountAmount: totals.discountAmount,
          cgst: totals.cgst,
          sgst: totals.sgst,
          igst: totals.igst,
          totalTax: totals.totalTax,
          total: totals.total,
          amountPaid: 0,
          balanceDue: totals.total,
          currency: "INR",
          notes: template.notes,
          terms: template.terms,
          isInterState,
          recurringId: recurring.id,
          sentAt: now,
          items: {
            create: (template.items ?? []).map((item: any, idx: number) => {
              const lineSubtotal = item.quantity * item.rate;
              const lineDiscount = (lineSubtotal * (item.discount ?? 0)) / 100;
              const lineAfterDiscount = lineSubtotal - lineDiscount;
              const lineTax = (lineAfterDiscount * (item.taxRate ?? 0)) / 100;
              return {
                name: item.name,
                description: item.description,
                quantity: item.quantity,
                unit: item.unit,
                rate: item.rate,
                discount: item.discount ?? 0,
                taxRate: item.taxRate ?? 0,
                taxAmount: lineTax,
                amount: lineAfterDiscount + lineTax,
                sortOrder: idx,
              };
            }),
          },
        },
      });

      // Update recurring schedule
      const nextRun = getNextRunDate(recurring.frequency, now);
      const isExpired = recurring.endDate && nextRun > recurring.endDate;

      await prisma.recurringInvoice.update({
        where: { id: recurring.id },
        data: {
          lastRunDate: now,
          nextRunDate: nextRun,
          invoicesCreated: { increment: 1 },
          status: isExpired ? "EXPIRED" : "ACTIVE",
        },
      });

      // Update customer balance
      await prisma.customer.update({
        where: { id: recurring.customerId },
        data: { outstandingBalance: { increment: totals.total } },
      });

      // Send email
      if (recurring.customer.email) {
        const viewUrl = `${process.env.NEXT_PUBLIC_APP_URL}/invoices/${invoice.id}`;
        await sendEmail({
          to: recurring.customer.email,
          subject: `Invoice ${invoiceNumber} from ${recurring.organization.name}`,
          html: invoiceEmailTemplate({
            customerName: recurring.customer.displayName,
            invoiceNumber,
            amount: formatCurrency(totals.total),
            dueDate: formatDate(dueDate),
            orgName: recurring.organization.name,
            viewUrl,
          }),
        }).catch(console.error);
      }

      created++;
    } catch (err) {
      console.error(`[CRON] Failed for recurring ${recurring.id}:`, err);
      errors++;
    }
  }

  return apiSuccess({ created, errors, processed: dues.length });
}
