import React from 'react';
import { ScheduleBlock } from '../types';
import { X, Clock, Train, Wrench, Shield, CheckCircle2, ChevronRight, Gauge } from 'lucide-react';

interface SelectedBlockDrawerProps {
  block: ScheduleBlock | undefined;
  onClose: () => void;
}

export const SelectedBlockDrawer: React.FC<SelectedBlockDrawerProps> = ({
  block,
  onClose,
}) => {
  if (!block) return null;

  const isMaintenance = block.category === 'maintenance';
  const isPassenger = block.category === 'passenger';
  const isFreight = block.category === 'freight';

  return (
    <div id="block-detail-panel" className="bg-white border border-slate-200 rounded-xl p-5 mb-6 shadow-sm">
      <div className="flex items-start justify-between gap-4 mb-4">
        <div className="flex items-center gap-3">
          <div className={`w-10 h-10 rounded-lg flex items-center justify-center font-bold ${
            isMaintenance
              ? 'bg-amber-100 text-amber-900 border border-amber-300'
              : isPassenger
              ? 'bg-blue-100 text-blue-900 border border-blue-300'
              : 'bg-emerald-100 text-emerald-900 border border-emerald-300'
          }`}>
            {isMaintenance ? <Wrench className="w-5 h-5" /> : <Train className="w-5 h-5" />}
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-mono font-bold bg-slate-100 px-2 py-0.5 rounded text-slate-800 border border-slate-200">
                {block.timeSlot}
              </span>
              <span className={`text-[11px] font-bold px-2 py-0.5 rounded-full capitalize ${
                isMaintenance
                  ? 'bg-amber-100 text-amber-900 border border-amber-300'
                  : isPassenger
                  ? 'bg-blue-100 text-blue-900 border border-blue-300'
                  : 'bg-emerald-100 text-emerald-900 border border-emerald-300'
              }`}>
                {block.category}
              </span>
            </div>
            <h3 className="text-base font-bold text-slate-900 mt-1">
              {block.activity}
            </h3>
          </div>
        </div>

        <button
          onClick={onClose}
          className="text-slate-400 hover:text-slate-700 p-1.5 rounded-lg hover:bg-slate-100 transition cursor-pointer"
          title="Close detail panel"
        >
          <X className="w-4 h-4" />
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
        {/* Core Benefit */}
        <div className="bg-slate-50 p-3.5 rounded-lg border border-slate-200">
          <span className="text-xs font-bold text-slate-500 uppercase tracking-wider block mb-1">
            Operational Benefit
          </span>
          <p className="text-slate-800 leading-relaxed font-medium">
            <span className="text-emerald-600 font-bold">✓ </span>
            {block.benefit}
          </p>
        </div>

        {/* Capacity / Trains Allowed */}
        <div className="bg-slate-50 p-3.5 rounded-lg border border-slate-200">
          <span className="text-xs font-bold text-slate-500 uppercase tracking-wider block mb-1">
            Permitted Train Capacity
          </span>
          <p className="text-slate-900 font-mono font-bold text-sm">
            {block.trainsAllowed}
          </p>
          <span className="text-[11px] text-slate-500 block mt-1">
            Status: <strong className="text-slate-700 font-medium">{block.trackStatus || 'Normal Line Operations'}</strong>
          </span>
        </div>

        {/* Safety & Protocol */}
        <div className="bg-slate-50 p-3.5 rounded-lg border border-slate-200">
          <span className="text-xs font-bold text-slate-500 uppercase tracking-wider block mb-1">
            Safety & Department
          </span>
          <p className="text-amber-900 font-medium">
            {block.safetyProtocol || 'Automatic Track Protection Active'}
          </p>
          <span className="text-[11px] text-slate-500 block mt-1">
            Responsible: <strong className="text-slate-700">{block.department || 'Operating Division'}</strong>
          </span>
        </div>
      </div>
    </div>
  );
};
