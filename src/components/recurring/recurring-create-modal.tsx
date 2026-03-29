"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input, Select } from "@/components/ui/input";
import { Plus, X } from "lucide-react";

const FREQUENCIES = [
  { value: "DAILY", label: "Daily" },
  { value: "WEEKLY", label: "Weekly" },
  { value: "BIWEEKLY", label: "Every 2 Weeks" },
  { value: "MONTHLY", label: "Monthly" },
  { value: "QUARTERLY", label: "Quarterly" },
  { value: "HALF_YEARLY", label: "Every 6 Months" },
  { value: "YEARLY", label: "Yearly" },
];

interface Customer { id: string; displayName: string }

export function RecurringCreateModal({ customers }: { customers: Customer[] }) {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState({
    customerId: "",
    frequency: "MONTHLY",
    startDate: new Date().toISOString().split("T")[0],
    endDate: "",
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
      const res = await fetch("/api/recurring", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...form,
          endDate: form.endDate || undefined,
          templateData: { note: "Auto-generated" },
        }),
      });
      const json = await res.json();
      if (!res.ok) {
        setError(json.error ?? "Failed to create");
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
      <Button onClick={() => setOpen(true)}>
        <Plus className="w-4 h-4" /> New Schedule
      </Button>

      {open && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-md">
            <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200">
              <h2 className="font-semibold text-gray-900">New Recurring Invoice</h2>
              <button onClick={() => setOpen(false)} className="text-gray-400 hover:text-gray-600 cursor-pointer">
                <X className="w-5 h-5" />
              </button>
            </div>
            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              {error && (
                <div className="p-3 bg-red-50 border border-red-200 rounded-lg text-sm text-red-700">{error}</div>
              )}
              <Select
                label="Customer *"
                required
                value={form.customerId}
                onChange={(e) => set("customerId", e.target.value)}
              >
                <option value="">Select customer…</option>
                {customers.map((c) => <option key={c.id} value={c.id}>{c.displayName}</option>)}
              </Select>
              <Select
                label="Frequency *"
                value={form.frequency}
                onChange={(e) => set("frequency", e.target.value)}
              >
                {FREQUENCIES.map((f) => <option key={f.value} value={f.value}>{f.label}</option>)}
              </Select>
              <div className="grid grid-cols-2 gap-4">
                <Input
                  label="Start Date *"
                  type="date"
                  required
                  value={form.startDate}
                  onChange={(e) => set("startDate", e.target.value)}
                />
                <Input
                  label="End Date (optional)"
                  type="date"
                  value={form.endDate}
                  onChange={(e) => set("endDate", e.target.value)}
                />
              </div>
              <div className="flex gap-3 pt-2">
                <Button type="button" variant="outline" className="flex-1" onClick={() => setOpen(false)}>Cancel</Button>
                <Button type="submit" className="flex-1" isLoading={loading}>Create Schedule</Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
}
