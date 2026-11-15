import React, { useState } from 'react';
import { Check, ShieldCheck, Truck, Sparkles, ChevronRight } from 'lucide-react';
import { AuraProduct, ProductColorway, AuraCartItem } from '../types/aura';
import { HERO_PRODUCT, PRODUCT_LINEUP } from '../data/auraProducts';
import { calculateCustomizedPrice, formatCurrency } from '../utils/bagStore';

interface InteractiveCustomizerProps {
  initialProduct?: AuraProduct;
  onAddToBag: (item: AuraCartItem) => void;
}

const STORAGE_OPTIONS = [
  { id: '1tb', label: '1TB SSD Storage', delta: 0, sub: 'High-speed PCIe 5.0' },
  { id: '2tb', label: '2TB SSD Storage', delta: 400, sub: '+$400 · Recommended for 6K RAW' },
  { id: '4tb', label: '4TB SSD Storage', delta: 1000, sub: '+$1,000 · Massive studio libraries' },
  { id: '8tb', label: '8TB SSD Storage', delta: 2200, sub: '+$2,200 · Maximum capacity' },
];

const MEMORY_OPTIONS = [
  { id: '32gb', label: '32GB Unified Memory', delta: 0, sub: 'Blazing fast 800 GB/s bandwidth' },
  { id: '64gb', label: '64GB Unified Memory', delta: 400, sub: '+$400 · Ideal for heavy 3D & VFX' },
  { id: '128gb', label: '128GB Unified Memory', delta: 1200, sub: '+$1,200 · Extreme simulation workflows' },
];

