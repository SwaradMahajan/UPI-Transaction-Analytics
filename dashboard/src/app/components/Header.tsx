import { useState } from "react";
import { Calendar, ChevronDown, Download, SlidersHorizontal, Zap } from "lucide-react";
import { navItems } from "./data";

export function Header() {
  const [active, setActive] = useState("Dashboard");
  return (
    <header className="sticky top-0 z-30 border-b border-border bg-background/80 backdrop-blur-xl">
      <div className="mx-auto flex h-16 max-w-[1440px] items-center gap-8 px-8">
        {/* Brand */}
        <div className="flex items-center gap-3">
          <div className="grid size-9 place-items-center rounded-xl bg-gradient-to-br from-primary to-magenta shadow-[0_6px_16px_-4px_rgba(168,85,247,0.6)]">
            <Zap className="size-4.5 text-white" strokeWidth={2.5} />
          </div>
          <div className="leading-none">
            <div className="text-[0.9375rem] font-semibold tracking-tight text-foreground" style={{ fontFamily: "var(--font-display)" }}>
              UPI ANALYTICS
            </div>
            <div className="mt-1 text-[0.625rem] tracking-[0.18em] text-muted-foreground">
              PAYMENT INSIGHTS & METRICS
            </div>
          </div>
        </div>

        {/* Nav */}
        <nav className="hidden items-center gap-1 lg:flex">
          {navItems.map((item) => (
            <button
              key={item}
              onClick={() => setActive(item)}
              className={`relative rounded-lg px-3 py-2 text-[0.8125rem] transition-colors ${
                active === item
                  ? "text-foreground"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              {item}
              {active === item && (
                <span className="absolute inset-x-3 -bottom-[21px] h-0.5 rounded-full bg-primary" />
              )}
            </button>
          ))}
        </nav>

        {/* Right actions */}
        <div className="ml-auto flex items-center gap-2">
          <button className="flex items-center gap-2 rounded-lg border border-border bg-input px-3 py-2 text-[0.8125rem] text-foreground transition-colors hover:bg-white/[0.06]">
            <Calendar className="size-3.5 text-muted-foreground" />
            Last 30 Days
            <ChevronDown className="size-3.5 text-muted-foreground" />
          </button>
          <button className="grid size-9 place-items-center rounded-lg border border-border bg-input text-muted-foreground transition-colors hover:text-foreground">
            <SlidersHorizontal className="size-4" />
          </button>
          <button className="flex items-center gap-2 rounded-lg bg-primary px-3.5 py-2 text-[0.8125rem] font-medium text-primary-foreground transition-colors hover:bg-primary/90">
            <Download className="size-3.5" />
            Export
          </button>
          <div className="ml-1 grid size-9 place-items-center rounded-full bg-gradient-to-br from-blue-400 to-primary text-[0.75rem] font-semibold text-white">
            UA
          </div>
        </div>
      </div>
    </header>
  );
}
