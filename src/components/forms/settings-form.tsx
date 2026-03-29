"use client";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input, Select, Textarea } from "@/components/ui/input";
import { Card, CardBody, CardHeader } from "@/components/ui/card";

const CURRENCIES = ["INR", "USD", "EUR", "GBP", "AED", "SGD"];
const TIMEZONES = [
  "Asia/Kolkata",
  "UTC",
  "America/New_York",
  "America/Los_Angeles",
  "Europe/London",
  "Europe/Paris",
  "Asia/Dubai",
  "Asia/Singapore",
];

export function SettingsForm({ org, readOnly }: { org: any; readOnly?: boolean }) {
  const [form, setForm] = useState({
    name: org?.name ?? "",
    email: org?.email ?? "",
    phone: org?.phone ?? "",
    address: org?.address ?? "",
    city: org?.city ?? "",
    state: org?.state ?? "",
    country: org?.country ?? "India",
    pincode: org?.pincode ?? "",
    gstin: org?.gstin ?? "",
    pan: org?.pan ?? "",
    currency: org?.currency ?? "INR",
    timezone: org?.timezone ?? "Asia/Kolkata",
    invoicePrefix: org?.invoicePrefix ?? "INV",
  });

  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);

  function set(key: string, val: string) {
    setForm((prev) => ({ ...prev, [key]: val }));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setMessage(null);
    setLoading(true);
    try {
      const res = await fetch("/api/settings", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const json = await res.json();
      if (!res.ok) {
        setMessage({ type: "error", text: json.error ?? "Failed to save" });
        return;
      }
      setMessage({ type: "success", text: "Settings saved successfully!" });
    } catch {
      setMessage({ type: "error", text: "Something went wrong" });
    } finally {
      setLoading(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {message && (
        <div className={`p-3 rounded-lg text-sm border ${
          message.type === "success"
            ? "bg-green-50 border-green-200 text-green-800"
            : "bg-red-50 border-red-200 text-red-700"
        }`}>
          {message.text}
        </div>
      )}

      <Card>
        <CardHeader><h2 className="font-semibold text-gray-900">Business Information</h2></CardHeader>
        <CardBody className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Input
            label="Organization Name *"
            required
            value={form.name}
            onChange={(e) => set("name", e.target.value)}
            disabled={readOnly}
          />
          <Input
            label="Business Email"
            type="email"
            value={form.email}
            onChange={(e) => set("email", e.target.value)}
            disabled={readOnly}
          />
          <Input
            label="Phone"
            value={form.phone}
            onChange={(e) => set("phone", e.target.value)}
            disabled={readOnly}
          />
          <Input
            label="GSTIN"
            value={form.gstin}
            onChange={(e) => set("gstin", e.target.value.toUpperCase())}
            placeholder="22AAAAA0000A1Z5"
            disabled={readOnly}
          />
          <Input
            label="PAN"
            value={form.pan}
            onChange={(e) => set("pan", e.target.value.toUpperCase())}
            placeholder="AAAAA0000A"
            disabled={readOnly}
          />
        </CardBody>
      </Card>

      <Card>
        <CardHeader><h2 className="font-semibold text-gray-900">Address</h2></CardHeader>
        <CardBody className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="md:col-span-2">
            <Input
              label="Street Address"
              value={form.address}
              onChange={(e) => set("address", e.target.value)}
              disabled={readOnly}
            />
          </div>
          <Input label="City" value={form.city} onChange={(e) => set("city", e.target.value)} disabled={readOnly} />
          <Input label="State" value={form.state} onChange={(e) => set("state", e.target.value)} disabled={readOnly} />
          <Input label="Country" value={form.country} onChange={(e) => set("country", e.target.value)} disabled={readOnly} />
          <Input label="Pincode" value={form.pincode} onChange={(e) => set("pincode", e.target.value)} disabled={readOnly} />
        </CardBody>
      </Card>

      <Card>
        <CardHeader><h2 className="font-semibold text-gray-900">Invoice Preferences</h2></CardHeader>
        <CardBody className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Input
            label="Invoice Prefix"
            value={form.invoicePrefix}
            onChange={(e) => set("invoicePrefix", e.target.value.toUpperCase())}
            placeholder="INV"
            hint="e.g. INV → INV-00001"
            disabled={readOnly}
          />
          <Select label="Default Currency" value={form.currency} onChange={(e) => set("currency", e.target.value)} disabled={readOnly}>
            {CURRENCIES.map((c) => <option key={c}>{c}</option>)}
          </Select>
          <Select label="Timezone" value={form.timezone} onChange={(e) => set("timezone", e.target.value)} disabled={readOnly}>
            {TIMEZONES.map((tz) => <option key={tz}>{tz}</option>)}
          </Select>
        </CardBody>
      </Card>

      {!readOnly && (
        <div className="flex justify-end">
          <Button type="submit" isLoading={loading}>Save Settings</Button>
        </div>
      )}
    </form>
  );
}
