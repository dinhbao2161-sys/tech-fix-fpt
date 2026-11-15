import test from 'node:test';
import assert from 'node:assert/strict';
import {
  formatCurrency,
  calculateCustomizedPrice,
  addItemToBag,
  removeItemFromBag,
  updateItemQuantity,
  calculateBagSubtotal,
  calculateEstimatedTax,
  calculateTotal
} from './bagStore.ts';
import { HERO_PRODUCT } from '../data/auraProducts.ts';
import { AuraCartItem } from '../types/aura.ts';

test('formatCurrency formats integer dollars cleanly', () => {
  assert.equal(formatCurrency(2499), '$2,499');
  assert.equal(formatCurrency(0), '$0');
  assert.equal(formatCurrency(549), '$549');
});

test('calculateCustomizedPrice sums base, storage, memory, and care plan', () => {
  // Base $2499 + $400 storage + $400 memory + $299 care
  const priceWithCare = calculateCustomizedPrice(2499, 400, 400, true);
  assert.equal(priceWithCare, 3598);

  const priceWithoutCare = calculateCustomizedPrice(2499, 200, 0, false);
  assert.equal(priceWithoutCare, 2699);
});

test('addItemToBag adds item and increments quantity for identical configurations', () => {
  const item1: AuraCartItem = {
    id: 'test-1',
    product: HERO_PRODUCT,
    colorway: HERO_PRODUCT.colorways[0],
    storage: '1TB SSD',
    memory: '32GB Unified',
    price: 2499,
    quantity: 1,
  };

  const cart1 = addItemToBag([], item1);
  assert.equal(cart1.length, 1);
  assert.equal(cart1[0].quantity, 1);

  // Add identical item
  const cart2 = addItemToBag(cart1, { ...item1, id: 'test-2' });
  assert.equal(cart2.length, 1);
  assert.equal(cart2[0].quantity, 2);

  // Add different storage option
  const itemDiffStorage: AuraCartItem = {
    ...item1,
    id: 'test-3',
    storage: '2TB SSD',
  };
  const cart3 = addItemToBag(cart2, itemDiffStorage);
  assert.equal(cart3.length, 2);
});

test('removeItemFromBag and updateItemQuantity manage bag properly', () => {
  const item: AuraCartItem = {
    id: 'cart-item-1',
    product: HERO_PRODUCT,
    colorway: HERO_PRODUCT.colorways[0],
    storage: '1TB SSD',
    memory: '32GB Unified',
    price: 2499,
    quantity: 1,
  };

  let cart = [item];
  cart = updateItemQuantity(cart, 'cart-item-1', 3);
  assert.equal(cart[0].quantity, 3);

  cart = updateItemQuantity(cart, 'cart-item-1', 0); // 0 drops item
  assert.equal(cart.length, 0);
});

test('calculateBagSubtotal, tax, and total are mathematically exact', () => {
  const item: AuraCartItem = {
    id: 'cart-item-1',
    product: HERO_PRODUCT,
    colorway: HERO_PRODUCT.colorways[0],
    storage: '1TB SSD',
    memory: '32GB Unified',
    price: 1000,
    quantity: 2,
  };

  const subtotal = calculateBagSubtotal([item]);
  assert.equal(subtotal, 2000);

  const tax = calculateEstimatedTax(subtotal, 0.10); // 10%
  assert.equal(tax, 200);

  const total = calculateTotal(subtotal, tax, 0);
  assert.equal(total, 2200);
});
