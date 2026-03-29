"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input, Select, Textarea } from "@/components/ui/input";
import { Card, CardBody, CardHeader } from "@/components/ui/card";

const INDIAN_STATES = [
  "Andhra Pradesh","Arunachal Pradesh","Assam","Bihar","Chhattisgarh","Goa","Gujarat",
  "Haryana","Himachal Pradesh","Jharkhand","Karnataka","Kerala","Madhya Pradesh",
  "Maharashtra","Manipur","Meghalaya","Mizoram","Nagaland","Odisha","Punjab",
  "Rajasthan","Sikkim","Tamil Nadu","Telangana","Tripura","Uttar Pradesh",
  "Uttarakhand","West Bengal","Delhi","Jammu & Kashmir","Ladakh",
];

interface CustomerFormProps {
  customer?: any;
}

export function CustomerForm({ customer }: CustomerFormProps) {
  const router = useRouter();
  const isEdit = !!customer;

  const [form, setForm] = useState({
    displayName: customer?.displayName ?? "",
    companyName: customer?.companyName ?? "",
    email: customer?.email ?? "",
    phone: customer?.phone ?? "",
    website: customer?.website ?? "",
    gstin: customer?.gstin ?? "",
    pan: customer?.pan ?? "",
    billingAddress: customer?.billingAddress ?? "",
    billingCity: customer?.billingCity ?? "",
    billingState: customer?.billingState ?? "",
    billingCountry: customer?.billingCountry ?? "India",
    billingPincode: customer?.billingPincode ?? "",
    shippingAddress: customer?.shippingAddress ?? "",
    shippingCity: customer?.shippingCity ?? "",
    shippingState: customer?.shippingState ?? "",
    shippingCountry: customer?.shippingCountry ?? "",
    shippingPincode: customer?.shippingPincode ?? "",
    notes: customer?.notes ?? "",
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [copyBilling, setCopyBilling] = useState(false);

  function set(key: string, val: string) {
    setForm((prev) => ({ ...prev, [key]: val }));
  }

  function handleCopyBilling(checked: boolean) {
    setCopyBilling(checked);
    if (checked) {
      setForm((prev) => ({
        ...prev,
        shippingAddress: prev.billingAddress,
        shippingCity: prev.billingCity,
        shippingState: prev.billingState,
        shippingCountry: prev.billingCountry,
        shippingPincode: prev.billingPincode,
      }));
    }
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const url = isEdit ? `/api/customers/${customer.id}` : "/api/customers";
      const method = isEdit ? "PUT" : "POST";
      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const json = await res.json();
      if (!res.ok) {
        setError(json.error ?? "Failed to save");
        return;
      }
      router.push("/customers");
      router.refresh();
    } catch {
      setError("Something went wrong");
    } finally {
      setLoading(false);
    }
  }

  async function handleDelete() {
    if (!confirm("Archive this customer?")) return;
    setLoading(true);
    await fetch(`/api/customers/${customer.id}`, { method: "DELETE" });
    router.push("/customers");
    router.refresh();
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {error && (
        <div className="p-3 bg-red-50 border border-red-200 rounded-lg text-sm text-red-700">{error}</div>
      )}

      {/* Basic Info */}
      <Card>
        <CardHeader>
          <h2 className="font-semibold text-gray-900">Basic Information</h2>
        </CardHeader>
        <CardBody className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Input
            label="Display Name *"
            required
            value={form.displayName}
            onChange={(e) => set("displayName", e.target.value)}
          />
          <Input
            label="Company Name"
            value={form.companyName}
            onChange={(e) => set("companyName", e.target.value)}
          />
          <Input
            label="Email"
            type="email"
            value={form.email}
            onChange={(e) => set("email", e.target.value)}
          />
          <Input
            label="Phone"
            type="tel"
            value={form.phone}
            onChange={(e) => set("phone", e.target.value)}
          />
          <Input
            label="Website"
            type="url"
            value={form.website}
            onChange={(e) => set("website", e.target.value)}
          />
        </CardBody>
      </Card>

      {/* Tax Info */}
      <Card>
        <CardHeader>
          <h2 className="font-semibold text-gray-900">Tax Information</h2>
        </CardHeader>
        <CardBody className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Input
            label="GSTIN"
            value={form.gstin}
            onChange={(e) => set("gstin", e.target.value.toUpperCase())}
            placeholder="22AAAAA0000A1Z5"
          />
          <Input
            label="PAN"
            value={form.pan}
            onChange={(e) => set("pan", e.target.value.toUpperCase())}
            placeholder="AAAAA0000A"
          />
        </CardBody>
      </Card>

      {/* Billing Address */}
      <Card>
        <CardHeader>
          <h2 className="font-semibold text-gray-900">Billing Address</h2>
        </CardHeader>
        <CardBody className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="md:col-span-2">
            <Input
              label="Street Address"
              value={form.billingAddress}
              onChange={(e) => set("billingAddress", e.target.value)}
            />
          </div>
          <Input label="City" value={form.billingCity} onChange={(e) => set("billingCity", e.target.value)} />
          <Select label="State" value={form.billingState} onChange={(e) => set("billingState", e.target.value)}>
            <option value="">Select state</option>
            {INDIAN_STATES.map((s) => <option key={s}>{s}</option>)}
          </Select>
          <Input label="Pincode" value={form.billingPincode} onChange={(e) => set("billingPincode", e.target.value)} />
          <Input label="Country" value={form.billingCountry} onChange={(e) => set("billingCountry", e.target.value)} />
        </CardBody>
      </Card>

      {/* Shipping Address */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between w-full">
            <h2 className="font-semibold text-gray-900">Shipping Address</h2>
            <label className="flex items-center gap-2 text-sm text-gray-600 cursor-pointer">
              <input
                type="checkbox"
                checked={copyBilling}
                onChange={(e) => handleCopyBilling(e.target.checked)}
                className="rounded"
              />
              Same as billing
            </label>
          </div>
        </CardHeader>
        <CardBody className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="md:col-span-2">
            <Input
              label="Street Address"
              value={form.shippingAddress}
              onChange={(e) => set("shippingAddress", e.target.value)}
              disabled={copyBilling}
            />
          </div>
          <Input label="City" value={form.shippingCity} onChange={(e) => set("shippingCity", e.target.value)} disabled={copyBilling} />
          <Select label="State" value={form.shippingState} onChange={(e) => set("shippingState", e.target.value)} disabled={copyBilling}>
            <option value="">Select state</option>
            {INDIAN_STATES.map((s) => <option key={s}>{s}</option>)}
          </Select>
          <Input label="Pincode" value={form.shippingPincode} onChange={(e) => set("shippingPincode", e.target.value)} disabled={copyBilling} />
          <Input label="Country" value={form.shippingCountry} onChange={(e) => set("shippingCountry", e.target.value)} disabled={copyBilling} />
        </CardBody>
      </Card>

      {/* Notes */}
      <Card>
        <CardBody>
          <Textarea
            label="Notes"
            rows={3}
            value={form.notes}
            onChange={(e) => set("notes", e.target.value)}
            placeholder="Internal notes about this customer"
          />
        </CardBody>
      </Card>

      <div className="flex items-center justify-between">
        {isEdit && (
          <Button type="button" variant="danger" size="sm" onClick={handleDelete} isLoading={loading}>
            Archive Customer
          </Button>
        )}
        <div className="flex gap-3 ml-auto">
          <Button type="button" variant="outline" onClick={() => router.back()}>
            Cancel
          </Button>
          <Button type="submit" isLoading={loading}>
            {isEdit ? "Save Changes" : "Create Customer"}
          </Button>
        </div>
      </div>
    </form>
  );
}
