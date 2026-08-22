import { ArrowRight } from "lucide-react";
import { Card, SectionHeading } from "./primitives";
import { statusDistribution } from "./data";

export function StatusDistribution() {
  const max = Math.max(...statusDistribution.map((s) => s.count));
  return (
    <Card className="p-6" elevated>
      <SectionHeading
        title="Transaction Status Distribution"
        subtitle="Breakdown of all payment outcomes"
      />
      <div className="grid grid-cols-1 gap-8 lg:grid-cols-[1fr_300px]">
        {/* Bars */}
        <div className="flex flex-col gap-4">
          {statusDistribution.map((s) => (
            <div key={s.key} className="group">
              <div className="mb-1.5 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span
                    className="text-[0.8125rem] tracking-tight"
                    style={{ fontFamily: "var(--font-mono)", color: s.highlight ? s.color : "var(--foreground)" }}
                  >
                    {s.label}
                  </span>
                  {s.highlight && (
                    <span className="rounded-full bg-magenta/15 px-2 py-0.5 text-[0.625rem] font-medium text-magenta">
                      FOCUS
                    </span>
                  )}
                </div>
                <div className="flex items-baseline gap-2" style={{ fontVariantNumeric: "tabular-nums" }}>
                  <span className="text-[0.875rem] text-foreground">{s.count.toLocaleString()}</span>
                  <span className="text-[0.75rem] text-muted-foreground">{s.pct}%</span>
                </div>
              </div>
              <div className="h-2.5 w-full overflow-hidden rounded-full bg-white/[0.05]">
                <div
                  className="h-full rounded-full transition-all duration-500"
                  style={{
                    width: `${(s.count / max) * 100}%`,
                    backgroundColor: s.color,
                    boxShadow: s.highlight ? `0 0 16px ${s.color}88` : undefined,
                  }}
                />
              </div>
            </div>
          ))}
        </div>

        {/* Insight panel */}
        <div className="flex flex-col justify-center rounded-xl border border-magenta/25 bg-magenta/[0.06] p-5">
          <div className="text-[2.25rem] font-bold leading-none tracking-tight text-magenta" style={{ fontSize: "2.25rem", fontVariantNumeric: "tabular-nums" }}>
            12.7%
          </div>
          <p className="mt-2 text-[0.8125rem] leading-snug text-foreground">
            of all failed transactions are MDR rejections
          </p>
          <p className="mt-3 text-[0.75rem] leading-relaxed text-muted-foreground">
            Unlike technical failures, MDR rejection cannot be solved by retrying
            with the same payment method.
          </p>
          <button className="mt-4 flex items-center gap-1.5 text-[0.8125rem] font-medium text-primary transition-colors hover:text-magenta">
            View Analysis
            <ArrowRight className="size-3.5" />
          </button>
        </div>
      </div>
    </Card>
  );
}
