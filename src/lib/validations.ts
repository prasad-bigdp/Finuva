// ─── Zod Validation Schemas ───────────────────────────────────────────────────
import { z } from "zod";

// ─── Auth ─────────────────────────────────────────────────────────────────────
export const registerSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Invalid email address"),
  password: z.string().min(8, "Password must be at least 8 characters"),
  organizationName: z.string().min(2, "Organization name is required"),
});

export const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(1),
});

// ─── Customer ─────────────────────────────────────────────────────────────────
export const customerSchema = z.object({
  displayName: z.string().min(1, "Display name is required"),
  companyName: z.string().optional(),
  email: z.string().email("Invalid email").optional().or(z.literal("")),
  phone: z.string().optional(),
  website: z.string().url().optional().or(z.literal("")),
  gstin: z
    .string()
    .regex(/^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z]{1}[1-9A-Z]{1}Z[0-9A-Z]{1}$/, "Invalid GSTIN")
    .optional()
    .or(z.literal("")),
  pan: z.string().optional(),
  billingAddress: z.string().optional(),
  billingCity: z.string().optional(),
  billingState: z.string().optional(),
  billingCountry: z.string().optional(),
  billingPincode: z.string().optional(),
  shippingAddress: z.string().optional(),
  shippingCity: z.string().optional(),
  shippingState: z.string().optional(),
  shippingCountry: z.string().optional(),
  shippingPincode: z.string().optional(),
  notes: z.string().optional(),
});

// ─── Item ─────────────────────────────────────────────────────────────────────
export const itemSchema = z.object({
  name: z.string().min(1, "Item name is required"),
  description: z.string().optional(),
  type: z.enum(["PRODUCT", "SERVICE"]),
  sku: z.string().optional(),
  unit: z.string().optional(),
  rate: z.coerce.number().min(0, "Rate must be non-negative"),
  taxRate: z.coerce.number().min(0).max(100),
  hsnSac: z.string().optional(),
});

// ─── Invoice ──────────────────────────────────────────────────────────────────
export const invoiceItemSchema = z.object({
  itemId: z.string().optional(),
  name: z.string().min(1, "Item name required"),
  description: z.string().optional(),
  quantity: z.coerce.number().min(0.001),
  unit: z.string().optional(),
  rate: z.coerce.number().min(0),
  discount: z.coerce.number().min(0).max(100).optional(),
  taxRate: z.coerce.number().min(0).max(100).optional(),
  hsnSac: z.string().optional(),
});

export const invoiceSchema = z.object({
  customerId: z.string().min(1, "Customer is required"),
  issueDate: z.string().min(1, "Issue date is required"),
  dueDate: z.string().min(1, "Due date is required"),
  items: z.array(invoiceItemSchema).min(1, "At least one item required"),
  discountType: z.enum(["PERCENT", "FIXED"]).optional(),
  discountValue: z.coerce.number().min(0).optional(),
  placeOfSupply: z.string().optional(),
  isInterState: z.boolean().optional(),
  notes: z.string().optional(),
  terms: z.string().optional(),
  status: z.enum(["DRAFT", "SENT"]).optional(),
});

// ─── Payment ──────────────────────────────────────────────────────────────────
export const paymentSchema = z.object({
  invoiceId: z.string().min(1),
  amount: z.coerce.number().min(0.01, "Amount must be greater than 0"),
  paymentDate: z.string().min(1, "Payment date required"),
  method: z.enum(["CASH", "CHEQUE", "BANK_TRANSFER", "UPI", "CARD", "RAZORPAY", "STRIPE", "OTHER"]),
  reference: z.string().optional(),
  notes: z.string().optional(),
});

// ─── Expense ──────────────────────────────────────────────────────────────────
export const expenseSchema = z.object({
  category: z.string().min(1, "Category is required"),
  amount: z.coerce.number().min(0),
  taxAmount: z.coerce.number().min(0).optional(),
  expenseDate: z.string().min(1),
  vendor: z.string().optional(),
  reference: z.string().optional(),
  notes: z.string().optional(),
  isBillable: z.boolean().optional(),
  customerId: z.string().optional(),
});

// ─── Recurring Invoice ────────────────────────────────────────────────────────
export const recurringSchema = z.object({
  customerId: z.string().min(1),
  frequency: z.enum(["DAILY", "WEEKLY", "BIWEEKLY", "MONTHLY", "QUARTERLY", "HALF_YEARLY", "YEARLY"]),
  startDate: z.string().min(1),
  endDate: z.string().optional(),
  templateData: z.any(),
});

// ─── Settings ─────────────────────────────────────────────────────────────────
export const orgSettingsSchema = z.object({
  name: z.string().min(1),
  email: z.string().email().optional().or(z.literal("")),
  phone: z.string().optional(),
  address: z.string().optional(),
  city: z.string().optional(),
  state: z.string().optional(),
  country: z.string().optional(),
  pincode: z.string().optional(),
  gstin: z.string().optional(),
  pan: z.string().optional(),
  currency: z.string().optional(),
  timezone: z.string().optional(),
  invoicePrefix: z.string().min(1).max(10),
});