export const InteractiveCustomizer: React.FC<InteractiveCustomizerProps> = ({
  initialProduct = HERO_PRODUCT,
  onAddToBag,
}) => {
  const [selectedProduct, setSelectedProduct] = useState<AuraProduct>(initialProduct);
  const [selectedColorway, setSelectedColorway] = useState<ProductColorway>(initialProduct.colorways[0]);
  const [selectedStorage, setSelectedStorage] = useState(STORAGE_OPTIONS[0]);
  const [selectedMemory, setSelectedMemory] = useState(MEMORY_OPTIONS[0]);
  const [engraving, setEngraving] = useState('');
  const [hasCarePlan, setHasCarePlan] = useState(false);
  const [isAddedAnimation, setIsAddedAnimation] = useState(false);

  // Switch product if user clicks tab
  const handleProductSwitch = (prod: AuraProduct) => {
    setSelectedProduct(prod);
    setSelectedColorway(prod.colorways[0]);
    setSelectedStorage(STORAGE_OPTIONS[0]);
    setSelectedMemory(MEMORY_OPTIONS[0]);
    setEngraving('');
  };

  const totalPrice = calculateCustomizedPrice(
    selectedProduct.price,
    selectedStorage.delta,
    selectedMemory.delta,
    hasCarePlan
  );

  const handleAdd = () => {
    const item: AuraCartItem = {
      id: `${selectedProduct.id}-${selectedColorway.id}-${Date.now()}`,
      product: selectedProduct,
      colorway: selectedColorway,
      storage: selectedStorage.label,
      memory: selectedMemory.label,
      engraving: engraving.trim() || undefined,
      price: totalPrice,
      quantity: 1,
    };

    onAddToBag(item);
    setIsAddedAnimation(true);
    setTimeout(() => setIsAddedAnimation(false), 2000);
  };

  return (
    <section id="customizer-section" className="py-20 sm:py-28 bg-[#F5F5F7] border-t border-black/[0.05]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16 space-y-3">
          <p className="text-xs font-semibold tracking-wider uppercase text-[#6E6E73] font-['Plus_Jakarta_Sans']">
            Studio Configurator
          </p>
          <h2 className="text-3xl sm:text-5xl font-bold tracking-tight text-[#1D1D1F]">
            Build your personal workstation.
          </h2>
          <p className="text-sm sm:text-base text-[#6E6E73]">
            Configure memory, high-bandwidth storage, precision finish, and laser engraving tailored to your creative workflow.
          </p>

          {/* Model Switcher Tabs */}
          <div className="inline-flex items-center gap-1 p-1 bg-white rounded-full border border-black/[0.06] shadow-sm mt-4">
            {[HERO_PRODUCT, ...PRODUCT_LINEUP].map((prod) => {
              const isActive = selectedProduct.id === prod.id;
              return (
                <button
                  key={prod.id}
                  onClick={() => handleProductSwitch(prod)}
                  className={`px-4 py-1.5 text-xs font-medium rounded-full transition-all cursor-pointer whitespace-nowrap shrink-0 ${
                    isActive
                      ? 'bg-[#1D1D1F] text-white shadow-sm'
                      : 'text-[#6E6E73] hover:text-[#1D1D1F]'
                  }`}
                >
                  {prod.name}
                </button>
              );
            })}
          </div>
        </div>

        {/* 2-Column Split: Interactive Gallery Left, Contiguous Purchase Module Right */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
          {/* Left Column (7 cols): Sticky Product Preview with Real-time Finish & Engraving */}
          <div className="lg:col-span-7 space-y-6 lg:sticky lg:top-20">
            <div className="apple-card-white p-8 rounded-3xl overflow-hidden text-center relative border border-black/[0.06]">
              {/* Product Visual */}
              <div className="relative aspect-[4/3] w-full rounded-2xl overflow-hidden bg-[#F5F5F7] mb-6">
                <img
                  src={selectedProduct.image}
                  alt={selectedProduct.name}
                  className="w-full h-full object-cover object-center transition-all duration-500"
                />

                {/* Laser Engraving Visual Simulator */}
                {engraving && (
                  <div className="absolute bottom-6 left-1/2 -translate-x-1/2 px-4 py-1.5 rounded-md bg-white/90 backdrop-blur-md border border-black/10 shadow-sm text-xs font-mono tracking-widest text-[#1D1D1F]">
                    LASER ENGRAVED: {engraving.toUpperCase()}
                  </div>
                )}
              </div>

              {/* Selected Finish Callout */}
              <div className="flex items-center justify-between text-xs text-[#6E6E73] pt-2 border-t border-black/[0.06]">
                <span className="font-medium text-[#1D1D1F]">
                  Finish: {selectedColorway.name}
                </span>
                <span className="font-mono text-[#86868B]">
                  {selectedColorway.finishLabel}
                </span>
              </div>
            </div>

            {/* In-the-box preview */}
            <div className="p-6 rounded-2xl bg-white border border-black/[0.06] text-xs space-y-2">
              <span className="font-bold text-[#1D1D1F] uppercase tracking-wider block font-['Plus_Jakarta_Sans']">
                What’s in the Box:
              </span>
              <ul className="text-[#6E6E73] space-y-1">
                {selectedProduct.inBox.map((item, idx) => (
                  <li key={idx} className="flex items-center gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#1D1D1F]" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Right Column (5 cols): Contiguous Configuration & Purchase Module */}
          <div className="lg:col-span-5 space-y-8">
            {/* 1. Finish Selection */}
            <div className="space-y-3">
              <label className="text-xs font-bold uppercase tracking-wider text-[#1D1D1F] block">
                1. Select Exterior Finish
              </label>
              <div className="grid grid-cols-2 gap-3">
                {selectedProduct.colorways.map((col) => {
                  const isSelected = selectedColorway.id === col.id;
                  return (
                    <button
                      key={col.id}
                      onClick={() => setSelectedColorway(col)}
                      className={`p-4 rounded-2xl text-left transition-all border cursor-pointer ${
                        isSelected
                          ? 'border-[#0071E3] bg-white ring-1 ring-[#0071E3] shadow-sm'
                          : 'border-black/[0.06] bg-white hover:border-black/20'
                      }`}
                    >
                      <div className="flex items-center gap-2.5 mb-2">
                        <span
                          className="w-4 h-4 rounded-full border border-black/15 shadow-inner"
                          style={{ backgroundColor: col.hex }}
                        />
                        <span className="text-xs font-semibold text-[#1D1D1F] font-['Plus_Jakarta_Sans']">
                          {col.name}
                        </span>
                      </div>
                      <span className="text-[11px] text-[#86868B] block truncate">
                        {col.finishLabel}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* 2. Unified Memory Selection */}
            <div className="space-y-3">
              <label className="text-xs font-bold uppercase tracking-wider text-[#1D1D1F] block">
                2. Unified Memory
              </label>
              <div className="space-y-2">
                {MEMORY_OPTIONS.map((mem) => {
                  const isSelected = selectedMemory.id === mem.id;
                  return (
                    <button
                      key={mem.id}
                      onClick={() => setSelectedMemory(mem)}
                      className={`w-full p-4 rounded-2xl text-left flex items-center justify-between transition-all border cursor-pointer ${
                        isSelected
                          ? 'border-[#0071E3] bg-white ring-1 ring-[#0071E3] shadow-sm'
                          : 'border-black/[0.06] bg-white hover:border-black/20'
                      }`}
                    >
                      <div>
                        <span className="text-xs font-bold text-[#1D1D1F] block font-['Plus_Jakarta_Sans']">
                          {mem.label}
                        </span>
                        <span className="text-[11px] text-[#86868B]">
                          {mem.sub}
                        </span>
                      </div>
                      {isSelected && <Check className="w-4 h-4 text-[#0071E3]" />}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* 3. High-Speed Storage Selection */}
            <div className="space-y-3">
              <label className="text-xs font-bold uppercase tracking-wider text-[#1D1D1F] block">
                3. PCIe 5.0 Storage
              </label>
              <div className="space-y-2">
                {STORAGE_OPTIONS.map((st) => {
                  const isSelected = selectedStorage.id === st.id;
                  return (
                    <button
                      key={st.id}
                      onClick={() => setSelectedStorage(st)}
                      className={`w-full p-4 rounded-2xl text-left flex items-center justify-between transition-all border cursor-pointer ${
                        isSelected
                          ? 'border-[#0071E3] bg-white ring-1 ring-[#0071E3] shadow-sm'
                          : 'border-black/[0.06] bg-white hover:border-black/20'
                      }`}
                    >
                      <div>
                        <span className="text-xs font-bold text-[#1D1D1F] block font-['Plus_Jakarta_Sans']">
                          {st.label}
                        </span>
                        <span className="text-[11px] text-[#86868B]">
                          {st.sub}
                        </span>
                      </div>
                      {isSelected && <Check className="w-4 h-4 text-[#0071E3]" />}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* 4. Free Laser Engraving Input */}
            <div className="space-y-2">
              <label className="text-xs font-bold uppercase tracking-wider text-[#1D1D1F] block">
                4. Complimentary Laser Engraving (Optional)
              </label>
              <input
                type="text"
                maxLength={24}
                value={engraving}
                onChange={(e) => setEngraving(e.target.value)}
                placeholder="Enter name, initials, or memo (max 24 characters)"
                className="w-full px-4 py-3 rounded-2xl bg-white border border-black/[0.08] text-xs text-[#1D1D1F] placeholder:text-[#86868B] outline-none focus:border-[#0071E3] font-mono"
              />
            </div>

            {/* 5. AURA Care+ Plan */}
            <div
              onClick={() => setHasCarePlan(!hasCarePlan)}
              className={`p-4 rounded-2xl border transition-all cursor-pointer flex items-start gap-3.5 ${
                hasCarePlan
                  ? 'border-[#0071E3] bg-white ring-1 ring-[#0071E3]'
                  : 'border-black/[0.06] bg-white hover:border-black/20'
              }`}
            >
              <div className="mt-0.5">
                <ShieldCheck className={`w-5 h-5 ${hasCarePlan ? 'text-[#0071E3]' : 'text-[#86868B]'}`} />
              </div>
              <div className="flex-1 text-xs">
                <div className="flex items-center justify-between font-bold text-[#1D1D1F] mb-0.5">
                  <span>AURA Care+ for 2 Years</span>
                  <span className="font-mono">+$299</span>
                </div>
                <p className="text-[11px] text-[#6E6E73] leading-relaxed">
                  Unlimited repairs for accidental damage protection, express replacement, and 24/7 priority hardware engineering support.
                </p>
              </div>
            </div>

            {/* Purchase Bar Sticky Module */}
            <div className="p-6 rounded-3xl bg-white border border-black/[0.08] shadow-lg space-y-4">
              <div className="flex items-baseline justify-between">
                <div>
                  <span className="text-xs text-[#86868B] block">Total Order Investment</span>
                  <span className="text-3xl font-bold font-mono text-[#1D1D1F] tabular-nums">
                    {formatCurrency(totalPrice)}
                  </span>
                </div>
                <div className="text-right text-xs text-[#86868B]">
                  <span>Or $104/mo. for 24 mo.</span>
                </div>
              </div>

              {/* Delivery Promise */}
              <div className="flex items-center gap-2 text-xs text-[#6E6E73] pt-1">
                <Truck className="w-4 h-4 text-[#0071E3] shrink-0" />
                <span>Order today for complimentary express delivery by Friday.</span>
              </div>

              {/* Add to Bag CTA */}
              <button
                onClick={handleAdd}
                className="w-full apple-btn-primary py-3.5 text-sm font-semibold flex items-center justify-center gap-2 cursor-pointer transition-all shadow-md active:scale-[0.98]"
              >
                {isAddedAnimation ? (
                  <>
                    <Check className="w-4 h-4 stroke-[2.5]" />
                    <span>Added to Bag!</span>
                  </>
                ) : (
                  <>
                    <span>Add to Bag</span>
                    <ChevronRight className="w-4 h-4" />
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
