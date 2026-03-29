import { cn } from "@/lib/utils";
import { ButtonHTMLAttributes, forwardRef } from "react";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "ghost" | "danger" | "outline";
  size?: "sm" | "md" | "lg";
  isLoading?: boolean;
}

const variants = {
  primary:
    "bg-[#7B4FD4] text-white hover:bg-[#6A3FBB] focus:ring-[#7B4FD4] shadow-[0_12px_26px_rgba(123,79,212,0.28)]",
  secondary: "bg-[#EDE8FF] text-[#1E1847] hover:bg-[#E0D8FF] focus:ring-[#C9ADFF]",
  ghost: "bg-transparent text-[#6B6B8A] hover:bg-[#EDE8FF] hover:text-[#7B4FD4] focus:ring-[#C9ADFF]",
  danger: "bg-[#E02D5B] text-white hover:bg-[#C0234D] focus:ring-[#E02D5B]",
  outline: "border border-[#C9ADFF] bg-white/60 text-[#7B4FD4] hover:bg-[#F3EEFF] focus:ring-[#C9ADFF]",
};

const sizes = {
  sm: "px-3 py-1.5 text-sm",
  md: "px-4 py-2 text-sm",
  lg: "px-6 py-3 text-base",
};

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = "primary", size = "md", isLoading, disabled, children, ...props }, ref) => (
    <button
      ref={ref}
      disabled={disabled || isLoading}
      className={cn(
        "inline-flex items-center justify-center gap-2 rounded-2xl font-semibold",
        "transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-offset-2 hover:-translate-y-0.5",
        "disabled:cursor-not-allowed disabled:opacity-60",
        variants[variant],
        sizes[size],
        className
      )}
      {...props}
    >
      {isLoading && (
        <svg className="h-4 w-4 animate-spin" viewBox="0 0 24 24" fill="none">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" />
        </svg>
      )}
      {children}
    </button>
  )
);
Button.displayName = "Button";
