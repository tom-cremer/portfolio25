// Formes de la bannière LinkedIn qui tombent dans la section contact : on peut les attraper, les lancer
// et les pousser avec la souris. Matter.js n'est chargé que lorsque la section approche du viewport.
// Markup : <div data-shapes> en position absolue dans la section qui reçoit les événements pointeur.

import type MatterNS from 'matter-js';
import {
    mulberry32, pickShapes, POLYGON_SIDES, restingLayout, shapeCount, shapeRadius,
    type ShapeSpec,
} from './shapes-layout';

type Matter = typeof MatterNS;

const SVG_NS = 'http://www.w3.org/2000/svg';
const SEED = 1755;
const STEP = 1000 / 60;
const WALL = 200;
const SPAWN_INTERVAL = 70;
const PUSH_FORCE = 0.00006;
const INTERACTIVE = 'a, button, input, textarea, select, label';

interface Shape {
    spec: ShapeSpec;
    radius: number;
    element: SVGSVGElement;
    half: number;
}

interface LiveShape extends Shape {
    body: MatterNS.Body;
}

// ---------- Rendu SVG ----------

function strokeWidth(radius: number) {
    return radius * 0.45;
}

function createElement(spec: ShapeSpec, radius: number): Shape {
    const svg = document.createElementNS(SVG_NS, 'svg');
    const half = Math.ceil(radius + 2);
    const size = half * 2;
    svg.setAttribute('viewBox', `${-half} ${-half} ${size} ${size}`);
    svg.setAttribute('width', String(size));
    svg.setAttribute('height', String(size));
    svg.classList.add('contact__shapes__item');

    const sw = strokeWidth(radius);
    const sides = POLYGON_SIDES[spec.kind];
    let shape: SVGElement;

    if (sides) {
        // Mêmes angles que Bodies.polygon pour que le dessin colle au corps physique
        const inner = radius - sw / 2;
        const theta = (Math.PI * 2) / sides;
        const points = Array.from({length: sides}, (_, i) => {
            const angle = theta / 2 + i * theta;
            return `${(inner * Math.cos(angle)).toFixed(2)},${(inner * Math.sin(angle)).toFixed(2)}`;
        });
        shape = document.createElementNS(SVG_NS, 'polygon');
        shape.setAttribute('points', points.join(' '));
        shape.setAttribute('fill', 'none');
        shape.setAttribute('stroke', spec.color);
        shape.setAttribute('stroke-width', String(sw));
        shape.setAttribute('stroke-linejoin', 'round');
    } else if (spec.kind === 'cross') {
        const arm = (radius - sw / 2) * Math.SQRT1_2;
        shape = document.createElementNS(SVG_NS, 'path');
        shape.setAttribute('d', `M${-arm} ${-arm}L${arm} ${arm}M${arm} ${-arm}L${-arm} ${arm}`);
        shape.setAttribute('stroke', spec.color);
        shape.setAttribute('stroke-width', String(sw));
        shape.setAttribute('stroke-linecap', 'round');
    } else {
        shape = document.createElementNS(SVG_NS, 'circle');
        if (spec.kind === 'dot') {
            shape.setAttribute('r', String(radius));
            shape.setAttribute('fill', spec.color);
        } else {
            shape.setAttribute('r', String(radius - sw / 2));
            shape.setAttribute('fill', 'none');
            shape.setAttribute('stroke', spec.color);
            shape.setAttribute('stroke-width', String(sw));
        }
    }

    svg.append(shape);
    return {spec, radius, element: svg, half};
}

function place(shape: Shape, x: number, y: number, angle: number) {
    shape.element.style.transform = `translate3d(${x - shape.half}px, ${y - shape.half}px, 0) rotate(${angle}rad)`;
}

function buildShapes(container: HTMLElement): Shape[] {
    const width = container.clientWidth;
    const radius = shapeRadius(width);
    const shapes = pickShapes(shapeCount(width), mulberry32(SEED)).map((spec) =>
        createElement(spec, spec.kind === 'dot' ? Math.round(radius * 0.32) : radius));
    container.replaceChildren(...shapes.map((shape) => shape.element));
    return shapes;
}

// ---------- Version statique (prefers-reduced-motion) ----------

function renderStatic(container: HTMLElement) {
    const shapes = buildShapes(container);
    const radius = shapeRadius(container.clientWidth);
    const placements = restingLayout(shapes.length, radius, container.clientWidth, container.clientHeight, mulberry32(SEED + 1));
    shapes.forEach((shape, index) => {
        const placement = placements[index];
        if (!placement) return shape.element.remove();
        // Les petits points reposent eux aussi au sol
        place(shape, placement.x, placement.y + radius - shape.radius, placement.angle);
    });
}

