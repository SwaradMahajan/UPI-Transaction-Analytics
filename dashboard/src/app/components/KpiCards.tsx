import { Activity, AlertOctagon, CheckCircle2, TrendingDown, TrendingUp } from "lucide-react";
import { Card, Sparkline } from "./primitives";
import { COLORS } from "./data";
import { SimulationResult } from "./simulationEngine";

interface KpiCardsProps {
  result: SimulationResult;
}

export function KpiCards({ result }: KpiCardsProps) {
  const kpis = [
    {
      label: "Total Transactions",
      value: result.totalTransactions.toLocaleString(),
      sub: `${result.params.totalTransactions.toLocaleString()} simulated batch`,
      subTone: "neutral" as const,
      icon: Activity,
      accent: COLORS.blue,
      spark: result.spark.transactions,
    },
    {
      label: "Successful Payments",
      value: result.successCount.toLocaleString(),
      sub: `${result.successRate}% success rate`,
      subTone: result.successRate >= 80 ? ("up" as const) : ("down" as const),
      icon: CheckCircle2,
      accent: COLORS.success,
      spark: result.spark.success,
    },
    {
      label: "MDR Rejections",
      value: result.mdrCount.toLocaleString(),
      sub: `${result.mdrRate}% of total volume`,
      subTone: "neutral" as const,
      icon: AlertOctagon,
      accent: COLORS.warning,
      spark: result.spark.mdr,
    },
    {
      label: "5-Minute Churn",
      value: `${result.churnRate}%`,
      sub: `${result.churnedCount.toLocaleString()} users abandoned`,
      subTone: result.churnRate > 50 ? ("down" as const) : ("up" as const),
      icon: TrendingDown,
      accent: COLORS.danger,
      spark: result.spark.churn,
      border: result.churnRate > 50 ? "border-danger/40" : "border-success/40",
    },
  ];

  return (
    <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-4">
      {kpis.map((k) => (
        <Card key={k.label} className={`p-5 ${k.border ?? ""}`} elevated>
          <div className="flex items-start justify-between">
            <div
              className="grid size-9 place-items-center rounded-lg"
              style={{ backgroundColor: `${k.accent}1f`, color: k.accent }}
            >
              <k.icon className="size-4.5" />
            </div>
            <Sparkline data={k.spark} color={k.accent} />
          </div>
          <div className="mt-4 text-[0.75rem] uppercase tracking-[0.1em] text-muted-foreground">
            {k.label}
          </div>
          <div
            className="mt-1.5 text-[2rem] font-bold leading-none tracking-tight text-foreground"
            style={{ fontSize: "2rem", fontVariantNumeric: "tabular-nums" }}
          >
            {k.value}
          </div>
          <div className="mt-3 flex items-center gap-1.5 text-[0.75rem]">
            {k.subTone === "up" && <TrendingUp className="size-3.5 text-success" />}
            {k.subTone === "down" && <TrendingDown className="size-3.5 text-danger" />}
            <span
              className={
                k.subTone === "up"
                  ? "text-success"
                  : k.subTone === "down"
                  ? "text-danger"
                  : "text-muted-foreground"
              }
            >
              {k.sub}
            </span>
          </div>
        </Card>
      ))}
    </div>
  );
}
