"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input, Select, Textarea } from "@/components/ui/input";
import { Card, CardBody, CardHeader } from "@/components/ui/card";

const TAX_RATES = ["0", "5", "12", "18", "28"];
const UNITS = ["hrs", "days", "pcs", "kg", "g", "lt", "mt", "sqft", "nos", "box", "set"];

interface ItemFormProps {
  item?: any;
}

export function ItemForm({ item }: ItemFormProps) {
  const router = useRouter();
  const isEdit = !!item;

  const [form, setForm] = useState({
    name: item?.name ?? "",
    description: item?.description ?? "",
    type: item?.type ?? "SERVICE",
    sku: item?.sku ?? "",
    unit: item?.unit ?? "",
    rate: item?.rate != null ? String(item.rate) : "",
    taxRate: item?.taxRate != null ? String(item.taxRate) : "18",
    hsnSac: item?.hsnSac ?? "",
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
      const url = isEdit ? `/api/items/${item.id}` : "/api/items";
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
      router.push("/items");
      router.refresh();
    } catch {
      setError("Something went wrong");
    } finally {
      setLoading(false);
    }
  }

  async function handleDelete() {
    if (!confirm("Archive this item?")) return;
    setLoading(true);
    await fetch(`/api/items/${item.id}`, { method: "DELETE" });
    router.push("/items");
    router.refresh();
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6 max-w-2xl">
      {error && (
        <div className="p-3 bg-red-50 border border-red-200 rounded-lg text-sm text-red-700">{error}</div>
      )}

      <Card>
        <CardHeader>
          <h2 className="font-semibold text-gray-900">Item Details</h2>
        </CardHeader>
        <CardBody className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Input
              label="Item Name *"
              required
              value={form.name}
              onChange={(e) => set("name", e.target.value)}
              placeholder="e.g. Web Development"
            />
            <Select label="Type" value={form.type} onChange={(e) => set("type", e.target.value)}>
              <option value="SERVICE">Service</option>
              <option value="PRODUCT">Product</option>
            </Select>
          </div>

          <Textarea
            label="Description"
            rows={2}
            value={form.description}
            onChange={(e) => set("description", e.target.value)}
            placeholder="Brief description shown on invoices"
          />

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <Input label="SKU" value={form.sku} onChange={(e) => set("sku", e.target.value)} placeholder="SKU-001" />
            <Select label="Unit" value={form.unit} onChange={(e) => set("unit", e.target.value)}>
              <option value="">None</option>
              {UNITS.map((u) => <option key={u}>{u}</option>)}
            </Select>
            <Input
              label="HSN / SAC Code"
              value={form.hsnSac}
              onChange={(e) => set("hsnSac", e.target.value)}
              placeholder="998314"
            />
          </div>
        </CardBody>
      </Card>

      <Card>
        <CardHeader>
          <h2 className="font-semibold text-gray-900">Pricing & Tax</h2>
        </CardHeader>
        <CardBody className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Input
            label="Selling Rate (₹) *"
            type="number"
            required
            min="0"
            step="0.01"
            value={form.rate}
            onChange={(e) => set("rate", e.target.value)}
            placeholder="0.00"
          />
          <Select label="Tax Rate (GST %)" value={form.taxRate} onChange={(e) => set("taxRate", e.target.value)}>
            {TAX_RATES.map((r) => (
              <option key={r} value={r}>
                {r}% GST
              </option>
            ))}
          </Select>
        </CardBody>
      </Card>

      <div className="flex items-center justify-between">
        {isEdit && (
          <Button type="button" variant="danger" size="sm" onClick={handleDelete} isLoading={loading}>
            Archive Item
          </Button>
        )}
        <div className="flex gap-3 ml-auto">
          <Button type="button" variant="outline" onClick={() => router.back()}>Cancel</Button>
          <Button type="submit" isLoading={loading}>
            {isEdit ? "Save Changes" : "Create Item"}
          </Button>
        </div>
      </div>
    </form>
  );
}
