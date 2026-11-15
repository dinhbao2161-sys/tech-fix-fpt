import { AuraCartItem } from '../types/aura';

export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
}

export function calculateCustomizedPrice(
  basePrice: number,
  storageDelta: number = 0,
  memoryDelta: number = 0,
  hasCarePlan: boolean = false
): number {
  const careCost = hasCarePlan ? 299 : 0;
  return basePrice + storageDelta + memoryDelta + careCost;
}

export function addItemToBag(
  cart: AuraCartItem[],
  newItem: AuraCartItem
): AuraCartItem[] {
  const existingIndex = cart.findIndex(
    (item) =>
      item.product.id === newItem.product.id &&
      item.colorway.id === newItem.colorway.id &&
      item.storage === newItem.storage &&
      item.memory === newItem.memory &&
      item.engraving === newItem.engraving
  );

  if (existingIndex > -1) {
    const updated = [...cart];
    updated[existingIndex] = {
      ...updated[existingIndex],
      quantity: updated[existingIndex].quantity + newItem.quantity,
    };
    return updated;
  }

  return [...cart, newItem];
}

export function removeItemFromBag(
  cart: AuraCartItem[],
  id: string
): AuraCartItem[] {
  return cart.filter((item) => item.id !== id);
}

export function updateItemQuantity(
  cart: AuraCartItem[],
  id: string,
  quantity: number
): AuraCartItem[] {
  if (quantity <= 0) {
    return removeItemFromBag(cart, id);
  }
  return cart.map((item) =>
    item.id === id ? { ...item, quantity } : item
  );
}

export function calculateBagSubtotal(cart: AuraCartItem[]): number {
  return cart.reduce((total, item) => total + item.price * item.quantity, 0);
}

export function calculateEstimatedTax(subtotal: number, rate: number = 0.0825): number {
  return Math.round(subtotal * rate);
}

export function calculateTotal(subtotal: number, tax: number, shippingCost: number = 0): number {
  return subtotal + tax + shippingCost;
}
