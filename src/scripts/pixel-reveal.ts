// Révélation d'image en mosaïque de pixels (Canvas 2D), inspirée de libraries.dev/image.
// Opt-in : <img data-pixel-reveal>, ou data-pixel-reveal="sweep" pour un balayage ordonné.
// data-pixel-duration="1400" surcharge la durée, data-pixel-delay="300" retarde le départ (ms).
//
// Phase 1 : les gros pixels apparaissent case par case.
// Phase 2 : chaque case passe en fondu par les petits pixels, scintille, puis devient nette.

type Origin = 'center' | 'random' | 'sweep';

const CONFIG = {
  duration: 1200, // ms, animation complète
  easing: 'linear' as keyof typeof EASINGS, // courbe appliquée au temps global
  trigger: {
    threshold: 0.2, // part visible de l'image avant de lancer
    rootMargin: '0px', // marge du viewport (ex. '0px 0px -10% 0px')
  },
  big: {
    share: 3 / 8, // part de la durée totale ; la phase 2 prend le reste
    pixel: 24, // taille des blocs (px)
    spread: 0.75, // part de la phase où les cases apparaissent ; le reste = mosaïque complète
    origin: 'random' as Origin, // point de départ de l'apparition
    noise: 0.55, // 0 = front net depuis l'origine, 1 = ordre totalement aléatoire
    flicker: 0.12, // intensité du scintillement (0 = aucun)
  },
  small: {
    pixels: [20], // tailles des petits pixels (px), du plus gros au plus fin ; puis net
    cell: 20, // taille des zones qui se résolvent indépendamment (px)
    spread: 0.7, // part de la phase où les zones démarrent
    origin: 'center' as Origin,
    noise: 0.5,
    blend: true, // fondu entre paliers ; false = changements secs
    flicker: 0.1, // scintillement des zones encore floues, s'éteint quand elles deviennent nettes
    flickerFadeIn: 0.25, // part de la phase pour monter en intensité
  },
  flickerSpeed: 90, // plus petit = plus rapide
  fadeOut: 250, // ms, fondu final du canvas vers la vraie <img>
};

const EASINGS = {
  linear: (t: number) => t,
  easeIn: (t: number) => t * t,
  easeOut: (t: number) => 1 - (1 - t) ** 2,
  easeInOut: (t: number) => (t < 0.5 ? 2 * t * t : 1 - (-2 * t + 2) ** 2 / 2),
};

interface Cell {
  x: number;
  y: number;
  start: number; // 0..1 dans sa phase
  phase: number; // décalage du scintillement
}

const clamp01 = (value: number) => Math.min(1, Math.max(0, value));

// Reproduit object-fit (cover / contain / fill), cadrage centré
function fitRect(img: HTMLImageElement, width: number, height: number) {
  const fit = getComputedStyle(img).objectFit;
  const ratio = img.naturalWidth / img.naturalHeight;
  if (fit !== 'cover' && fit !== 'contain') return {x: 0, y: 0, w: width, h: height};
  const fillWidth = (fit === 'cover') === (ratio < width / height);
  const w = fillWidth ? width : height * ratio;
  const h = fillWidth ? width / ratio : height;
  return {x: (width - w) / 2, y: (height - h) / 2, w, h};
}

function loaded(img: HTMLImageElement) {
  if (img.complete && img.naturalWidth) return img.decode().catch(() => undefined);
  return new Promise<void>((resolve, reject) => {
    img.addEventListener('load', () => resolve(), {once: true});
    img.addEventListener('error', () => reject(), {once: true});
  });
}

// Grille de cases, chacune avec son moment de départ selon l'origine et le bruit
function makeCells(width: number, height: number, size: number, origin: Origin, noise: number): Cell[] {
  const cols = Math.ceil(width / size);
  const rows = Math.ceil(height / size);
  const originX = origin === 'center' ? cols / 2 : Math.random() * cols;
  const originY = origin === 'center' ? rows / 2 : Math.random() * rows;
  const maxDistance = Math.hypot(Math.max(originX, cols - originX), Math.max(originY, rows - originY)) || 1;
  const cells: Cell[] = [];
  for (let row = 0; row < rows; row++) {
    for (let col = 0; col < cols; col++) {
      const order = origin === 'sweep'
        ? (row * cols + col) / (rows * cols)
        : Math.hypot(col + 0.5 - originX, row + 0.5 - originY) / maxDistance;
      const start = (1 - noise) * order + noise * Math.random();
      cells.push({x: col * size, y: row * size, start, phase: Math.random() * Math.PI * 2});
    }
  }
  return cells;
}

