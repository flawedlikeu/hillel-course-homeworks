import { sumBy } from 'lodash-es';
import '../../styles/cart.less';
import { getCart, getCartItems, setQty, removeFromCart, clearCart } from '../../ts/cart-store';
import { formatPrice } from '../../ts/filters';
import { updateCartBadge, el } from '../ui';

const list = document.getElementById('cart-list');
const cartBox = document.getElementById('cart');
const emptyBox = document.getElementById('cart-empty');
const summary = document.getElementById('summary');
const totalCount = document.getElementById('total-count');
const totalPrice = document.getElementById('total-price');
const clearButton = document.getElementById('clear-cart');

const ACTIONS = {
  inc: (id, qty) => setQty(id, qty + 1),
  dec: (id, qty) => setQty(id, qty - 1),
  remove: (id) => removeFromCart(id),
};

function createActionButton(className, text, action, id, label) {
  const button = el('button', className, text);
  button.type = 'button';
  button.dataset.action = action;
  button.dataset.id = id;
  button.setAttribute('aria-label', label);
  return button;
}

function createItem({ product, qty }) {
  const { id, title, price, image } = product;
  const li = el('li', 'cart-item');

  const info = el('div', 'cart-item__info');
  info.append(
    el('h3', 'cart-item__title', title),
    el('span', 'cart-item__price', `${formatPrice(price)} / шт.`),
  );

  const qtyBox = el('div', 'qty');
  qtyBox.append(
    createActionButton('qty__btn', '−', 'dec', id, 'Зменшити кількість'),
    el('span', 'qty__value', qty),
    createActionButton('qty__btn', '+', 'inc', id, 'Збільшити кількість'),
  );

  li.append(
    el('div', 'cart-item__image', image),
    info,
    qtyBox,
    el('strong', 'cart-item__subtotal', formatPrice(price * qty)),
    createActionButton('btn btn--icon', '✕', 'remove', id, `Видалити «${title}»`),
  );
  return li;
}

function render() {
  const items = getCartItems();
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
  ACTIONS[button.dataset.action]?.(id, getCart()[id] ?? 0);
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
