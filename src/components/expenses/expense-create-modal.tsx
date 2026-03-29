"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input, Select, Textarea } from "@/components/ui/input";
import { Plus, X } from "lucide-react";

const CATEGORIES = [
  "Travel", "Meals & Entertainment", "Office Supplies", "Software & Subscriptions",
  "Marketing", "Utilities", "Rent", "Professional Services", "Equipment", "Other",
];

interface Customer { id: string; displayName: string }

export function ExpenseCreateModal({ customers }: { customers: Customer[] }) {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState({
    category: "",
    amount: "",
    taxAmount: "",
    expenseDate: new Date().toISOString().split("T")[0],
    vendor: "",
    reference: "",
    notes: "",
    isBillable: false,
    customerId: "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  function set(key: string, val: string | boolean) {
    setForm((prev) => ({ ...prev, [key]: val }));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const res = await fetch("/api/expenses", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...form,
          customerId: form.customerId || undefined,
        }),
      });
      const json = await res.json();
      if (!res.ok) {
        setError(json.error ?? "Failed to create");
        return;
      }
      setOpen(false);
      setForm({
        category: "", amount: "", taxAmount: "",
        expenseDate: new Date().toISOString().split("T")[0],
        vendor: "", reference: "", notes: "", isBillable: false, customerId: "",
      });
      router.refresh();
    } catch {
      setError("Something went wrong");
    } finally {
      setLoading(false);
    }
  }

  return (
    <>
      <Button onClick={() => setOpen(true)}>
        <Plus className="w-4 h-4" /> Add Expense
      </Button>

      {open && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-lg max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200 sticky top-0 bg-white">
              <h2 className="font-semibold text-gray-900">Add Expense</h2>
              <button onClick={() => setOpen(false)} className="text-gray-400 hover:text-gray-600 cursor-pointer">
                <X className="w-5 h-5" />
              </button>
            </div>
            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              {error && (
                <div className="p-3 bg-red-50 border border-red-200 rounded-lg text-sm text-red-700">{error}</div>
              )}
              <div className="grid grid-cols-2 gap-4">
                <Select
                  label="Category *"
                  required
                  value={form.category}
                  onChange={(e) => set("category", e.target.value)}
                >
                  <option value="">Select…</option>
                  {CATEGORIES.map((c) => <option key={c}>{c}</option>)}
                </Select>
                <Input
                  label="Date *"
                  type="date"
                  required
                  value={form.expenseDate}
                  onChange={(e) => set("expenseDate", e.target.value)}
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <Input
                  label="Amount (₹) *"
                  type="number"
                  required
                  min="0"
                  step="0.01"
                  value={form.amount}
                  onChange={(e) => set("amount", e.target.value)}
                />
                <Input
                  label="Tax Amount (₹)"
                  type="number"
                  min="0"
                  step="0.01"
                  value={form.taxAmount}
                  onChange={(e) => set("taxAmount", e.target.value)}
                />
              </div>
              <Input
                label="Vendor"
                value={form.vendor}
                onChange={(e) => set("vendor", e.target.value)}
              />
              <Input
                label="Reference / Invoice #"
                value={form.reference}
                onChange={(e) => set("reference", e.target.value)}
              />
              <div className="flex items-center gap-3">
                <label className="flex items-center gap-2 text-sm text-gray-700 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={form.isBillable}
                    onChange={(e) => set("isBillable", e.target.checked)}
                    className="rounded"
                  />
                  Billable to customer
                </label>
              </div>
              {form.isBillable && (
                <Select
                  label="Customer"
                  value={form.customerId}
                  onChange={(e) => set("customerId", e.target.value)}
                >
                  <option value="">Select customer…</option>
                  {customers.map((c) => <option key={c.id} value={c.id}>{c.displayName}</option>)}
                </Select>
              )}
              <Textarea
                label="Notes"
                rows={2}
                value={form.notes}
                onChange={(e) => set("notes", e.target.value)}
              />
              <div className="flex gap-3 pt-2">
                <Button type="button" variant="outline" className="flex-1" onClick={() => setOpen(false)}>Cancel</Button>
                <Button type="submit" className="flex-1" isLoading={loading}>Add Expense</Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
}
