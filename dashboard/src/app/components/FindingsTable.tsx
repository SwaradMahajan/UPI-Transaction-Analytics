import { AlertTriangle, CircleDot, Search, Sparkles } from "lucide-react";
import { Card, SectionHeading } from "./primitives";
import { Finding, SimulationResult } from "./simulationEngine";

function StatusBadge({ finding }: { finding: Finding }) {
  const map = {
    warning: { cls: "bg-warning/12 text-warning", Icon: AlertTriangle, label: finding.status },
    danger: { cls: "bg-danger/12 text-danger", Icon: CircleDot, label: finding.status },
    opportunity: { cls: "bg-primary/15 text-primary", Icon: Sparkles, label: finding.status },
  } as const;
  const investigate = finding.status === "Investigate";
  const cfg = map[finding.tone];
  const Icon = investigate ? Search : cfg.Icon;
  return (
    <span className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[0.75rem] ${cfg.cls}`}>
      <Icon className="size-3.5" />
      {cfg.label}
    </span>
  );
}

interface FindingsTableProps {
  result: SimulationResult;
}

export function FindingsTable({ result }: FindingsTableProps) {
  return (
    <Card className="p-6" elevated>
      <SectionHeading title="Key Findings" subtitle="Prioritized signals for the Product & Data teams from the active simulation run" />
      <div className="overflow-hidden rounded-xl border border-border">
        <table className="w-full border-collapse text-left">
          <thead>
            <tr className="bg-white/[0.03] text-[0.6875rem] uppercase tracking-[0.1em] text-muted-foreground">
              <th className="px-4 py-3 font-medium">Insight</th>
              <th className="px-4 py-3 font-medium">Metric</th>
              <th className="px-4 py-3 font-medium">Impact</th>
              <th className="px-4 py-3 font-medium">Status</th>
            </tr>
          </thead>
          <tbody>
            {result.keyFindings.map((f, i) => (
              <tr
                key={f.insight}
                className={`text-[0.875rem] transition-colors hover:bg-white/[0.02] ${
                  i !== result.keyFindings.length - 1 ? "border-b border-border" : ""
                }`}
              >
                <td className="px-4 py-3.5 font-medium text-foreground">{f.insight}</td>
                <td className="px-4 py-3.5 text-muted-foreground" style={{ fontVariantNumeric: "tabular-nums" }}>
                  {f.metric}
                </td>
                <td className="px-4 py-3.5 text-muted-foreground">{f.impact}</td>
                <td className="px-4 py-3.5">
                  <StatusBadge finding={f} />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </Card>
  );
}
