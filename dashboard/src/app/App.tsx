import { useState, useCallback, useEffect } from "react";
import { Header, NAV_SECTIONS } from "./components/Header";
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
  const [activeSection, setActiveSection] = useState<string>("dashboard-overview");

  const handleRunSimulation = useCallback((params: Partial<SimulationParams>) => {
    setIsRunning(true);
    // Micro-delay to allow visual feedback for the user
    setTimeout(() => {
      const nextResult = runSimulation(params);
      setSimulationResult(nextResult);
      setIsRunning(false);
    }, 180);
  }, []);

  const handleNavigate = useCallback((sectionId: string) => {
    setActiveSection(sectionId);
    const element = document.getElementById(sectionId);
    if (element) {
      const yOffset = -80; // Offset for sticky header
      const y = element.getBoundingClientRect().top + window.pageYOffset + yOffset;
      window.scrollTo({ top: y, behavior: "smooth" });
    }
  }, []);

  // Update active navigation tab as the user scrolls
  useEffect(() => {
    const handleScroll = () => {
      const scrollPosition = window.scrollY + 120;
      for (let i = NAV_SECTIONS.length - 1; i >= 0; i--) {
        const section = document.getElementById(NAV_SECTIONS[i].id);
        if (section) {
          const top = section.offsetTop;
          if (scrollPosition >= top) {
            setActiveSection(NAV_SECTIONS[i].id);
            break;
          }
        }
      }
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <div className="min-h-screen w-full bg-background text-foreground selection:bg-primary/30 scroll-smooth">
      <Header activeSection={activeSection} onNavigate={handleNavigate} />
      
      <main className="mx-auto max-w-[1440px] px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col gap-10">
          
          {/* 1. Dashboard Overview Section */}
          <section id="dashboard-overview" className="scroll-mt-24 flex flex-col gap-8">
            <Hero result={simulationResult} />
            <SimulationWindow
              currentResult={simulationResult}
              onRunSimulation={handleRunSimulation}
              isRunning={isRunning}
            />
            <KpiCards result={simulationResult} />
          </section>

          {/* 2. Transaction Analysis Section */}
          <section id="transaction-analysis" className="scroll-mt-24 flex flex-col gap-6">
            <div className="flex items-center gap-2 border-b border-border pb-3">
              <span className="text-[0.6875rem] font-bold uppercase tracking-widest text-primary font-mono">
                Section 01
              </span>
              <span className="text-muted-foreground">/</span>
              <span className="text-[0.875rem] font-semibold text-foreground">
                Transaction Volume & Status Distribution
              </span>
            </div>
            <StatusDistribution
              result={simulationResult}
              onViewAnalysis={() => handleNavigate("churn-analysis")}
            />
          </section>

          {/* 3. Churn Analysis Section */}
          <section id="churn-analysis" className="scroll-mt-24 flex flex-col gap-6">
            <div className="flex items-center gap-2 border-b border-border pb-3">
              <span className="text-[0.6875rem] font-bold uppercase tracking-widest text-magenta font-mono">
                Section 02
              </span>
              <span className="text-muted-foreground">/</span>
              <span className="text-[0.875rem] font-semibold text-foreground">
                MDR Friction & Next-Action Churn Breakdown
              </span>
            </div>
            <Funnel result={simulationResult} />
            <ChurnAnalysis result={simulationResult} />
          </section>

          {/* 4. Fallback Performance Section */}
          <section id="fallback-performance" className="scroll-mt-24 flex flex-col gap-6">
            <div className="flex items-center gap-2 border-b border-border pb-3">
              <span className="text-[0.6875rem] font-bold uppercase tracking-widest text-primary font-mono">
                Section 03
              </span>
              <span className="text-muted-foreground">/</span>
              <span className="text-[0.875rem] font-semibold text-foreground">
                Smart Fallback Solution & UI Prototype
              </span>
            </div>
            <Opportunity result={simulationResult} />
          </section>

          {/* 5. Experiment Metrics Section */}
          <section id="experiment-metrics" className="scroll-mt-24 flex flex-col gap-6">
            <div className="flex items-center gap-2 border-b border-border pb-3">
              <span className="text-[0.6875rem] font-bold uppercase tracking-widest text-success font-mono">
                Section 04
              </span>
              <span className="text-muted-foreground">/</span>
              <span className="text-[0.875rem] font-semibold text-foreground">
                Success Benchmarks & Executive Findings
              </span>
            </div>
            <Targets result={simulationResult} />
            <FindingsTable result={simulationResult} />
          </section>

        </div>

        <footer className="mt-14 flex flex-col sm:flex-row items-center justify-between gap-3 border-t border-border pt-6 text-[0.75rem] text-muted-foreground">
          <span>UPI Analytics · Payment Insights & Simulation Engine</span>
          <span>
            Active Simulation: {simulationResult.totalTransactions.toLocaleString()} transactions · Seed #{simulationResult.seed} · Generated in {simulationResult.runDurationMs}ms
          </span>
        </footer>
      </main>
    </div>
  );
}
