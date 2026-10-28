const form = document.querySelector('.todo-form');
const input = document.querySelector('.todo-input');
const list = document.querySelector('.todo-list');
const counter = document.querySelector('.todo-counter');

function updateCounter() {
  const total = list.querySelectorAll('li').length;
  const done = list.querySelectorAll('[data-done="true"]').length;
  counter.textContent = `Виконано: ${done} / ${total}`;
}

form.addEventListener('submit', (event) => {
  event.preventDefault();

  const text = input.value.trim();
  if (!text) return;

  const li = document.createElement('li');
  li.textContent = text;
  li.dataset.done = 'false';

  const removeBtn = document.createElement('button');
  removeBtn.type = 'button';
  removeBtn.textContent = '✕';
  li.append(removeBtn);

  list.append(li);
  input.value = '';
  input.focus();
  updateCounter();
});

list.addEventListener('click', (event) => {
  const removeBtn = event.target.closest('button');
  if (removeBtn) {
    removeBtn.closest('li').remove();
    updateCounter();
    return;
  }

  const li = event.target.closest('li');
  if (!li) return;

  li.dataset.done = li.dataset.done === 'true' ? 'false' : 'true';
  updateCounter();
});
