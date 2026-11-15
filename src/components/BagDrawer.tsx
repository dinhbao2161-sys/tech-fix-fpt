import React, { useState } from 'react';
import { X, Trash2, Plus, Minus, ShoppingBag, ShieldCheck, CheckCircle2 } from 'lucide-react';
import { AuraCartItem } from '../types/aura';
import {
  calculateBagSubtotal,
  calculateEstimatedTax,
  calculateTotal,
  formatCurrency,
} from '../utils/bagStore';

interface BagDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  cart: AuraCartItem[];
  onUpdateQuantity: (id: string, qty: number) => void;
  onRemoveItem: (id: string) => void;
  onClearBag: () => void;
}

export const BagDrawer: React.FC<BagDrawerProps> = ({
  isOpen,
  onClose,
  cart,
  onUpdateQuantity,
  onRemoveItem,
  onClearBag,
}) => {
  const [isCheckingOut, setIsCheckingOut] = useState(false);
  const [orderConfirmed, setOrderConfirmed] = useState(false);

  if (!isOpen) return null;

  const subtotal = calculateBagSubtotal(cart);
  const estimatedTax = calculateEstimatedTax(subtotal);
  const total = calculateTotal(subtotal, estimatedTax, 0);

  const handleCheckout = () => {
    setIsCheckingOut(true);
    setTimeout(() => {
      setIsCheckingOut(false);
      setOrderConfirmed(true);
      onClearBag();
    }, 1200);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/40 backdrop-blur-sm transition-opacity"
        onClick={onClose}
      />

      <div className="fixed inset-y-0 right-0 max-w-full flex pl-10">
        <div className="w-screen max-w-md bg-white shadow-2xl flex flex-col">
          {/* Header */}
          <div className="p-6 border-b border-black/[0.06] flex items-center justify-between">
            <div className="flex items-center gap-2">
              <ShoppingBag className="w-4 h-4 text-[#1D1D1F]" />
              <h2 className="text-base font-bold text-[#1D1D1F] font-['Plus_Jakarta_Sans']">
                Review your Bag ({cart.reduce((s, i) => s + i.quantity, 0)})
              </h2>
            </div>
            <button
              onClick={onClose}
              className="w-8 h-8 rounded-full bg-[#F5F5F7] hover:bg-[#E8E8ED] flex items-center justify-center text-[#1D1D1F] transition-colors cursor-pointer"
              aria-label="Close Bag"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Body */}
          <div className="flex-1 overflow-y-auto p-6 space-y-6">
            {orderConfirmed ? (
              <div className="py-16 text-center space-y-4">
                <div className="w-16 h-16 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center mx-auto">
                  <CheckCircle2 className="w-8 h-8 stroke-[2]" />
                </div>
                <h3 className="text-xl font-bold text-[#1D1D1F]">
                  Order #AU-89421 Confirmed
                </h3>
                <p className="text-xs text-[#6E6E73] max-w-xs mx-auto leading-relaxed">
                  Thank you for your order. We’ve sent a confirmation email with white-glove tracking details.
                </p>
                <button
                  onClick={() => {
                    setOrderConfirmed(false);
                    onClose();
                  }}
                  className="apple-btn-secondary px-6 py-2.5 text-xs font-medium cursor-pointer"
                >
                  Continue Browsing
                </button>
              </div>
            ) : cart.length === 0 ? (
              <div className="py-20 text-center space-y-3">
                <div className="w-12 h-12 rounded-full bg-[#F5F5F7] flex items-center justify-center mx-auto text-[#86868B]">
                  <ShoppingBag className="w-6 h-6 stroke-[1.5]" />
                </div>
                <p className="text-base font-bold text-[#1D1D1F]">Your Bag is empty.</p>
                <p className="text-xs text-[#6E6E73]">
                  Explore the AURA hardware ecosystem and customize your setup.
                </p>
              </div>
            ) : (
              <div className="space-y-4">
                {cart.map((item) => (
                  <div
                    key={item.id}
                    className="p-4 rounded-2xl bg-[#F5F5F7] border border-black/[0.04] space-y-3"
                  >
                    <div className="flex items-start gap-4">
                      <img
                        src={item.product.image}
                        alt={item.product.name}
                        className="w-16 h-16 object-cover rounded-xl bg-white border border-black/[0.04]"
                      />
                      <div className="flex-1 min-w-0">
                        <div className="flex items-baseline justify-between gap-2">
                          <h4 className="text-sm font-bold text-[#1D1D1F] truncate">
                            {item.product.name}
                          </h4>
                          <span className="text-sm font-bold font-mono text-[#1D1D1F] tabular-nums">
                            {formatCurrency(item.price * item.quantity)}
                          </span>
                        </div>
                        <p className="text-xs text-[#6E6E73]">
                          {item.colorway.name} · {item.storage}
                        </p>
                        {item.memory && (
                          <p className="text-[11px] text-[#86868B]">{item.memory}</p>
                        )}
                        {item.engraving && (
                          <p className="text-[11px] font-mono text-[#0071E3] mt-0.5">
                            Engraving: "{item.engraving}"
                          </p>
                        )}
                      </div>
                    </div>

                    {/* Stepper & Remove */}
                    <div className="pt-2 border-t border-black/[0.04] flex items-center justify-between text-xs">
                      <div className="flex items-center gap-2 bg-white px-2.5 py-1 rounded-full border border-black/[0.06]">
                        <button
                          onClick={() => onUpdateQuantity(item.id, item.quantity - 1)}
                          className="text-[#6E6E73] hover:text-[#1D1D1F] cursor-pointer"
                          aria-label="Decrease quantity"
                        >
                          <Minus className="w-3 h-3" />
                        </button>
                        <span className="font-mono font-bold text-[#1D1D1F] px-1 tabular-nums">
                          {item.quantity}
                        </span>
                        <button
                          onClick={() => onUpdateQuantity(item.id, item.quantity + 1)}
                          className="text-[#6E6E73] hover:text-[#1D1D1F] cursor-pointer"
                          aria-label="Increase quantity"
                        >
                          <Plus className="w-3 h-3" />
                        </button>
                      </div>

                      <button
                        onClick={() => onRemoveItem(item.id)}
                        className="text-[#86868B] hover:text-rose-600 transition-colors flex items-center gap-1 cursor-pointer"
                        aria-label="Remove item"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                        <span>Remove</span>
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Footer Checkout Summary */}
          {!orderConfirmed && cart.length > 0 && (
            <div className="p-6 border-t border-black/[0.06] bg-[#F5F5F7] space-y-4">
              <div className="space-y-1.5 text-xs">
                <div className="flex items-center justify-between text-[#6E6E73]">
                  <span>Subtotal</span>
                  <span className="font-mono text-[#1D1D1F] font-semibold tabular-nums">
                    {formatCurrency(subtotal)}
                  </span>
                </div>
                <div className="flex items-center justify-between text-[#6E6E73]">
                  <span>Shipping</span>
                  <span className="font-mono text-emerald-600 font-semibold">FREE</span>
                </div>
                <div className="flex items-center justify-between text-[#6E6E73]">
                  <span>Estimated Sales Tax</span>
                  <span className="font-mono text-[#1D1D1F] tabular-nums">
                    {formatCurrency(estimatedTax)}
                  </span>
                </div>
                <div className="pt-2 border-t border-black/[0.06] flex items-baseline justify-between text-sm font-bold text-[#1D1D1F]">
                  <span>Total</span>
                  <span className="font-mono text-xl tabular-nums">
                    {formatCurrency(total)}
                  </span>
                </div>
              </div>

              <button
                onClick={handleCheckout}
                disabled={isCheckingOut}
                className="w-full apple-btn-primary py-3.5 text-xs font-semibold flex items-center justify-center gap-2 cursor-pointer transition-all shadow-md active:scale-[0.98] disabled:opacity-50"
              >
                {isCheckingOut ? (
                  <span>Processing Secure Checkout...</span>
                ) : (
                  <span>Check Out with Apple Pay / Card</span>
                )}
              </button>

              <div className="flex items-center justify-center gap-1.5 text-[11px] text-[#86868B]">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                <span>256-bit Encrypted Checkout · 14-Day Free Returns</span>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
