import React from 'react';
import { X, Check, ChevronRight, ShieldCheck, Cpu, Box } from 'lucide-react';
import { AuraProduct } from '../types/aura';

interface ProductDetailModalProps {
  product: AuraProduct | null;
  onClose: () => void;
  onConfigure: (product: AuraProduct) => void;
}

export const ProductDetailModal: React.FC<ProductDetailModalProps> = ({
  product,
  onClose,
  onConfigure,
}) => {
  if (!product) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 sm:p-6 animate-in fade-in duration-200">
      {/* Click outside backdrop */}
      <div className="fixed inset-0" onClick={onClose} aria-hidden="true" />

      {/* Modal Container */}
      <div className="relative w-full max-w-4xl bg-white rounded-3xl shadow-2xl overflow-hidden border border-black/[0.08] z-10 flex flex-col max-h-[90vh]">
        {/* Sticky Header */}
        <div className="px-6 py-4 border-b border-black/[0.06] flex items-center justify-between bg-white/90 backdrop-blur-md sticky top-0 z-20">
          <div>
            <span className="text-[11px] font-mono text-[#86868B] uppercase tracking-wider block">
              {product.eyebrow}
            </span>
            <h2 className="text-lg font-bold text-[#1D1D1F] font-['Plus_Jakarta_Sans']">
              {product.name}
            </h2>
          </div>

          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-[#F5F5F7] hover:bg-[#E8E8ED] flex items-center justify-center text-[#1D1D1F] transition-colors cursor-pointer"
            aria-label="Close dialog"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Scrollable Body */}
        <div className="overflow-y-auto p-6 sm:p-10 space-y-8">
          {/* Hero Media & Summary Split */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
            <div className="aspect-[4/3] rounded-2xl overflow-hidden bg-[#F5F5F7] border border-black/[0.04]">
              <img
                src={product.image}
                alt={product.name}
                className="w-full h-full object-cover object-center"
              />
            </div>

            <div className="space-y-4">
              <span className="text-xs font-mono font-semibold text-[#0071E3] tracking-wide uppercase">
                {product.badge || 'Engineering Spec'}
              </span>
              <h3 className="text-2xl sm:text-3xl font-bold text-[#1D1D1F] leading-tight font-['Plus_Jakarta_Sans']">
                {product.tagline}
              </h3>
              <p className="text-sm text-[#6E6E73] leading-relaxed">
                {product.description}
              </p>

              <div className="pt-2">
                <span className="text-xs text-[#86868B] block">Starting from</span>
                <span className="text-3xl font-bold font-mono text-[#1D1D1F] tabular-nums">
                  {product.priceFormatted}
                </span>
              </div>

              {/* Color Swatches */}
              <div className="pt-2">
                <span className="text-xs text-[#86868B] block mb-2">Available Finishes:</span>
                <div className="flex items-center gap-2">
                  {product.colorways.map((c) => (
                    <div key={c.id} className="flex items-center gap-1.5 text-xs text-[#6E6E73]">
                      <span
                        className="w-4 h-4 rounded-full border border-black/15 shadow-inner"
                        style={{ backgroundColor: c.hex }}
                      />
                      <span>{c.name}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Full Technical Specifications Sheet */}
          <div className="space-y-4 pt-6 border-t border-black/[0.06]">
            <h4 className="text-base font-bold text-[#1D1D1F] font-['Plus_Jakarta_Sans']">
              Technical Specifications
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {product.specs.map((sp, i) => (
                <div key={i} className="p-4 rounded-2xl bg-[#F5F5F7] border border-black/[0.04]">
                  <span className="text-xs text-[#86868B] block">{sp.label}</span>
                  <span className="text-sm font-semibold text-[#1D1D1F] font-mono mt-0.5 block">
                    {sp.value}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Physical Dimensions & Accessories */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 pt-4 border-t border-black/[0.06] text-xs">
            <div className="p-5 rounded-2xl bg-[#F5F5F7] space-y-2">
              <span className="font-bold text-[#1D1D1F] block">Physical Geometry:</span>
              <p className="text-[#6E6E73]">Dimensions: {product.dimensions}</p>
              <p className="text-[#6E6E73]">Weight: {product.weight}</p>
              {product.batteryLife && (
                <p className="text-[#6E6E73]">Battery: {product.batteryLife}</p>
              )}
            </div>

            <div className="p-5 rounded-2xl bg-[#F5F5F7] space-y-2">
              <span className="font-bold text-[#1D1D1F] block">Included with Purchase:</span>
              <ul className="text-[#6E6E73] space-y-1">
                {product.inBox.map((item, idx) => (
                  <li key={idx}>• {item}</li>
                ))}
              </ul>
            </div>
          </div>
        </div>

        {/* Modal Sticky Bottom Action Footer */}
        <div className="px-6 py-4 border-t border-black/[0.06] bg-[#F5F5F7] flex items-center justify-between">
          <div className="text-xs text-[#6E6E73]">
            Free express delivery · 14-day returns
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={onClose}
              className="apple-btn-secondary px-4 py-2 text-xs font-medium cursor-pointer"
            >
              Close
            </button>
            <button
              onClick={() => {
                onClose();
                onConfigure(product);
              }}
              className="apple-btn-primary px-5 py-2 text-xs font-semibold flex items-center gap-1 cursor-pointer"
            >
              <span>Configure & Buy</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
