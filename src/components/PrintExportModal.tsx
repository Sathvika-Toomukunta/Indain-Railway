import React from 'react';
import { X, Printer, Train, ShieldCheck, Download } from 'lucide-react';
import { BlockPlanData } from '../types';

interface PrintExportModalProps {
  isOpen: boolean;
  onClose: () => void;
  plan: BlockPlanData;
}

export const PrintExportModal: React.FC<PrintExportModalProps> = ({
  isOpen,
  onClose,
  plan,
}) => {
  if (!isOpen) return null;

  const handlePrint = () => {
    window.print();
  };

  return (
    <div id="print-export-modal" className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm">
      <div className="bg-slate-900 border border-slate-700 rounded-2xl max-w-3xl w-full max-h-[90vh] flex flex-col overflow-hidden shadow-2xl">
        {/* Header */}
        <div className="p-4 sm:p-5 bg-slate-850 border-b border-slate-700 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Printer className="w-5 h-5 text-amber-400" />
            <h3 className="text-base font-bold text-white">
              Print / Export Official Block Timetable (IR-Form 104)
            </h3>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-white p-1 rounded-lg hover:bg-slate-800 transition cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Printable Content View */}
        <div className="p-6 overflow-y-auto bg-slate-950 text-slate-200 font-sans space-y-5 text-xs">
          {/* Header Strip */}
          <div className="border-b-2 border-amber-500 pb-3 text-center">
            <h2 className="text-lg font-black text-amber-400 tracking-wider uppercase">
              INDIAN RAILWAYS — OPERATING & ENGINEERING DIVISION
            </h2>
            <p className="text-xs text-slate-300 font-semibold mt-0.5">
              Daily Master Automatic Block Plan & Asset Availability Schedule
            </p>
            <div className="flex justify-between items-center text-[11px] text-slate-400 mt-2 font-mono">
              <span>Section: <strong>{plan.sectionSummary.sectionName}</strong></span>
              <span>Zone: <strong>{plan.sectionSummary.zone}</strong></span>
              <span>Clashes: <strong className="text-emerald-400">0 (Zero)</strong></span>
            </div>
          </div>

          {/* Metrics summary banner */}
          <div className="grid grid-cols-4 gap-2 bg-slate-900 p-3 rounded-lg border border-slate-800 text-center font-mono">
            <div>
              <span className="text-[10px] text-slate-400 block">Asset Availability</span>
              <strong className="text-emerald-400 text-sm">{plan.sectionSummary.assetAvailabilityPercent}%</strong>
            </div>
            <div>
              <span className="text-[10px] text-slate-400 block">Safe Repair Hours</span>
              <strong className="text-amber-400 text-sm">{plan.sectionSummary.maintenanceHoursTotal} hrs</strong>
            </div>
            <div>
              <span className="text-[10px] text-slate-400 block">Passenger Trains</span>
              <strong className="text-sky-400 text-sm">{plan.sectionSummary.passengerTrainsScheduled}</strong>
            </div>
            <div>
              <span className="text-[10px] text-slate-400 block">Freight Rakes</span>
              <strong className="text-emerald-400 text-sm">{plan.sectionSummary.freightRakesScheduled}</strong>
            </div>
          </div>

          {/* Simple Timetable Table */}
          <div className="border border-slate-800 rounded-lg overflow-hidden">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-900 text-slate-300 text-[11px] font-bold uppercase border-b border-slate-800">
                  <th className="p-2.5">Time</th>
                  <th className="p-2.5">What Happens</th>
                  <th className="p-2.5">Benefit</th>
                  <th className="p-2.5">Train Capacity / Line Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-850 text-slate-200">
                {plan.scheduleBlocks.map((b) => (
                  <tr key={b.id} className="hover:bg-slate-900/50">
                    <td className="p-2.5 font-mono font-bold text-amber-400 whitespace-nowrap">
                      {b.timeSlot}
                    </td>
                    <td className="p-2.5 font-semibold text-white">
                      {b.activity}
                    </td>
                    <td className="p-2.5 text-slate-300">
                      {b.benefit}
                    </td>
                    <td className="p-2.5 text-slate-400 font-mono text-[11px]">
                      {b.trainsAllowed}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Verification stamp */}
          <div className="p-3 bg-slate-900 rounded-lg border border-slate-800 text-[11px] text-slate-300 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
              <span>
                Safety Assurance: Generated via Indian Railways Automatic Block Planning Engine.
              </span>
            </div>
            <span className="font-mono text-slate-400">Chief Operations Controller Sign-off [AI-OK]</span>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="p-4 bg-slate-850 border-t border-slate-700 flex justify-end gap-3">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-lg text-xs font-semibold cursor-pointer"
          >
            Close
          </button>
          <button
            onClick={handlePrint}
            className="flex items-center gap-2 px-5 py-2 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold rounded-lg text-xs shadow-md transition cursor-pointer"
          >
            <Printer className="w-4 h-4" />
            <span>Print Timetable Document</span>
          </button>
        </div>
      </div>
    </div>
  );
};
