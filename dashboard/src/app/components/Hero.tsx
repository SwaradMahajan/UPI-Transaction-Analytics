import { AlertTriangle } from "lucide-react";

export function Hero() {
  return (
    <section className="grid grid-cols-1 items-stretch gap-6 lg:grid-cols-[1fr_360px]">
      <div className="flex flex-col justify-center">
        <div className="mb-3 inline-flex w-fit items-center gap-2 rounded-full border border-border bg-white/[0.03] px-3 py-1 text-[0.6875rem] tracking-wide text-muted-foreground">
          <span className="size-1.5 rounded-full bg-success" />
          Live · Synced 4 min ago
        </div>
        <h1 className="text-[2.5rem] font-bold leading-[1.1] tracking-tight text-foreground" style={{ fontSize: "2.5rem" }}>
          UPI Payment Health
        </h1>
        <p className="mt-3 max-w-xl text-[0.9375rem] leading-relaxed text-muted-foreground">
          Monitor transaction failures, merchant MDR rejections, and their impact
          on user retention.
        </p>
      </div>

      {/* Critical insight card */}
      <div className="relative overflow-hidden rounded-2xl border border-danger/30 bg-gradient-to-br from-danger/[0.14] to-magenta/[0.06] p-6">
        <div className="pointer-events-none absolute -right-8 -top-8 size-32 rounded-full bg-danger/20 blur-2xl" />
        <div className="flex items-center gap-2">
          <div className="grid size-8 place-items-center rounded-lg bg-danger/20 text-danger">
            <AlertTriangle className="size-4" />
          </div>
          <span className="text-[0.6875rem] font-semibold uppercase tracking-[0.14em] text-danger">
            Critical Insight
          </span>
        </div>
        <div className="mt-4 text-[3rem] font-bold leading-none tracking-tight text-foreground" style={{ fontSize: "3rem", fontVariantNumeric: "tabular-nums" }}>
          62.8%
        </div>
        <p className="mt-2 text-[0.8125rem] leading-snug text-foreground/80">
          Users abandon within 5 minutes after an MDR rejection.
        </p>
        <p className="mt-3 border-t border-white/10 pt-3 text-[0.75rem] leading-snug text-muted-foreground">
          Merchant-initiated failures have the highest downstream churn impact.
        </p>
      </div>
    </section>
  );
}
