"use client";
import { useLoading } from "@/components/providers/loading-provider";

export function GlobalLoader() {
  const { isLoading } = useLoading();

  return (
    <div
      aria-hidden={!isLoading}
      className={`fixed inset-0 z-[9999] flex flex-col items-center justify-center transition-opacity duration-300 ${
        isLoading ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
      }`}
      style={{
        background:
          "radial-gradient(circle at top left, rgba(91,154,245,0.18), transparent 38%), " +
          "radial-gradient(circle at bottom right, rgba(224,64,160,0.14), transparent 38%), " +
          "rgba(246,242,255,0.96)",
        backdropFilter: "blur(14px)",
        WebkitBackdropFilter: "blur(14px)",
      }}
    >
      {/* ── Gradient top progress bar with shimmer ── */}
      <div
        className="absolute left-0 right-0 top-0 h-[3px] overflow-hidden"
        style={{ background: "linear-gradient(90deg, #5B9AF5 0%, #7B4FD4 55%, #E040A0 100%)" }}
      >
        <div
          className="absolute inset-y-0 w-1/3 animate-loader-sweep"
          style={{
            background: "linear-gradient(90deg, transparent, rgba(255,255,255,0.55), transparent)",
          }}
        />
      </div>

      {/* ── Spinning gradient ring + logo ── */}
      <div className="relative flex items-center justify-center">
        {/* outer rotating gradient ring */}
        <div
          className="absolute h-[100px] w-[100px] animate-spin-slow rounded-full p-[3px]"
          style={{
            background: "linear-gradient(135deg, #5B9AF5 0%, #7B4FD4 50%, #E040A0 100%)",
          }}
        >
          <div
            className="h-full w-full rounded-full"
            style={{ background: "rgba(246,242,255,0.96)" }}
          />
        </div>

        {/* inner soft pulse ring */}
        <div
          className="absolute h-[84px] w-[84px] animate-ping rounded-full opacity-20"
          style={{
            background: "linear-gradient(135deg, #5B9AF5, #7B4FD4)",
            animationDuration: "1.6s",
          }}
        />

        {/* logo mark */}
        <div
          className="relative z-10 flex h-[62px] w-[62px] items-center justify-center rounded-[20px] shadow-[0_14px_40px_rgba(123,79,212,0.38)]"
          style={{
            background: "linear-gradient(135deg, #5B9AF5 0%, #7B4FD4 55%, #E040A0 100%)",
          }}
        >
          <span className="text-2xl font-black text-white">F</span>
        </div>
      </div>

      {/* ── Bouncing dots ── */}
      <div className="mt-10 flex items-center gap-[7px]">
        {[0, 1, 2].map((i) => (
          <span
            key={i}
            className="block h-2 w-2 animate-bounce rounded-full"
            style={{
              background: "linear-gradient(135deg, #5B9AF5, #7B4FD4)",
              animationDelay: `${i * 160}ms`,
              animationDuration: "900ms",
            }}
          />
        ))}
      </div>

      {/* ── Label ── */}
      <p
        className="mt-4 text-sm font-semibold tracking-wide"
        style={{
          background: "linear-gradient(135deg, #5B9AF5, #7B4FD4)",
          WebkitBackgroundClip: "text",
          WebkitTextFillColor: "transparent",
          backgroundClip: "text",
        }}
      >
        Loading…
      </p>
    </div>
  );
}
