import React, { useState } from 'react';
import { ScheduleBlock, BlockCategory } from '../types';
import { Clock, Play, Pause, ShieldCheck, Layers, LayoutGrid, Calendar } from 'lucide-react';

interface VisualTimelineChartProps {
  blocks: ScheduleBlock[];
  selectedBlockId: string | null;
  onSelectBlock: (blockId: string) => void;
  activeTime: string;
  isSimulating: boolean;
  onToggleSimulation: () => void;
}

export const VisualTimelineChart: React.FC<VisualTimelineChartProps> = ({
  blocks,
  selectedBlockId,
  onSelectBlock,
  activeTime,
  isSimulating,
  onToggleSimulation,
}) => {
  const [viewTab, setViewTab] = useState<'matrix' | 'gantt'>('matrix');
  const [filterCategory, setFilterCategory] = useState<string>('all');

  const parseTimeToMinutes = (timeStr: string): number => {
    const [h, m] = timeStr.split(':').map(Number);
    return (h || 0) * 60 + (m || 0);
  };

  const getCategoryStyles = (category: BlockCategory, isSelected: boolean) => {
    switch (category) {
      case 'passenger':
        return {
          card: isSelected
            ? 'bg-blue-600 text-white font-bold ring-2 ring-blue-700 shadow-md'
            : 'bg-blue-100 border border-blue-200 text-blue-900 hover:bg-blue-200/80',
          badge: 'bg-blue-200 text-blue-800',
          titleColor: isSelected ? 'text-white' : 'text-blue-950 font-bold',
          subColor: isSelected ? 'text-blue-100' : 'text-blue-700',
          label: 'PASSENGER',
        };
      case 'freight':
        return {
          card: isSelected
            ? 'bg-emerald-600 text-white font-bold ring-2 ring-emerald-700 shadow-md'
            : 'bg-emerald-100 border border-emerald-200 text-emerald-900 hover:bg-emerald-200/80',
          badge: 'bg-emerald-200 text-emerald-800',
          titleColor: isSelected ? 'text-white' : 'text-emerald-950 font-bold',
          subColor: isSelected ? 'text-emerald-100' : 'text-emerald-700',
          label: 'FREIGHT',
        };
      case 'maintenance':
        return {
          card: isSelected
            ? 'bg-amber-500 text-slate-950 font-bold ring-2 ring-amber-600 shadow-md'
            : 'bg-amber-50 border-2 border-dashed border-amber-300 text-amber-900 hover:bg-amber-100',
          badge: 'bg-amber-200 text-amber-900',
          titleColor: isSelected ? 'text-slate-950' : 'text-amber-950 font-bold',
          subColor: isSelected ? 'text-amber-950' : 'text-amber-700 font-medium',
          label: 'MAINT. BLOCK',
        };
      default:
        return {
          card: isSelected
            ? 'bg-purple-600 text-white font-bold'
            : 'bg-purple-100 border border-purple-200 text-purple-900',
          badge: 'bg-purple-200 text-purple-800',
          titleColor: isSelected ? 'text-white' : 'text-purple-950 font-bold',
          subColor: isSelected ? 'text-purple-100' : 'text-purple-700',
          label: 'INSPECTION',
        };
    }
  };

  const activeMinutes = parseTimeToMinutes(activeTime);
  const currentLeftPercent = Math.min(100, Math.max(0, (activeMinutes / 1440) * 100));
  const hoursMarks = [0, 3, 6, 9, 12, 15, 18, 21, 24];

  return (
    <div id="visual-timeline-section" className="bg-white rounded-xl border border-slate-200 shadow-sm p-5 mb-6">
      {/* Top Header Controls */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4 pb-3 border-b border-slate-200">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-base sm:text-lg font-bold text-slate-800 flex items-center gap-2">
              Automated Block Schedule
            </h2>
            <span className="text-xs font-normal text-slate-500 bg-slate-100 px-2 py-0.5 rounded border border-slate-200">
              24-Hour Optimization Plan
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-0.5">
            Balanced operational corridors for Up/Down mainlines, freight rakes, and protected maintenance windows.
          </p>
        </div>

        {/* View mode toggle & Live clock sim */}
        <div className="flex items-center gap-2 flex-wrap">
          <button
            onClick={onToggleSimulation}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded text-xs font-semibold transition cursor-pointer border ${
              isSimulating
                ? 'bg-amber-500 border-amber-600 text-slate-950 shadow-sm'
                : 'bg-white border-slate-300 hover:bg-slate-50 text-slate-700'
            }`}
          >
            {isSimulating ? (
              <>
                <Pause className="w-3.5 h-3.5" /> Pause Clock ({activeTime})
              </>
            ) : (
              <>
                <Play className="w-3.5 h-3.5 fill-current" /> Live Clock Sim
              </>
            )}
          </button>

          <div className="flex items-center bg-slate-100 rounded-md p-0.5 border border-slate-200 text-xs">
            <button
              onClick={() => setViewTab('matrix')}
              className={`px-3 py-1 rounded text-xs font-semibold transition cursor-pointer flex items-center gap-1 ${
                viewTab === 'matrix'
                  ? 'bg-white text-slate-900 shadow-xs'
                  : 'text-slate-500 hover:text-slate-900'
              }`}
            >
              <LayoutGrid className="w-3.5 h-3.5" /> Zone Matrix
            </button>
            <button
              onClick={() => setViewTab('gantt')}
              className={`px-3 py-1 rounded text-xs font-semibold transition cursor-pointer flex items-center gap-1 ${
                viewTab === 'gantt'
                  ? 'bg-white text-slate-900 shadow-xs'
                  : 'text-slate-500 hover:text-slate-900'
              }`}
            >
              <Layers className="w-3.5 h-3.5" /> 24h Timeline
            </button>
          </div>
        </div>
      </div>

      {/* MATRIX VIEW (Structured Multi-Zone corridor timetable) */}
      {viewTab === 'matrix' ? (
        <div className="rounded-lg border border-slate-200 overflow-hidden">
          {/* Header Row: Time Slots */}
          <div className="grid grid-cols-12 bg-slate-100 border-b border-slate-200 text-center py-2.5 text-[10px] sm:text-xs font-bold text-slate-600 uppercase tracking-tight">
            <div className="col-span-12 sm:col-span-2 text-left px-4 font-semibold text-slate-700">
              Operational Zone
            </div>
            <div className="col-span-2 hidden sm:block border-l border-slate-200">06:00 – 10:00</div>
            <div className="col-span-2 hidden sm:block border-l border-slate-200">10:00 – 12:00</div>
            <div className="col-span-2 hidden sm:block border-l border-slate-200">12:00 – 16:00</div>
            <div className="col-span-2 hidden sm:block border-l border-slate-200">16:00 – 18:00</div>
            <div className="col-span-2 hidden sm:block border-l border-slate-200">18:00 – 23:00</div>
          </div>

          {/* Row 1: Section Alpha (Main Line - Up) */}
          <div className="grid grid-cols-12 border-b border-slate-200 items-stretch bg-white min-h-[72px]">
            <div className="col-span-12 sm:col-span-2 px-4 py-2 flex flex-col justify-center bg-slate-50 border-r border-slate-200">
              <p className="text-xs font-bold text-slate-900">Section Alpha</p>
              <p className="text-[10px] text-slate-500">Main Line – UP (130 km/h)</p>
            </div>

            {/* 06:00 - 10:00 */}
            <div className="col-span-12 sm:col-span-2 p-1.5">
              <div
                onClick={() => onSelectBlock('blk-1')}
                className="h-full bg-blue-100 border border-blue-200 rounded p-2 flex flex-col items-center justify-center text-center cursor-pointer hover:bg-blue-200/80 transition"
              >
                <p className="text-[10px] font-bold text-blue-900 uppercase">PASSENGER</p>
                <p className="text-[9px] text-blue-700 truncate max-w-full font-medium">Vande Bharat / Morning Rush</p>
              </div>
            </div>

            {/* 10:00 - 12:00 */}
            <div className="col-span-12 sm:col-span-2 p-1.5">
              <div
                onClick={() => onSelectBlock('blk-2')}
                className="h-full bg-amber-50 border-2 border-dashed border-amber-300 rounded p-2 flex flex-col items-center justify-center text-center cursor-pointer hover:bg-amber-100 transition"
              >
                <p className="text-[10px] font-bold text-amber-900 uppercase">MAINT. BLOCK</p>
                <p className="text-[9px] text-amber-700 font-medium truncate max-w-full">Track Repair & Tamping</p>
              </div>
            </div>

            {/* 12:00 - 16:00 */}
            <div className="col-span-12 sm:col-span-2 p-1.5">
              <div
                onClick={() => onSelectBlock('blk-3')}
                className="h-full bg-emerald-100 border border-emerald-200 rounded p-2 flex flex-col items-center justify-center text-center cursor-pointer hover:bg-emerald-200/80 transition"
              >
                <p className="text-[10px] font-bold text-emerald-900 uppercase">FREIGHT</p>
                <p className="text-[9px] text-emerald-700 font-medium truncate max-w-full">Coal & Container Rakes</p>
              </div>
            </div>

            {/* 16:00 - 18:00 */}
            <div className="col-span-12 sm:col-span-2 p-1.5">
              <div
                onClick={() => onSelectBlock('blk-4')}
                className="h-full bg-blue-100 border border-blue-200 rounded p-2 flex flex-col items-center justify-center text-center cursor-pointer hover:bg-blue-200/80 transition"
              >
                <p className="text-[10px] font-bold text-blue-900 uppercase">PASSENGER</p>
                <p className="text-[9px] text-blue-700 font-medium">Intercity Corridors</p>
              </div>
            </div>

            {/* 18:00 - 23:00 */}
            <div className="col-span-12 sm:col-span-2 p-1.5">
              <div
                onClick={() => onSelectBlock('blk-5')}
                className="h-full bg-blue-100 border border-blue-200 rounded p-2 flex flex-col items-center justify-center text-center cursor-pointer hover:bg-blue-200/80 transition"
              >
                <p className="text-[10px] font-bold text-blue-900 uppercase">PASSENGER</p>
                <p className="text-[9px] text-blue-700 font-medium">Rajdhani / Evening Peak</p>
              </div>
            </div>
          </div>

          {/* Row 2: Section Beta (Main Line - Down) */}
          <div className="grid grid-cols-12 border-b border-slate-200 items-stretch bg-slate-50/50 min-h-[72px]">
            <div className="col-span-12 sm:col-span-2 px-4 py-2 flex flex-col justify-center bg-slate-50 border-r border-slate-200">
              <p className="text-xs font-bold text-slate-900">Section Beta</p>
              <p className="text-[10px] text-slate-500">Main Line – DOWN (130 km/h)</p>
            </div>

            {/* 06:00 - 10:00 */}
            <div className="col-span-12 sm:col-span-2 p-1.5">
              <div
                onClick={() => onSelectBlock('blk-1')}
                className="h-full bg-blue-100 border border-blue-200 rounded p-2 flex flex-col items-center justify-center text-center cursor-pointer hover:bg-blue-200/80 transition"
              >
                <p className="text-[10px] font-bold text-blue-900 uppercase">PASSENGER</p>
                <p className="text-[9px] text-blue-700 font-medium">Shatabdi Express</p>
              </div>
            </div>

            {/* 10:00 - 12:00 */}
            <div className="col-span-12 sm:col-span-2 p-1.5">
              <div
                onClick={() => onSelectBlock('blk-2')}
                className="h-full bg-blue-100 border border-blue-200 rounded p-2 flex flex-col items-center justify-center text-center cursor-pointer hover:bg-blue-200/80 transition"
              >
                <p className="text-[10px] font-bold text-blue-900 uppercase">PASSENGER</p>
                <p className="text-[9px] text-blue-700 font-medium">Single-line Pacing</p>
              </div>
            </div>

            {/* 12:00 - 16:00 */}
            <div className="col-span-12 sm:col-span-2 p-1.5">
              <div
                onClick={() => onSelectBlock('blk-3')}
                className="h-full bg-emerald-100 border border-emerald-200 rounded p-2 flex flex-col items-center justify-center text-center cursor-pointer hover:bg-emerald-200/80 transition"
              >
                <p className="text-[10px] font-bold text-emerald-900 uppercase">FREIGHT</p>
                <p className="text-[9px] text-emerald-700 font-medium">Auto-Carrier Rakes</p>
              </div>
            </div>

            {/* 16:00 - 18:00 (Signal maintenance block) */}
            <div className="col-span-12 sm:col-span-2 p-1.5">
              <div
                onClick={() => onSelectBlock('blk-4')}
                className="h-full bg-amber-50 border-2 border-dashed border-amber-300 rounded p-2 flex flex-col items-center justify-center text-center cursor-pointer hover:bg-amber-100 transition"
              >
                <p className="text-[10px] font-bold text-amber-900 uppercase">MAINT. BLOCK</p>
                <p className="text-[9px] text-amber-700 font-medium">Signal & Point Testing</p>
              </div>
            </div>

            {/* 18:00 - 23:00 */}
            <div className="col-span-12 sm:col-span-2 p-1.5">
              <div
                onClick={() => onSelectBlock('blk-5')}
                className="h-full bg-blue-100 border border-blue-200 rounded p-2 flex flex-col items-center justify-center text-center cursor-pointer hover:bg-blue-200/80 transition"
              >
                <p className="text-[10px] font-bold text-blue-900 uppercase">PASSENGER</p>
                <p className="text-[9px] text-blue-700 font-medium">Superfast Express</p>
              </div>
            </div>
          </div>

          {/* Row 3: Yard 04 (Sorting Lines) */}
          <div className="grid grid-cols-12 border-b border-slate-200 items-stretch bg-white min-h-[56px]">
            <div className="col-span-12 sm:col-span-2 px-4 py-2 flex flex-col justify-center bg-slate-50 border-r border-slate-200">
              <p className="text-xs font-bold text-slate-900">Yard 04</p>
              <p className="text-[10px] text-slate-500">Sorting & Marshalling</p>
            </div>
            <div className="col-span-12 sm:col-span-6 p-1.5">
              <div className="h-full bg-emerald-100 border border-emerald-200 rounded p-2 flex items-center justify-center text-[10px] font-bold text-emerald-900 uppercase">
                Extended Freight Convoy & Rake Formation (FOIS Managed)
              </div>
            </div>
            <div className="col-span-12 sm:col-span-2 p-1.5">
              <div className="h-full bg-slate-100 border border-slate-200 rounded p-2 flex items-center justify-center text-[10px] font-bold text-slate-500 uppercase">
                Idle / Buffer
              </div>
            </div>
            <div className="col-span-12 sm:col-span-2 p-1.5">
              <div className="h-full bg-amber-50 border-2 border-dashed border-amber-300 rounded p-2 flex items-center justify-center text-[10px] font-bold text-amber-900 uppercase">
                Yard Track Cleaning
              </div>
            </div>
          </div>

          {/* Row 4: Loop Line (Emergency Reserve) */}
          <div className="grid grid-cols-12 items-center bg-slate-50 py-2.5 px-4 text-[11px] text-slate-500 border-t border-slate-200">
            <div className="col-span-12 sm:col-span-2 font-bold text-slate-800 text-xs">
              Loop Line
            </div>
            <div className="col-span-12 sm:col-span-10 italic">
              Available for emergency diversion blocks — 100% electrified reserve line. No planned maintenance scheduled.
            </div>
          </div>
        </div>
      ) : (
        /* GANTT VIEW (Continuous 24h Bar) */
        <div className="relative pt-6 pb-2 select-none">
          {/* Hour Axis Markers */}
          <div className="relative h-5 text-[10px] font-mono text-slate-500 flex justify-between px-1 mb-1">
            {hoursMarks.map((hour) => {
              const leftPercent = (hour / 24) * 100;
              const label =
                hour === 0
                  ? '00:00'
                  : hour === 12
                  ? '12:00'
                  : hour === 24
                  ? '24:00'
                  : hour < 12
                  ? `${hour}:00 AM`
                  : `${hour - 12}:00 PM`;

              return (
                <div
                  key={hour}
                  className="absolute transform -translate-x-1/2 flex flex-col items-center"
                  style={{ left: `${leftPercent}%` }}
                >
                  <span>{label}</span>
                  <div className="w-px h-1.5 bg-slate-300 mt-0.5"></div>
                </div>
              );
            })}
          </div>

          {/* 24-Hour Main Gantt Strip */}
          <div className="relative h-16 bg-slate-100 rounded-xl overflow-hidden border border-slate-300 shadow-inner flex">
            {blocks.map((block) => {
              const startMin = parseTimeToMinutes(block.startTime);
              let endMin = parseTimeToMinutes(block.endTime);
              if (endMin <= startMin) endMin += 1440;
              const durationMin = endMin - startMin;
              const widthPercent = (durationMin / 1440) * 100;
              const leftPercent = (startMin / 1440) * 100;
              const isSelected = selectedBlockId === block.id;
              const styles = getCategoryStyles(block.category, isSelected);

              return (
                <button
                  key={block.id}
                  onClick={() => onSelectBlock(block.id)}
                  style={{ left: `${leftPercent}%`, width: `${widthPercent}%` }}
                  className={`absolute top-0 bottom-0 border-r border-slate-300 p-2 text-left transition-all cursor-pointer flex flex-col justify-between overflow-hidden ${styles.card}`}
                  title={`${block.timeSlot}: ${block.activity}`}
                >
                  <div className="flex items-center justify-between w-full">
                    <span className={`text-[10px] sm:text-[11px] font-bold truncate ${styles.titleColor}`}>
                      {block.timeSlot}
                    </span>
                    {isSelected && <span className="w-2 h-2 rounded-full bg-white shrink-0"></span>}
                  </div>
                  <span className={`text-[9px] sm:text-[10px] truncate leading-tight font-semibold ${styles.subColor}`}>
                    {styles.label}: {block.activity}
                  </span>
                </button>
              );
            })}

            {/* Real-time needle */}
            <div
              className="absolute top-0 bottom-0 z-30 pointer-events-none flex flex-col items-center transition-all duration-300"
              style={{ left: `${currentLeftPercent}%` }}
            >
              <div className="bg-red-600 text-white font-mono text-[9px] font-bold px-1 rounded -translate-y-4 shadow-sm">
                {activeTime}
              </div>
              <div className="w-0.5 h-full bg-red-600 shadow"></div>
            </div>
          </div>
        </div>
      )}

      {/* Legend Footer */}
      <div className="flex flex-wrap items-center justify-between gap-3 mt-4 pt-3 border-t border-slate-200 text-xs">
        <div className="flex flex-wrap items-center gap-4 text-slate-700">
          <div className="flex items-center gap-2">
            <div className="w-3.5 h-3.5 bg-blue-100 border border-blue-300 rounded"></div>
            <span className="text-[11px] font-bold text-slate-700 uppercase">Passenger</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3.5 h-3.5 bg-emerald-100 border border-emerald-300 rounded"></div>
            <span className="text-[11px] font-bold text-slate-700 uppercase">Freight</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3.5 h-3.5 bg-amber-50 border-2 border-dashed border-amber-500 rounded"></div>
            <span className="text-[11px] font-bold text-slate-700 uppercase">Maint. Block</span>
          </div>
        </div>

        <div className="text-[11px] text-slate-500 flex items-center gap-1.5">
          <ShieldCheck className="w-4 h-4 text-emerald-600" />
          <span>
            AI Confidence Score: <strong className="text-slate-900">99.8%</strong> | Zero Track Overlaps
          </span>
        </div>
      </div>
    </div>
  );
};
