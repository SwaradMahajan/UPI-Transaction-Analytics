import {
  Bar,
  BarChart,
  Cell,
  LabelList,
  Pie,
  PieChart,
  Rectangle,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { AlertTriangle } from "lucide-react";
import { Card, SectionHeading } from "./primitives";
import { COLORS } from "./data";
import { SimulationResult } from "./simulationEngine";

const barColor: Record<string, string> = {
  highest: COLORS.magenta,
  medium: COLORS.warning,
  lower: "#7c8299",
};

function TooltipBox({ active, payload, suffix = "%" }: any) {
  if (!active || !payload?.length) return null;
  const p = payload[0].payload;
  return (
    <div className="rounded-lg border border-border bg-popover px-3 py-2 shadow-xl">
      <div className="text-[0.75rem] text-foreground">{p.label ?? p.name}</div>
      <div className="text-[0.8125rem] font-semibold text-primary" style={{ fontVariantNumeric: "tabular-nums" }}>
        {(p.churn ?? p.value)}{suffix}
        {p.users != null && <span className="ml-1 text-muted-foreground">· {p.users} users</span>}
      </div>
    </div>
  );
}

interface ChurnAnalysisProps {
  result: SimulationResult;
}

export function ChurnAnalysis({ result }: ChurnAnalysisProps) {
  return (
    <div className="grid grid-cols-1 gap-5 lg:grid-cols-2">
      {/* Left — churn by failure type */}
      <Card className="p-6" elevated>
        <SectionHeading
          title="Which Failures Drive Churn?"
          subtitle="5-minute churn rate by failure type"
        />
        <div className="h-[220px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={result.churnByFailure} layout="vertical" margin={{ left: 8, right: 40, top: 0, bottom: 0 }}>
              <XAxis type="number" hide domain={[0, 100]} />
              <YAxis
                type="category"
                dataKey="label"
                width={140}
                tickLine={false}
                axisLine={false}
                tick={{ fill: COLORS.muted, fontSize: 12 }}
              />
              <Tooltip cursor={{ fill: "rgba(255,255,255,0.04)" }} content={<TooltipBox />} />
              <Bar
                dataKey="churn"
                radius={[0, 6, 6, 0]}
                barSize={22}
                isAnimationActive={false}
                shape={(props: any) => (
                  <Rectangle
                    {...props}
                    fill={barColor[result.churnByFailure[props.index]?.level] ?? "#7c8299"}
                    radius={[0, 6, 6, 0]}
                  />
                )}
              >
                <LabelList
                  dataKey="churn"
                  position="right"
                  fill="#f4f4f8"
                  fontSize={12}
                  formatter={(v: number) => `${v}%`}
                />
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
        <div className="mt-2 flex items-start gap-2.5 rounded-lg border border-magenta/25 bg-magenta/[0.06] p-3">
          <AlertTriangle className="mt-0.5 size-4 shrink-0 text-magenta" />
          <p className="text-[0.8125rem] leading-snug text-foreground/85">
            <span className="font-semibold text-magenta">MDR Rejection — {result.churnRate}% churn.</span>{" "}
            Merchant-initiated rejection is the single most damaging payment failure mode.
          </p>
        </div>
      </Card>

      {/* Right — post-rejection behavior donut */}
      <Card className="p-6" elevated>
        <SectionHeading
          title="Post-Rejection User Behavior"
          subtitle={`Outcome of the ${result.mdrCount.toLocaleString()} rejected sessions`}
        />
        <div className="flex items-center gap-6">
          <div className="relative h-[200px] w-[200px] shrink-0">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={result.postRejection}
                  dataKey="value"
                  innerRadius={68}
                  outerRadius={92}
                  paddingAngle={3}
                  startAngle={90}
                  endAngle={-270}
                  stroke="none"
                  isAnimationActive={false}
                >
                  {result.postRejection.map((d) => (
                    <Cell key={d.name} fill={d.color} />
                  ))}
                </Pie>
                <Tooltip content={<TooltipBox />} />
              </PieChart>
            </ResponsiveContainer>
            <div className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center">
              <div className="text-[1.75rem] font-bold leading-none text-foreground" style={{ fontVariantNumeric: "tabular-nums" }}>
                {result.mdrCount.toLocaleString()}
              </div>
              <div className="mt-1 text-[0.6875rem] text-muted-foreground">MDR Rejections</div>
            </div>
          </div>
          <div className="flex flex-1 flex-col gap-3">
            {result.postRejection.map((d) => (
              <div key={d.name} className="flex items-center justify-between rounded-lg border border-border bg-white/[0.02] px-3 py-2.5">
                <div className="flex items-center gap-2.5">
                  <span className="size-2.5 rounded-full" style={{ backgroundColor: d.color }} />
                  <span className="text-[0.8125rem] text-foreground">{d.name}</span>
                </div>
                <div className="text-right" style={{ fontVariantNumeric: "tabular-nums" }}>
                  <div className="text-[0.9375rem] font-semibold text-foreground">{d.value}%</div>
                  <div className="text-[0.6875rem] text-muted-foreground">{d.users.toLocaleString()} users</div>
                </div>
              </div>
            ))}
          </div>
        </div>
        <p className="mt-4 border-t border-border pt-3 text-[0.8125rem] text-muted-foreground">
          <span className="font-semibold text-success">{result.retainedCount.toLocaleString()} users</span> successfully
          switched to a linked UPI Savings Account.
        </p>
      </Card>
    </div>
  );
}
