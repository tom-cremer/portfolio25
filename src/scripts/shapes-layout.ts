// Fonctions pures pour les formes de la section contact (sans Matter.js, testables avec node --test)

export type ShapeKind = 'triangle' | 'square' | 'pentagon' | 'hexagon' | 'ring' | 'cross' | 'dot';

export interface ShapeSpec {
    kind: ShapeKind;
    color: string;
}

export interface Placement {
    x: number;
    y: number;
    angle: number;
}

// Palette de la bannière LinkedIn
export const SHAPE_COLORS = {
    lilac: '#B4A7F5',
    teal: '#7FE0D8',
    yellow: '#F5D63D',
    pink: '#EE2F72',
    dark: '#2B2933',
} as const;

/*export const SHAPE_COLORS = {
    lilac: '#9363F6',
    teal: '#63adf6',
    yellow: '#E9A925',
    pink: '#F36441',
    dark: '#2B2933',
} as const;*/

export const POLYGON_SIDES: Partial<Record<ShapeKind, number>> = {triangle: 3, square: 4, pentagon: 5, hexagon: 6};

const KIND_WEIGHTS: [ShapeKind, number][] = [
    ['pentagon', 3], ['hexagon', 3], ['triangle', 3], ['square', 3], ['ring', 2], ['cross', 2], ['dot', 2],
];

const COLOR_WEIGHTS: [string, number][] = [
    [SHAPE_COLORS.lilac, 4], [SHAPE_COLORS.teal, 1], [SHAPE_COLORS.yellow, 4], [SHAPE_COLORS.dark, 1], [SHAPE_COLORS.pink, 2],
];

const clamp = (value: number, min: number, max: number) => Math.min(max, Math.max(min, value));

// Plus l'écran est large, plus il y a de formes
export function shapeCount(width: number): number {
    return clamp(Math.round(width / 2), 10, 100 );
}

// Rayon extérieur (trait compris) d'une forme, en px
export function shapeRadius(width: number): number {
    return Math.round(clamp(width / 50, 18, 32));
}

// Générateur pseudo-aléatoire seedé : mêmes formes à chaque visite
export function mulberry32(seed: number): () => number {
    let a = seed >>> 0;
    return () => {
        a = (a + 0x6D2B79F5) >>> 0;
        let t = a;
        t = Math.imul(t ^ (t >>> 15), t | 1);
        t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
        return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
    };
}

function weighted<T>(items: [T, number][], rand: () => number): T {
    const total = items.reduce((sum, [, weight]) => sum + weight, 0);
    let roll = rand() * total;
    for (const [item, weight] of items) {
        roll -= weight;
        if (roll < 0) return item;
    }
    return items[items.length - 1][0];
}

export function pickShapes(count: number, rand: () => number): ShapeSpec[] {
    return Array.from({length: count}, () => {
        const kind = weighted(KIND_WEIGHTS, rand);
        // Les points restent sombres ou turquoise, comme sur la bannière
        const color = kind === 'dot' ? (rand() < 0.6 ? SHAPE_COLORS.dark : SHAPE_COLORS.teal) : weighted(COLOR_WEIGHTS, rand);
        return {kind, color};
    });
}

// Formes posées au sol sans physique (prefers-reduced-motion) : une rangée sans chevauchement,
// quitte à en afficher moins que demandé
export function restingLayout(count: number, radius: number, width: number, height: number, rand: () => number): Placement[] {
    const fit = Math.max(0, Math.min(count, Math.floor(width / (radius * 2.2))));
    const slot = width / fit;
    const jitter = Math.max(0, slot / 2 - radius);
    return Array.from({length: fit}, (_, index) => ({
        x: slot * (index + 0.5) + (rand() * 2 - 1) * jitter,
        y: height - radius,
        angle: rand() * Math.PI * 2,
    }));
}