// ---------- Version physique ----------

function createBody(M: Matter, shape: Shape, x: number, y: number): MatterNS.Body {
    const options = {restitution: 0.35, friction: 0.3, frictionAir: 0.012, density: 0.002};
    const sides = POLYGON_SIDES[shape.spec.kind];
    const sw = strokeWidth(shape.radius);

    if (sides) {
        return M.Bodies.polygon(x, y, sides, shape.radius, {...options, chamfer: {radius: sw / 2}});
    }
    if (shape.spec.kind === 'cross') {
        const length = shape.radius * 2;
        const parts = [Math.PI / 4, -Math.PI / 4].map((angle) =>
            M.Bodies.rectangle(x, y, length, sw, {...options, angle, chamfer: {radius: sw / 2}}));
        return M.Body.create({...options, parts});
    }
    return M.Bodies.circle(x, y, shape.radius, options);
}

function startPhysics(M: Matter, section: HTMLElement, container: HTMLElement) {
    const engine = M.Engine.create({gravity: {x: 0, y: 1, scale: 0.0012}});
    const world = engine.world;
    const shapes = buildShapes(container);
    const live: LiveShape[] = [];
    let width = container.clientWidth;
    let height = container.clientHeight;
    let walls: MatterNS.Body[] = [];

    // Sol + murs hauts (pas de plafond : les formes lancées vers le haut retombent)
    function buildWalls() {
        M.Composite.remove(world, walls);
        const options = {isStatic: true, friction: 0.5};
        walls = [
            M.Bodies.rectangle(width / 2, height + WALL / 2, width + WALL * 2, WALL, options),
            M.Bodies.rectangle(-WALL / 2, height / 2 - height * 2, WALL, height * 6, options),
            M.Bodies.rectangle(width + WALL / 2, height / 2 - height * 2, WALL, height * 6, options),
        ];
        M.Composite.add(world, walls);
    }
    buildWalls();

    // Apparition échelonnée au-dessus de la section
    const rand = mulberry32(SEED + 2);
    shapes.forEach((shape, index) => {
        setTimeout(() => {
            const x = shape.radius + rand() * (width - shape.radius * 2);
            const body = createBody(M, shape, x, -shape.radius - rand() * 120);
            M.Body.setAngle(body, rand() * Math.PI * 2);
            M.Body.setAngularVelocity(body, (rand() - 0.5) * 0.1);
            live.push({...shape, body});
            M.Composite.add(world, body);
        }, index * SPAWN_INTERVAL);
    });

    // Boucle à pas fixe, en pause hors écran
    let frame = 0;
    let last = 0;
    let lag = 0;
    let running = false;

    function tick(now: number) {
        lag += Math.min(now - last, 100);
        last = now;
        while (lag >= STEP) {
            M.Engine.update(engine, STEP);
            lag -= STEP;
        }
        live.forEach((shape) => {
            const {position, angle} = shape.body;
            // Filet de sécurité si une forme traverse le sol ou sort par les côtés
            if (position.y > height + WALL || position.x < -WALL || position.x > width + WALL) {
                M.Body.setPosition(shape.body, {x: width / 2, y: -shape.radius});
                M.Body.setVelocity(shape.body, {x: 0, y: 0});
            }
            place(shape, position.x, position.y, angle);
        });
        frame = requestAnimationFrame(tick);
    }

    function setRunning(value: boolean) {
        if (value === running) return;
        running = value;
        if (running) {
            last = performance.now();
            frame = requestAnimationFrame(tick);
        } else {
            cancelAnimationFrame(frame);
        }
    }

    let visible = true;
    new IntersectionObserver(([entry]) => {
        visible = entry.isIntersecting;
        setRunning(visible && !document.hidden);
    }).observe(section);
    document.addEventListener('visibilitychange', () => setRunning(visible && !document.hidden));
    setRunning(true);

    new ResizeObserver(() => {
        if (container.clientWidth === width && container.clientHeight === height) return;
        width = container.clientWidth;
        height = container.clientHeight;
        buildWalls();
        live.forEach((shape) => {
            const {x, y} = shape.body.position;
            const clamped = Math.min(Math.max(x, shape.radius), width - shape.radius);
            if (clamped !== x) M.Body.setPosition(shape.body, {x: clamped, y});
        });
    }).observe(container);

    bindPointer(M, section, container, engine, live);
}

// ---------- Souris / tactile ----------