class PixelReveal {
  private canvas = document.createElement('canvas');
  private ctx = this.canvas.getContext('2d')!;
  // Calques pleine taille : gros pixels, chaque palier de petits pixels, puis net
  private big?: HTMLCanvasElement;
  private small: HTMLCanvasElement[] = [];
  private sharp?: HTMLCanvasElement;
  private bigCells: Cell[] = [];
  private smallCells: Cell[] = [];
  private bigSize = 0;
  private smallSize = 0;
  private startTime = 0;
  private frame = 0;
  private resizeObserver = new ResizeObserver(() => this.setup());

  private triggeredAt = performance.now();

  constructor(private img: HTMLImageElement, private sweep: boolean, private duration: number, private delay = 0) {}

  async run() {
    try {
      await loaded(this.img);
    } catch {
      return this.finish(); // image cassée
    }
    const wait = this.delay - (performance.now() - this.triggeredAt);
    if (wait > 0) await new Promise((resolve) => setTimeout(resolve, wait));
    this.canvas.className = 'pixel-reveal__canvas';
    this.canvas.setAttribute('aria-hidden', 'true');
    this.canvas.style.transition = `opacity ${CONFIG.fadeOut}ms ease-out`;
    const parent = this.img.parentElement!;
    if (getComputedStyle(parent).position === 'static') parent.style.position = 'relative';
    this.img.after(this.canvas);
    this.setup();
    this.resizeObserver.observe(this.img);
    this.startTime = performance.now();
    this.frame = requestAnimationFrame(this.tick);
  }

  // Appelé aussi au resize
  private setup() {
    const {img, canvas} = this;
    const dpr = window.devicePixelRatio || 1;
    const width = Math.max(1, Math.round(img.offsetWidth * dpr));
    const height = Math.max(1, Math.round(img.offsetHeight * dpr));
    if (width === canvas.width && height === canvas.height && this.sharp) return;

    Object.assign(canvas.style, {
      left: `${img.offsetLeft}px`,
      top: `${img.offsetTop}px`,
      width: `${img.offsetWidth}px`,
      height: `${img.offsetHeight}px`,
      borderRadius: getComputedStyle(img).borderRadius,
    });
    canvas.width = width;
    canvas.height = height;

    // Réduit l'image (1 pixel = 1 bloc) puis l'agrandit sans lissage à la taille du canvas
    const pixelate = (px: number) => {
      const size = Math.max(1, Math.round(px * dpr));
      const tiny = document.createElement('canvas');
      tiny.width = Math.ceil(width / size);
      tiny.height = Math.ceil(height / size);
      const tinyCtx = tiny.getContext('2d')!;
      tinyCtx.imageSmoothingQuality = 'high';
      const rect = fitRect(img, width / size, height / size);
      tinyCtx.drawImage(img, rect.x, rect.y, rect.w, rect.h);
      if (size === 1) return tiny;

      const layer = document.createElement('canvas');
      layer.width = width;
      layer.height = height;
      const layerCtx = layer.getContext('2d')!;
      layerCtx.imageSmoothingEnabled = false;
      layerCtx.drawImage(tiny, 0, 0, tiny.width * size, tiny.height * size);
      return layer;
    };

    const {big, small} = CONFIG;
    const bigOrigin = this.sweep ? 'sweep' : big.origin;
    const smallOrigin = this.sweep ? 'sweep' : small.origin;
    this.big = pixelate(big.pixel);
    this.small = small.pixels.map(pixelate);
    this.sharp = pixelate(0);
    this.bigSize = Math.max(1, Math.round(big.pixel * dpr));
    this.smallSize = Math.max(1, Math.round(small.cell * dpr));
    this.bigCells = makeCells(width, height, this.bigSize, bigOrigin, big.noise);
    this.smallCells = makeCells(width, height, this.smallSize, smallOrigin, small.noise);
  }

