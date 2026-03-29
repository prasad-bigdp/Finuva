"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input, Select } from "@/components/ui/input";
import { formatCurrency } from "@/lib/utils";
import { CreditCard, X } from "lucide-react";

interface PaymentModalProps {
  invoiceId: string;
  balanceDue: number;
}

const METHODS = [
  { value: "BANK_TRANSFER", label: "Bank Transfer" },
  { value: "UPI", label: "UPI" },
  { value: "CASH", label: "Cash" },
  { value: "CHEQUE", label: "Cheque" },
  { value: "CARD", label: "Card" },
  { value: "OTHER", label: "Other" },
];

export function PaymentModal({ invoiceId, balanceDue }: PaymentModalProps) {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState({
    amount: String(balanceDue),
    paymentDate: new Date().toISOString().split("T")[0],
    method: "BANK_TRANSFER",
    reference: "",
    notes: "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  function set(key: string, val: string) {
    setForm((prev) => ({ ...prev, [key]: val }));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const res = await fetch("/api/payments", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...form, invoiceId }),
      });
      const json = await res.json();
      if (!res.ok) {
        setError(json.error ?? "Failed to record payment");
        return;
      }
      setOpen(false);
      router.refresh();
    } catch {
      setError("Something went wrong");
    } finally {
      setLoading(false);
    }
  }

  return (
    <>
      <Button onClick={() => setOpen(true)} className="w-full">
        <CreditCard className="w-4 h-4" /> Record Payment
      </Button>

      {open && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-md">
            <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200">
              <h2 className="font-semibold text-gray-900">Record Payment</h2>
              <button onClick={() => setOpen(false)} className="text-gray-400 hover:text-gray-600 cursor-pointer">
                <X className="w-5 h-5" />
              </button>
            </div>
            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              {error && (
                <div className="p-3 bg-red-50 border border-red-200 rounded-lg text-sm text-red-700">{error}</div>
              )}
              <p className="text-sm text-gray-600">
                Balance due: <strong className="text-gray-900">{formatCurrency(balanceDue)}</strong>
              </p>
              <Input
                label="Amount (₹) *"
                type="number"
                required
                min="0.01"
                max={balanceDue}
                step="0.01"
                value={form.amount}
                onChange={(e) => set("amount", e.target.value)}
              />
              <Input
                label="Payment Date *"
                type="date"
                required
                value={form.paymentDate}
                onChange={(e) => set("paymentDate", e.target.value)}
              />
              <Select label="Payment Method" value={form.method} onChange={(e) => set("method", e.target.value)}>
                {METHODS.map((m) => <option key={m.value} value={m.value}>{m.label}</option>)}
              </Select>
              <Input
                label="Reference / Cheque No."
                value={form.reference}
                onChange={(e) => set("reference", e.target.value)}
                placeholder="UTR, cheque no., etc."
              />
              <Input
                label="Notes"
                value={form.notes}
                onChange={(e) => set("notes", e.target.value)}
              />
              <div className="flex gap-3 pt-2">
                <Button type="button" variant="outline" className="flex-1" onClick={() => setOpen(false)}>
                  Cancel
                </Button>
                <Button type="submit" className="flex-1" isLoading={loading}>
                  Record Payment
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
}
