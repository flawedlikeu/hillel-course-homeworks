import { products } from './mock-data';
import type { Cart, CartItem } from './types';

const STORAGE_KEY = 'minishop-cart';

function read(): Cart {
  try {
    const data: unknown = JSON.parse(localStorage.getItem(STORAGE_KEY) ?? '{}');
    return data && typeof data === 'object' ? (data as Cart) : {};
  } catch {
    return {};
  }
}

function write(cart: Cart): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(cart));
  } catch (error) {
    console.error('Не вдалося зберегти кошик:', error);
  }
}

export function getCart(): Cart {
  return read();
}

export function addToCart(id: number): void {
  const cart = read();
  cart[id] = (cart[id] ?? 0) + 1;
  write(cart);
}

export function setQty(id: number, qty: number): void {
  const cart = read();
  if (qty <= 0) {
    delete cart[id];
  } else {
    cart[id] = qty;
  }
  write(cart);
}

export function removeFromCart(id: number): void {
  setQty(id, 0);
}

export function clearCart(): void {
  write({});
}

export function getCartCount(): number {
  return Object.values(read()).reduce((sum, qty) => sum + qty, 0);
}

export function getCartItems(): CartItem[] {
  return Object.entries(read())
    .map(([id, qty]) => ({ product: products.find((p) => p.id === Number(id)), qty }))
    .filter((item): item is CartItem => Boolean(item.product) && item.qty > 0);
}
