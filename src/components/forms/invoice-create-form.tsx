"use client";
import { useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input, Select, Textarea } from "@/components/ui/input";
import { Card, CardBody, CardHeader } from "@/components/ui/card";
import { formatCurrency } from "@/lib/utils";
import { Plus, Trash2, ChevronDown } from "lucide-react";

interface Customer {
  id: string;
  displayName: string;
  email: string | null;
  gstin: string | null;
  billingState: string | null;
}

interface Item {
  id: string;
  name: string;
  rate: any;
  taxRate: any;
  unit: string | null;
  description: string | null;
  hsnSac: string | null;
}

interface LineItem {
  id: string;
  itemId: string;
  name: string;
  description: string;
  quantity: number;
  unit: string;
  rate: number;
  discount: number;
  taxRate: number;
  hsnSac: string;
}

function genId() {
  return Math.random().toString(36).slice(2);
}

function newLine(): LineItem {
  return {
    id: genId(),
    itemId: "",
    name: "",
    description: "",
    quantity: 1,
    unit: "",
    rate: 0,
    discount: 0,
    taxRate: 18,
    hsnSac: "",
  };
}

function calcLine(line: LineItem) {
  const gross = line.quantity * line.rate;
  const disc = (gross * line.discount) / 100;
  const taxable = gross - disc;
  const tax = (taxable * line.taxRate) / 100;
  return { taxable, tax, total: taxable + tax };
}

