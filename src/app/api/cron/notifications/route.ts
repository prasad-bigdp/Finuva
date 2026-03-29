import { differenceInCalendarDays } from "date-fns";
import { NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";
import { sendEmail, paymentReminderTemplate } from "@/lib/email";
import { apiError, apiSuccess, formatCurrency, formatDate } from "@/lib/utils";

function isAuthorized(req: NextRequest) {
  const token = req.headers.get("authorization")?.replace("Bearer ", "");
  return token === process.env.CRON_SECRET;
}

export async function POST(req: NextRequest) {
  if (!isAuthorized(req)) return apiError("Unauthorized", 401);

  const now = new Date();

  const overdue = await prisma.invoice.updateMany({
    where: {
      status: { in: ["SENT", "VIEWED", "PARTIALLY_PAID"] },
      dueDate: { lt: now },
    },
    data: { status: "OVERDUE" },
  });

  const unpaidInvoices = await prisma.invoice.findMany({
    where: {
      status: { in: ["SENT", "VIEWED", "PARTIALLY_PAID", "OVERDUE"] },
      balanceDue: { gt: 0 },
      dueDate: { lte: now },
    },
    include: {
      customer: { select: { displayName: true, email: true } },
      organization: { select: { name: true } },
    },
  });

  let reminderCount = 0;

  for (const invoice of unpaidInvoices) {
    if (!invoice.customer.email) continue;

    const reminder = paymentReminderTemplate({
      customerName: invoice.customer.displayName,
      invoiceNumber: invoice.invoiceNumber,
      amount: formatCurrency(Number(invoice.balanceDue)),
      dueDate: formatDate(invoice.dueDate),
      orgName: invoice.organization.name,
      viewUrl: `${process.env.NEXT_PUBLIC_APP_URL}/invoices/${invoice.id}`,
      daysOverdue: Math.max(differenceInCalendarDays(now, invoice.dueDate), 0),
    });

    await sendEmail({
      to: invoice.customer.email,
      subject: reminder.subject,
      html: reminder.html,
    }).catch(console.error);

    reminderCount += 1;
  }

  return apiSuccess({ updatedOverdue: overdue.count, reminderCount });
}
