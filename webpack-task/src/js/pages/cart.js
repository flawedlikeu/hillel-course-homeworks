import { sumBy } from 'lodash-es';
import { products } from '../modules/mock-data';
import { getCart, setQty, removeFromCart, clearCart } from '../modules/cart-store';
import { formatPrice, updateCartBadge, el } from '../modules/ui';

const list = document.getElementById('cart-list');
const cartBox = document.getElementById('cart');
const emptyBox = document.getElementById('cart-empty');
const summary = document.getElementById('summary');
const totalCount = document.getElementById('total-count');
const totalPrice = document.getElementById('total-price');
const clearButton = document.getElementById('clear-cart');

function getItems() {
  const cart = getCart();
  return Object.entries(cart)
    .map(([id, qty]) => ({ product: products.find((p) => p.id === Number(id)), qty }))
    .filter((item) => item.product && item.qty > 0);
}

function createQtyButton(text, action, id, label) {
  const button = el('button', 'qty__btn', text);
  button.type = 'button';
  button.dataset.action = action;
  button.dataset.id = id;
  button.setAttribute('aria-label', label);
  return button;
}

function createItem({ product, qty }) {
  const li = el('li', 'cart-item');

  const info = el('div', 'cart-item__info');
  info.append(
    el('h3', 'cart-item__title', product.title),
    el('span', 'cart-item__price', `${formatPrice(product.price)} / шт.`),
  );

  const qtyBox = el('div', 'qty');
  qtyBox.append(
    createQtyButton('−', 'dec', product.id, 'Зменшити кількість'),
    el('span', 'qty__value', qty),
    createQtyButton('+', 'inc', product.id, 'Збільшити кількість'),
  );

  const subtotal = el('strong', 'cart-item__subtotal', formatPrice(product.price * qty));

  const remove = el('button', 'btn btn--icon', '✕');
  remove.type = 'button';
  remove.dataset.action = 'remove';
  remove.dataset.id = product.id;
  remove.setAttribute('aria-label', `Видалити «${product.title}»`);

  li.append(el('div', 'cart-item__image', product.image), info, qtyBox, subtotal, remove);
  return li;
}

function render() {
  const items = getItems();
  const isEmpty = items.length === 0;

  emptyBox.hidden = !isEmpty;
  cartBox.hidden = isEmpty;
  summary.hidden = isEmpty;

  list.replaceChildren(...items.map(createItem));
  totalCount.textContent = sumBy(items, 'qty');
  totalPrice.textContent = formatPrice(sumBy(items, ({ product, qty }) => product.price * qty));

  updateCartBadge();
}

list.addEventListener('click', (event) => {
  const button = event.target.closest('[data-action]');
  if (!button) return;

  const id = Number(button.dataset.id);
  const qty = getCart()[id] || 0;

  if (button.dataset.action === 'inc') setQty(id, qty + 1);
  if (button.dataset.action === 'dec') setQty(id, qty - 1);
  if (button.dataset.action === 'remove') removeFromCart(id);

  render();
});

clearButton.addEventListener('click', () => {
  if (window.confirm('Очистити кошик?')) {
    clearCart();
    render();
  }
});

window.addEventListener('storage', render);

render();