  private tick = (now: number) => {
    const linear = Math.min(1, (now - this.startTime) / this.duration);
    this.draw(EASINGS[CONFIG.easing](linear), now);
    if (linear < 1) {
      this.frame = requestAnimationFrame(this.tick);
    } else {
      this.finish();
    }
  };

  private drawCell(layer: HTMLCanvasElement, c: Cell, size: number) {
    this.ctx.drawImage(layer, c.x, c.y, size, size, c.x, c.y, size, size);
  }

  private drawFlicker(c: Cell, size: number, now: number, amount: number) {
    const value = Math.sin(c.phase + now / CONFIG.flickerSpeed) * amount;
    if (!value) return;
    this.ctx.fillStyle = value > 0 ? `rgba(255,255,255,${value})` : `rgba(0,0,0,${-value})`;
    this.ctx.fillRect(c.x, c.y, size, size);
  }

  private draw(t: number, now: number) {
    const {ctx, canvas, big, small, bigSize, smallSize} = this;
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    if (t < CONFIG.big.share) {
      const progress = t / CONFIG.big.share;
      for (const c of this.bigCells) {
        if (progress < c.start * CONFIG.big.spread) continue;
        this.drawCell(big!, c, bigSize);
        this.drawFlicker(c, bigSize, now, CONFIG.big.flicker * (1 - progress));
      }
      return;
    }

    // Phase 2 : sous les zones pas encore démarrées, la mosaïque de gros pixels reste visible
    ctx.drawImage(big!, 0, 0);
    const {spread, blend, flicker, flickerFadeIn} = CONFIG.small;
    const progress = (t - CONFIG.big.share) / (1 - CONFIG.big.share);
    const layers = [big!, ...small, this.sharp!];
    const last = layers.length - 1;
    const flickerRamp = flickerFadeIn > 0 ? clamp01(progress / flickerFadeIn) : 1;
    for (const c of this.smallCells) {
      const local = clamp01((progress - c.start * spread) / (1 - spread));
      if (local > 0) {
        const position = local * last;
        const step = Math.min(last, Math.floor(position));
        this.drawCell(layers[step], c, smallSize);
        if (blend && step < last) {
          ctx.globalAlpha = position - step;
          this.drawCell(layers[step + 1], c, smallSize);
          ctx.globalAlpha = 1;
        }
      }
      this.drawFlicker(c, smallSize, now, flicker * flickerRamp * (1 - local));
    }
  }

  private finish() {
    cancelAnimationFrame(this.frame);
    this.resizeObserver.disconnect();
    this.img.classList.add('is-pixel-revealed');
    if (!this.canvas.isConnected) return;
    this.canvas.classList.add('is-done');
    setTimeout(() => this.canvas.remove(), CONFIG.fadeOut);
  }
}

let observer: IntersectionObserver | undefined;

export function initPixelReveal(root: ParentNode = document) {
  const images = [...root.querySelectorAll<HTMLImageElement>('img[data-pixel-reveal]:not([data-pixel-bound])')];
  const reduceMotion = matchMedia('(prefers-reduced-motion: reduce)').matches;

  images.forEach((img) => {
    img.dataset.pixelBound = '';
    if (reduceMotion || !('IntersectionObserver' in window)) {
      img.classList.add('is-pixel-revealed');
      return;
    }
    observer ??= new IntersectionObserver((entries) => {
      entries.filter((entry) => entry.isIntersecting).forEach((entry) => {
        const target = entry.target as HTMLImageElement;
        observer?.unobserve(target);
        const sweep = target.dataset.pixelReveal === 'sweep';
        const duration = Number(target.dataset.pixelDuration) || CONFIG.duration;
        const delay = Number(target.dataset.pixelDelay) || 0;
        new PixelReveal(target, sweep, duration, delay).run();
      });
    }, CONFIG.trigger);
    observer.observe(img);
  });
}
