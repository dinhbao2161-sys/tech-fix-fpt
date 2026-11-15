import React, { useState } from 'react';
import { ChevronRight, Play, Check, Sparkles } from 'lucide-react';
import { HERO_PRODUCT } from '../data/auraProducts';
import { ProductColorway } from '../types/aura';

interface HeroSectionProps {
  onPreOrder: (colorway: ProductColorway) => void;
  onExploreSpecs: () => void;
  onOpenMediaModal: () => void;
}

export const HeroSection: React.FC<HeroSectionProps> = ({
  onPreOrder,
  onExploreSpecs,
  onOpenMediaModal,
}) => {
  const [selectedColor, setSelectedColor] = useState<ProductColorway>(HERO_PRODUCT.colorways[0]);
  const [activeCallout, setActiveCallout] = useState<string | null>('display');

  const CALLOUTS = [
    {
      id: 'display',
      label: '32" 6K Nanometer XDR',
      desc: '1,600 nits peak brightness with zero-reflection micro-etched glass.',
      pos: 'top-[30%] left-[28%]',
    },
    {
      id: 'arm',
      label: 'Zero-Gravity Arm',
      desc: 'Balanced counterweight articulation moves effortlessly with one finger.',
      pos: 'top-[42%] right-[24%]',
    },
    {
      id: 'silicon',
      label: 'Apollo-X 3nm Hub',
      desc: '24-core monolithic workstation processor in aerospace titanium.',
      pos: 'bottom-[22%] left-[48%]',
    },
  ];

  return (
    <section id="studio-pro-section" className="relative pt-12 pb-20 sm:pt-16 sm:pb-28 overflow-hidden bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Editorial Headline Block */}
        <div className="text-center max-w-4xl mx-auto space-y-4 mb-10">
          <p className="text-xs sm:text-sm font-semibold tracking-wide uppercase text-[#6E6E73] font-['Plus_Jakarta_Sans']">
            {HERO_PRODUCT.eyebrow}
          </p>

          <h1 className="text-4xl sm:text-6xl lg:text-7xl font-bold tracking-tight text-[#1D1D1F] leading-[1.08] [text-wrap:balance]">
            Titanium unibody. 6K clarity. Pure performance.
          </h1>

          <p className="text-lg sm:text-xl text-[#6E6E73] max-w-2xl mx-auto leading-relaxed font-normal">
            Precision-milled from aerospace Grade 5 titanium. Engineered with the world’s first 3nm workstation silicon and zero-reflection nanometer glass.
          </p>

          {/* Action Row */}
          <div className="flex flex-wrap items-center justify-center gap-4 pt-4">
            <button
              onClick={() => onPreOrder(selectedColor)}
              className="apple-btn-primary px-6 py-3 text-sm font-semibold flex items-center gap-2 cursor-pointer shadow-sm hover:shadow"
            >
              <span>Pre-order from $2,499</span>
              <ChevronRight className="w-4 h-4" />
            </button>

            <button
              onClick={onOpenMediaModal}
              className="px-5 py-3 text-sm font-medium text-[#0071E3] hover:text-[#0077ED] flex items-center gap-2 cursor-pointer transition-colors group"
            >
              <div className="w-7 h-7 rounded-full bg-[#0071E3]/10 flex items-center justify-center group-hover:scale-105 transition-transform">
                <Play className="w-3.5 h-3.5 fill-current text-[#0071E3] ml-0.5" />
              </div>
              <span>Watch the film (1:45)</span>
            </button>
          </div>

          {/* Clean Unboxed Metadata */}
          <div className="flex items-center justify-center gap-2 text-xs text-[#86868B] pt-2">
            <span>Available in 4 Titanium Finishes</span>
            <span aria-hidden="true">·</span>
            <span>Free Express White-Glove Delivery</span>
            <span aria-hidden="true">·</span>
            <span>2-Year AppleCare+ Available</span>
          </div>
        </div>

        {/* Cinematic Product Showcase */}
        <div className="relative rounded-3xl overflow-hidden bg-[#F5F5F7] border border-black/[0.05] shadow-[0_4px_30px_rgba(0,0,0,0.04)]">
          <div className="relative aspect-[16/9] w-full">
            <img
              src={HERO_PRODUCT.image}
              alt={HERO_PRODUCT.name}
              className="w-full h-full object-cover object-center"
              loading="eager"
            />

            {/* Interactive Feature Callout Anchors */}
            {CALLOUTS.map((callout) => {
              const isActive = activeCallout === callout.id;
              return (
                <div
                  key={callout.id}
                  className={`absolute ${callout.pos} hidden md:block z-10 transition-all`}
                >
                  <button
                    onClick={() => setActiveCallout(isActive ? null : callout.id)}
                    className={`w-7 h-7 rounded-full flex items-center justify-center cursor-pointer transition-all duration-200 border ${
                      isActive
                        ? 'bg-[#1D1D1F] text-white border-white scale-110 shadow-lg'
                        : 'bg-white/90 text-[#1D1D1F] border-black/10 hover:scale-105 shadow-md backdrop-blur-sm'
                    }`}
                    aria-label={`View detail: ${callout.label}`}
                  >
                    <span className="w-2 h-2 rounded-full bg-current" />
                  </button>

                  {/* Popover Bubble */}
                  {isActive && (
                    <div className="absolute left-8 top-0 w-64 p-3.5 rounded-xl bg-white/95 backdrop-blur-md border border-black/[0.08] shadow-xl text-left animate-in fade-in zoom-in-95 duration-150">
                      <p className="text-xs font-semibold text-[#1D1D1F] mb-1 font-['Plus_Jakarta_Sans']">
                        {callout.label}
                      </p>
                      <p className="text-[11px] text-[#6E6E73] leading-relaxed">
                        {callout.desc}
                      </p>
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          {/* Bottom Shelf: Finish Selector & Spec Highlights */}
          <div className="p-6 sm:p-8 bg-white border-t border-black/[0.05] flex flex-col md:flex-row items-center justify-between gap-6">
            {/* Color Finish Picker */}
            <div className="flex items-center gap-4">
              <span className="text-xs font-medium text-[#6E6E73] uppercase tracking-wider">
                Finish:
              </span>
              <div className="flex items-center gap-2.5">
                {HERO_PRODUCT.colorways.map((col) => {
                  const isSelected = selectedColor.id === col.id;
                  return (
                    <button
                      key={col.id}
                      onClick={() => setSelectedColor(col)}
                      className={`group relative p-1 rounded-full cursor-pointer transition-all ${
                        isSelected ? 'ring-2 ring-[#0071E3] ring-offset-2' : 'hover:scale-105'
                      }`}
                      title={col.name}
                      aria-label={`Select ${col.name}`}
                    >
                      <span
                        className="block w-5 h-5 rounded-full border border-black/15 shadow-inner"
                        style={{ backgroundColor: col.hex }}
                      />
                    </button>
                  );
                })}
              </div>
              <span className="text-xs font-medium text-[#1D1D1F] font-mono">
                {selectedColor.name}
              </span>
            </div>

            {/* Quick Spec Highlights */}
            <div className="flex items-center gap-6 text-xs text-[#6E6E73]">
              <div>
                <span className="font-bold text-[#1D1D1F] font-mono text-sm block">32-inch 6K</span>
                <span>Liquid Retina XDR</span>
              </div>
              <div className="h-6 w-px bg-black/[0.08]" />
              <div>
                <span className="font-bold text-[#1D1D1F] font-mono text-sm block">3nm FinFET</span>
                <span>Apollo-X Silicon</span>
              </div>
              <div className="h-6 w-px bg-black/[0.08]" />
              <div>
                <span className="font-bold text-[#1D1D1F] font-mono text-sm block">Grade 5</span>
                <span>Aerospace Titanium</span>
              </div>
            </div>

            {/* Right Action */}
            <button
              onClick={onExploreSpecs}
              className="text-xs font-medium text-[#0071E3] hover:underline flex items-center gap-1 cursor-pointer shrink-0"
            >
              <span>Explore technical specifications</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};
