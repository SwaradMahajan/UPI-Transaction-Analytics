import { Activity, AlertOctagon, CheckCircle2, TrendingDown, TrendingUp } from "lucide-react";
import { Card, Sparkline } from "./primitives";
import { COLORS, spark } from "./data";

type Kpi = {
  label: string;
  value: string;
  sub: string;
  subTone: "up" | "down" | "neutral";
  icon: typeof Activity;
  accent: string;
  spark: number[];
  border?: string;
};

const kpis: Kpi[] = [
  {
    label: "Total Transactions",
    value: "10,000",
    sub: "8.4% vs previous period",
    subTone: "up",
    icon: Activity,
    accent: COLORS.blue,
    spark: spark.transactions,
  },
  {
    label: "Successful Payments",
    value: "8,373",
    sub: "83.73% success rate",
    subTone: "up",
    icon: CheckCircle2,
    accent: COLORS.success,
    spark: spark.success,
  },
  {
    label: "MDR Rejections",
    value: "207",
    sub: "2.07% of total transactions",
    subTone: "neutral",
    icon: AlertOctagon,
    accent: COLORS.warning,
    spark: spark.mdr,
  },
  {
    label: "5-Minute Churn",
    value: "62.8%",
    sub: "130 users abandoned",
    subTone: "down",
    icon: TrendingDown,
    accent: COLORS.danger,
    spark: spark.churn,
    border: "border-danger/40",
  },
];

export function KpiCards() {
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
