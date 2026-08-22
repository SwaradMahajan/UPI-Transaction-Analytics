import { Header } from "./components/Header";
import { Hero } from "./components/Hero";
import { KpiCards } from "./components/KpiCards";
import { StatusDistribution } from "./components/StatusDistribution";
import { Funnel } from "./components/Funnel";
import { ChurnAnalysis } from "./components/ChurnAnalysis";
import { Opportunity } from "./components/Opportunity";
import { Targets } from "./components/Targets";
import { FindingsTable } from "./components/FindingsTable";

export default function App() {
  return (
    <div className="min-h-screen w-full bg-background text-foreground">
      <Header />
      <main className="mx-auto max-w-[1440px] px-8 py-8">
        <div className="flex flex-col gap-8">
          <Hero />
          <KpiCards />
          <StatusDistribution />
          <Funnel />
          <ChurnAnalysis />
          <Opportunity />
          <Targets />
          <FindingsTable />
        </div>
        <footer className="mt-10 flex items-center justify-between border-t border-border pt-6 text-[0.75rem] text-muted-foreground">
          <span>Slice Analytics · UPI Payment Insights</span>
          <span>Data window: Jul 23 – Aug 22, 2026 · 10,000 transactions</span>
        </footer>
      </main>
    </div>
  );
}
