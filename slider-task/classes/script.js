
class Slider {
  static defaults = {
    interval: 3000,
    autoplay: true,
    showArrows: true,
    showDots: true,
    showPauseButton: true,
    pauseOnHover: true,
    swipeThreshold: 50
  };

  constructor(root, options = {}) {
    this.root = root;
    this.config = { ...Slider.defaults, ...options };
    this.track = root.querySelector('.track');
    this.slides = [...root.querySelectorAll('.slide')];
    this.index = 0;
    this.timer = null;
    this.paused = !this.config.autoplay;
    this.dragging = false;

    this.createControls();
    this.bindHover();
    this.goTo(0);
    this.updatePauseBtn();
    if (!this.paused) this.startTimer();
  }

  createButton(className, text, label, handler) {
    const btn = document.createElement('button');
    btn.type = 'button';
    btn.className = className;
    btn.textContent = text;
    btn.setAttribute('aria-label', label);
    btn.addEventListener('click', handler);
    this.root.appendChild(btn);
    return btn;
  }

  createControls() {
    const c = this.config;
    if (c.showArrows) {
      this.createButton('btn prev', '\u276E', 'Попередній слайд', () => { this.prev(); this.restart(); });
      this.createButton('btn next', '\u276F', 'Наступний слайд', () => { this.next(); this.restart(); });
    }
    if (c.showPauseButton) {
      this.pauseBtn = this.createButton('pause', 'Пауза', 'Пауза', () => this.toggle());
    }
    if (c.showDots) {
      const wrap = document.createElement('div');
      wrap.className = 'dots';
      this.dots = this.slides.map((_, i) => {
        const dot = document.createElement('button');
        dot.type = 'button';
        dot.className = 'dot';
        dot.setAttribute('aria-label', `Слайд ${i + 1}`);
        dot.addEventListener('click', () => { this.goTo(i); this.restart(); });
        wrap.appendChild(dot);
        return dot;
      });
      this.root.appendChild(wrap);
    }
  }

  bindHover() {
    if (!this.config.pauseOnHover) return;
    this.root.addEventListener('mouseenter', () => this.clearTimer());
    this.root.addEventListener('mouseleave', () => this.restart());
  }

  goTo(i) {
    const n = this.slides.length;
    this.index = (i + n) % n;
    this.track.style.transform = `translateX(${-this.index * 100}%)`;
    this.dots?.forEach((d, k) => d.classList.toggle('active', k === this.index));
  }

  next() { this.goTo(this.index + 1); }
  prev() { this.goTo(this.index - 1); }

  startTimer() {
    this.clearTimer();
    this.timer = setInterval(() => { if (!this.dragging) this.next(); }, this.config.interval);
  }
  clearTimer() { clearInterval(this.timer); this.timer = null; }
  play() { this.paused = false; this.startTimer(); this.updatePauseBtn(); }
  pause() { this.paused = true; this.clearTimer(); this.updatePauseBtn(); }
  toggle() { this.paused ? this.play() : this.pause(); }
  restart() { if (!this.paused) this.startTimer(); }
  updatePauseBtn() {
    if (this.pauseBtn) this.pauseBtn.textContent = this.paused ? 'Грати' : 'Пауза';
  }
}

class DragSlider extends Slider {
  constructor(root, options) {
    super(root, options);
    this.startX = 0;
    this.dx = 0;
    this.initDrag();
  }

  initDrag() {
    const viewport = this.root.querySelector('.viewport');

    viewport.addEventListener('pointerdown', (e) => {
      this.dragging = true;
      this.startX = e.clientX;
      this.dx = 0;
      this.track.classList.add('dragging');
      viewport.setPointerCapture(e.pointerId);
    });

    viewport.addEventListener('pointermove', (e) => {
      if (!this.dragging) return;
      this.dx = e.clientX - this.startX;
      this.track.style.transform = `translateX(calc(${-this.index * 100}% + ${this.dx}px))`;
    });

    const end = () => {
      if (!this.dragging) return;
      this.dragging = false;
      this.track.classList.remove('dragging');
      const t = this.config.swipeThreshold;
      if (this.dx < -t) this.next();
      else if (this.dx > t) this.prev();
      else this.goTo(this.index);
      this.restart();
    };
    viewport.addEventListener('pointerup', end);
    viewport.addEventListener('pointercancel', end);
  }
}

document.querySelectorAll('.slider').forEach((el) => {
  new DragSlider(el, { interval: 3000, pauseOnHover: true });
});
