import { cn } from "@/lib/utils";

interface CardProps {
  children: React.ReactNode;
  className?: string;
}

export function Card({ children, className }: CardProps) {
  return <div className={cn("glass-panel rounded-[28px] animate-rise", className)}>{children}</div>;
}

export function CardHeader({ children, className }: CardProps) {
  return (
    <div className={cn("flex items-center justify-between border-b border-[#E5E2F5] px-6 py-5", className)}>
      {children}
    </div>
  );
}

export function CardBody({ children, className }: CardProps) {
  return <div className={cn("px-6 py-5", className)}>{children}</div>;
}

interface StatCardProps {
  title: string;
  value: string;
  subtitle?: string;
  icon?: React.ReactNode;
  trend?: "up" | "down" | "neutral";
  trendValue?: string;
}

export function StatCard({ title, value, subtitle, icon, trend, trendValue }: StatCardProps) {
  return (
    <Card>
      <CardBody className="flex items-start justify-between gap-4">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.24em] text-[#8B7FB0]">{title}</p>
          <p className="mt-2 text-3xl font-bold text-[#1E1847]">{value}</p>
          {subtitle && <p className="mt-1 text-xs text-[#6B6B8A]">{subtitle}</p>}
          {trendValue && (
            <p
              className={cn(
                "mt-2 text-xs font-medium",
                trend === "up" ? "text-emerald-600" : trend === "down" ? "text-red-500" : "text-[#6B6B8A]"
              )}
            >
              {trend === "up" ? "↑" : trend === "down" ? "↓" : "→"} {trendValue}
            </p>
          )}
        </div>
        {icon && (
          <div
            className="animate-glow rounded-[22px] p-4 text-white shadow-[0_12px_28px_rgba(123,79,212,0.24)]"
            style={{ background: "linear-gradient(135deg, #5B9AF5, #7B4FD4)" }}
          >
            {icon}
          </div>
        )}
      </CardBody>
    </Card>
  );
}
