import { useState } from "react";
import {
  Play,
  RotateCcw,
  Sparkles,
  Sliders,
  Dices,
  Info,
  Check,
} from "lucide-react";
import { Card } from "./primitives";
import {
  DEFAULT_PARAMS,
  SimulationParams,
  SimulationResult,
} from "./simulationEngine";

interface SimulationWindowProps {
  currentResult: SimulationResult;
  onRunSimulation: (params: Partial<SimulationParams>) => void;
  isRunning?: boolean;
}

export function SimulationWindow({
  currentResult,
  onRunSimulation,
  isRunning = false,
}: SimulationWindowProps) {
  const [params, setParams] = useState<SimulationParams>(currentResult.params);
  const [isExpanded, setIsExpanded] = useState(true);
  const [activePreset, setActivePreset] = useState<string>("baseline");

  const presets = [
    {
      id: "baseline",
      label: "Baseline",
      desc: "10,000 Txns · 40% MDR · 35% Retention",
      values: { ...DEFAULT_PARAMS, totalTransactions: 10000 },
    },
    {
      id: "high_volume",
      label: "High Volume",
      desc: "25,000 Txns · Peak Traffic",
      values: { ...DEFAULT_PARAMS, totalTransactions: 25000, mdrRejectionRate: 0.42 },
    },
    {
      id: "merchant_friction",
      label: "Kirana Friction",
      desc: "15,000 Txns · 60% MDR Avoidance",
      values: { ...DEFAULT_PARAMS, totalTransactions: 15000, mdrRejectionRate: 0.60, retentionRate: 0.25 },
    },
    {
      id: "smart_fallback",
      label: "Post-Launch PRD",
      desc: "10,000 Txns · 65% Fallback Retention",
      values: { ...DEFAULT_PARAMS, totalTransactions: 10000, retentionRate: 0.65 },
    },
  ];

  const handleApplyPreset = (presetId: string) => {
    const preset = presets.find((p) => p.id === presetId);
    if (!preset) return;
    setActivePreset(presetId);
    setParams(preset.values);
    onRunSimulation(preset.values);
  };

  const handleRun = () => {
    setActivePreset("custom");
    onRunSimulation(params);
  };

  const handleRandomSeed = () => {
    const newSeed = Math.floor(Math.random() * 900000) + 100000;
    const updated = { ...params, seed: newSeed };
    setParams(updated);
    setActivePreset("custom");
    onRunSimulation(updated);
  };

  const handleReset = () => {
    setParams(DEFAULT_PARAMS);
    setActivePreset("baseline");
    onRunSimulation(DEFAULT_PARAMS);
  };

  return (
    <Card className="relative overflow-hidden border-primary/35 p-6 bg-gradient-to-b from-card-elevated to-card shadow-2xl" elevated>
      {/* Decorative background glow */}
      <div className="pointer-events-none absolute -right-20 -top-20 size-72 rounded-full bg-primary/10 blur-3xl" />
      <div className="pointer-events-none absolute -left-20 -bottom-20 size-72 rounded-full bg-magenta/10 blur-3xl" />

      {/* Header bar */}
      <div className="flex flex-wrap items-center justify-between gap-4 border-b border-border/80 pb-5">
        <div className="flex items-center gap-3">
          <div className="grid size-10 place-items-center rounded-xl bg-gradient-to-br from-primary to-magenta text-white shadow-[0_4px_16px_rgba(168,85,247,0.4)]">
            <Sliders className="size-5" />
          </div>
          <div>
            <div className="flex items-center gap-2.5">
              <h2 className="text-[1.125rem] font-bold tracking-tight text-foreground" style={{ fontFamily: "var(--font-display)" }}>
                Transaction Simulation Control Window
              </h2>
              <span className="inline-flex items-center gap-1 rounded-full bg-success/15 px-2.5 py-0.5 text-[0.6875rem] font-semibold text-success">
                <span className="size-1.5 rounded-full bg-success animate-pulse" />
                Live Engine
              </span>
            </div>
            <p className="text-[0.8125rem] text-muted-foreground">
              Adjust transaction volume, MDR rejection likelihood, and retry probabilities to simulate real-time UPI metrics.
            </p>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-2.5">
          <button
            onClick={handleRandomSeed}
            disabled={isRunning}
            title="Generate with a new random seed"
            className="flex items-center gap-1.5 rounded-lg border border-border bg-input px-3 py-2 text-[0.8125rem] text-muted-foreground transition-all hover:bg-white/[0.08] hover:text-foreground active:scale-95 disabled:opacity-50"
          >
            <Dices className="size-4 text-primary" />
            <span>Random Seed</span>
          </button>

          <button
            onClick={handleReset}
            disabled={isRunning}
            title="Reset parameters to project baseline"
            className="flex items-center gap-1.5 rounded-lg border border-border bg-input px-3 py-2 text-[0.8125rem] text-muted-foreground transition-all hover:bg-white/[0.08] hover:text-foreground active:scale-95 disabled:opacity-50"
          >
            <RotateCcw className="size-3.5" />
            <span>Reset</span>
          </button>

          <button
            onClick={handleRun}
            disabled={isRunning}
            className="flex items-center gap-2 rounded-xl bg-gradient-to-r from-primary via-purple-500 to-magenta px-5 py-2.5 text-[0.875rem] font-semibold text-white shadow-[0_6px_20px_-4px_rgba(168,85,247,0.7)] transition-all hover:brightness-110 active:scale-95 disabled:opacity-60"
          >
            <Play className={`size-4 fill-white ${isRunning ? "animate-spin" : ""}`} />
            <span>{isRunning ? "Simulating..." : "Run Simulation"}</span>
          </button>
        </div>
      </div>

      {/* Preset pills */}
      <div className="mt-5 flex flex-wrap items-center gap-2">
        <span className="text-[0.75rem] uppercase tracking-wider text-muted-foreground font-semibold mr-1">
          Scenario Presets:
        </span>
        {presets.map((p) => {
          const isSelected = activePreset === p.id;
          return (
            <button
              key={p.id}
              onClick={() => handleApplyPreset(p.id)}
              className={`flex items-center gap-2 rounded-lg px-3 py-1.5 text-[0.75rem] transition-all ${
                isSelected
                  ? "bg-primary/20 border border-primary text-primary font-medium shadow-[0_0_12px_rgba(168,85,247,0.3)]"
                  : "bg-white/[0.03] border border-border text-muted-foreground hover:bg-white/[0.06] hover:text-foreground"
              }`}
            >
              {isSelected && <Check className="size-3" />}
              <span>{p.label}</span>
              <span className="text-[0.6875rem] opacity-70">({p.desc.split("·")[0].trim()})</span>
            </button>
          );
        })}
      </div>

      {/* Interactive Controls Grid */}
      {isExpanded && (
        <div className="mt-6 grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 pt-2">
          {/* Parameter 1: Total Transactions */}
          <div className="rounded-xl border border-border/70 bg-white/[0.02] p-4 flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between text-[0.8125rem]">
                <label className="font-semibold text-foreground">Total Transactions</label>
                <span className="text-[0.6875rem] font-mono font-medium text-primary">
                  {params.totalTransactions.toLocaleString()}
                </span>
              </div>
              <p className="mt-1 text-[0.6875rem] text-muted-foreground">
                Total synthetic volume generated.
              </p>
            </div>
            <div className="mt-4">
              <input
                type="range"
                min="1000"
                max="50000"
                step="1000"
                value={params.totalTransactions}
                onChange={(e) => {
                  setParams({ ...params, totalTransactions: Number(e.target.value) });
                  setActivePreset("custom");
                }}
                className="w-full accent-primary h-1.5 bg-white/10 rounded-lg cursor-pointer"
              />
              <div className="mt-2 flex items-center justify-between text-[0.6875rem] text-muted-foreground font-mono">
                <span>1K</span>
                <input
                  type="number"
                  min="500"
                  max="100000"
                  value={params.totalTransactions}
                  onChange={(e) => {
                    const val = Math.max(100, Number(e.target.value));
                    setParams({ ...params, totalTransactions: val });
                    setActivePreset("custom");
                  }}
                  className="w-20 rounded border border-border bg-input px-1.5 py-0.5 text-center text-[0.75rem] text-foreground font-mono"
                />
                <span>50K</span>
              </div>
            </div>
          </div>

          {/* Parameter 2: MDR Rejection Probability */}
          <div className="rounded-xl border border-magenta/30 bg-magenta/[0.03] p-4 flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between text-[0.8125rem]">
                <label className="font-semibold text-magenta">MDR Rejection Rate</label>
                <span className="text-[0.75rem] font-mono font-bold text-magenta">
                  {Math.round(params.mdrRejectionRate * 100)}%
                </span>
              </div>
              <p className="mt-1 text-[0.6875rem] text-muted-foreground">
                Kirana/Retail CC transactions &gt; ₹{params.amountThreshold}.
              </p>
            </div>
            <div className="mt-4">
              <input
                type="range"
                min="0.05"
                max="0.80"
                step="0.05"
                value={params.mdrRejectionRate}
                onChange={(e) => {
                  setParams({ ...params, mdrRejectionRate: Number(e.target.value) });
                  setActivePreset("custom");
                }}
                className="w-full accent-magenta h-1.5 bg-white/10 rounded-lg cursor-pointer"
              />
              <div className="mt-2 flex justify-between text-[0.6875rem] text-muted-foreground font-mono">
                <span>5%</span>
                <span className="text-magenta font-semibold">{Math.round(params.mdrRejectionRate * 100)}% Chance</span>
                <span>80%</span>
              </div>
            </div>
          </div>

          {/* Parameter 3: Post-Rejection Retention Rate */}
          <div className="rounded-xl border border-success/30 bg-success/[0.03] p-4 flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between text-[0.8125rem]">
                <label className="font-semibold text-success">Retry Retention Rate</label>
                <span className="text-[0.75rem] font-mono font-bold text-success">
                  {Math.round(params.retentionRate * 100)}%
                </span>
              </div>
              <p className="mt-1 text-[0.6875rem] text-muted-foreground">
                Users retrying via Slice Savings (vs. Churn).
              </p>
            </div>
            <div className="mt-4">
              <input
                type="range"
                min="0.05"
                max="0.80"
                step="0.05"
                value={params.retentionRate}
                onChange={(e) => {
                  setParams({ ...params, retentionRate: Number(e.target.value) });
                  setActivePreset("custom");
                }}
                className="w-full accent-success h-1.5 bg-white/10 rounded-lg cursor-pointer"
              />
              <div className="mt-2 flex justify-between text-[0.6875rem] text-muted-foreground font-mono">
                <span>5% (95% Churn)</span>
                <span>80%</span>
              </div>
            </div>
          </div>

          {/* Parameter 4: Base Success Rate */}
          <div className="rounded-xl border border-border/70 bg-white/[0.02] p-4 flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between text-[0.8125rem]">
                <label className="font-semibold text-foreground">Base Success Rate</label>
                <span className="text-[0.75rem] font-mono font-semibold text-blue-400">
                  {Math.round(params.baseSuccessRate * 100)}%
                </span>
              </div>
              <p className="mt-1 text-[0.6875rem] text-muted-foreground">
                Non-MDR transactions baseline reliability.
              </p>
            </div>
            <div className="mt-4">
              <input
                type="range"
                min="0.60"
                max="0.98"
                step="0.01"
                value={params.baseSuccessRate}
                onChange={(e) => {
                  setParams({ ...params, baseSuccessRate: Number(e.target.value) });
                  setActivePreset("custom");
                }}
                className="w-full accent-blue-400 h-1.5 bg-white/10 rounded-lg cursor-pointer"
              />
              <div className="mt-2 flex justify-between text-[0.6875rem] text-muted-foreground font-mono">
                <span>60%</span>
                <span>98%</span>
              </div>
            </div>
          </div>

          {/* Parameter 5: Amount Threshold */}
          <div className="rounded-xl border border-border/70 bg-white/[0.02] p-4 flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between text-[0.8125rem]">
                <label className="font-semibold text-foreground">MDR Min Amount</label>
                <span className="text-[0.75rem] font-mono font-semibold text-warning">
                  ₹{params.amountThreshold.toLocaleString()}
                </span>
              </div>
              <p className="mt-1 text-[0.6875rem] text-muted-foreground">
                Min transaction size triggering MDR avoidance.
              </p>
            </div>
            <div className="mt-4">
              <input
                type="range"
                min="500"
                max="5000"
                step="500"
                value={params.amountThreshold}
                onChange={(e) => {
                  setParams({ ...params, amountThreshold: Number(e.target.value) });
                  setActivePreset("custom");
                }}
                className="w-full accent-warning h-1.5 bg-white/10 rounded-lg cursor-pointer"
              />
              <div className="mt-2 flex justify-between text-[0.6875rem] text-muted-foreground font-mono">
                <span>₹500</span>
                <span>₹5,000</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Live Simulation Telemetry Footer */}
      <div className="mt-5 flex flex-wrap items-center justify-between gap-3 border-t border-white/[0.06] pt-4 text-[0.75rem] text-muted-foreground">
        <div className="flex items-center gap-3">
          <span className="inline-flex items-center gap-1.5 font-mono">
            <span className="size-2 rounded-full bg-primary" />
            Seed: <strong className="text-foreground">#{currentResult.seed}</strong>
          </span>
          <span className="text-white/20">|</span>
          <span>
            Simulated: <strong className="text-foreground">{currentResult.totalTransactions.toLocaleString()}</strong> rows
          </span>
          <span className="text-white/20">|</span>
          <span>
            Execution: <strong className="text-foreground">{currentResult.runDurationMs}ms</strong>
          </span>
        </div>

        <div className="flex items-center gap-2">
          <Info className="size-3.5 text-muted-foreground" />
          <span>Last simulated at {currentResult.timestamp}</span>
        </div>
      </div>
    </Card>
  );
}
