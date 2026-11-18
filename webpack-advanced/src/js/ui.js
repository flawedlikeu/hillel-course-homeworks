import 'modern-normalize/modern-normalize.css';
import '../styles/fonts.css';
import '../styles/main.scss';
import { getCartCount } from '../ts/cart-store';

export function updateCartBadge() {
  const count = getCartCount();
  document.querySelectorAll('[data-cart-count]').forEach((node) => {
    node.textContent = count;
  });
}

let toastTimer;

export function showToast(message) {
  const toast = document.getElementById('toast');
  if (!toast) return;
  toast.textContent = message;
  toast.classList.add('toast--visible');
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => toast.classList.remove('toast--visible'), 2000);
}

export function el(tag, className = '', text) {
  const node = document.createElement(tag);
  if (className) node.className = className;
  if (text !== undefined) node.textContent = text;
  return node;
}
