import React from 'react';
import { ScheduleBlock } from '../types';
import { Train, Wrench, ShieldAlert, Signal, Activity, Gauge } from 'lucide-react';

interface LiveTrackSimulatorProps {
  currentBlock: ScheduleBlock | undefined;
  activeTime: string;
}

export const LiveTrackSimulator: React.FC<LiveTrackSimulatorProps> = ({
  currentBlock,
  activeTime,
}) => {
  const isMaintenance = currentBlock?.category === 'maintenance';
  const isFreight = currentBlock?.category === 'freight';
  const isPassenger = currentBlock?.category === 'passenger';

  return (
    <div id="live-track-simulator" className="bg-white border border-slate-200 rounded-xl p-5 mb-6 shadow-sm">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-4">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
              <Activity className="w-4 h-4 text-emerald-600" />
              Live Track Section Monitor
            </h2>
            <span className="text-xs bg-slate-100 border border-slate-300 text-slate-800 px-2 py-0.5 rounded font-mono font-bold">
              Time: {activeTime}
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-0.5">
            Active physical status on Up & Down Broad Gauge tracks during slot: <strong className="text-slate-800">{currentBlock?.timeSlot}</strong>
          </p>
        </div>

        {/* Current State Tag */}
        <div className="flex items-center gap-2">
          {isMaintenance ? (
            <span className="flex items-center gap-1.5 bg-amber-50 text-amber-900 border-2 border-dashed border-amber-400 px-3 py-1 rounded-md text-xs font-bold animate-pulse">
              <Wrench className="w-3.5 h-3.5" /> Maintenance Block Active
            </span>
          ) : isPassenger ? (
            <span className="flex items-center gap-1.5 bg-blue-50 text-blue-800 border border-blue-200 px-3 py-1 rounded-md text-xs font-bold">
              <Train className="w-3.5 h-3.5 text-blue-600" /> Passenger Express Flow
            </span>
          ) : (
            <span className="flex items-center gap-1.5 bg-emerald-50 text-emerald-800 border border-emerald-200 px-3 py-1 rounded-md text-xs font-bold">
              <Train className="w-3.5 h-3.5 text-emerald-600" /> Dedicated Freight Flow
            </span>
          )}
        </div>
      </div>

      {/* Railway Track Visual Box */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 sm:p-6 relative overflow-hidden space-y-6">
        {/* Track 1: UP LINE */}
        <div>
          <div className="flex items-center justify-between text-xs mb-1.5">
            <span className="font-mono font-semibold text-slate-200 flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-400"></span>
              Track 1 (UP LINE — Mainline 130 km/h)
            </span>
            <span className="text-[11px] text-slate-400 font-mono">
              Signal: <strong className="text-emerald-400 font-bold">PROCEED (GREEN)</strong>
            </span>
          </div>

          {/* Rail Track Representation */}
          <div className="relative h-14 bg-slate-950 border-y-2 border-slate-700 rounded flex items-center overflow-hidden rail-pattern">
            {/* Sleepers background */}
            <div className="absolute inset-0 opacity-20 bg-[linear-gradient(90deg,#475569_2px,transparent_2px)] bg-[size:16px_100%]"></div>

            {/* Train moving or clear track */}
            {isPassenger && (
              <div className="absolute left-1/4 transform -translate-x-1/2 flex items-center gap-2 bg-blue-500 text-white px-3 py-1.5 rounded-md shadow-md border border-blue-400 font-bold text-xs">
                <Train className="w-4 h-4 animate-bounce" />
                <span>12002 Vande Bharat Express (130 km/h)</span>
              </div>
            )}

            {isFreight && (
              <div className="absolute left-1/3 transform -translate-x-1/2 flex items-center gap-2 bg-emerald-500 text-slate-950 px-3 py-1.5 rounded-md shadow-md border border-emerald-400 font-bold text-xs">
                <Train className="w-4 h-4" />
                <span>BOXNHL Freight Rake (75 km/h)</span>
              </div>
            )}

            {isMaintenance && (
              <div className="absolute left-1/2 transform -translate-x-1/2 flex items-center gap-2 bg-slate-800 text-slate-300 px-3 py-1 rounded text-xs border border-slate-700 font-medium">
                <span>Single-line bidirectional pilotage active (Speed restricted: 30 km/h)</span>
              </div>
            )}
          </div>
        </div>

        {/* Track 2: DOWN LINE */}
        <div>
          <div className="flex items-center justify-between text-xs mb-1.5">
            <span className="font-mono font-semibold text-slate-200 flex items-center gap-2">
              <span className={`w-2.5 h-2.5 rounded-full ${isMaintenance ? 'bg-amber-400 animate-ping' : 'bg-emerald-400'}`}></span>
              Track 2 (DOWN LINE — {isMaintenance ? 'UNDER MAINTENANCE BLOCK' : 'Mainline Clear'})
            </span>
            <span className="text-[11px] text-slate-400 font-mono">
              Status: {isMaintenance ? (
                <strong className="text-amber-400 font-bold">BLOCKED FOR CREW SAFETY (RED)</strong>
              ) : (
                <strong className="text-emerald-400 font-bold">CLEAR & ENERGIZED</strong>
              )}
            </span>
          </div>

          {/* Rail Track 2 */}
          <div className={`relative h-14 bg-slate-950 border-y-2 border-slate-700 rounded flex items-center overflow-hidden ${
            isMaintenance ? 'hazard-stripe border-amber-500/60' : 'rail-pattern'
          }`}>
            {/* Sleepers */}
            <div className="absolute inset-0 opacity-20 bg-[linear-gradient(90deg,#475569_2px,transparent_2px)] bg-[size:16px_100%]"></div>

            {isMaintenance ? (
              <div className="absolute left-1/2 transform -translate-x-1/2 flex items-center gap-3 bg-amber-400 text-slate-950 px-4 py-2 rounded-md shadow-lg border border-amber-300 font-bold text-xs">
                <Wrench className="w-4 h-4 animate-spin" />
                <span>Track Repair Crew Active • Machine Tamping & Welding (0 Trains Allowed)</span>
              </div>
            ) : isPassenger ? (
              <div className="absolute right-1/4 transform translate-x-1/2 flex items-center gap-2 bg-blue-500 text-white px-3 py-1.5 rounded-md shadow-md border border-blue-400 font-bold text-xs">
                <Train className="w-4 h-4" />
                <span>12424 Rajdhani Superfast (130 km/h)</span>
              </div>
            ) : (
              <div className="absolute right-1/3 transform translate-x-1/2 flex items-center gap-2 bg-emerald-500 text-slate-950 px-3 py-1.5 rounded-md shadow-md border border-emerald-400 font-bold text-xs">
                <Train className="w-4 h-4" />
                <span>Container Cargo Express (80 km/h)</span>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Info Callout Bar */}
      <div className="mt-4 p-3 rounded-lg bg-slate-50 border border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs">
        <div className="flex items-center gap-2 text-slate-700">
          <span className="text-slate-900 font-bold uppercase tracking-wider text-[10px]">Active Protocol:</span>
          <span>{currentBlock?.safetyProtocol || 'Automatic Block Signaling and continuous Kavach ATP system.'}</span>
        </div>
        <div className="text-slate-500">
          Responsible: <strong className="text-slate-800">{currentBlock?.department || 'Operating Division'}</strong>
        </div>
      </div>
    </div>
  );
};
