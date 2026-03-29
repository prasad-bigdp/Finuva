import React from "react";
import { Buffer } from "node:buffer";
import {
  Document,
  Page,
  Text,
  View,
  StyleSheet,
  pdf,
} from "@react-pdf/renderer";
import { Invoice } from "@prisma/client";

type InvoiceForPdf = Invoice & {
  organization: {
    name: string;
    address: string | null;
    city: string | null;
    state: string | null;
    pincode: string | null;
    gstin: string | null;
    email: string | null;
    phone: string | null;
  };
  customer: {
    displayName: string;
    companyName: string | null;
    billingAddress: string | null;
    billingCity: string | null;
    billingState: string | null;
    billingPincode: string | null;
    gstin: string | null;
    email: string | null;
    phone: string | null;
  };
  items: Array<{
    id: string;
    name: string;
    description: string | null;
    quantity: unknown;
    unit: string | null;
    rate: unknown;
    discount: unknown;
    taxRate: unknown;
    amount: unknown;
    hsnSac: string | null;
  }>;
};

const styles = StyleSheet.create({
  page: {
    padding: 32,
    fontSize: 10,
    color: "#172033",
    backgroundColor: "#f6f4ef",
  },
  shell: {
    borderRadius: 18,
    border: "1 solid #d8d1c3",
    backgroundColor: "#fffdf8",
    padding: 24,
  },
  row: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-between",
  },
  brandBlock: {
    marginBottom: 18,
    paddingBottom: 14,
    borderBottom: "1 solid #e8dfcf",
  },
  invoiceTitle: {
    fontSize: 26,
    color: "#0f3d30",
    fontWeight: 700,
    letterSpacing: 1.2,
  },
  orgName: {
    fontSize: 18,
    fontWeight: 700,
    marginBottom: 6,
  },
  muted: {
    color: "#5d6678",
  },
  sectionTitle: {
    fontSize: 9,
    textTransform: "uppercase",
    letterSpacing: 1,
    color: "#7b6e58",
    marginBottom: 6,
  },
  cardGrid: {
    display: "flex",
    flexDirection: "row",
    gap: 12,
    marginVertical: 18,
  },
  infoCard: {
    flex: 1,
    padding: 12,
    borderRadius: 12,
    backgroundColor: "#f0ece1",
  },
  tableHead: {
    display: "flex",
    flexDirection: "row",
    backgroundColor: "#123524",
    color: "#f7f5ee",
    borderRadius: 8,
    paddingVertical: 8,
    paddingHorizontal: 10,
    marginTop: 12,
  },
  tableRow: {
    display: "flex",
    flexDirection: "row",
    borderBottom: "1 solid #ece4d5",
    paddingVertical: 10,
    paddingHorizontal: 10,
  },
  colItem: { width: "33%" },
  colHsn: { width: "13%" },
  colQty: { width: "10%", textAlign: "right" },
  colRate: { width: "12%", textAlign: "right" },
  colTax: { width: "10%", textAlign: "right" },
  colAmount: { width: "22%", textAlign: "right" },
  totalsWrap: {
    width: 220,
    marginLeft: "auto",
    marginTop: 16,
  },
  totalRow: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-between",
    paddingVertical: 4,
  },
  grandTotal: {
    marginTop: 8,
    paddingTop: 8,
    borderTop: "1 solid #d7cebf",
    fontSize: 12,
    fontWeight: 700,
  },
  footer: {
    marginTop: 20,
    paddingTop: 14,
    borderTop: "1 solid #e8dfcf",
  },
});

function money(value: unknown) {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    minimumFractionDigits: 2,
  }).format(Number(value ?? 0));
}

