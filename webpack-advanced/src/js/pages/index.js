import { debounce } from 'lodash-es';
import { products, categories } from '../../ts/mock-data';
import { addToCart } from '../../ts/cart-store';
import { readFilters, filterProducts, formatPrice } from '../../ts/filters';
import { updateCartBadge, showToast, el } from '../ui';

const form = document.getElementById('filters');
const grid = document.getElementById('products');
const info = document.getElementById('results-info');

function fillCategories() {
  const select = form.elements.category;
  Object.entries(categories).forEach(([value, label]) => {
    const option = el('option', '', label);
    option.value = value;
    select.append(option);
  });
}

function createCard({ id, image, category, title, description, price, rating }) {
  const card = el('article', 'card');
  const body = el('div', 'card__body');
  const footer = el('div', 'card__footer');
  const priceBox = el('div');

  priceBox.append(
    el('div', 'card__price', formatPrice(price)),
    el('div', 'card__rating', `★ ${rating.toFixed(1)}`),
  );

  const button = el('button', 'btn btn--primary', 'У кошик');
  button.type = 'button';
  button.dataset.add = id;

  footer.append(priceBox, button);
  body.append(
    el('span', 'card__category', categories[category]),
    el('h3', 'card__title', title),
    el('p', 'card__desc', description),
    footer,
  );
  card.append(el('div', 'card__image', image), body);
  return card;
}

function render() {
  const list = filterProducts(readFilters(form));

  if (list.length) {
    grid.replaceChildren(...list.map(createCard));
  } else {
    const empty = el('div', 'empty');
    empty.append(el('p', '', 'Нічого не знайдено. Спробуйте змінити фільтри.'));
    grid.replaceChildren(empty);
  }

  info.textContent = `Знайдено товарів: ${list.length} з ${products.length}`;
}

grid.addEventListener('click', (event) => {
  const button = event.target.closest('[data-add]');
  if (!button) return;

  const product = products.find(({ id }) => id === Number(button.dataset.add));
  if (!product) return;

  addToCart(product.id);
  updateCartBadge();
  showToast(`«${product.title}» додано в кошик`);
});

form.addEventListener('input', debounce(render, 250));
form.addEventListener('change', render);
form.addEventListener('reset', () => setTimeout(render));
form.addEventListener('submit', (event) => event.preventDefault());
window.addEventListener('storage', updateCartBadge);

fillCategories();
render();
updateCartBadge();
