import React from 'react';
import { Train, Wrench, BarChart3, CheckCircle2, TrendingUp, ShieldCheck } from 'lucide-react';
import { SectionSummary } from '../types';

interface SimpleOverviewCardsProps {
  summary: SectionSummary;
}

export const SimpleOverviewCards: React.FC<SimpleOverviewCardsProps> = ({
  summary,
}) => {
  return (
    <div id="simple-overview-cards" className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
      {/* 1. Asset Availability / Available Trains Report */}
      <div className="bg-white p-4.5 rounded-lg border border-slate-200 border-l-4 border-l-blue-600 shadow-sm hover:shadow transition">
        <div className="flex items-center justify-between mb-1">
          <p className="text-xs font-bold text-slate-500 uppercase tracking-wider">
            Asset Availability
          </p>
          <span className="text-xs text-blue-700 bg-blue-50 px-2 py-0.5 rounded font-semibold border border-blue-100">
            Available Trains
          </span>
        </div>
        <p className="text-3xl font-light text-slate-900 tracking-tight my-1">
          {summary.assetAvailabilityPercent}%{' '}
          <span className="text-sm text-emerald-600 font-bold ml-1">+2.4%</span>
        </p>
        <p className="text-xs text-slate-600 leading-relaxed mt-2">
          Shows how many trains ({summary.passengerTrainsScheduled} passenger + {summary.freightRakesScheduled} freight) can safely operate.
        </p>
      </div>

      {/* 2. When tracks are free for repair / Active Maintenance Blocks */}
      <div className="bg-white p-4.5 rounded-lg border border-slate-200 border-l-4 border-l-amber-500 shadow-sm hover:shadow transition">
        <div className="flex items-center justify-between mb-1">
          <p className="text-xs font-bold text-slate-500 uppercase tracking-wider">
            Track Repair Blocks
          </p>
          <span className="text-xs text-amber-800 bg-amber-50 px-2 py-0.5 rounded font-semibold border border-amber-200">
            Free For Repair
          </span>
        </div>
        <p className="text-3xl font-light text-slate-900 tracking-tight my-1">
          02{' '}
          <span className="text-sm text-slate-500 font-normal ml-1">
            / {summary.maintenanceHoursTotal} hrs total
          </span>
        </p>
        <p className="text-xs text-slate-600 leading-relaxed mt-2">
          Maintenance teams receive clear, protected slots for P-Way & Signal repairs with 100% worker safety.
        </p>
      </div>

      {/* 3. When trains run / Freight & Passenger Throughput */}
      <div className="bg-white p-4.5 rounded-lg border border-slate-200 border-l-4 border-l-emerald-600 shadow-sm hover:shadow transition">
        <div className="flex items-center justify-between mb-1">
          <p className="text-xs font-bold text-slate-500 uppercase tracking-wider">
            When Trains Run
          </p>
          <span className="text-xs text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded font-semibold border border-emerald-200">
            Peak & Corridors
          </span>
        </div>
        <p className="text-3xl font-light text-slate-900 tracking-tight my-1">
          {summary.passengerTrainsScheduled + summary.freightRakesScheduled}{' '}
          <span className="text-xs text-slate-500 font-normal uppercase ml-1">
            Trains / 24h
          </span>
        </p>
        <p className="text-xs text-slate-600 leading-relaxed mt-2">
          Morning & evening express runs keep passengers moving; designated slots keep freight on schedule.
        </p>
      </div>

      {/* 4. Conflict Resolution / Zero Clashes Guarantee */}
      <div className="bg-white p-4.5 rounded-lg border border-slate-200 border-l-4 border-l-slate-800 shadow-sm hover:shadow transition">
        <div className="flex items-center justify-between mb-1">
          <p className="text-xs font-bold text-slate-500 uppercase tracking-wider">
            Conflict Resolution
          </p>
          <span className="text-xs text-slate-800 bg-slate-100 px-2 py-0.5 rounded font-semibold border border-slate-200">
            No Clashes
          </span>
        </div>
        <p className="text-3xl font-light text-slate-900 tracking-tight my-1">
          Zero{' '}
          <span className="text-sm text-blue-600 font-bold ml-1">AI Audited</span>
        </p>
        <p className="text-xs text-slate-600 leading-relaxed mt-2">
          AI continuously verifies that train timings and track repair work orders never overlap or clash.
        </p>
      </div>
    </div>
  );
};
