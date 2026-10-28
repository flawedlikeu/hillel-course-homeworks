function createProductCard(product) {
  const { title, category, price, discount, inStock, rating, image, tags } = product;

  const li = document.createElement('li');
  li.className = 'product-card';
  if (!inStock) li.classList.add('product-card--out-of-stock');
  const img = document.createElement('img');
  img.className = 'product-card__image';
  img.src = image || 'https://via.placeholder.com/300x200?text=No+Image';
  img.alt = title;
  li.appendChild(img);

  const titleEl = document.createElement('h3');
  titleEl.className = 'product-card__title';
  titleEl.textContent = title;
  li.appendChild(titleEl);

  const categoryEl = document.createElement('span');
  categoryEl.className = 'product-card__category';
  categoryEl.textContent = category;
  li.appendChild(categoryEl);

  const priceEl = document.createElement('div');
  priceEl.className = 'product-card__price';
  if (discount) {
    const finalPrice = Math.round(price * (1 - discount / 100));
    priceEl.innerHTML = `
      <span class="product-card__price-old">${price} ₴</span>
      <span class="product-card__price-final">${finalPrice} ₴</span>
      <span class="product-card__discount">-${discount}%</span>
    `;
  } else {
    priceEl.textContent = `${price} ₴`;
  }
  li.appendChild(priceEl);
  
  const ratingEl = document.createElement('div');
  ratingEl.className = 'product-card__rating';
  ratingEl.textContent = `★ ${rating.toFixed(1)}`;
  li.appendChild(ratingEl);

  if (tags && tags.length > 0) {
    const tagsEl = document.createElement('ul');
    tagsEl.className = 'product-card__tags';
    tags.forEach(tag => {
      const tagItem = document.createElement('li');
      tagItem.className = 'product-card__tag';
      tagItem.textContent = tag;
      tagsEl.appendChild(tagItem);
    });
    li.appendChild(tagsEl);
  }

  const stockEl = document.createElement('span');
  stockEl.className = 'product-card__stock';
  stockEl.textContent = inStock ? 'В наявності' : 'Немає в наявності';
  li.appendChild(stockEl);

  return li;
}

function renderCatalog(items) {
  const catalog = document.getElementById('catalog');
  catalog.innerHTML = '';
  items.forEach(product => {
    catalog.appendChild(createProductCard(product));
  });
}

renderCatalog(products);
