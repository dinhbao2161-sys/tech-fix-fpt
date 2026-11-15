import React from 'react';
import { Cpu, Eye, Volume2, Shield, Zap, Sparkles } from 'lucide-react';

export const SiliconBento: React.FC = () => {
  return (
    <section id="silicon-bento" className="py-20 sm:py-28 bg-white border-t border-black/[0.05]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Lead */}
        <div className="max-w-3xl mb-16 space-y-3">
          <p className="text-xs font-semibold tracking-wider uppercase text-[#6E6E73] font-['Plus_Jakarta_Sans']">
            Architecture & Craftsmanship
          </p>
          <h2 className="text-3xl sm:text-5xl font-bold tracking-tight text-[#1D1D1F]">
            Every micrometer considered.
          </h2>
          <p className="text-base sm:text-lg text-[#6E6E73] leading-relaxed">
            By unifying custom 3nm silicon, acoustic resonance chambers, and Grade 5 titanium into a single architecture, AURA achieves unprecedented thermal efficiency and silent power.
          </p>
        </div>

        {/* Asymmetric Bento Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
          {/* Card 1: 3nm Apollo-X Monolith (8 columns) */}
          <div className="lg:col-span-8 apple-card p-8 sm:p-12 flex flex-col justify-between overflow-hidden relative group">
            <div className="max-w-xl z-10 space-y-3">
              <span className="text-xs font-mono text-[#0071E3] uppercase tracking-wider block">
                01. Custom Monolithic Die
              </span>
              <h3 className="text-2xl sm:text-4xl font-bold text-[#1D1D1F] leading-tight font-['Plus_Jakarta_Sans']">
                Apollo-X. The first 3nm workstation engine.
              </h3>
              <p className="text-sm sm:text-base text-[#6E6E73] leading-relaxed">
                18.7 billion transistors packed onto a singular die. Dedicated hardware ray tracing cores, 38 TOPS neural engine, and 800 GB/s unified memory throughput deliver instant renders without heat or fan noise.
              </p>

              {/* Quantified Spec Metrics Row */}
              <div className="grid grid-cols-3 gap-6 pt-6 border-t border-black/[0.08]">
                <div>
                  <span className="text-2xl sm:text-3xl font-bold font-mono text-[#1D1D1F] tabular-nums block">
                    3nm
                  </span>
                  <span className="text-xs text-[#86868B]">FinFET Process</span>
                </div>
                <div>
                  <span className="text-2xl sm:text-3xl font-bold font-mono text-[#1D1D1F] tabular-nums block">
                    800 GB/s
                  </span>
                  <span className="text-xs text-[#86868B]">Unified Bandwidth</span>
                </div>
                <div>
                  <span className="text-2xl sm:text-3xl font-bold font-mono text-[#1D1D1F] tabular-nums block">
                    38 TOPS
                  </span>
                  <span className="text-xs text-[#86868B]">Neural Accelerator</span>
                </div>
              </div>
            </div>

            {/* Embedded Chip Visual */}
            <div className="mt-8 rounded-2xl overflow-hidden aspect-[16/9] border border-black/[0.08] bg-[#EBEBEF]">
              <img
                src="/src/assets/images/bento_silicon_chip_1794494055808.jpg"
                alt="Apollo-X 3nm Processor"
                className="w-full h-full object-cover group-hover:scale-102 transition-transform duration-500"
                loading="lazy"
              />
            </div>
          </div>

          {/* Card 2: Grade 5 Titanium Unibody (4 columns) */}
          <div className="lg:col-span-4 apple-card p-8 sm:p-10 flex flex-col justify-between">
            <div className="space-y-4">
              <div className="w-12 h-12 rounded-2xl bg-white border border-black/[0.06] flex items-center justify-center text-[#1D1D1F] shadow-sm">
                <Shield className="w-6 h-6 stroke-[1.8]" />
              </div>
              <span className="text-xs font-mono text-[#86868B] uppercase tracking-wider block">
                02. Metallurgy
              </span>
              <h3 className="text-2xl font-bold text-[#1D1D1F] font-['Plus_Jakarta_Sans']">
                Aerospace Grade 5 Titanium
              </h3>
              <p className="text-sm text-[#6E6E73] leading-relaxed">
                One of the highest strength-to-weight ratios of any metal. Diamond-like carbon vapor finish creates a fingerprint-resistant, satin surface that stays cool to the touch.
              </p>
            </div>

            <div className="mt-8 p-5 rounded-2xl bg-white border border-black/[0.06] space-y-2">
              <div className="flex items-center justify-between text-xs">
                <span className="text-[#86868B]">Tensile Strength</span>
                <span className="font-mono font-bold text-[#1D1D1F]">950 MPa</span>
              </div>
              <div className="flex items-center justify-between text-xs">
                <span className="text-[#86868B]">Recycled Content</span>
                <span className="font-mono font-bold text-[#0071E3]">100% Certified</span>
              </div>
              <div className="flex items-center justify-between text-xs">
                <span className="text-[#86868B]">Thermal Conductivity</span>
                <span className="font-mono font-bold text-[#1D1D1F]">21.9 W/(m·K)</span>
              </div>
            </div>
          </div>

          {/* Card 3: Nanometer Textured Glass (4 columns) */}
          <div className="lg:col-span-4 apple-card p-8 sm:p-10 flex flex-col justify-between">
            <div className="space-y-4">
              <div className="w-12 h-12 rounded-2xl bg-white border border-black/[0.06] flex items-center justify-center text-[#1D1D1F] shadow-sm">
                <Eye className="w-6 h-6 stroke-[1.8]" />
              </div>
              <span className="text-xs font-mono text-[#86868B] uppercase tracking-wider block">
                03. Optics
              </span>
              <h3 className="text-2xl font-bold text-[#1D1D1F] font-['Plus_Jakarta_Sans']">
                Nanometer Etched Glass
              </h3>
              <p className="text-sm text-[#6E6E73] leading-relaxed">
                Etched directly into the glass surface at the nanometer scale to scatter ambient glare without sacrificing micro-contrast or color saturation.
              </p>
            </div>

            <div className="mt-8 pt-6 border-t border-black/[0.06] flex items-baseline gap-2">
              <span className="text-3xl font-bold font-mono text-[#1D1D1F]">0.02%</span>
              <span className="text-xs text-[#86868B]">Specular ambient reflectivity</span>
            </div>
          </div>

          {/* Card 4: Acoustic Resonance Chamber (8 columns) */}
          <div className="lg:col-span-8 apple-card p-8 sm:p-10 flex flex-col md:flex-row items-center justify-between gap-8">
            <div className="space-y-4 max-w-md">
              <div className="w-12 h-12 rounded-2xl bg-white border border-black/[0.06] flex items-center justify-center text-[#1D1D1F] shadow-sm">
                <Volume2 className="w-6 h-6 stroke-[1.8]" />
              </div>
              <span className="text-xs font-mono text-[#86868B] uppercase tracking-wider block">
                04. Spatial Acoustics
              </span>
              <h3 className="text-2xl sm:text-3xl font-bold text-[#1D1D1F] font-['Plus_Jakarta_Sans']">
                Force-cancelling acoustic chambers.
              </h3>
              <p className="text-sm text-[#6E6E73] leading-relaxed">
                Opposing woofer pairs cancel mechanical vibrations while radiating deep, uncolored bass down to 28Hz. Precision beamforming microphones capture studio-fidelity vocals.
              </p>
            </div>

            <div className="w-full md:w-72 p-6 rounded-2xl bg-white border border-black/[0.06] space-y-4 shrink-0 shadow-sm">
              <div className="text-xs font-mono text-[#86868B] uppercase">Harmonic Distortion</div>
              <div className="text-3xl font-bold font-mono text-[#1D1D1F]">&lt; 0.08%</div>
              <p className="text-xs text-[#6E6E73] leading-relaxed">
                Studio reference transparency across the audible 20Hz – 40kHz spectrum.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
