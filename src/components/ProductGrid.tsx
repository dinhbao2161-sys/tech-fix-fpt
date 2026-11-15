import React from 'react';
import { ChevronRight, ArrowUpRight } from 'lucide-react';
import { AuraProduct, ProductCategory } from '../types/aura';
import { PRODUCT_LINEUP } from '../data/auraProducts';

interface ProductGridProps {
  selectedCategory: ProductCategory;
  onSelectCategory: (cat: ProductCategory) => void;
  onSelectProduct: (product: AuraProduct) => void;
  onConfigureProduct: (product: AuraProduct) => void;
}

export const ProductGrid: React.FC<ProductGridProps> = ({
  selectedCategory,
  onSelectCategory,
  onSelectProduct,
  onConfigureProduct,
}) => {
  const filteredProducts = selectedCategory === 'all'
    ? PRODUCT_LINEUP
    : PRODUCT_LINEUP.filter(p => p.category === selectedCategory);

  const CATEGORY_TABS: { id: ProductCategory; label: string }[] = [
    { id: 'all', label: 'All Innovations' },
    { id: 'audio', label: 'Acoustics' },
    { id: 'spatial', label: 'Spatial Vision' },
    { id: 'silicon', label: 'Silicon Architecture' },
  ];

  return (
    <section id="lineup-section" className="py-20 sm:py-28 bg-[#F5F5F7] border-t border-black/[0.05]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
          <div className="space-y-2">
            <p className="text-xs font-semibold tracking-wider uppercase text-[#6E6E73] font-['Plus_Jakarta_Sans']">
              The Ecosystem
            </p>
            <h2 className="text-3xl sm:text-5xl font-bold tracking-tight text-[#1D1D1F]">
              Engineered to work as one.
            </h2>
          </div>

          {/* Interactive Category Filter Tabs (Zero pill slop, clean segmented button controls) */}
          <div className="flex items-center gap-1 p-1 bg-white rounded-full border border-black/[0.06] shadow-sm self-start md:self-auto">
            {CATEGORY_TABS.map((tab) => {
              const isActive = selectedCategory === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => onSelectCategory(tab.id)}
                  className={`px-4 py-2 text-xs font-medium rounded-full transition-all cursor-pointer whitespace-nowrap shrink-0 ${
                    isActive
                      ? 'bg-[#1D1D1F] text-white shadow-sm'
                      : 'text-[#6E6E73] hover:text-[#1D1D1F]'
                  }`}
                >
                  {tab.label}
                </button>
              );
            })}
          </div>
        </div>

        {/* 3-Column / 2-Column Responsive Product Showcase Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-stretch">
          {filteredProducts.map((product) => (
            <div
              key={product.id}
              className="apple-card-white rounded-3xl p-8 flex flex-col justify-between group text-left cursor-pointer transition-all duration-300"
              onClick={() => onSelectProduct(product)}
            >
              <div>
                {/* Clean Unboxed Eyebrow & Badge */}
                <div className="flex items-center justify-between text-xs text-[#86868B] mb-2 font-mono">
                  <span>{product.eyebrow}</span>
                  {product.badge && <span>{product.badge}</span>}
                </div>

                {/* Title & Tagline */}
                <h3 className="text-2xl font-bold text-[#1D1D1F] group-hover:text-[#0071E3] transition-colors leading-snug font-['Plus_Jakarta_Sans']">
                  {product.name}
                </h3>
                <p className="text-sm text-[#6E6E73] mt-2 mb-6 leading-relaxed line-clamp-2">
                  {product.description}
                </p>

                {/* Large Product Imagery */}
                <div className="relative aspect-[4/3] rounded-2xl overflow-hidden bg-[#F5F5F7] mb-8 border border-black/[0.04]">
                  <img
                    src={product.image}
                    alt={product.name}
                    className="w-full h-full object-cover object-center group-hover:scale-103 transition-transform duration-500 ease-[cubic-bezier(0.16,1,0.3,1)]"
                    loading="lazy"
                  />
                </div>

                {/* Key Spec Callouts */}
                <div className="space-y-2.5 pb-6 border-b border-black/[0.06]">
                  {product.specs.slice(0, 3).map((spec, i) => (
                    <div key={i} className="flex items-center justify-between text-xs">
                      <span className="text-[#86868B]">{spec.label}</span>
                      <span className="font-semibold text-[#1D1D1F] font-mono tabular-nums text-right max-w-[180px] truncate">
                        {spec.value}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Bottom Actions & Price */}
              <div className="pt-6 flex items-center justify-between gap-4">
                <div>
                  <span className="text-[11px] text-[#86868B] block uppercase tracking-wider">From</span>
                  <span className="text-xl font-bold text-[#1D1D1F] font-mono tabular-nums">
                    {product.priceFormatted}
                  </span>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      onSelectProduct(product);
                    }}
                    className="px-3.5 py-2 text-xs font-medium text-[#1D1D1F] bg-[#F5F5F7] hover:bg-[#EBEBEF] rounded-full transition-colors cursor-pointer"
                  >
                    Quick View
                  </button>

                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      onConfigureProduct(product);
                    }}
                    className="apple-btn-primary px-4 py-2 text-xs font-semibold flex items-center gap-1 cursor-pointer"
                  >
                    <span>Buy</span>
                    <ChevronRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
