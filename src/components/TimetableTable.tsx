import React, { useState } from 'react';
import { ScheduleBlock } from '../types';
import { Train, Wrench, Shield, CheckCircle2, ChevronRight, Eye, Printer, Filter } from 'lucide-react';

interface TimetableTableProps {
  blocks: ScheduleBlock[];
  selectedBlockId: string | null;
  onSelectBlock: (blockId: string) => void;
  onOpenPrintModal: () => void;
}

export const TimetableTable: React.FC<TimetableTableProps> = ({
  blocks,
  selectedBlockId,
  onSelectBlock,
  onOpenPrintModal,
}) => {
  const [viewMode, setViewMode] = useState<'simple' | 'detailed'>('simple');
  const [selectedFilter, setSelectedFilter] = useState<string>('all');

  const getCategoryBadge = (category: string) => {
    switch (category) {
      case 'passenger':
        return (
          <span className="inline-flex items-center gap-1 bg-blue-100 text-blue-800 border border-blue-200 px-2 py-0.5 rounded text-xs font-bold uppercase">
            <Train className="w-3 h-3 text-blue-600" /> Passenger
          </span>
        );
      case 'freight':
        return (
          <span className="inline-flex items-center gap-1 bg-emerald-100 text-emerald-800 border border-emerald-200 px-2 py-0.5 rounded text-xs font-bold uppercase">
            <Train className="w-3 h-3 text-emerald-600" /> Freight
          </span>
        );
      case 'maintenance':
        return (
          <span className="inline-flex items-center gap-1 bg-amber-50 text-amber-900 border-2 border-dashed border-amber-400 px-2 py-0.5 rounded text-xs font-bold uppercase">
            <Wrench className="w-3 h-3 text-amber-700" /> Maint. Block
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center gap-1 bg-purple-100 text-purple-800 border border-purple-200 px-2 py-0.5 rounded text-xs font-bold uppercase">
            <Shield className="w-3 h-3 text-purple-600" /> Inspection
          </span>
        );
    }
  };

  const filteredBlocks = blocks.filter((b) => {
    if (selectedFilter === 'all') return true;
    return b.category === selectedFilter;
  });

  return (
    <div id="smart-timetable-table" className="bg-white border border-slate-200 rounded-xl overflow-hidden shadow-sm mb-6">
      {/* Table Header Controls */}
      <div className="p-4 sm:p-5 border-b border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
              <Train className="w-4 h-4 text-orange-500" />
              Smart Automatic Block Timetable (Schedule)
            </h2>
            <span className="text-xs bg-emerald-100 text-emerald-800 border border-emerald-200 px-2 py-0.5 rounded font-semibold">
              Balanced Operations
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-0.5">
            Output showing clear slots when trains run and when tracks are free for repair.
          </p>
        </div>

        {/* View mode toggle & Print export button */}
        <div className="flex items-center gap-2.5 flex-wrap">
          <div className="flex items-center bg-slate-100 rounded-lg p-0.5 border border-slate-200 text-xs">
            <button
              onClick={() => setViewMode('simple')}
              className={`px-3 py-1.5 rounded-md font-semibold transition cursor-pointer ${
                viewMode === 'simple'
                  ? 'bg-white text-slate-900 shadow-xs'
                  : 'text-slate-500 hover:text-slate-900'
              }`}
            >
              Simple View
            </button>
            <button
              onClick={() => setViewMode('detailed')}
              className={`px-3 py-1.5 rounded-md font-semibold transition cursor-pointer ${
                viewMode === 'detailed'
                  ? 'bg-white text-slate-900 shadow-xs'
                  : 'text-slate-500 hover:text-slate-900'
              }`}
            >
              Full Operational View
            </button>
          </div>

          <button
            onClick={onOpenPrintModal}
            className="flex items-center gap-1.5 bg-slate-800 hover:bg-slate-900 text-white text-xs font-semibold px-3 py-1.5 rounded-md transition cursor-pointer shadow-sm"
          >
            <Printer className="w-3.5 h-3.5" />
            <span>Export / Print</span>
          </button>
        </div>
      </div>

      {/* Main Table */}
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-slate-100 text-slate-600 text-[11px] uppercase tracking-wider font-bold border-b border-slate-200">
              <th className="py-3 px-4 sm:px-6">Time Slot</th>
              <th className="py-3 px-4">Category</th>
              <th className="py-3 px-4">What Happens</th>
              <th className="py-3 px-4">Benefit</th>
              {viewMode === 'detailed' && (
                <>
                  <th className="py-3 px-4">Available Trains / Status</th>
                  <th className="py-3 px-4">Department & Safety</th>
                </>
              )}
              <th className="py-3 px-4 text-right">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-200 text-xs sm:text-sm">
            {filteredBlocks.map((block) => {
              const isSelected = selectedBlockId === block.id;

              return (
                <tr
                  key={block.id}
                  onClick={() => onSelectBlock(block.id)}
                  className={`transition-colors cursor-pointer ${
                    isSelected
                      ? 'bg-amber-50/80 border-l-4 border-l-amber-500'
                      : 'hover:bg-slate-50'
                  }`}
                >
                  {/* Time */}
                  <td className="py-3.5 px-4 sm:px-6 whitespace-nowrap font-mono font-bold text-slate-900">
                    <div className="flex items-center gap-2">
                      <span className="text-amber-600">🕒</span>
                      <span>{block.timeSlot}</span>
                    </div>
                  </td>

                  {/* Category */}
                  <td className="py-3.5 px-4 whitespace-nowrap">
                    {getCategoryBadge(block.category)}
                  </td>

                  {/* What Happens */}
                  <td className="py-3.5 px-4 font-semibold text-slate-900">
                    <div className="flex items-center gap-2">
                      {block.activity}
                    </div>
                  </td>

                  {/* Benefit */}
                  <td className="py-3.5 px-4 text-slate-600">
                    <span className="text-emerald-600 font-bold">✓ </span>
                    {block.benefit}
                  </td>

                  {/* Detailed Extra Columns */}
                  {viewMode === 'detailed' && (
                    <>
                      <td className="py-3.5 px-4 text-slate-700 text-xs">
                        <span className="font-bold text-slate-900 block font-mono">
                          {block.trainsAllowed}
                        </span>
                        <span className="text-slate-500 text-[11px]">
                          {block.trackStatus}
                        </span>
                      </td>
                      <td className="py-3.5 px-4 text-slate-700 text-xs">
                        <span className="bg-slate-100 px-2 py-0.5 rounded text-[11px] font-mono text-slate-700 block w-fit mb-1 border border-slate-200">
                          {block.department || 'Operating'}
                        </span>
                        <span className="text-slate-500 text-[11px]">
                          {block.safetyProtocol}
                        </span>
                      </td>
                    </>
                  )}

                  {/* Row click / select indicator */}
                  <td className="py-3.5 px-4 text-right whitespace-nowrap">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        onSelectBlock(block.id);
                      }}
                      className={`inline-flex items-center gap-1 text-xs font-semibold px-2.5 py-1 rounded transition ${
                        isSelected
                          ? 'bg-amber-500 text-slate-950 font-bold shadow-xs'
                          : 'bg-slate-100 hover:bg-slate-200 text-slate-700 border border-slate-200'
                      }`}
                    >
                      <Eye className="w-3.5 h-3.5" />
                      <span>{isSelected ? 'Active' : 'Details'}</span>
                    </button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Footer Table Summary */}
      <div className="p-3.5 bg-slate-50 border-t border-slate-200 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-500 gap-2">
        <div className="flex items-center gap-2 text-slate-700">
          <CheckCircle2 className="w-4 h-4 text-emerald-600" />
          <span>
            <strong>Operational Guarantee:</strong> High-speed passenger runs + 100% clash-free track repair windows.
          </span>
        </div>
        <span className="text-[11px] text-slate-500 font-mono">
          Showing {filteredBlocks.length} planned schedule blocks
        </span>
      </div>
    </div>
  );
};
