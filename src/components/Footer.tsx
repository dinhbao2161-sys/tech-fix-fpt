import React from 'react';

export const Footer: React.FC = () => {
  return (
    <footer className="bg-[#F5F5F7] border-t border-black/[0.06] text-xs text-[#6E6E73] py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        {/* Footnote Disclaimers */}
        <div className="space-y-2 text-[11px] leading-relaxed border-b border-black/[0.06] pb-8 text-[#86868B]">
          <p>
            1. 6K Liquid Retina XDR display has rounded corners that follow a beautiful curved design, and these corners are within a standard rectangular shape. When measured as a standard rectangular shape, the screen is 31.5 inches diagonally.
          </p>
          <p>
            2. Testing conducted by AURA in October 2026 using preproduction Apollo-X 3nm systems with 128GB of unified memory. Actual performance varies based on configuration, network, and environmental conditions.
          </p>
          <p>
            3. Free express delivery available on all hardware systems within the continental United States and eligible global metropolitan regions.
          </p>
        </div>

        {/* 5-Column Apple Directory */}
        <div className="grid grid-cols-2 md:grid-cols-5 gap-8">
          <div className="space-y-3">
            <h4 className="font-semibold text-[#1D1D1F] font-['Plus_Jakarta_Sans']">Hardware Ecosystem</h4>
            <ul className="space-y-2">
              <li><a href="#studio-pro-section" className="hover:text-[#1D1D1F] transition-colors">AURA Studio Pro</a></li>
              <li><a href="#lineup-section" className="hover:text-[#1D1D1F] transition-colors">AURA Audio One</a></li>
              <li><a href="#lineup-section" className="hover:text-[#1D1D1F] transition-colors">AURA Spatial One</a></li>
              <li><a href="#silicon-bento" className="hover:text-[#1D1D1F] transition-colors">Apollo-X 3nm Silicon</a></li>
              <li><a href="#comparator-section" className="hover:text-[#1D1D1F] transition-colors">Compare All Models</a></li>
            </ul>
          </div>

          <div className="space-y-3">
            <h4 className="font-semibold text-[#1D1D1F] font-['Plus_Jakarta_Sans']">Acoustic & Optics</h4>
            <ul className="space-y-2">
              <li><span className="text-[#86868B]">Lossless Spatial Audio</span></li>
              <li><span className="text-[#86868B]">Micro-OLED Technology</span></li>
              <li><span className="text-[#86868B]">Nanometer Glass Finishing</span></li>
              <li><span className="text-[#86868B]">Acoustic Chamber Design</span></li>
            </ul>
          </div>

          <div className="space-y-3">
            <h4 className="font-semibold text-[#1D1D1F] font-['Plus_Jakarta_Sans']">Studio Services</h4>
            <ul className="space-y-2">
              <li><span className="text-[#86868B]">AURA Care+ Protection</span></li>
              <li><span className="text-[#86868B]">White-Glove Installation</span></li>
              <li><span className="text-[#86868B]">Enterprise Hardware Leases</span></li>
              <li><span className="text-[#86868B]">Developer Spatial SDK</span></li>
            </ul>
          </div>

          <div className="space-y-3">
            <h4 className="font-semibold text-[#1D1D1F] font-['Plus_Jakarta_Sans']">Sustainability</h4>
            <ul className="space-y-2">
              <li><span className="text-[#86868B]">100% Recycled Titanium</span></li>
              <li><span className="text-[#86868B]">Carbon Neutral 2030 Roadmap</span></li>
              <li><span className="text-[#86868B]">Closed-Loop Water Recycling</span></li>
              <li><span className="text-[#86868B]">Supply Chain Transparency</span></li>
            </ul>
          </div>

          <div className="space-y-3">
            <h4 className="font-semibold text-[#1D1D1F] font-['Plus_Jakarta_Sans']">AURA Labs</h4>
            <ul className="space-y-2">
              <li><span className="text-[#86868B]">Industrial Design Philosophy</span></li>
              <li><span className="text-[#86868B]">Architecture Whitepapers</span></li>
              <li><span className="text-[#86868B]">Press Room & Assets</span></li>
              <li><span className="text-[#86868B]">Global Retail Studios</span></li>
            </ul>
          </div>
        </div>

        {/* Quiet Bottom Copyright & Legal Line */}
        <div className="pt-8 border-t border-black/[0.06] flex flex-col sm:flex-row items-center justify-between gap-4 text-[11px] text-[#86868B]">
          <div>
            Copyright © 2026 AURA Inc. All rights reserved. Precision technology engineered in California.
          </div>

          <div className="flex items-center gap-4">
            <span className="hover:text-[#1D1D1F] transition-colors cursor-pointer">Privacy Policy</span>
            <span aria-hidden="true">·</span>
            <span className="hover:text-[#1D1D1F] transition-colors cursor-pointer">Terms of Use</span>
            <span aria-hidden="true">·</span>
            <span className="hover:text-[#1D1D1F] transition-colors cursor-pointer">Sales & Refunds</span>
            <span aria-hidden="true">·</span>
            <span className="hover:text-[#1D1D1F] transition-colors cursor-pointer">Legal</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