export function InvoiceCreateForm({
  customers,
  items,
}: {
  customers: Customer[];
  items: Item[];
}) {
  const router = useRouter();

  const today = new Date().toISOString().split("T")[0];
  const dueDefault = new Date(Date.now() + 15 * 86400000).toISOString().split("T")[0];

  const [customerId, setCustomerId] = useState("");
  const [issueDate, setIssueDate] = useState(today);
  const [dueDate, setDueDate] = useState(dueDefault);
  const [discountType, setDiscountType] = useState<"PERCENT" | "FIXED">("PERCENT");
  const [discountValue, setDiscountValue] = useState(0);
  const [isInterState, setIsInterState] = useState(false);
  const [placeOfSupply, setPlaceOfSupply] = useState("");
  const [notes, setNotes] = useState("");
  const [terms, setTerms] = useState("");
  const [lines, setLines] = useState<LineItem[]>([newLine()]);
  const [submitStatus, setSubmitStatus] = useState<"DRAFT" | "SENT">("DRAFT");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // Totals
  let subtotal = 0;
  let totalTax = 0;
  for (const l of lines) {
    const { taxable, tax } = calcLine(l);
    subtotal += taxable;
    totalTax += tax;
  }
  const discAmt =
    discountType === "PERCENT"
      ? (subtotal * discountValue) / 100
      : discountValue;
  const taxableBase = subtotal - discAmt;
  const total = taxableBase + totalTax;
  const halfTax = totalTax / 2;
  const cgst = isInterState ? 0 : halfTax;
  const sgst = isInterState ? 0 : halfTax;
  const igst = isInterState ? totalTax : 0;

  function updateLine(id: string, key: keyof LineItem, val: any) {
    setLines((prev) =>
      prev.map((l) => {
        if (l.id !== id) return l;
        const updated = { ...l, [key]: val };
        // Auto-fill from item catalog
        if (key === "itemId" && val) {
          const item = items.find((i) => i.id === val);
          if (item) {
            return {
              ...updated,
              name: item.name,
              rate: Number(item.rate),
              taxRate: Number(item.taxRate),
              unit: item.unit ?? "",
              description: item.description ?? "",
              hsnSac: item.hsnSac ?? "",
            };
          }
        }
        return updated;
      })
    );
  }

  function removeLine(id: string) {
    setLines((prev) => prev.filter((l) => l.id !== id));
  }

  async function handleSubmit(status: "DRAFT" | "SENT") {
    setError("");
    setLoading(true);
    setSubmitStatus(status);
    try {
      const res = await fetch("/api/invoices", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          customerId,
          issueDate,
          dueDate,
          discountType,
          discountValue,
          isInterState,
          placeOfSupply,
          notes,
          terms,
          status,
          items: lines.map(({ id, ...rest }) => rest),
        }),
      });
      const json = await res.json();
      if (!res.ok) {
        setError(json.error ?? "Failed to create invoice");
        return;
      }
      router.push(`/invoices/${json.data.id}`);
      router.refresh();
    } catch {
      setError("Something went wrong");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="space-y-6">
      {error && (
        <div className="p-3 bg-red-50 border border-red-200 rounded-lg text-sm text-red-700">{error}</div>
      )}

      {/* Header Info */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader><h2 className="font-semibold text-gray-900">Customer</h2></CardHeader>
          <CardBody className="space-y-4">
            <Select
              label="Bill To *"
              value={customerId}
              onChange={(e) => setCustomerId(e.target.value)}
              required
            >
              <option value="">Select a customer…</option>
              {customers.map((c) => (
                <option key={c.id} value={c.id}>{c.displayName}</option>
              ))}
            </Select>
            <div className="flex items-center gap-3">
              <label className="flex items-center gap-2 text-sm text-gray-700 cursor-pointer">
                <input
                  type="checkbox"
                  checked={isInterState}
                  onChange={(e) => setIsInterState(e.target.checked)}
                  className="rounded"
                />
                Inter-state supply (IGST)
              </label>
            </div>
            <Input
              label="Place of Supply (State)"
              value={placeOfSupply}
              onChange={(e) => setPlaceOfSupply(e.target.value)}
              placeholder="e.g. Maharashtra"
            />
          </CardBody>
        </Card>

        <Card>
          <CardHeader><h2 className="font-semibold text-gray-900">Invoice Details</h2></CardHeader>
          <CardBody className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <Input
                label="Issue Date *"
                type="date"
                value={issueDate}
                onChange={(e) => setIssueDate(e.target.value)}
              />
              <Input
                label="Due Date *"
                type="date"
                value={dueDate}
                onChange={(e) => setDueDate(e.target.value)}
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <Select
                label="Discount Type"
                value={discountType}
                onChange={(e) => setDiscountType(e.target.value as "PERCENT" | "FIXED")}
              >
                <option value="PERCENT">Percent (%)</option>
                <option value="FIXED">Fixed Amount (₹)</option>
              </Select>
              <Input
                label={`Discount ${discountType === "PERCENT" ? "%" : "₹"}`}
                type="number"
                min="0"
                step="0.01"
                value={discountValue}
                onChange={(e) => setDiscountValue(Number(e.target.value))}
              />
            </div>
          </CardBody>
        </Card>
      </div>

      {/* Line Items */}
      <Card>
        <CardHeader>
          <h2 className="font-semibold text-gray-900">Line Items</h2>
        </CardHeader>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-200 bg-gray-50">
                <th className="px-3 py-2 text-left text-xs font-semibold text-gray-500 w-40">Item</th>
                <th className="px-3 py-2 text-left text-xs font-semibold text-gray-500">Description</th>
                <th className="px-3 py-2 text-left text-xs font-semibold text-gray-500 w-16">HSN/SAC</th>
                <th className="px-3 py-2 text-right text-xs font-semibold text-gray-500 w-16">Qty</th>
                <th className="px-3 py-2 text-left text-xs font-semibold text-gray-500 w-14">Unit</th>
                <th className="px-3 py-2 text-right text-xs font-semibold text-gray-500 w-24">Rate (₹)</th>
                <th className="px-3 py-2 text-right text-xs font-semibold text-gray-500 w-16">Disc%</th>
                <th className="px-3 py-2 text-right text-xs font-semibold text-gray-500 w-16">GST%</th>
                <th className="px-3 py-2 text-right text-xs font-semibold text-gray-500 w-24">Amount</th>
                <th className="px-3 py-2 w-8"></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {lines.map((line) => {
                const { total: lineTotal } = calcLine(line);
                return (
                  <tr key={line.id}>
                    <td className="px-2 py-2">
                      <select
                        value={line.itemId}
                        onChange={(e) => updateLine(line.id, "itemId", e.target.value)}
                        className="w-full rounded border border-gray-300 px-2 py-1.5 text-xs focus:border-blue-500 focus:outline-none"
                      >
                        <option value="">Custom</option>
                        {items.map((i) => <option key={i.id} value={i.id}>{i.name}</option>)}
                      </select>
                    </td>
                    <td className="px-2 py-2">
                      <input
                        value={line.name}
                        onChange={(e) => updateLine(line.id, "name", e.target.value)}
                        placeholder="Item name"
                        className="w-full rounded border border-gray-300 px-2 py-1.5 text-xs focus:border-blue-500 focus:outline-none"
                        required
                      />
                    </td>
                    <td className="px-2 py-2">
                      <input
                        value={line.hsnSac}
                        onChange={(e) => updateLine(line.id, "hsnSac", e.target.value)}
                        placeholder="—"
                        className="w-full rounded border border-gray-300 px-2 py-1.5 text-xs focus:border-blue-500 focus:outline-none"
                      />
                    </td>
                    <td className="px-2 py-2">
                      <input
                        type="number"
                        min="0.001"
                        step="0.001"
                        value={line.quantity}
                        onChange={(e) => updateLine(line.id, "quantity", Number(e.target.value))}
                        className="w-full rounded border border-gray-300 px-2 py-1.5 text-xs text-right focus:border-blue-500 focus:outline-none"
                      />
                    </td>
                    <td className="px-2 py-2">
                      <input
                        value={line.unit}
                        onChange={(e) => updateLine(line.id, "unit", e.target.value)}
                        placeholder="hrs"
                        className="w-full rounded border border-gray-300 px-2 py-1.5 text-xs focus:border-blue-500 focus:outline-none"
                      />
                    </td>
                    <td className="px-2 py-2">
                      <input
                        type="number"
                        min="0"
                        step="0.01"
                        value={line.rate}
                        onChange={(e) => updateLine(line.id, "rate", Number(e.target.value))}
                        className="w-full rounded border border-gray-300 px-2 py-1.5 text-xs text-right focus:border-blue-500 focus:outline-none"
                      />
                    </td>
                    <td className="px-2 py-2">
                      <input
                        type="number"
                        min="0"
                        max="100"
                        step="0.01"
                        value={line.discount}
                        onChange={(e) => updateLine(line.id, "discount", Number(e.target.value))}
                        className="w-full rounded border border-gray-300 px-2 py-1.5 text-xs text-right focus:border-blue-500 focus:outline-none"
                      />
                    </td>
                    <td className="px-2 py-2">
                      <select
                        value={line.taxRate}
                        onChange={(e) => updateLine(line.id, "taxRate", Number(e.target.value))}
                        className="w-full rounded border border-gray-300 px-2 py-1.5 text-xs focus:border-blue-500 focus:outline-none"
                      >
                        {[0, 5, 12, 18, 28].map((r) => <option key={r} value={r}>{r}%</option>)}
                      </select>
                    </td>
                    <td className="px-2 py-2 text-right font-medium text-gray-900 text-xs">
                      {formatCurrency(lineTotal)}
                    </td>
                    <td className="px-2 py-2">
                      <button
                        type="button"
                        onClick={() => removeLine(line.id)}
                        disabled={lines.length === 1}
                        className="text-red-400 hover:text-red-600 disabled:opacity-30 cursor-pointer"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
        <div className="px-4 py-3 border-t border-gray-100">
          <button
            type="button"
            onClick={() => setLines((prev) => [...prev, newLine()])}
            className="inline-flex items-center gap-1.5 text-sm text-blue-600 hover:text-blue-800 font-medium cursor-pointer"
          >
            <Plus className="w-4 h-4" /> Add Line Item
          </button>
        </div>
      </Card>

      {/* Totals + Notes */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardBody className="space-y-4">
            <Textarea
              label="Notes"
              rows={3}
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Notes visible to the customer"
            />
            <Textarea
              label="Terms & Conditions"
              rows={3}
              value={terms}
              onChange={(e) => setTerms(e.target.value)}
              placeholder="Payment terms, late fees, etc."
            />
          </CardBody>
        </Card>

        <Card>
          <CardBody>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between text-gray-600">
                <span>Subtotal</span>
                <span>{formatCurrency(subtotal)}</span>
              </div>
              {discAmt > 0 && (
                <div className="flex justify-between text-green-700">
                  <span>Discount</span>
                  <span>- {formatCurrency(discAmt)}</span>
                </div>
              )}
              {isInterState ? (
                <div className="flex justify-between text-gray-600">
                  <span>IGST ({lines[0]?.taxRate ?? 0}%)</span>
                  <span>{formatCurrency(igst)}</span>
                </div>
              ) : (
                <>
                  <div className="flex justify-between text-gray-600">
                    <span>CGST</span>
                    <span>{formatCurrency(cgst)}</span>
                  </div>
                  <div className="flex justify-between text-gray-600">
                    <span>SGST</span>
                    <span>{formatCurrency(sgst)}</span>
                  </div>
                </>
              )}
              <div className="flex justify-between text-lg font-bold text-gray-900 border-t border-gray-200 pt-2 mt-2">
                <span>Total</span>
                <span>{formatCurrency(total)}</span>
              </div>
            </div>
          </CardBody>
        </Card>
      </div>

      {/* Actions */}
      <div className="flex items-center justify-end gap-3">
        <Button type="button" variant="outline" onClick={() => router.back()}>Cancel</Button>
        <Button
          type="button"
          variant="secondary"
          isLoading={loading && submitStatus === "DRAFT"}
          onClick={() => handleSubmit("DRAFT")}
        >
          Save as Draft
        </Button>
        <Button
          type="button"
          isLoading={loading && submitStatus === "SENT"}
          onClick={() => handleSubmit("SENT")}
        >
          Save & Send
        </Button>
      </div>
    </div>
  );
}
