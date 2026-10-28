const DELAY = 3000;

const initSlider = (root) => {
  const track = root.querySelector('.track');
  const viewport = root.querySelector('.viewport');
  const total = root.querySelectorAll('.slide').length;
  const pauseBtn = root.querySelector('.pause');
  const dotsBox = root.querySelector('.dots');

  const state = { index: 0, timer: null, paused: false };
  const dots = Array.from({ length: total }, (_, i) => {
    const dot = document.createElement('button');
    dot.className = 'dot';
    dot.addEventListener('click', () => { goTo(i); restart(); });
    dotsBox.append(dot);
    return dot;
  });

  const render = () => {
    track.style.transform = `translateX(-${state.index * 100}%)`;
    dots.forEach((d, i) => d.classList.toggle('active', i === state.index));
  };

  const goTo = (i) => { state.index = (i + total) % total; render(); };
  const next = () => goTo(state.index + 1);
  const prev = () => goTo(state.index - 1);
  const stop = () => clearInterval(state.timer);
  const start = () => { stop(); if (!state.paused) state.timer = setInterval(next, DELAY); };
  const restart = start;

  pauseBtn.addEventListener('click', () => {
    state.paused = !state.paused;
    pauseBtn.textContent = state.paused ? 'Грати' : 'Пауза';
    start();
  });

  root.querySelector('.next').addEventListener('click', () => { next(); restart(); });
  root.querySelector('.prev').addEventListener('click', () => { prev(); restart(); });
  document.addEventListener('keydown', (e) => {
    if (e.key === 'ArrowRight') { next(); restart(); }
    if (e.key === 'ArrowLeft') { prev(); restart(); }
  });

  let startX = 0, deltaX = 0, dragging = false;

  viewport.addEventListener('pointerdown', (e) => {
    dragging = true;
    startX = e.clientX;
    deltaX = 0;
    track.classList.add('dragging');
    viewport.setPointerCapture(e.pointerId);
    stop();
  });

  viewport.addEventListener('pointermove', (e) => {
    if (!dragging) return;
    deltaX = e.clientX - startX;
    track.style.transform = `translateX(${-state.index * viewport.offsetWidth + deltaX}px)`;
  });

  const endDrag = () => {
    if (!dragging) return;
    dragging = false;
    track.classList.remove('dragging');
    if (deltaX < -50) next();
    else if (deltaX > 50) prev();
    else render();
    start();
  };
  viewport.addEventListener('pointerup', endDrag);
  viewport.addEventListener('pointercancel', endDrag);

  render();
  start();
};

initSlider(document.getElementById('slider'));