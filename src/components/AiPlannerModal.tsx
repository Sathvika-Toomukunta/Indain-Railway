import React, { useState } from 'react';
import { X, Sparkles, Sliders, CheckCircle2, ShieldCheck, RefreshCw, Train, Wrench } from 'lucide-react';
import { RoutePreset } from '../types';
import { ROUTE_PRESETS } from '../data/samplePlans';

interface AiPlannerModalProps {
  isOpen: boolean;
  onClose: () => void;
  selectedRoute: RoutePreset;
  onOptimizePlan: (params: any) => Promise<void>;
  isLoading: boolean;
}

export const AiPlannerModal: React.FC<AiPlannerModalProps> = ({
  isOpen,
  onClose,
  selectedRoute,
  onOptimizePlan,
  isLoading,
}) => {
  const [routeId, setRouteId] = useState<string>(selectedRoute.id);
  const [trackRepairHours, setTrackRepairHours] = useState<number>(2);
  const [signalCheckHours, setSignalCheckHours] = useState<number>(2);
  const [passengerPriority, setPassengerPriority] = useState<string>('high_rush');
  const [freightTarget, setFreightTarget] = useState<number>(14);
  const [electrificationCheck, setElectrificationCheck] = useState<boolean>(true);

  if (!isOpen) return null;

  const currentRouteObj = ROUTE_PRESETS.find((r) => r.id === routeId) || selectedRoute;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const maintenanceNeeds = [];
    if (trackRepairHours > 0) {
      maintenanceNeeds.push(`Track Tamping & Deep Ballast Renewal (${trackRepairHours} hrs)`);
    }
    if (signalCheckHours > 0) {
      maintenanceNeeds.push(`Signal & Telecom Electronic Interlocking testing (${signalCheckHours} hrs)`);
    }
    if (electrificationCheck) {
      maintenanceNeeds.push(`OHE Electrical Wire inspection & Cantilever check`);
    }

    await onOptimizePlan({
      sectionName: currentRouteObj.name,
      zone: currentRouteObj.zone,
      trackType: currentRouteObj.lines,
      maintenanceNeeds,
      passengerPriority:
        passengerPriority === 'high_rush'
          ? 'Morning Peak (06:00-10:00) & Evening Peak (18:00-23:00) Protected'
          : 'Uniform Passenger Intervals',
      freightTargetTrains: `${freightTarget} rakes per 24 hours`,
    });
    onClose();
  };

  return (
    <div id="ai-planner-modal" className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="bg-white border border-slate-200 rounded-xl max-w-lg w-full overflow-hidden shadow-2xl">
        {/* Modal Header */}
        <div className="p-5 bg-slate-900 text-white flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded bg-orange-500 text-white flex items-center justify-center font-black text-sm">
              IR
            </div>
            <div>
              <h3 className="text-base font-bold text-white">AI Block Planning Generator</h3>
              <p className="text-xs text-slate-300">Configure parameters for automatic clash-free scheduling</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-white p-1 rounded-lg hover:bg-slate-800 transition cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body / Form */}
        <form onSubmit={handleSubmit} className="p-5 space-y-4 text-xs">
          {/* Section Corridor Selection */}
          <div>
            <label className="block text-slate-700 font-bold mb-1">
              Railway Section / Corridor
            </label>
            <select
              value={routeId}
              onChange={(e) => setRouteId(e.target.value)}
              className="w-full bg-slate-50 border border-slate-300 rounded-md p-2.5 text-slate-900 font-medium outline-none focus:ring-2 focus:ring-orange-500"
            >
              {ROUTE_PRESETS.map((r) => (
                <option key={r.id} value={r.id}>
                  {r.name} ({r.zone})
                </option>
              ))}
            </select>
          </div>

          {/* Maintenance Repair Slots */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-slate-700 font-bold mb-1">
                Track Repair Window
              </label>
              <div className="flex items-center gap-2">
                <input
                  type="range"
                  min={1}
                  max={4}
                  value={trackRepairHours}
                  onChange={(e) => setTrackRepairHours(Number(e.target.value))}
                  className="flex-1 accent-orange-500"
                />
                <span className="font-mono font-bold text-slate-900 bg-slate-100 px-2 py-1 rounded border border-slate-300">
                  {trackRepairHours} hrs
                </span>
              </div>
            </div>

            <div>
              <label className="block text-slate-700 font-bold mb-1">
                Signal & Point Check
              </label>
              <div className="flex items-center gap-2">
                <input
                  type="range"
                  min={1}
                  max={4}
                  value={signalCheckHours}
                  onChange={(e) => setSignalCheckHours(Number(e.target.value))}
                  className="flex-1 accent-orange-500"
                />
                <span className="font-mono font-bold text-slate-900 bg-slate-100 px-2 py-1 rounded border border-slate-300">
                  {signalCheckHours} hrs
                </span>
              </div>
            </div>
          </div>

          {/* Passenger Flow Priority */}
          <div>
            <label className="block text-slate-700 font-bold mb-1">
              Passenger Train Priority Profile
            </label>
            <div className="grid grid-cols-2 gap-2">
              <label
                onClick={() => setPassengerPriority('high_rush')}
                className={`p-2.5 rounded-md border text-left cursor-pointer flex flex-col justify-between transition ${
                  passengerPriority === 'high_rush'
                    ? 'bg-blue-50 border-blue-400 text-blue-900'
                    : 'bg-slate-50 border-slate-200 text-slate-600 hover:bg-slate-100'
                }`}
              >
                <span className="font-bold text-xs">Peak Hour Shield</span>
                <span className="text-[10px] text-slate-500 mt-1">
                  06:00-10:00 & 18:00-23:00
                </span>
              </label>

              <label
                onClick={() => setPassengerPriority('uniform')}
                className={`p-2.5 rounded-md border text-left cursor-pointer flex flex-col justify-between transition ${
                  passengerPriority === 'uniform'
                    ? 'bg-blue-50 border-blue-400 text-blue-900'
                    : 'bg-slate-50 border-slate-200 text-slate-600 hover:bg-slate-100'
                }`}
              >
                <span className="font-bold text-xs">Equal Intervals</span>
                <span className="text-[10px] text-slate-500 mt-1">
                  Even spacing across day
                </span>
              </label>
            </div>
          </div>

          {/* Freight Target */}
          <div>
            <label className="block text-slate-700 font-bold mb-1">
              Freight Throughput Target (Rakes / 24h)
            </label>
            <div className="flex items-center gap-3">
              <input
                type="number"
                min={6}
                max={30}
                value={freightTarget}
                onChange={(e) => setFreightTarget(Number(e.target.value))}
                className="w-24 bg-slate-50 border border-slate-300 rounded-md p-2 text-slate-900 font-bold font-mono outline-none"
              />
              <span className="text-slate-500 text-[11px]">
                Target: {freightTarget} goods rakes scheduled in mid-day & night freight corridors
              </span>
            </div>
          </div>

          {/* Checkbox for OHE */}
          <div className="flex items-center gap-2 pt-1">
            <input
              type="checkbox"
              id="ohe-checkbox"
              checked={electrificationCheck}
              onChange={(e) => setElectrificationCheck(e.target.checked)}
              className="w-4 h-4 text-orange-500 rounded border-slate-300 focus:ring-orange-400"
            />
            <label htmlFor="ohe-checkbox" className="text-slate-700 font-medium select-none cursor-pointer">
              Include Overhead Electrification (OHE) wire inspection window
            </label>
          </div>

          {/* Modal Footer / Submit */}
          <div className="pt-3 border-t border-slate-200 flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-md font-semibold text-xs transition cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isLoading}
              className="px-4 py-2 bg-orange-500 hover:bg-orange-600 text-white rounded-md font-semibold text-xs shadow-sm flex items-center gap-1.5 transition active:scale-95 disabled:opacity-50 cursor-pointer"
            >
              {isLoading ? (
                <>
                  <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                  <span>Computing Optimal Blocks...</span>
                </>
              ) : (
                <>
                  <Sparkles className="w-3.5 h-3.5 fill-current" />
                  <span>Generate AI Timetable</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
