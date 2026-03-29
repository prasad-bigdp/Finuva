"use client";
import { Bell } from "lucide-react";

interface TopbarProps {
  title: string;
  userName?: string;
  actions?: React.ReactNode;
}

export function Topbar({ title, userName, actions }: TopbarProps) {
  return (
    <header className="sticky top-0 z-40 mx-3 mt-3 flex h-20 items-center justify-between rounded-[28px] border border-white/60 bg-[rgba(253,251,255,0.86)] px-6 shadow-[0_18px_50px_rgba(58,28,113,0.07)] backdrop-blur-xl lg:mx-6">
      <div>
        <p className="text-[11px] uppercase tracking-[0.32em] text-[#8B7FB0]">Finuva</p>
        <h1 className="text-3xl font-bold leading-none text-[#1E1847]">{title}</h1>
      </div>
      <div className="flex items-center gap-3">
        {actions}
        <button className="flex h-11 w-11 items-center justify-center rounded-2xl border border-[#E5E2F5] bg-white/70 text-[#8B7FB0] transition hover:-translate-y-0.5 hover:text-[#7B4FD4]">
          <Bell className="h-5 w-5" />
        </button>
        <div
          className="flex h-11 w-11 items-center justify-center rounded-2xl text-sm font-bold text-white shadow-[0_10px_30px_rgba(123,79,212,0.28)]"
          style={{ background: "linear-gradient(135deg, #5B9AF5, #7B4FD4)" }}
        >
          {userName?.[0]?.toUpperCase() ?? "U"}
        </div>
      </div>
    </header>
  );
}
