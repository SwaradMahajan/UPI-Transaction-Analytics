import { Calendar, ChevronDown, Download, SlidersHorizontal, Zap } from "lucide-react";

export const NAV_SECTIONS = [
  { id: "dashboard-overview", label: "Dashboard" },
  { id: "transaction-analysis", label: "Transaction Analysis" },
  { id: "churn-analysis", label: "Churn Analysis" },
  { id: "fallback-performance", label: "Fallback Performance" },
  { id: "experiment-metrics", label: "Experiment Metrics" },
];

interface HeaderProps {
  activeSection?: string;
  onNavigate?: (sectionId: string) => void;
}

export function Header({ activeSection = "dashboard-overview", onNavigate }: HeaderProps) {
  const handleNavClick = (sectionId: string) => {
    if (onNavigate) {
      onNavigate(sectionId);
    } else {
      const el = document.getElementById(sectionId);
      if (el) {
        el.scrollIntoView({ behavior: "smooth", block: "start" });
      }
    }
  };

  const handleExport = () => {
    window.print();
  };

  return (
    <header className="sticky top-0 z-30 border-b border-border bg-background/80 backdrop-blur-xl">
      <div className="mx-auto flex h-16 max-w-[1440px] items-center gap-8 px-4 sm:px-6 lg:px-8">
        {/* Brand */}
        <button
          onClick={() => handleNavClick("dashboard-overview")}
          className="flex items-center gap-3 text-left transition-opacity hover:opacity-90 cursor-pointer"
        >
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
        </button>

        {/* Navigation Tabs */}
        <nav className="hidden items-center gap-1 lg:flex">
          {NAV_SECTIONS.map((item) => {
            const isActive = activeSection === item.id;
            return (
              <button
                key={item.id}
                onClick={() => handleNavClick(item.id)}
                className={`relative rounded-lg px-3 py-2 text-[0.8125rem] font-medium transition-colors cursor-pointer ${
                  isActive
                    ? "text-foreground"
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                {item.label}
                {isActive && (
                  <span className="absolute inset-x-3 -bottom-[21px] h-0.5 rounded-full bg-primary shadow-[0_0_10px_rgba(168,85,247,0.8)]" />
                )}
              </button>
            );
          })}
        </nav>

        {/* Right actions */}
        <div className="ml-auto flex items-center gap-2">
          <button
            onClick={() => handleNavClick("transaction-analysis")}
            className="hidden sm:flex items-center gap-2 rounded-lg border border-border bg-input px-3 py-2 text-[0.8125rem] text-foreground transition-colors hover:bg-white/[0.06] cursor-pointer"
          >
            <Calendar className="size-3.5 text-muted-foreground" />
            Last 30 Days
            <ChevronDown className="size-3.5 text-muted-foreground" />
          </button>
          <button
            onClick={() => handleNavClick("dashboard-overview")}
            title="Configure simulation parameters"
            className="grid size-9 place-items-center rounded-lg border border-border bg-input text-muted-foreground transition-colors hover:text-foreground cursor-pointer"
          >
            <SlidersHorizontal className="size-4" />
          </button>
          <button
            onClick={handleExport}
            className="flex items-center gap-2 rounded-lg bg-primary px-3.5 py-2 text-[0.8125rem] font-medium text-primary-foreground transition-colors hover:bg-primary/90 cursor-pointer shadow-[0_4px_12px_rgba(168,85,247,0.3)]"
          >
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
