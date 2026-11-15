import React, { useState } from 'react';
import { SPEC_COMPARISONS } from '../data/auraProducts';
import { ChevronRight } from 'lucide-react';

interface SpecComparatorProps {
  onSelectModel: (modelName: string) => void;
}

export const SpecComparator: React.FC<SpecComparatorProps> = ({ onSelectModel }) => {
  const [activeCategoryIndex, setActiveCategoryIndex] = useState<number>(0);

  return (
    <section id="comparator-section" className="py-20 sm:py-28 bg-white border-t border-black/[0.05]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16 space-y-3">
          <p className="text-xs font-semibold tracking-wider uppercase text-[#6E6E73] font-['Plus_Jakarta_Sans']">
            Model Matrix
          </p>
          <h2 className="text-3xl sm:text-5xl font-bold tracking-tight text-[#1D1D1F]">
            Compare all models.
          </h2>
          <p className="text-base text-[#6E6E73]">
            Find the precision hardware configuration tailored to your computing and studio requirements.
          </p>
        </div>

        {/* 3-Column Header Deck */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 pb-10 border-b border-black/[0.08] text-center">
          <div className="space-y-2 p-6 rounded-3xl bg-[#F5F5F7] border border-black/[0.04]">
            <span className="text-xs font-mono text-[#86868B] uppercase">Compact Studio</span>
            <h3 className="text-2xl font-bold text-[#1D1D1F] font-['Plus_Jakarta_Sans']">AURA One</h3>
            <p className="text-xs text-[#6E6E73]">Everyday creative powerhouse</p>
            <div className="text-xl font-bold font-mono text-[#1D1D1F] pt-2 tabular-nums">From $1,299</div>
            <button
              onClick={() => onSelectModel('AURA One')}
              className="apple-btn-secondary px-4 py-1.5 text-xs font-medium cursor-pointer mt-3"
            >
              Select
            </button>
          </div>

          <div className="space-y-2 p-6 rounded-3xl bg-[#F5F5F7] border border-black/[0.04] relative">
            <span className="text-xs font-mono text-[#0071E3] uppercase font-semibold">Most Popular</span>
            <h3 className="text-2xl font-bold text-[#1D1D1F] font-['Plus_Jakarta_Sans']">AURA Pro</h3>
            <p className="text-xs text-[#6E6E73]">High-throughput studio production</p>
            <div className="text-xl font-bold font-mono text-[#1D1D1F] pt-2 tabular-nums">From $1,799</div>
            <button
              onClick={() => onSelectModel('AURA Pro')}
              className="apple-btn-secondary px-4 py-1.5 text-xs font-medium cursor-pointer mt-3"
            >
              Select
            </button>
          </div>

          <div className="space-y-2 p-6 rounded-3xl bg-[#F5F5F7] border border-black/[0.04]">
            <span className="text-xs font-mono text-[#86868B] uppercase">Ultimate Flagship</span>
            <h3 className="text-2xl font-bold text-[#1D1D1F] font-['Plus_Jakarta_Sans']">AURA Studio Max</h3>
            <p className="text-xs text-[#6E6E73]">Aerospace titanium 6K powerhouse</p>
            <div className="text-xl font-bold font-mono text-[#1D1D1F] pt-2 tabular-nums">From $2,499</div>
            <button
              onClick={() => onSelectModel('AURA Studio Max')}
              className="apple-btn-primary px-4 py-1.5 text-xs font-medium cursor-pointer mt-3"
            >
              Select
            </button>
          </div>
        </div>

        {/* Category Tabs */}
        <div className="flex items-center justify-center gap-2 my-8 overflow-x-auto no-scrollbar">
          {SPEC_COMPARISONS.map((group, idx) => {
            const isActive = activeCategoryIndex === idx;
            return (
              <button
                key={idx}
                onClick={() => setActiveCategoryIndex(idx)}
                className={`px-4 py-2 text-xs font-medium rounded-full transition-all cursor-pointer whitespace-nowrap ${
                  isActive
                    ? 'bg-[#1D1D1F] text-white shadow-sm'
                    : 'bg-[#F5F5F7] text-[#6E6E73] hover:text-[#1D1D1F]'
                }`}
              >
                {group.category}
              </button>
            );
          })}
        </div>

        {/* Comparison Data Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs sm:text-sm">
            <thead>
              <tr className="border-b border-black/[0.06] text-[#86868B] font-mono text-xs">
                <th className="py-4 font-normal w-1/4">Specification</th>
                <th className="py-4 font-normal w-1/4 text-center">AURA One</th>
                <th className="py-4 font-normal w-1/4 text-center">AURA Pro</th>
                <th className="py-4 font-normal w-1/4 text-center">AURA Studio Max</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-black/[0.04]">
              {SPEC_COMPARISONS[activeCategoryIndex].rows.map((row, i) => (
                <tr key={i} className="hover:bg-[#F5F5F7]/50 transition-colors">
                  <td className="py-4 font-medium text-[#1D1D1F]">{row.label}</td>
                  <td className="py-4 text-[#6E6E73] text-center font-mono">{row.auraOne}</td>
                  <td className="py-4 text-[#6E6E73] text-center font-mono">{row.auraPro}</td>
                  <td className="py-4 text-[#1D1D1F] font-semibold text-center font-mono">{row.auraStudioMax}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </section>
  );
};
