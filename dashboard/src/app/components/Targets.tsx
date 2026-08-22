import { Target, TrendingDown, TrendingUp } from "lucide-react";
import { Card } from "./primitives";
import { SimulationResult } from "./simulationEngine";

interface TargetsProps {
  result: SimulationResult;
}

export function Targets({ result }: TargetsProps) {
  const projectedUplift = Math.max(0, Number((70 - result.retentionRate).toFixed(1)));

  return (
    <div>
      <div className="mb-4 flex items-center gap-2">
        <h2 className="tracking-tight">Success Metrics</h2>
        <span className="rounded-full bg-white/[0.06] px-2.5 py-1 text-[0.6875rem] text-muted-foreground">
          4-Week Post-Launch Targets vs. Current Simulation
        </span>
      </div>

      <div className="grid grid-cols-1 gap-5 md:grid-cols-3">
        {/* Fallback Adoption */}
        <Card className="p-5" elevated>
          <div className="flex items-center justify-between">
            <span className="text-[0.8125rem] text-muted-foreground">Fallback Adoption</span>
            <Target className="size-4 text-primary" />
          </div>
          <div className="mt-4 flex items-baseline gap-2">
            <span className="text-[0.8125rem] text-muted-foreground">Baseline</span>
            <span className="text-[1.125rem] font-semibold text-foreground">N/A</span>
          </div>
          <div className="mt-4">
            <div className="mb-1.5 flex justify-between text-[0.75rem]">
              <span className="text-muted-foreground">Target</span>
              <span className="font-semibold text-primary" style={{ fontVariantNumeric: "tabular-nums" }}>≥ 60%</span>
            </div>
            <div className="h-2.5 w-full overflow-hidden rounded-full bg-white/[0.06]">
              <div className="h-full rounded-full bg-gradient-to-r from-primary to-magenta" style={{ width: "60%" }} />
            </div>
            <div className="mt-2 text-[0.6875rem] text-muted-foreground">New metric — no prior baseline</div>
          </div>
        </Card>

        {/* Churn Rate */}
        <Card className="p-5" elevated>
          <div className="flex items-center justify-between">
            <span className="text-[0.8125rem] text-muted-foreground">5-Minute Churn Rate</span>
            <TrendingDown className="size-4 text-success" />
          </div>
          <div className="mt-4 flex items-end justify-between">
            <div>
              <div className="text-[0.6875rem] text-muted-foreground">Current Sim</div>
              <div className="text-[1.5rem] font-bold text-danger" style={{ fontVariantNumeric: "tabular-nums" }}>
                {result.churnRate}%
              </div>
            </div>
            <TrendingDown className="mb-1 size-5 text-success" />
            <div className="text-right">
              <div className="text-[0.6875rem] text-muted-foreground">Target</div>
              <div className="text-[1.5rem] font-bold text-success" style={{ fontVariantNumeric: "tabular-nums" }}>≤ 30%</div>
            </div>
          </div>
          <div className="mt-4 flex h-2.5 gap-1">
            <div className="h-full rounded-l-full bg-danger" style={{ width: `${result.churnRate}%` }} />
            <div className="h-full rounded-r-full bg-success/40" style={{ width: `${result.retentionRate}%` }} />
          </div>
        </Card>

        {/* Session Completion */}
        <Card className="p-5" elevated>
          <div className="flex items-center justify-between">
            <span className="text-[0.8125rem] text-muted-foreground">Session Completion</span>
            <TrendingUp className="size-4 text-success" />
          </div>
          <div className="mt-4 flex items-end justify-between">
            <div>
              <div className="text-[0.6875rem] text-muted-foreground">Current Sim</div>
              <div className="text-[1.5rem] font-bold text-foreground" style={{ fontVariantNumeric: "tabular-nums" }}>
                {result.retentionRate}%
              </div>
            </div>
            <TrendingUp className="mb-1 size-5 text-success" />
            <div className="text-right">
              <div className="text-[0.6875rem] text-muted-foreground">Target</div>
              <div className="text-[1.5rem] font-bold text-success" style={{ fontVariantNumeric: "tabular-nums" }}>≥ 70%</div>
            </div>
          </div>
          <div className="mt-4">
            <div className="h-2.5 w-full overflow-hidden rounded-full bg-white/[0.06]">
              <div className="h-full rounded-full bg-gradient-to-r from-blue-400 to-success" style={{ width: `${Math.min(100, (result.retentionRate / 70) * 100)}%` }} />
            </div>
            <div className="mt-2 text-[0.6875rem] text-success">
              {projectedUplift > 0 ? `+${projectedUplift}pt projected uplift` : "Target achieved"}
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}
