// GET /api/reports — revenue, unpaid, customer revenue summary
import { NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";
import { getRequiredSession } from "@/lib/auth";
import { apiSuccess, apiError } from "@/lib/utils";
import { startOfMonth, endOfMonth, subMonths } from "date-fns";

export const dynamic = "force-dynamic";

export async function GET(req: NextRequest) {
  try {
    const session = await getRequiredSession();
    const orgId = session.user.organizationId;
    const { searchParams } = new URL(req.url);
    const type = searchParams.get("type") ?? "summary";

    if (type === "summary") {
      const now = new Date();
      const thisMonthStart = startOfMonth(now);
      const thisMonthEnd = endOfMonth(now);
      const lastMonthStart = startOfMonth(subMonths(now, 1));
      const lastMonthEnd = endOfMonth(subMonths(now, 1));

      const [
        totalRevenue,
        thisMonthRevenue,
        lastMonthRevenue,
        unpaidCount,
        unpaidAmount,
        overdueCount,
        overdueAmount,
        totalCustomers,
        totalInvoices,
        recentInvoices,
        monthlyRevenue,
      ] = await Promise.all([
        // Total revenue (all paid)
        prisma.payment.aggregate({
          where: { organizationId: orgId },
          _sum: { amount: true },
        }),
        // This month revenue
        prisma.payment.aggregate({
          where: {
            organizationId: orgId,
            paymentDate: { gte: thisMonthStart, lte: thisMonthEnd },
          },
          _sum: { amount: true },
        }),
        // Last month revenue
        prisma.payment.aggregate({
          where: {
            organizationId: orgId,
            paymentDate: { gte: lastMonthStart, lte: lastMonthEnd },
          },
          _sum: { amount: true },
        }),
        // Unpaid invoices count
        prisma.invoice.count({
          where: { organizationId: orgId, status: { in: ["SENT", "VIEWED", "PARTIALLY_PAID"] } },
        }),
        // Unpaid invoices amount
        prisma.invoice.aggregate({
          where: { organizationId: orgId, status: { in: ["SENT", "VIEWED", "PARTIALLY_PAID"] } },
          _sum: { balanceDue: true },
        }),
        // Overdue count
        prisma.invoice.count({
          where: {
            organizationId: orgId,
            status: { in: ["SENT", "VIEWED", "PARTIALLY_PAID", "OVERDUE"] },
            dueDate: { lt: now },
          },
        }),
        // Overdue amount
        prisma.invoice.aggregate({
          where: {
            organizationId: orgId,
            status: { in: ["SENT", "VIEWED", "PARTIALLY_PAID", "OVERDUE"] },
            dueDate: { lt: now },
          },
          _sum: { balanceDue: true },
        }),
        // Customer count
        prisma.customer.count({ where: { organizationId: orgId, isActive: true } }),
        // Invoice count
        prisma.invoice.count({ where: { organizationId: orgId } }),
        // Recent invoices
        prisma.invoice.findMany({
          where: { organizationId: orgId },
          include: { customer: { select: { displayName: true } } },
          orderBy: { createdAt: "desc" },
          take: 5,
        }),
        // Monthly revenue (last 6 months)
        prisma.$queryRaw<{ month: string; revenue: number }[]>`
          SELECT
            TO_CHAR(DATE_TRUNC('month', "paymentDate"), 'Mon YYYY') as month,
            SUM(amount)::float as revenue
          FROM payments
          WHERE "organizationId" = ${orgId}
            AND "paymentDate" >= ${subMonths(now, 5)}
          GROUP BY DATE_TRUNC('month', "paymentDate")
          ORDER BY DATE_TRUNC('month', "paymentDate") ASC
        `,
      ]);

      return apiSuccess({
        totalRevenue: Number(totalRevenue._sum.amount ?? 0),
        thisMonthRevenue: Number(thisMonthRevenue._sum.amount ?? 0),
        lastMonthRevenue: Number(lastMonthRevenue._sum.amount ?? 0),
        unpaidCount,
        unpaidAmount: Number(unpaidAmount._sum.balanceDue ?? 0),
        overdueCount,
        overdueAmount: Number(overdueAmount._sum.balanceDue ?? 0),
        totalCustomers,
        totalInvoices,
        recentInvoices,
        monthlyRevenue,
      });
    }

    if (type === "customer-revenue") {
      const data = await prisma.customer.findMany({
        where: { organizationId: orgId, isActive: true },
        select: {
          id: true,
          displayName: true,
          outstandingBalance: true,
          _count: { select: { invoices: true } },
          invoices: {
            where: { status: "PAID" },
            select: { total: true },
          },
        },
        orderBy: { outstandingBalance: "desc" },
        take: 20,
      });

      const customers = data.map((c) => ({
        id: c.id,
        name: c.displayName,
        invoiceCount: c._count.invoices,
        totalRevenue: c.invoices.reduce((s, i) => s + Number(i.total), 0),
        outstanding: Number(c.outstandingBalance),
      }));

      return apiSuccess(customers);
    }

    if (type === "unpaid-invoices") {
      const invoices = await prisma.invoice.findMany({
        where: {
          organizationId: orgId,
          status: { in: ["SENT", "VIEWED", "PARTIALLY_PAID", "OVERDUE"] },
        },
        include: { customer: { select: { displayName: true, email: true } } },
        orderBy: { dueDate: "asc" },
      });
      return apiSuccess(invoices);
    }

    return apiError("Unknown report type", 400);
  } catch (err: any) {
    if (err.message === "Unauthorized") return apiError("Unauthorized", 401);
    console.error("[REPORTS]", err);
    return apiError("Internal server error", 500);
  }
}