function formatDate(date: Date | string) {
  return new Intl.DateTimeFormat("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  }).format(new Date(date));
}

function InvoicePdfDocument({ invoice }: { invoice: InvoiceForPdf }) {
  return (
    <Document>
      <Page size="A4" style={styles.page}>
        <View style={styles.shell}>
          <View style={[styles.row, styles.brandBlock]}>
            <View>
              <Text style={styles.orgName}>{invoice.organization.name}</Text>
              {invoice.organization.address && <Text style={styles.muted}>{invoice.organization.address}</Text>}
              {(invoice.organization.city || invoice.organization.state || invoice.organization.pincode) && (
                <Text style={styles.muted}>
                  {[invoice.organization.city, invoice.organization.state, invoice.organization.pincode]
                    .filter(Boolean)
                    .join(", ")}
                </Text>
              )}
              {invoice.organization.gstin && <Text style={styles.muted}>GSTIN: {invoice.organization.gstin}</Text>}
            </View>
            <View>
              <Text style={styles.invoiceTitle}>INVOICE</Text>
              <Text style={styles.muted}>{invoice.invoiceNumber}</Text>
              <Text style={styles.muted}>Issued: {formatDate(invoice.issueDate)}</Text>
              <Text style={styles.muted}>Due: {formatDate(invoice.dueDate)}</Text>
            </View>
          </View>

          <View style={styles.cardGrid}>
            <View style={styles.infoCard}>
              <Text style={styles.sectionTitle}>Bill To</Text>
              <Text>{invoice.customer.displayName}</Text>
              {invoice.customer.companyName && <Text style={styles.muted}>{invoice.customer.companyName}</Text>}
              {invoice.customer.billingAddress && <Text style={styles.muted}>{invoice.customer.billingAddress}</Text>}
              {(invoice.customer.billingCity || invoice.customer.billingState || invoice.customer.billingPincode) && (
                <Text style={styles.muted}>
                  {[invoice.customer.billingCity, invoice.customer.billingState, invoice.customer.billingPincode]
                    .filter(Boolean)
                    .join(", ")}
                </Text>
              )}
              {invoice.customer.gstin && <Text style={styles.muted}>GSTIN: {invoice.customer.gstin}</Text>}
            </View>
            <View style={styles.infoCard}>
              <Text style={styles.sectionTitle}>Summary</Text>
              <Text>Status: {invoice.status.replace(/_/g, " ")}</Text>
              <Text>Subtotal: {money(invoice.subtotal)}</Text>
              <Text>Total Tax: {money(invoice.totalTax)}</Text>
              <Text>Paid: {money(invoice.amountPaid)}</Text>
              <Text>Balance Due: {money(invoice.balanceDue)}</Text>
            </View>
          </View>

          <View style={styles.tableHead}>
            <Text style={styles.colItem}>Item</Text>
            <Text style={styles.colHsn}>HSN/SAC</Text>
            <Text style={styles.colQty}>Qty</Text>
            <Text style={styles.colRate}>Rate</Text>
            <Text style={styles.colTax}>GST%</Text>
            <Text style={styles.colAmount}>Amount</Text>
          </View>
          {invoice.items.map((item) => (
            <View style={styles.tableRow} key={item.id}>
              <View style={styles.colItem}>
                <Text>{item.name}</Text>
                {item.description && <Text style={styles.muted}>{item.description}</Text>}
              </View>
              <Text style={styles.colHsn}>{item.hsnSac ?? "-"}</Text>
              <Text style={styles.colQty}>
                {Number(item.quantity)} {item.unit ?? ""}
              </Text>
              <Text style={styles.colRate}>{money(item.rate)}</Text>
              <Text style={styles.colTax}>{Number(item.taxRate)}%</Text>
              <Text style={styles.colAmount}>{money(item.amount)}</Text>
            </View>
          ))}

          <View style={styles.totalsWrap}>
            <View style={styles.totalRow}>
              <Text style={styles.muted}>Subtotal</Text>
              <Text>{money(invoice.subtotal)}</Text>
            </View>
            <View style={styles.totalRow}>
              <Text style={styles.muted}>Discount</Text>
              <Text>{money(invoice.discountAmount)}</Text>
            </View>
            <View style={styles.totalRow}>
              <Text style={styles.muted}>CGST</Text>
              <Text>{money(invoice.cgst)}</Text>
            </View>
            <View style={styles.totalRow}>
              <Text style={styles.muted}>SGST</Text>
              <Text>{money(invoice.sgst)}</Text>
            </View>
            <View style={styles.totalRow}>
              <Text style={styles.muted}>IGST</Text>
              <Text>{money(invoice.igst)}</Text>
            </View>
            <View style={[styles.totalRow, styles.grandTotal]}>
              <Text>Total</Text>
              <Text>{money(invoice.total)}</Text>
            </View>
          </View>

          <View style={styles.footer}>
            {invoice.notes && (
              <>
                <Text style={styles.sectionTitle}>Notes</Text>
                <Text style={styles.muted}>{invoice.notes}</Text>
              </>
            )}
            {invoice.terms && (
              <>
                <Text style={[styles.sectionTitle, { marginTop: 10 }]}>Terms</Text>
                <Text style={styles.muted}>{invoice.terms}</Text>
              </>
            )}
          </View>
        </View>
      </Page>
    </Document>
  );
}

export async function renderInvoicePdf(invoice: InvoiceForPdf) {
  const instance = pdf(<InvoicePdfDocument invoice={invoice} />);
  const stream = await instance.toBuffer();
  const chunks: Buffer[] = [];

  for await (const chunk of stream as AsyncIterable<Uint8Array>) {
    chunks.push(Buffer.from(chunk));
  }

  return Buffer.concat(chunks);
}
