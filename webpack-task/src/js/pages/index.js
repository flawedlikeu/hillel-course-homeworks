// Іменовані імпорти з lodash-es: завдяки tree-shaking у збірку
// потрапляють лише debounce та orderBy, а не вся бібліотека (~70 КБ)
import { debounce, orderBy } from 'lodash-es';
import { products, categories } from '../modules/mock-data';
import { addToCart } from '../modules/cart-store';
import { formatPrice, updateCartBadge, showToast, el } from '../modules/ui';

const form = document.getElementById('filters');
const grid = document.getElementById('products');
const info = document.getElementById('results-info');

const SORTS = {
  'price-asc': [['price'], ['asc']],
  'price-desc': [['price'], ['desc']],
  'title-asc': [[(p) => p.title.toLowerCase()], ['asc']],
  'rating-desc': [['rating'], ['desc']],
};

function fillCategories() {
  const select = form.elements.category;
  Object.entries(categories).forEach(([value, label]) => {
    const option = el('option', '', label);
    option.value = value;
    select.append(option);
  });
}

function getFilters() {
  const data = new FormData(form);
  const toNumber = (v) => (v === '' || v === null ? null : Number(v));
  return {
    search: data.get('search').trim().toLowerCase(),
    category: data.get('category'),
    minPrice: toNumber(data.get('minPrice')),
    maxPrice: toNumber(data.get('maxPrice')),
    sort: data.get('sort'),
  };
}

function filterProducts({ search, category, minPrice, maxPrice, sort }) {
  const filtered = products.filter((p) =>
    (!search || p.title.toLowerCase().includes(search))
    && (category === 'all' || p.category === category)
    && (minPrice === null || p.price >= minPrice)
    && (maxPrice === null || p.price <= maxPrice));

  return SORTS[sort] ? orderBy(filtered, ...SORTS[sort]) : filtered;
}

function createCard(product) {
  const card = el('article', 'card');
  card.append(el('div', 'card__image', product.image));

  const body = el('div', 'card__body');
  body.append(
    el('span', 'card__category', categories[product.category]),
    el('h3', 'card__title', product.title),
    el('p', 'card__desc', product.description),
  );

  const footer = el('div', 'card__footer');
  const priceBox = el('div');
  priceBox.append(
    el('div', 'card__price', formatPrice(product.price)),
    el('div', 'card__rating', `★ ${product.rating.toFixed(1)}`),
  );

  const button = el('button', 'btn btn--primary', 'У кошик');
  button.type = 'button';
  button.dataset.add = product.id;

  footer.append(priceBox, button);
  body.append(footer);
  card.append(body);
  return card;
}

function render() {
  const list = filterProducts(getFilters());
  grid.replaceChildren();

  if (!list.length) {
    const empty = el('div', 'empty');
    empty.append(el('p', '', 'Нічого не знайдено. Спробуйте змінити фільтри.'));
    grid.append(empty);
  } else {
    const fragment = document.createDocumentFragment();
    list.forEach((p) => fragment.append(createCard(p)));
    grid.append(fragment);
  }

  info.textContent = `Знайдено товарів: ${list.length} з ${products.length}`;
}

grid.addEventListener('click', (event) => {
  const button = event.target.closest('[data-add]');
  if (!button) return;
  const product = products.find((p) => p.id === Number(button.dataset.add));
  if (!product) return;
  addToCart(product.id);
  updateCartBadge();
  showToast(`«${product.title}» додано в кошик`);
});

// Пошук та ціни — з debounce, щоб не перемальовувати сітку на кожен символ
form.addEventListener('input', debounce(render, 250));
form.addEventListener('change', render);
form.addEventListener('reset', () => setTimeout(render));
form.addEventListener('submit', (e) => e.preventDefault());

// Синхронізація лічильника, якщо кошик змінили в іншій вкладці
window.addEventListener('storage', updateCartBadge);

fillCategories();
render();
updateCartBadge();
