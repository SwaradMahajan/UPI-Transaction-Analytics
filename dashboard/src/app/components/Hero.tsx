import { AlertTriangle, Sparkles } from "lucide-react";
import { SimulationResult } from "./simulationEngine";

interface HeroProps {
  result: SimulationResult;
}

export function Hero({ result }: HeroProps) {
  return (
    <section className="grid grid-cols-1 items-stretch gap-6 lg:grid-cols-[1fr_360px]">
      <div className="flex flex-col justify-center">
        <div className="mb-3 inline-flex w-fit items-center gap-2 rounded-full border border-border bg-card px-3 py-1 text-[0.6875rem] tracking-wide text-muted-foreground">
          <span className="size-1.5 rounded-full bg-success animate-pulse" />
          Live Simulation · Seed #{result.seed} · {result.totalTransactions.toLocaleString()} txns
        </div>
        <h1 className="text-[2.5rem] font-bold leading-[1.1] tracking-tight text-foreground" style={{ fontSize: "2.5rem" }}>
          UPI Payment Health
        </h1>
        <p className="mt-3 max-w-xl text-[0.9375rem] leading-relaxed text-muted-foreground">
          Monitor transaction failures, merchant MDR rejections, and quantify their real-time impact
          on user churn and retention.
        </p>
      </div>

      {/* Critical insight card */}
      <div className="rounded-[1.15rem] border border-danger/25 bg-danger/[0.08] p-6 backdrop-blur-xl shadow-[0_2px_4px_rgba(50,28,39,0.08),0_22px_48px_-26px_rgba(160,40,50,0.35)]">
        <div className="flex items-center gap-2">
          <div className="grid size-8 place-items-center rounded-lg bg-danger/20 text-danger">
            <AlertTriangle className="size-4" />
          </div>
          <span className="text-[0.6875rem] font-semibold uppercase tracking-[0.14em] text-danger">
            Critical Insight
          </span>
        </div>
        <div className="mt-4 text-[3rem] font-bold leading-none tracking-tight text-foreground" style={{ fontSize: "3rem", fontVariantNumeric: "tabular-nums" }}>
          {result.churnRate}%
        </div>
        <p className="mt-2 text-[0.8125rem] leading-snug text-foreground/80">
          Users ({result.churnedCount.toLocaleString()} out of {result.mdrCount.toLocaleString()}) abandon within 5 minutes after an MDR rejection.
        </p>
        <p className="mt-3 border-t border-danger/20 pt-3 text-[0.75rem] leading-snug text-muted-foreground">
          Merchant-initiated failures have the highest downstream churn impact ({result.mdrShareOfFailures}% of total failures).
        </p>
      </div>
    </section>
  );
}
