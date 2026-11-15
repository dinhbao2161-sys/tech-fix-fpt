import React from 'react';
import { SUSTAINABILITY_POINTS } from '../data/auraProducts';
import { Leaf, Award, Recycle, ShieldCheck } from 'lucide-react';

export const CraftsmanshipSection: React.FC = () => {
  return (
    <section className="py-20 sm:py-28 bg-[#F5F5F7] border-t border-black/[0.05]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="max-w-3xl mb-16 space-y-3">
          <p className="text-xs font-semibold tracking-wider uppercase text-[#6E6E73] font-['Plus_Jakarta_Sans']">
            Environmental Responsibility
          </p>
          <h2 className="text-3xl sm:text-5xl font-bold tracking-tight text-[#1D1D1F]">
            Designed with the planet in mind.
          </h2>
          <p className="text-base sm:text-lg text-[#6E6E73] leading-relaxed">
            True luxury means uncompromising responsibility. We take responsibility for our products across their entire lifecycle — from raw mineral extraction to 100% clean energy assembly.
          </p>
        </div>

        {/* 4 Quantitative Proof Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {SUSTAINABILITY_POINTS.map((item, idx) => (
            <div
              key={idx}
              className="apple-card-white p-8 rounded-3xl flex flex-col justify-between space-y-6"
            >
              <div>
                <span className="text-4xl sm:text-5xl font-bold font-mono text-[#1D1D1F] tracking-tight block tabular-nums">
                  {item.metric}
                </span>
                <h3 className="text-base font-bold text-[#1D1D1F] mt-3 font-['Plus_Jakarta_Sans']">
                  {item.title}
                </h3>
              </div>
              <p className="text-xs text-[#6E6E73] leading-relaxed">
                {item.description}
              </p>
            </div>
          ))}
        </div>

        {/* Clean Environmental Policy Statement */}
        <div className="mt-12 p-8 rounded-3xl bg-white border border-black/[0.06] flex flex-col sm:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-4">
            <div className="w-10 h-10 rounded-2xl bg-[#F5F5F7] flex items-center justify-center text-[#1D1D1F]">
              <Leaf className="w-5 h-5 stroke-[1.8]" />
            </div>
            <div>
              <h4 className="text-sm font-bold text-[#1D1D1F]">AURA 2030 Climate Commitment</h4>
              <p className="text-xs text-[#6E6E73]">Every device in the ecosystem is designed to be carbon neutral by 2030.</p>
            </div>
          </div>

          <a
            href="#read-report"
            onClick={(e) => {
              e.preventDefault();
              alert('AURA Environmental Progress Report 2026: Direct emissions reduced by 78%, verified 100% renewable electricity across all tier-1 assembly suppliers.');
            }}
            className="text-xs font-medium text-[#0071E3] hover:underline whitespace-nowrap cursor-pointer"
          >
            Read the 2026 Environmental Progress Report &gt;
          </a>
        </div>
      </div>
    </section>
  );
};
