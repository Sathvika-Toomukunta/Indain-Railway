import React, { useState, useEffect } from 'react';
import { BlockPlanData, RoutePreset, ScheduleBlock } from './types';
import { ROUTE_PRESETS, DEFAULT_SAMPLE_PLAN } from './data/samplePlans';
import { Header } from './components/Header';
import { SimpleOverviewCards } from './components/SimpleOverviewCards';
import { VisualTimelineChart } from './components/VisualTimelineChart';
import { TimetableTable } from './components/TimetableTable';
import { LiveTrackSimulator } from './components/LiveTrackSimulator';
import { ConflictVerifier } from './components/ConflictVerifier';
import { AiPlannerModal } from './components/AiPlannerModal';
import { PrintExportModal } from './components/PrintExportModal';
import { SelectedBlockDrawer } from './components/SelectedBlockDrawer';
import { Sparkles, Train, Wrench, ShieldCheck, CheckCircle2, RefreshCw } from 'lucide-react';

export default function App() {
  const [selectedRoute, setSelectedRoute] = useState<RoutePreset>(ROUTE_PRESETS[0]);
  const [currentPlan, setCurrentPlan] = useState<BlockPlanData>(DEFAULT_SAMPLE_PLAN);
  const [selectedBlockId, setSelectedBlockId] = useState<string | null>('blk-1');
  const [isAiModalOpen, setIsAiModalOpen] = useState<boolean>(false);
  const [isPrintModalOpen, setIsPrintModalOpen] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  // Live simulation clock state
  const [activeTimeMinutes, setActiveTimeMinutes] = useState<number>(540); // 09:00 AM default
  const [isSimulating, setIsSimulating] = useState<boolean>(false);

  // Convert activeTimeMinutes to formatted "HH:MM"
  const formatMinutesToTime = (totalMinutes: number): string => {
    const hours = Math.floor(totalMinutes / 60) % 24;
    const mins = totalMinutes % 60;
    const hh = hours.toString().padStart(2, '0');
    const mm = mins.toString().padStart(2, '0');
    return `${hh}:${mm}`;
  };

  const activeTimeString = formatMinutesToTime(activeTimeMinutes);

  // Clock tick when simulation is on
  useEffect(() => {
    let interval: NodeJS.Timeout | null = null;
    if (isSimulating) {
      interval = setInterval(() => {
        setActiveTimeMinutes((prev) => (prev + 10) % 1440);
      }, 800);
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isSimulating]);

  // Find currently active block based on activeTimeString or selectedBlockId
  const getActiveBlockForTime = (timeStr: string): ScheduleBlock | undefined => {
    const [h, m] = timeStr.split(':').map(Number);
    const totalMin = (h || 0) * 60 + (m || 0);

    for (const b of currentPlan.scheduleBlocks) {
      const [sh, sm] = b.startTime.split(':').map(Number);
      const [eh, em] = b.endTime.split(':').map(Number);
      const startMin = (sh || 0) * 60 + (sm || 0);
      let endMin = (eh || 0) * 60 + (em || 0);
      if (endMin <= startMin) endMin += 1440;

      let checkMin = totalMin;
      if (checkMin < startMin && endMin > 1440) checkMin += 1440;

      if (checkMin >= startMin && checkMin < endMin) {
        return b;
      }
    }
    return currentPlan.scheduleBlocks[0];
  };

  const activeSimulationBlock = getActiveBlockForTime(activeTimeString);
  const currentInspectedBlock = currentPlan.scheduleBlocks.find((b) => b.id === selectedBlockId) || activeSimulationBlock;

  // Handle route change
  const handleRouteChange = (route: RoutePreset) => {
    setSelectedRoute(route);
    // Adjust plan title for the section
    setCurrentPlan((prev) => ({
      ...prev,
      sectionSummary: {
        ...prev.sectionSummary,
        sectionName: route.name,
        zone: route.zone,
      },
    }));
  };

  // Call API for Gemini AI Block Planning optimization
  const handleOptimizePlan = async (params: any) => {
    setIsLoading(true);
    try {
      const res = await fetch('/api/ai/optimize-plan', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(params),
      });

      if (!res.ok) {
        throw new Error('Server optimization request failed');
      }

      const data = await res.json();
      if (data.plan) {
        setCurrentPlan(data.plan);
        if (data.plan.scheduleBlocks?.length > 0) {
          setSelectedBlockId(data.plan.scheduleBlocks[0].id);
        }
      }
    } catch (err) {
      console.error('AI plan optimization error:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleResetDefault = () => {
    setCurrentPlan(DEFAULT_SAMPLE_PLAN);
    setSelectedBlockId('blk-1');
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 flex flex-col font-sans">
      {/* Top Header */}
      <Header
        selectedRoute={selectedRoute}
        onRouteChange={handleRouteChange}
        onOpenAiPlanner={() => setIsAiModalOpen(true)}
        onResetDefault={handleResetDefault}
        isAiLoading={isLoading}
        activeTime={activeTimeString}
      />

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {/* Intro / Section Status Banner */}
        <div className="bg-white border border-slate-200 rounded-xl p-5 sm:p-6 mb-6 shadow-sm relative overflow-hidden">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 relative z-10">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <span className="text-orange-700 text-xs font-bold uppercase tracking-wider bg-orange-50 px-2 py-0.5 rounded border border-orange-200">
                  Active Corridor
                </span>
                <span className="text-xs text-slate-500 font-mono font-medium">
                  {currentPlan.sectionSummary.zone} • {selectedRoute.lines}
                </span>
              </div>
              <h2 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight">
                {currentPlan.sectionSummary.sectionName}
              </h2>
              <p className="text-xs sm:text-sm text-slate-600 mt-1 max-w-3xl leading-relaxed">
                Smart timetable balancing high-speed train runs and safe track maintenance slots to eliminate delays and maximize railway asset availability.
              </p>
            </div>

            <div className="flex items-center gap-2.5 shrink-0">
              <button
                onClick={() => setIsAiModalOpen(true)}
                className="flex items-center gap-2 bg-orange-500 hover:bg-orange-600 text-white font-semibold text-xs sm:text-sm px-4 py-2 rounded-lg shadow-sm transition active:scale-95 cursor-pointer"
              >
                <Sparkles className="w-4 h-4 fill-white" />
                <span>Optimize with AI</span>
              </button>
            </div>
          </div>
        </div>

        {/* 1. Simple Overview Cards (4 Key Deliverables with left-accent borders) */}
        <SimpleOverviewCards summary={currentPlan.sectionSummary} />

        {/* 2. Visual 24-Hour Timeline & Corridor Matrix */}
        <VisualTimelineChart
          blocks={currentPlan.scheduleBlocks}
          selectedBlockId={selectedBlockId}
          onSelectBlock={(id) => setSelectedBlockId(id)}
          activeTime={activeTimeString}
          isSimulating={isSimulating}
          onToggleSimulation={() => setIsSimulating(!isSimulating)}
        />

        {/* 3. Selected Block Detail Drawer */}
        {currentInspectedBlock && (
          <SelectedBlockDrawer
            block={currentInspectedBlock}
            onClose={() => setSelectedBlockId(null)}
          />
        )}

        {/* 4. Live Track Section Simulation View */}
        <LiveTrackSimulator
          currentBlock={activeSimulationBlock}
          activeTime={activeTimeString}
        />

        {/* 5. Conflict Verifier & Asset Availability Report */}
        <ConflictVerifier
          summary={currentPlan.sectionSummary}
          insights={currentPlan.aiOptimizationInsights}
          simpleExplanation={currentPlan.simpleExplanation}
        />

        {/* 6. Smart Timetable Table */}
        <TimetableTable
          blocks={currentPlan.scheduleBlocks}
          selectedBlockId={selectedBlockId}
          onSelectBlock={(id) => setSelectedBlockId(id)}
          onOpenPrintModal={() => setIsPrintModalOpen(true)}
        />
      </main>

      {/* AI Re-plan Modal */}
      <AiPlannerModal
        isOpen={isAiModalOpen}
        onClose={() => setIsAiModalOpen(false)}
        selectedRoute={selectedRoute}
        onOptimizePlan={handleOptimizePlan}
        isLoading={isLoading}
      />

      {/* Print Export Modal */}
      <PrintExportModal
        isOpen={isPrintModalOpen}
        onClose={() => setIsPrintModalOpen(false)}
        plan={currentPlan}
      />

      {/* Footer */}
      <footer className="bg-white border-t border-slate-200 py-6 mt-12 text-slate-500 text-xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <div className="w-5 h-5 bg-orange-500 rounded flex items-center justify-center font-bold text-[10px] text-white">
              IR
            </div>
            <span className="font-semibold text-slate-700">
              Indian Railways Automatic Block Planning & Asset Availability Engine
            </span>
          </div>
          <div className="flex items-center gap-4 text-[11px] text-slate-500">
            <span>Safety Assurance: 100% Conflict Free</span>
            <span>•</span>
            <span>Asset Availability: {currentPlan.sectionSummary.assetAvailabilityPercent}%</span>
            <span>•</span>
            <span>RDSO Operational Standard</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
