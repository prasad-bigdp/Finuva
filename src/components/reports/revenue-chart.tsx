"use client";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

interface RevenueChartProps {
  data: { month: string; revenue: number }[];
}

function formatAmount(v: number) {
  if (v >= 100000) return `₹${(v / 100000).toFixed(1)}L`;
  if (v >= 1000) return `₹${(v / 1000).toFixed(0)}K`;
  return `₹${v}`;
}

export function RevenueChart({ data }: RevenueChartProps) {
  if (!data || data.length === 0) {
    return (
      <div className="h-48 flex items-center justify-center text-gray-400 text-sm">
        No revenue data yet. Record payments to see your chart.
      </div>
    );
  }

  return (
    <div className="h-64">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={data} margin={{ top: 4, right: 16, left: 0, bottom: 0 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#f3f4f6" />
          <XAxis dataKey="month" tick={{ fontSize: 12, fill: "#9ca3af" }} />
          <YAxis tickFormatter={formatAmount} tick={{ fontSize: 12, fill: "#9ca3af" }} width={56} />
          <Tooltip
            formatter={(v: number) =>
              new Intl.NumberFormat("en-IN", { style: "currency", currency: "INR" }).format(v)
            }
            contentStyle={{ border: "1px solid #e5e7eb", borderRadius: 8, fontSize: 12 }}
          />
          <Bar dataKey="revenue" fill="#2563eb" radius={[4, 4, 0, 0]} name="Revenue" />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