function bindPointer(M: Matter, section: HTMLElement, container: HTMLElement, engine: MatterNS.Engine, live: LiveShape[]) {
    let drag: MatterNS.Constraint | undefined;
    let previous: {x: number; y: number; time: number} | undefined;
    let tap: {x: number; y: number; time: number} | undefined;

    const toLocal = (event: PointerEvent) => {
        const rect = container.getBoundingClientRect();
        return {x: event.clientX - rect.left, y: event.clientY - rect.top};
    };
    const bodies = () => live.map((shape) => shape.body);
    const hit = (point: {x: number; y: number}) => M.Query.point(bodies(), point)[0];
    // Pour un corps composé (croix), Query.point renvoie une partie : on remonte au parent
    const root = (body: MatterNS.Body) => body.parent ?? body;
    const onInteractive = (event: PointerEvent) => (event.target as Element).closest(INTERACTIVE) !== null;

    section.addEventListener('pointerdown', (event) => {
        const point = toLocal(event);
        if (event.pointerType === 'touch') {
            tap = {...point, time: event.timeStamp};
            return;
        }
        if (event.button !== 0 || onInteractive(event)) return;
        const part = hit(point);
        if (!part) return;
        const body = root(part);
        event.preventDefault();
        section.setPointerCapture(event.pointerId);
        section.classList.add('is-grabbing');
        drag = M.Constraint.create({
            pointA: point,
            bodyB: body,
            // Point saisi relatif au centre : Matter le fait ensuite tourner avec le corps
            pointB: M.Vector.sub(point, body.position),
            stiffness: 0.2,
            damping: 0.1,
            length: 0,
        });
        M.Composite.add(engine.world, drag);
    });

    section.addEventListener('pointermove', (event) => {
        if (event.pointerType === 'touch') return;
        const point = toLocal(event);
        if (drag) {
            drag.pointA = point;
            return;
        }
        section.classList.toggle('is-grabbable', !onInteractive(event) && hit(point) !== undefined);

        // Poussée proportionnelle à la vitesse du curseur
        if (previous) {
            const dt = Math.max(event.timeStamp - previous.time, 1);
            const velocity = {x: (point.x - previous.x) / dt * STEP, y: (point.y - previous.y) / dt * STEP};
            const speed = Math.min(M.Vector.magnitude(velocity), 40);
            if (speed > 1) {
                const direction = M.Vector.normalise(velocity);
                live.forEach(({body, radius}) => {
                    if (M.Vector.magnitude(M.Vector.sub(body.position, point)) > radius * 2.5) return;
                    M.Sleeping.set(body, false);
                    M.Body.applyForce(body, point, M.Vector.mult(direction, PUSH_FORCE * speed * body.mass));
                });
            }
        }
        previous = {...point, time: event.timeStamp};
    });

    const release = () => {
        if (!drag) return;
        M.Composite.remove(engine.world, drag);
        drag = undefined;
        section.classList.remove('is-grabbing');
    };
    section.addEventListener('pointerup', (event) => {
        release();
        // Tactile : un tap fait sauter les formes proches (le scroll reste libre)
        if (event.pointerType !== 'touch' || !tap || onInteractive(event)) return;
        const point = toLocal(event);
        const moved = M.Vector.magnitude(M.Vector.sub(point, tap));
        if (moved < 10 && event.timeStamp - tap.time < 300) {
            live.forEach(({body, radius}) => {
                const offset = M.Vector.sub(body.position, point);
                if (M.Vector.magnitude(offset) > radius * 4) return;
                M.Body.setVelocity(body, {x: Math.sign(offset.x || 1) * 3 + (Math.random() - 0.5) * 4, y: -10 - Math.random() * 6});
                M.Body.setAngularVelocity(body, (Math.random() - 0.5) * 0.4);
            });
        }
        tap = undefined;
    });
    section.addEventListener('pointercancel', () => {
        release();
        tap = undefined;
    });
    section.addEventListener('pointerleave', () => {
        previous = undefined;
        section.classList.remove('is-grabbable');
    });
}

// ---------- Point d'entrée ----------

export function initShapesPhysics(root: ParentNode = document) {
    root.querySelectorAll<HTMLElement>('[data-shapes]:not([data-shapes-bound])').forEach((container) => {
        container.dataset.shapesBound = '';
        const section = (container.closest('section') ?? container.parentElement) as HTMLElement;

        if (matchMedia('(prefers-reduced-motion: reduce)').matches || !('IntersectionObserver' in window)) {
            renderStatic(container);
            return;
        }

        // Chargement de Matter.js et chute des formes quand la section devient visible
        const observer = new IntersectionObserver(async ([entry]) => {
            if (!entry.isIntersecting) return;
            observer.disconnect();
            try {
                const {default: M} = await import('matter-js');
                startPhysics(M, section, container);
            } catch {
                renderStatic(container);
            }
        }, {threshold: 0.25});
        observer.observe(section);
    });
}
