const STORAGE_KEY = 'minishop-cart';

function read() {
  try {
    const data = JSON.parse(localStorage.getItem(STORAGE_KEY));
    return data && typeof data === 'object' ? data : {};
  } catch {
    return {};
  }
}

function write(cart) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(cart));
  } catch (error) {
    console.error('Не вдалося зберегти кошик:', error);
  }
}

export function getCart() {
  return read();
}

export function addToCart(id) {
  const cart = read();
  cart[id] = (cart[id] || 0) + 1;
  write(cart);
}

export function setQty(id, qty) {
  const cart = read();
  if (qty <= 0) {
    delete cart[id];
  } else {
    cart[id] = qty;
  }
  write(cart);
}

export function removeFromCart(id) {
  setQty(id, 0);
}

export function clearCart() {
  write({});
}

export function getCartCount() {
  return Object.values(read()).reduce((sum, qty) => sum + qty, 0);
}
