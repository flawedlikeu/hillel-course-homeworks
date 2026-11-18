// LiveSearch серіалів через TVMaze API (не потребує ключа)
// Документація: https://www.tvmaze.com/api

const API_URL = 'https://api.tvmaze.com/search/shows?q=';
const MIN_QUERY_LENGTH = 2;
const DEBOUNCE_DELAY = 400;
const REQUEST_TIMEOUT = 8000;

const input = document.getElementById('search-input');
const resultsList = document.getElementById('results');
const statusEl = document.getElementById('status');
const spinner = document.getElementById('spinner');

let currentController = null;

// Затримка виклику, щоб не слати запит на кожен символ
function debounce(fn, delay) {
  let timerId;
  return (...args) => {
    clearTimeout(timerId);
    timerId = setTimeout(() => fn(...args), delay);
  };
}

function setStatus(text, isError = false) {
  statusEl.textContent = text;
  statusEl.classList.toggle('status--error', isError);
}

function setLoading(isLoading) {
  spinner.hidden = !isLoading;
}

async function fetchShows(query, signal) {
  const response = await fetch(API_URL + encodeURIComponent(query), { signal });

  if (!response.ok) {
    if (response.status === 429) {
      throw new Error('Забагато запитів. Зачекайте кілька секунд.');
    }
    throw new Error(`Помилка сервера: ${response.status}`);
  }

  const data = await response.json();

  if (!Array.isArray(data)) {
    throw new Error('Отримано неочікувану відповідь від API');
  }

  return data.map((item) => item.show);
}

function createCard(show) {
  const li = document.createElement('li');
  li.className = 'card';

  const link = document.createElement('a');
  link.className = 'card__link';
  link.href = show.url;
  link.target = '_blank';
  link.rel = 'noopener noreferrer';

  let poster;
  if (show.image?.medium) {
    poster = document.createElement('img');
    poster.src = show.image.medium;
    poster.alt = `Постер: ${show.name}`;
    poster.loading = 'lazy';
    poster.className = 'card__poster';
    // Якщо постер не завантажився — показуємо заглушку
    poster.addEventListener('error', () => {
      poster.replaceWith(createPosterPlaceholder());
    });
  } else {
    poster = createPosterPlaceholder();
  }

  const body = document.createElement('div');
  body.className = 'card__body';

  const title = document.createElement('h2');
  title.className = 'card__title';
  title.textContent = show.name;

  const year = show.premiered ? show.premiered.slice(0, 4) : '—';
  const meta = document.createElement('p');
  meta.className = 'card__meta';
  meta.textContent = `${year} · ${show.type || 'Невідомо'}`;

  const tags = document.createElement('div');
  tags.className = 'card__tags';

  if (show.rating?.average) {
    tags.append(createTag(`★ ${show.rating.average}`, 'tag--rating'));
  }
  (show.genres || []).slice(0, 2).forEach((genre) => tags.append(createTag(genre)));

  body.append(title, meta, tags);
  link.append(poster, body);
  li.append(link);
  return li;
}

function createPosterPlaceholder() {
  const div = document.createElement('div');
  div.className = 'card__poster card__poster--empty';
  div.textContent = 'Немає постера';
  return div;
}

function createTag(text, extraClass = '') {
  const span = document.createElement('span');
  span.className = `tag ${extraClass}`.trim();
  span.textContent = text;
  return span;
}

function renderResults(shows) {
  resultsList.innerHTML = '';
  const fragment = document.createDocumentFragment();
  shows.forEach((show) => fragment.append(createCard(show)));
  resultsList.append(fragment);
}

async function handleSearch(rawQuery) {
  const query = rawQuery.trim();

  // Скасовуємо попередній запит, щоб старі відповіді не перезаписали нові
  if (currentController) {
    currentController.abort();
  }

  if (query.length < MIN_QUERY_LENGTH) {
    renderResults([]);
    setLoading(false);
    setStatus(query.length === 0
      ? `Введіть щонайменше ${MIN_QUERY_LENGTH} символи`
      : 'Продовжуйте вводити…');
    return;
  }

  const controller = new AbortController();
  currentController = controller;
  const timeoutId = setTimeout(() => controller.abort('timeout'), REQUEST_TIMEOUT);

  setLoading(true);
  setStatus('Шукаємо…');

  try {
    const shows = await fetchShows(query, controller.signal);
    renderResults(shows);
    setStatus(shows.length
      ? `Знайдено: ${shows.length}`
      : `За запитом «${query}» нічого не знайдено`);
  } catch (error) {
    if (error.name === 'AbortError' || controller.signal.aborted) {
      // Запит скасовано новим введенням — це не помилка
      if (controller.signal.reason === 'timeout') {
        renderResults([]);
        setStatus('Сервер не відповідає. Спробуйте ще раз.', true);
      }
      return;
    }

    renderResults([]);
    if (!navigator.onLine) {
      setStatus('Немає підключення до інтернету', true);
    } else if (error instanceof TypeError) {
      setStatus('Не вдалося з\'єднатися з сервером', true);
    } else {
      setStatus(error.message, true);
    }
    console.error('Search error:', error);
  } finally {
    clearTimeout(timeoutId);
    if (currentController === controller) {
      setLoading(false);
      currentController = null;
    }
  }
}

input.addEventListener('input', debounce((event) => handleSearch(event.target.value), DEBOUNCE_DELAY));

window.addEventListener('offline', () => setStatus('Втрачено підключення до інтернету', true));
window.addEventListener('online', () => handleSearch(input.value));
