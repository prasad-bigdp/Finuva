"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input, Select, Textarea } from "@/components/ui/input";
import { Plus, X } from "lucide-react";

interface Customer { id: string; displayName: string }

export function TimeEntryModal({ customers }: { customers: Customer[] }) {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState({
    description: "",
    hours: "",
    rate: "",
    date: new Date().toISOString().split("T")[0],
    customerId: "",
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
      const hours = Number(form.hours);
      const rate = Number(form.rate);
      const amount = hours * rate;

      const res = await fetch("/api/time", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...form,
          hours,
          rate,
          amount,
          customerId: form.customerId || undefined,
        }),
      });
      const json = await res.json();
      if (!res.ok) {
        setError(json.error ?? "Failed to save");
        return;
      }
      setOpen(false);
      setForm({ description: "", hours: "", rate: "", date: new Date().toISOString().split("T")[0], customerId: "" });
      router.refresh();
    } catch {
      setError("Something went wrong");
    } finally {
      setLoading(false);
    }
  }

  const amount = Number(form.hours || 0) * Number(form.rate || 0);

  return (
    <>
      <Button onClick={() => setOpen(true)}>
        <Plus className="w-4 h-4" /> Log Time
      </Button>

      {open && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-md">
            <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200">
              <h2 className="font-semibold text-gray-900">Log Time Entry</h2>
              <button onClick={() => setOpen(false)} className="text-gray-400 hover:text-gray-600 cursor-pointer">
                <X className="w-5 h-5" />
              </button>
            </div>
            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              {error && (
                <div className="p-3 bg-red-50 border border-red-200 rounded-lg text-sm text-red-700">{error}</div>
              )}
              <Input
                label="Description *"
                required
                value={form.description}
                onChange={(e) => set("description", e.target.value)}
                placeholder="What did you work on?"
              />
              <div className="grid grid-cols-2 gap-4">
                <Input
                  label="Hours *"
                  type="number"
                  required
                  min="0.01"
                  step="0.25"
                  value={form.hours}
                  onChange={(e) => set("hours", e.target.value)}
                  placeholder="1.5"
                />
                <Input
                  label="Rate (₹/hr) *"
                  type="number"
                  required
                  min="0"
                  step="0.01"
                  value={form.rate}
                  onChange={(e) => set("rate", e.target.value)}
                  placeholder="1000"
                />
              </div>
              {amount > 0 && (
                <p className="text-sm text-blue-700 font-medium">
                  Billable amount: ₹{amount.toLocaleString("en-IN", { minimumFractionDigits: 2 })}
                </p>
              )}
              <div className="grid grid-cols-2 gap-4">
                <Input
                  label="Date *"
                  type="date"
                  required
                  value={form.date}
                  onChange={(e) => set("date", e.target.value)}
                />
                <Select
                  label="Customer"
                  value={form.customerId}
                  onChange={(e) => set("customerId", e.target.value)}
                >
                  <option value="">None</option>
                  {customers.map((c) => <option key={c.id} value={c.id}>{c.displayName}</option>)}
                </Select>
              </div>
              <div className="flex gap-3 pt-2">
                <Button type="button" variant="outline" className="flex-1" onClick={() => setOpen(false)}>Cancel</Button>
                <Button type="submit" className="flex-1" isLoading={loading}>Save Entry</Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
}
