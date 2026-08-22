import { useState, useCallback } from "react";
import { Header } from "./components/Header";
import { Hero } from "./components/Hero";
import { SimulationWindow } from "./components/SimulationWindow";
import { KpiCards } from "./components/KpiCards";
import { StatusDistribution } from "./components/StatusDistribution";
import { Funnel } from "./components/Funnel";
import { ChurnAnalysis } from "./components/ChurnAnalysis";
import { Opportunity } from "./components/Opportunity";
import { Targets } from "./components/Targets";
import { FindingsTable } from "./components/FindingsTable";
import { runSimulation, SimulationParams, SimulationResult } from "./components/simulationEngine";

export default function App() {
  const [simulationResult, setSimulationResult] = useState<SimulationResult>(() => runSimulation());
  const [isRunning, setIsRunning] = useState<boolean>(false);

  const handleRunSimulation = useCallback((params: Partial<SimulationParams>) => {
    setIsRunning(true);
    // Micro-delay to allow visual feedback for the user
    setTimeout(() => {
      const nextResult = runSimulation(params);
      setSimulationResult(nextResult);
      setIsRunning(false);
    }, 180);
  }, []);

  return (
    <div className="min-h-screen w-full bg-background text-foreground selection:bg-primary/30">
      <Header />
      <main className="mx-auto max-w-[1440px] px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col gap-8">
          {/* Top Hero Section */}
          <Hero result={simulationResult} />

          {/* Interactive Simulation Input Window */}
          <SimulationWindow
            currentResult={simulationResult}
            onRunSimulation={handleRunSimulation}
            isRunning={isRunning}
          />

          {/* Dynamic KPI Cards */}
          <KpiCards result={simulationResult} />

          {/* Status Breakdown & Insights */}
          <StatusDistribution result={simulationResult} />

          {/* Funnel: Rejection -> Churned / Retained */}
          <Funnel result={simulationResult} />

          {/* Churn Analysis Charts (Recharts Bar & Donut) */}
          <ChurnAnalysis result={simulationResult} />

          {/* PRD Solution Experience & Mockup */}
          <Opportunity result={simulationResult} />

          {/* 4-Week Post-Launch Targets Tracker */}
          <Targets result={simulationResult} />

          {/* Findings Summary Table */}
          <FindingsTable result={simulationResult} />
        </div>

        <footer className="mt-12 flex flex-col sm:flex-row items-center justify-between gap-3 border-t border-border pt-6 text-[0.75rem] text-muted-foreground">
          <span>UPI Analytics · Payment Insights & Simulation Engine</span>
          <span>
            Active Simulation: {simulationResult.totalTransactions.toLocaleString()} transactions · Seed #{simulationResult.seed} · Generated in {simulationResult.runDurationMs}ms
          </span>
        </footer>
      </main>
    </div>
  );
}
