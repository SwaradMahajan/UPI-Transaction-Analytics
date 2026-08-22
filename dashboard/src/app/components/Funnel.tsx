import { ArrowRight, Lightbulb, TrendingDown, TrendingUp } from "lucide-react";
import { Card, SectionHeading } from "./primitives";
import { SimulationResult } from "./simulationEngine";

interface FunnelProps {
  result: SimulationResult;
}

export function Funnel({ result }: FunnelProps) {
  return (
    <Card className="p-6" elevated>
      <SectionHeading
        title="MDR Rejection → User Outcome Funnel"
        subtitle="What happens to users after a merchant rejects their Slice Credit Card payment"
      />

      <div className="grid grid-cols-1 items-stretch gap-4 lg:grid-cols-[220px_48px_1fr]">
        {/* Step 1: Entry point */}
        <div className="flex flex-col justify-center rounded-xl border border-magenta/30 bg-gradient-to-br from-magenta/[0.14] to-primary/[0.06] p-6 text-center">
          <div className="text-[0.6875rem] uppercase tracking-[0.14em] text-magenta">
            Entry Point
          </div>
          <div className="mt-2 text-[3rem] font-bold leading-none tracking-tight text-foreground" style={{ fontSize: "3rem", fontVariantNumeric: "tabular-nums" }}>
            {result.mdrCount.toLocaleString()}
          </div>
          <div className="mt-2 text-[0.8125rem] text-muted-foreground">MDR Rejections</div>
        </div>

        {/* Connector */}
        <div className="hidden items-center justify-center lg:flex">
          <div className="grid size-9 place-items-center rounded-full border border-border bg-card text-muted-foreground">
            <ArrowRight className="size-4" />
          </div>
        </div>

        {/* Split paths */}
        <div className="flex flex-col gap-4">
          {/* Churned — larger, prominent */}
          <div className="relative overflow-hidden rounded-xl border border-danger/35 bg-danger/[0.08] p-5">
            <div className="pointer-events-none absolute -right-6 -top-6 size-24 rounded-full bg-danger/20 blur-2xl" />
            <div className="flex items-center justify-between">
              <div>
                <div className="flex items-center gap-2 text-danger">
                  <TrendingDown className="size-4" />
                  <span className="text-[0.6875rem] font-semibold uppercase tracking-[0.14em]">
                    Churned Path
                  </span>
                </div>
                <div className="mt-3 flex items-baseline gap-3">
                  <span className="text-[2.75rem] font-bold leading-none tracking-tight text-foreground" style={{ fontSize: "2.75rem", fontVariantNumeric: "tabular-nums" }}>
                    {result.churnedCount.toLocaleString()}
                  </span>
                  <span className="text-[1.5rem] font-semibold text-danger" style={{ fontVariantNumeric: "tabular-nums" }}>
                    {result.churnRate}%
                  </span>
                </div>
                <p className="mt-1.5 text-[0.8125rem] text-foreground/80">
                  Abandoned the app within 5 minutes without completing payment
                </p>
              </div>
            </div>
            <div className="mt-4 h-2 w-full overflow-hidden rounded-full bg-white/[0.06]">
              <div className="h-full rounded-full bg-danger" style={{ width: `${result.churnRate}%` }} />
            </div>
          </div>

          {/* Retained — smaller */}
          <div className="rounded-xl border border-success/30 bg-success/[0.07] p-5">
            <div className="flex items-center justify-between">
              <div>
                <div className="flex items-center gap-2 text-success">
                  <TrendingUp className="size-4" />
                  <span className="text-[0.6875rem] font-semibold uppercase tracking-[0.14em]">
                    Retained Path
                  </span>
                </div>
                <div className="mt-2 flex items-baseline gap-3">
                  <span className="text-[1.75rem] font-bold leading-none tracking-tight text-foreground" style={{ fontVariantNumeric: "tabular-nums" }}>
                    {result.retainedCount.toLocaleString()}
                  </span>
                  <span className="text-[1.125rem] font-semibold text-success" style={{ fontVariantNumeric: "tabular-nums" }}>
                    {result.retentionRate}%
                  </span>
                </div>
                <p className="mt-1 text-[0.8125rem] text-muted-foreground">
                  Retried successfully using Slice Savings within 5 minutes
                </p>
              </div>
            </div>
            <div className="mt-3 h-2 w-full overflow-hidden rounded-full bg-white/[0.06]">
              <div className="h-full rounded-full bg-success" style={{ width: `${result.retentionRate}%` }} />
            </div>
          </div>
        </div>
      </div>

      {/* Insight banner */}
      <div className="mt-6 flex items-start gap-3 rounded-xl border border-primary/25 bg-primary/[0.07] p-4">
        <div className="grid size-8 shrink-0 place-items-center rounded-lg bg-primary/20 text-primary">
          <Lightbulb className="size-4" />
        </div>
        <p className="text-[0.875rem] leading-relaxed text-foreground/90">
          The biggest product opportunity is immediately after a merchant rejects Slice CC.
          Currently, <span className="font-semibold text-primary">{result.retentionRate}%</span> of users
          discover the Slice Savings workaround organically, while <span className="font-semibold text-danger">{result.churnRate}%</span> drop off.
        </p>
      </div>
    </Card>
  );
}
