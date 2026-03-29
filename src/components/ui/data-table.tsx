"use client";
import { cn } from "@/lib/utils";

interface Column<T> {
  key: keyof T | string;
  header: string;
  render?: (row: T) => React.ReactNode;
  className?: string;
}

interface DataTableProps<T> {
  columns: Column<T>[];
  data: T[];
  emptyMessage?: string;
  onRowClick?: (row: T) => void;
}

export function DataTable<T extends Record<string, any>>({
  columns,
  data,
  emptyMessage = "No records found.",
  onRowClick,
}: DataTableProps<T>) {
  return (
    <div className="overflow-x-auto">
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b border-gray-200 bg-gray-50">
            {columns.map((col) => (
              <th
                key={String(col.key)}
                className={cn(
                  "px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider",
                  col.className
                )}
              >
                {col.header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-100">
          {data.length === 0 ? (
            <tr>
              <td
                colSpan={columns.length}
                className="px-4 py-12 text-center text-gray-500"
              >
                {emptyMessage}
              </td>
            </tr>
          ) : (
            data.map((row, i) => (
              <tr
                key={i}
                onClick={() => onRowClick?.(row)}
                className={cn(
                  "hover:bg-gray-50 transition-colors",
                  onRowClick && "cursor-pointer"
                )}
              >
                {columns.map((col) => (
                  <td
                    key={String(col.key)}
                    className={cn("px-4 py-3 text-gray-700", col.className)}
                  >
                    {col.render
                      ? col.render(row)
                      : (row[col.key as string] as React.ReactNode)}
                  </td>
                ))}
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
}

// ─── Pagination ───────────────────────────────────────────────────────────────
interface PaginationProps {
  page: number;
  total: number;
  limit: number;
  onChange: (page: number) => void;
}

export function Pagination({ page, total, limit, onChange }: PaginationProps) {
  const totalPages = Math.ceil(total / limit);
  if (totalPages <= 1) return null;

  return (
    <div className="flex items-center justify-between px-4 py-3 border-t border-gray-200">
      <p className="text-sm text-gray-500">
        Showing {(page - 1) * limit + 1}–{Math.min(page * limit, total)} of {total}
      </p>
      <div className="flex gap-1">
        <button
          onClick={() => onChange(page - 1)}
          disabled={page <= 1}
          className="px-3 py-1.5 rounded-lg text-sm text-gray-600 hover:bg-gray-100 disabled:opacity-40"
        >
          ←
        </button>
        {Array.from({ length: Math.min(totalPages, 5) }, (_, i) => {
          const p = i + 1;
          return (
            <button
              key={p}
              onClick={() => onChange(p)}
              className={cn(
                "px-3 py-1.5 rounded-lg text-sm",
                p === page
                  ? "bg-blue-600 text-white"
                  : "text-gray-600 hover:bg-gray-100"
              )}
            >
              {p}
            </button>
          );
        })}
        <button
          onClick={() => onChange(page + 1)}
          disabled={page >= totalPages}
          className="px-3 py-1.5 rounded-lg text-sm text-gray-600 hover:bg-gray-100 disabled:opacity-40"
        >
          →
        </button>
      </div>
    </div>
  );
}
