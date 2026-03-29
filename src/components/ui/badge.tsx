import { cn } from "@/lib/utils";

interface BadgeProps {
  children: React.ReactNode;
  variant?: "default" | "success" | "warning" | "danger" | "info" | "muted";
  className?: string;
}

const variants = {
  default: "bg-gray-100 text-gray-700",
  success: "bg-green-100 text-green-700",
  warning: "bg-orange-100 text-orange-700",
  danger: "bg-red-100 text-red-700",
  info: "bg-blue-100 text-blue-700",
  muted: "bg-gray-200 text-gray-500",
};

export function Badge({ children, variant = "default", className }: BadgeProps) {
  return (
    <span
      className={cn(
        "inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium",
        variants[variant],
        className
      )}
    >
      {children}
    </span>
  );
}

// Invoice status → badge variant mapping
export function InvoiceStatusBadge({ status }: { status: string }) {
  const map: Record<string, BadgeProps["variant"]> = {
    DRAFT: "muted",
    SENT: "info",
    VIEWED: "info",
    PARTIALLY_PAID: "warning",
    PAID: "success",
    OVERDUE: "danger",
    CANCELLED: "muted",
    VOID: "muted",
  };
  return <Badge variant={map[status] ?? "default"}>{status.replace(/_/g, " ")}</Badge>;
}
