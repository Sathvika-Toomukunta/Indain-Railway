import React from 'react';
import { Train, ShieldCheck, Sparkles, RefreshCw, Clock, ArrowRight, UserCheck } from 'lucide-react';
import { RoutePreset } from '../types';
import { ROUTE_PRESETS } from '../data/samplePlans';

interface HeaderProps {
  selectedRoute: RoutePreset;
  onRouteChange: (route: RoutePreset) => void;
  onOpenAiPlanner: () => void;
  onResetDefault: () => void;
  isAiLoading: boolean;
  activeTime: string;
}

export const Header: React.FC<HeaderProps> = ({
  selectedRoute,
  onRouteChange,
  onOpenAiPlanner,
  onResetDefault,
  isAiLoading,
  activeTime,
}) => {
  return (
    <header id="main-header" className="bg-slate-900 text-white border-b border-slate-800 sticky top-0 z-30 shadow-md">
      {/* Top Ministry / IR Banner Strip */}
      <div className="bg-slate-950 border-b border-slate-800/80 text-slate-300 px-4 sm:px-6 py-1 text-[11px] font-medium flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="bg-orange-500 text-white px-1.5 py-0.2 rounded text-[9px] uppercase font-black tracking-wider">
            IR
          </span>
          <span className="text-slate-300">
            Ministry of Railways • National Automatic Block Planning & Asset Availability Engine
          </span>
        </div>
        <div className="hidden sm:flex items-center gap-4 text-[11px]">
          <span className="flex items-center gap-1.5 text-slate-400">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
            AI Engine: <strong className="text-emerald-400">Online & Optimized</strong>
          </span>
          <span className="text-slate-500">|</span>
          <span className="text-slate-400 font-mono">RDSO Safe Margin: 100%</span>
        </div>
      </div>

      {/* Main Navbar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-4">
        {/* Brand & Title */}
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 bg-orange-500 rounded flex items-center justify-center font-black text-sm text-white shadow-sm shrink-0">
            IR
          </div>
          <div>
            <h1 className="text-base sm:text-lg font-bold tracking-tight uppercase flex items-center gap-2">
              RailPlan AI <span className="text-slate-400 font-normal text-xs sm:text-sm normal-case">| Asset Availability Engine</span>
            </h1>
          </div>
        </div>

        {/* Status, Route Selector & Action Controls */}
        <div className="flex items-center gap-3 sm:gap-5">
          {/* Section Corridor Selector */}
          <div className="text-right hidden md:block">
            <p className="text-[10px] text-slate-400 uppercase tracking-widest font-semibold">Section Status</p>
            <p className="text-xs font-semibold text-emerald-400 flex items-center justify-end gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400"></span>
              {selectedRoute.name.split('–')[0].trim()} (Optimal)
            </p>
          </div>

          <div className="relative">
            <label htmlFor="route-select" className="sr-only">Select Route Section</label>
            <select
              id="route-select"
              value={selectedRoute.id}
              onChange={(e) => {
                const found = ROUTE_PRESETS.find((r) => r.id === e.target.value);
                if (found) onRouteChange(found);
              }}
              className="bg-slate-800 hover:bg-slate-750 border border-slate-700 text-slate-200 text-xs font-semibold rounded-md px-3 py-1.5 pr-8 focus:ring-2 focus:ring-orange-500 focus:border-orange-500 outline-none cursor-pointer transition"
            >
              {ROUTE_PRESETS.map((route) => (
                <option key={route.id} value={route.id}>
                  📍 {route.name}
                </option>
              ))}
            </select>
          </div>

          {/* Time indicator */}
          <div className="hidden lg:flex items-center gap-1.5 bg-slate-800 border border-slate-700 px-2.5 py-1.5 rounded-md text-xs font-mono text-slate-300">
            <Clock className="w-3.5 h-3.5 text-amber-400" />
            <span>Clock: <strong className="text-white">{activeTime}</strong></span>
          </div>

          {/* AI Re-plan Button */}
          <button
            id="open-ai-planner-btn"
            onClick={onOpenAiPlanner}
            disabled={isAiLoading}
            className="flex items-center gap-1.5 bg-orange-500 hover:bg-orange-600 text-white font-semibold text-xs px-3.5 py-1.5 rounded-md shadow-sm transition active:scale-95 disabled:opacity-50 cursor-pointer"
          >
            {isAiLoading ? (
              <>
                <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                <span>Optimizing...</span>
              </>
            ) : (
              <>
                <Sparkles className="w-3.5 h-3.5 text-white fill-white" />
                <span>AI Re-Plan</span>
              </>
            )}
          </button>

          {/* Chief Controller Avatar badge */}
          <div className="w-8 h-8 rounded-full bg-slate-700 border border-slate-600 flex items-center justify-center text-xs font-bold text-slate-200 shrink-0" title="Chief Operations Controller">
            CO
          </div>
        </div>
      </div>
    </header>
  );
};
