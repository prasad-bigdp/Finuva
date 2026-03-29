// ─── Shared Utilities ─────────────────────────────────────────────────────────
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import { format } from "date-fns";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// ─── Currency formatter ───────────────────────────────────────────────────────
export function formatCurrency(
  amount: number | string,
  currency = "INR",
  locale = "en-IN"
): string {
  return new Intl.NumberFormat(locale, {
    style: "currency",
    currency,
    minimumFractionDigits: 2,
  }).format(Number(amount));
}

// ─── Date helpers ─────────────────────────────────────────────────────────────
export function formatDate(date: Date | string, fmt = "dd MMM yyyy"): string {
  return format(new Date(date), fmt);
}

export function isOverdue(dueDate: Date | string): boolean {
  return new Date(dueDate) < new Date();
}

// ─── Invoice number generator ─────────────────────────────────────────────────
export function generateInvoiceNumber(prefix: string, counter: number): string {
  return `${prefix}-${String(counter).padStart(5, "0")}`;
}

// ─── GST calculator ───────────────────────────────────────────────────────────
export interface GSTBreakdown {
  subtotal: number;
  discountAmount: number;
  taxableAmount: number;
  cgst: number;
  sgst: number;
  igst: number;
  totalTax: number;
  total: number;
}

export function calculateGST(
  subtotal: number,
  taxRate: number, // e.g. 18
  discountAmount: number,
  isInterState: boolean
): GSTBreakdown {
  const taxableAmount = subtotal - discountAmount;
  const totalTax = (taxableAmount * taxRate) / 100;
  const halfTax = totalTax / 2;

  return {
    subtotal,
    discountAmount,
    taxableAmount,
    cgst: isInterState ? 0 : halfTax,
    sgst: isInterState ? 0 : halfTax,
    igst: isInterState ? totalTax : 0,
    totalTax,
    total: taxableAmount + totalTax,
  };
}

// ─── Invoice totals from line items ──────────────────────────────────────────
export interface LineItem {
  quantity: number;
  rate: number;
  discount?: number; // percent
  taxRate?: number;  // percent
}

export interface InvoiceTotals {
  subtotal: number;
  discountAmount: number;
  totalTax: number;
  total: number;
  cgst: number;
  sgst: number;
  igst: number;
}

export function calculateInvoiceTotals(
  items: LineItem[],
  invoiceDiscountType: "PERCENT" | "FIXED",
  invoiceDiscountValue: number,
  isInterState: boolean
): InvoiceTotals {
  let subtotal = 0;
  let totalTax = 0;

  for (const item of items) {
    const lineSubtotal = item.quantity * item.rate;
    const lineDiscount = (lineSubtotal * (item.discount ?? 0)) / 100;
    const lineAfterDiscount = lineSubtotal - lineDiscount;
    const lineTax = (lineAfterDiscount * (item.taxRate ?? 0)) / 100;
    subtotal += lineAfterDiscount;
    totalTax += lineTax;
  }

  const discountAmount =
    invoiceDiscountType === "PERCENT"
      ? (subtotal * invoiceDiscountValue) / 100
      : invoiceDiscountValue;

  const taxableBase = subtotal - discountAmount;
  const halfTax = totalTax / 2;

  return {
    subtotal,
    discountAmount,
    totalTax,
    total: taxableBase + totalTax,
    cgst: isInterState ? 0 : halfTax,
    sgst: isInterState ? 0 : halfTax,
    igst: isInterState ? totalTax : 0,
  };
}

// ─── Status badge colours ─────────────────────────────────────────────────────
export const invoiceStatusColors: Record<string, string> = {
  DRAFT: "bg-gray-100 text-gray-700",
  SENT: "bg-blue-100 text-blue-700",
  VIEWED: "bg-purple-100 text-purple-700",
  PARTIALLY_PAID: "bg-orange-100 text-orange-700",
  PAID: "bg-green-100 text-green-700",
  OVERDUE: "bg-red-100 text-red-700",
  CANCELLED: "bg-gray-200 text-gray-500",
  VOID: "bg-gray-200 text-gray-400",
};

export function slugify(str: string): string {
  return str
    .toLowerCase()
    .replace(/\s+/g, "-")
    .replace(/[^a-z0-9-]/g, "");
}

// ─── API response helpers ─────────────────────────────────────────────────────
export function apiSuccess<T>(data: T, status = 200) {
  return Response.json({ success: true, data }, { status });
}

export function apiError(message: string, status = 400) {
  return Response.json({ success: false, error: message }, { status });
}
