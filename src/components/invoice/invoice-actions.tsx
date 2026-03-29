"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Download, Ban, Mail, Printer } from "lucide-react";

interface InvoiceActionsProps {
  invoice: { id: string; status: string };
  canPay: boolean;
}

export function InvoiceActions({ invoice }: InvoiceActionsProps) {
  const router = useRouter();
  const [sending, setSending] = useState(false);
  const [voiding, setVoiding] = useState(false);

  async function handleSend() {
    setSending(true);
    try {
      const res = await fetch(`/api/invoices/${invoice.id}/send`, { method: "POST" });
      const json = await res.json();
      if (!res.ok) {
        alert(json.error ?? "Failed to send");
        return;
      }
      alert("Invoice sent successfully");
      router.refresh();
    } finally {
      setSending(false);
    }
  }

  async function handleVoid() {
    if (!confirm("Void this invoice?")) return;
    setVoiding(true);
    try {
      const res = await fetch(`/api/invoices/${invoice.id}`, { method: "DELETE" });
      if (!res.ok) {
        const json = await res.json();
        alert(json.error ?? "Failed to void");
        return;
      }
      router.refresh();
    } finally {
      setVoiding(false);
    }
  }

  const canVoid = !["PAID", "VOID", "CANCELLED"].includes(invoice.status);
  const canSend = !["VOID", "CANCELLED", "PAID"].includes(invoice.status);

  return (
    <div className="flex items-center gap-2">
      <a
        href={`/api/invoices/${invoice.id}/pdf`}
        target="_blank"
        rel="noreferrer"
        className="inline-flex items-center gap-1.5 rounded-2xl border border-[#d8cbb3] bg-white/70 px-4 py-2 text-sm font-medium text-[#274135] transition-all duration-300 hover:-translate-y-0.5 hover:bg-white"
      >
        <Download className="h-4 w-4" />
        PDF
      </a>
      <button
        onClick={() => window.print()}
        className="inline-flex items-center gap-1.5 rounded-2xl border border-[#d8cbb3] bg-white/70 px-4 py-2 text-sm font-medium text-[#5f665c] transition-all duration-300 hover:-translate-y-0.5 hover:bg-white"
        title="Print"
      >
        <Printer className="h-4 w-4" />
        Print
      </button>
      {canSend && (
        <Button variant="outline" size="sm" isLoading={sending} onClick={handleSend}>
          <Mail className="h-4 w-4" /> Send Email
        </Button>
      )}
      {canVoid && (
        <Button variant="danger" size="sm" isLoading={voiding} onClick={handleVoid}>
          <Ban className="h-4 w-4" /> Void
        </Button>
      )}
    </div>
  );
}
