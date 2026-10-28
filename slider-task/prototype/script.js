
function Slider(root, options) {
  this.root = root;
  this.config = Object.assign({}, Slider.defaults, options);
  this.track = root.querySelector('.track');
  this.slides = Array.from(root.querySelectorAll('.slide'));
  this.index = 0;
  this.timer = null;
  this.paused = !this.config.autoplay;

  this.createControls();
  this.goTo(0);
  this.updatePauseBtn();
  if (!this.paused) this.startTimer();
}

Slider.defaults = {
  interval: 3000,
  autoplay: true,
  showArrows: true,
  showDots: true,
  showPauseButton: true,
  swipeThreshold: 50
};

Slider.prototype.createButton = function (className, text, label, handler) {
  var btn = document.createElement('button');
  btn.type = 'button';
  btn.className = className;
  btn.textContent = text;
  btn.setAttribute('aria-label', label);
  btn.addEventListener('click', handler);
  this.root.appendChild(btn);
  return btn;
};

Slider.prototype.createControls = function () {
  var self = this;
  var c = this.config;

  if (c.showArrows) {
    this.createButton('btn prev', '\u276E', 'Попередній слайд', function () { self.prev(); self.restart(); });
    this.createButton('btn next', '\u276F', 'Наступний слайд', function () { self.next(); self.restart(); });
  }
  if (c.showPauseButton) {
    this.pauseBtn = this.createButton('pause', 'Пауза', 'Пауза', function () { self.toggle(); });
  }
  if (c.showDots) {
    var wrap = document.createElement('div');
    wrap.className = 'dots';
    this.dots = this.slides.map(function (_, i) {
      var dot = document.createElement('button');
      dot.type = 'button';
      dot.className = 'dot';
      dot.setAttribute('aria-label', 'Слайд ' + (i + 1));
      dot.addEventListener('click', function () { self.goTo(i); self.restart(); });
      wrap.appendChild(dot);
      return dot;
    });
    this.root.appendChild(wrap);
  }
};

Slider.prototype.goTo = function (i) {
  var n = this.slides.length;
  this.index = (i + n) % n;
  this.track.style.transform = 'translateX(' + (-this.index * 100) + '%)';
  if (this.dots) {
    this.dots.forEach(function (d, k) { d.classList.toggle('active', k === this.index); }, this);
  }
};

Slider.prototype.next = function () { this.goTo(this.index + 1); };
Slider.prototype.prev = function () { this.goTo(this.index - 1); };

Slider.prototype.startTimer = function () {
  var self = this;
  this.clearTimer();
  this.timer = setInterval(function () { if (!self.dragging) self.next(); }, this.config.interval);
};
Slider.prototype.clearTimer = function () { clearInterval(this.timer); this.timer = null; };
Slider.prototype.play = function () { this.paused = false; this.startTimer(); this.updatePauseBtn(); };
Slider.prototype.pause = function () { this.paused = true; this.clearTimer(); this.updatePauseBtn(); };
Slider.prototype.toggle = function () { this.paused ? this.play() : this.pause(); };
Slider.prototype.restart = function () { if (!this.paused) this.startTimer(); };
Slider.prototype.updatePauseBtn = function () {
  if (this.pauseBtn) this.pauseBtn.textContent = this.paused ? 'Грати' : 'Пауза';
};


function DragSlider(root, options) {
  Slider.call(this, root, options);
  this.dragging = false;
  this.startX = 0;
  this.dx = 0;
  this.initDrag();
}
DragSlider.prototype = Object.create(Slider.prototype);
DragSlider.prototype.constructor = DragSlider;

DragSlider.prototype.initDrag = function () {
  var self = this;
  var viewport = this.root.querySelector('.viewport');

  viewport.addEventListener('pointerdown', function (e) {
    self.dragging = true;
    self.startX = e.clientX;
    self.dx = 0;
    self.track.classList.add('dragging');
    viewport.setPointerCapture(e.pointerId);
  });

  viewport.addEventListener('pointermove', function (e) {
    if (!self.dragging) return;
    self.dx = e.clientX - self.startX;
    self.track.style.transform = 'translateX(calc(' + (-self.index * 100) + '% + ' + self.dx + 'px))';
  });

  function end() {
    if (!self.dragging) return;
    self.dragging = false;
    self.track.classList.remove('dragging');
    var t = self.config.swipeThreshold;
    if (self.dx < -t) self.next();
    else if (self.dx > t) self.prev();
    else self.goTo(self.index);
    self.restart();
  }
  viewport.addEventListener('pointerup', end);
  viewport.addEventListener('pointercancel', end);
};

document.querySelectorAll('.slider').forEach(function (el) {
  new DragSlider(el, { interval: 3000, showDots: true });
});
