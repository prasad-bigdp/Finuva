import { cn } from "@/lib/utils";
import { InputHTMLAttributes, forwardRef } from "react";

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  hint?: string;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ className, label, error, hint, id, ...props }, ref) => {
    const inputId = id ?? label?.toLowerCase().replace(/\s+/g, "-");
    return (
      <div className="space-y-1">
        {label && (
          <label htmlFor={inputId} className="block text-sm font-medium text-[#1E1847]">
            {label}
          </label>
        )}
        <input
          ref={ref}
          id={inputId}
          className={cn(
            "block w-full rounded-2xl border border-[#D8D0F0] bg-white/70 px-4 py-3 text-sm shadow-sm",
            "placeholder:text-[#A09BBF]",
            "focus:border-[#7B4FD4] focus:outline-none focus:ring-2 focus:ring-[#7B4FD4]/15",
            "disabled:bg-[#F3EEFF] disabled:text-[#A09BBF]",
            error && "border-red-500 focus:border-red-500 focus:ring-red-500/15",
            className
          )}
          {...props}
        />
        {error && <p className="text-xs text-red-600">{error}</p>}
        {hint && !error && <p className="text-xs text-[#8B7FB0]">{hint}</p>}
      </div>
    );
  }
);
Input.displayName = "Input";

interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  label?: string;
  error?: string;
  children: React.ReactNode;
}

export const Select = forwardRef<HTMLSelectElement, SelectProps>(
  ({ className, label, error, id, children, ...props }, ref) => {
    const selectId = id ?? label?.toLowerCase().replace(/\s+/g, "-");
    return (
      <div className="space-y-1">
        {label && (
          <label htmlFor={selectId} className="block text-sm font-medium text-[#1E1847]">
            {label}
          </label>
        )}
        <select
          ref={ref}
          id={selectId}
          className={cn(
            "block w-full rounded-2xl border border-[#D8D0F0] bg-white/70 px-4 py-3 text-sm shadow-sm",
            "focus:border-[#7B4FD4] focus:outline-none focus:ring-2 focus:ring-[#7B4FD4]/15",
            "disabled:bg-[#F3EEFF]",
            error && "border-red-500",
            className
          )}
          {...props}
        >
          {children}
        </select>
        {error && <p className="text-xs text-red-600">{error}</p>}
      </div>
    );
  }
);
Select.displayName = "Select";

interface TextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
  error?: string;
}

export const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ className, label, error, id, ...props }, ref) => {
    const textareaId = id ?? label?.toLowerCase().replace(/\s+/g, "-");
    return (
      <div className="space-y-1">
        {label && (
          <label htmlFor={textareaId} className="block text-sm font-medium text-[#1E1847]">
            {label}
          </label>
        )}
        <textarea
          ref={ref}
          id={textareaId}
          className={cn(
            "block w-full rounded-2xl border border-[#D8D0F0] bg-white/70 px-4 py-3 text-sm shadow-sm",
            "focus:border-[#7B4FD4] focus:outline-none focus:ring-2 focus:ring-[#7B4FD4]/15",
            "resize-none disabled:bg-[#F3EEFF]",
            error && "border-red-500",
            className
          )}
          {...props}
        />
        {error && <p className="text-xs text-red-600">{error}</p>}
      </div>
    );
  }
);
Textarea.displayName = "Textarea";
