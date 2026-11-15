import React from 'react';
import { ShoppingBag, ChevronRight } from 'lucide-react';
import { ProductCategory } from '../types/aura';

interface NavigationProps {
  activeCategory: ProductCategory;
  onSelectCategory: (cat: ProductCategory) => void;
  onOpenBag: () => void;
  bagCount: number;
  onPreOrderClick: () => void;
}

export const Navigation: React.FC<NavigationProps> = ({
  activeCategory,
  onSelectCategory,
  onOpenBag,
  bagCount,
  onPreOrderClick,
}) => {
  return (
    <header className="sticky top-0 z-40 w-full apple-nav-blur transition-all duration-300">
      {/* 3-Zone Apple-style Top Bar Contract */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-14 flex items-center justify-between gap-8">
        {/* Zone 1: Brand Wordmark (Single text element in display face, no subtext pill) */}
        <a
          href="#"
          onClick={(e) => {
            e.preventDefault();
            window.scrollTo({ top: 0, behavior: 'smooth' });
          }}
          className="text-base font-bold tracking-tight text-[#1D1D1F] hover:opacity-75 transition-opacity whitespace-nowrap shrink-0 font-['Plus_Jakarta_Sans']"
        >
          AURA
        </a>

        {/* Zone 2: 4–5 single-line clean text navigation links */}
        <nav className="hidden md:flex items-center gap-8 text-[13px] font-normal text-[#1D1D1F]/80">
          <button
            onClick={() => {
              const el = document.getElementById('studio-pro-section');
              el?.scrollIntoView({ behavior: 'smooth' });
            }}
            className="hover:text-[#1D1D1F] transition-colors whitespace-nowrap shrink-0 cursor-pointer"
          >
            Studio Pro
          </button>
          <button
            onClick={() => {
              const el = document.getElementById('lineup-section');
              el?.scrollIntoView({ behavior: 'smooth' });
              onSelectCategory('audio');
            }}
            className="hover:text-[#1D1D1F] transition-colors whitespace-nowrap shrink-0 cursor-pointer"
          >
            Audio One
          </button>
          <button
            onClick={() => {
              const el = document.getElementById('lineup-section');
              el?.scrollIntoView({ behavior: 'smooth' });
              onSelectCategory('spatial');
            }}
            className="hover:text-[#1D1D1F] transition-colors whitespace-nowrap shrink-0 cursor-pointer"
          >
            Spatial Glass
          </button>
          <button
            onClick={() => {
              const el = document.getElementById('silicon-bento');
              el?.scrollIntoView({ behavior: 'smooth' });
            }}
            className="hover:text-[#1D1D1F] transition-colors whitespace-nowrap shrink-0 cursor-pointer"
          >
            Silicon 3nm
          </button>
          <button
            onClick={() => {
              const el = document.getElementById('comparator-section');
              el?.scrollIntoView({ behavior: 'smooth' });
            }}
            className="hover:text-[#1D1D1F] transition-colors whitespace-nowrap shrink-0 cursor-pointer"
          >
            Compare
          </button>
        </nav>

        {/* Zone 3: 1 primary action + Bag Trigger */}
        <div className="flex items-center gap-3.5 shrink-0">
          <button
            onClick={onOpenBag}
            className="relative p-2 text-[#1D1D1F]/80 hover:text-[#1D1D1F] transition-colors cursor-pointer"
            aria-label="View Shopping Bag"
            title="Shopping Bag"
          >
            <ShoppingBag className="w-4 h-4 stroke-[1.8]" />
            {bagCount > 0 && (
              <span className="absolute -top-0.5 -right-0.5 w-4 h-4 rounded-full bg-[#0071E3] text-white text-[10px] font-mono font-bold flex items-center justify-center tabular-nums">
                {bagCount}
              </span>
            )}
          </button>

          <button
            onClick={onPreOrderClick}
            className="apple-btn-primary px-3.5 py-1.5 text-xs font-medium flex items-center gap-1 cursor-pointer whitespace-nowrap shrink-0"
          >
            <span>Pre-order</span>
            <ChevronRight className="w-3.5 h-3.5 stroke-[2.2]" />
          </button>
        </div>
      </div>
    </header>
  );
};
