import {defaultLang, ui, type Dictionary, type Lang, type UIKey} from './ui.ts';

export function getLang(locale: string | undefined): Lang {
    return locale === 'en' ? 'en' : 'fr';
}

const warned = new Set<string>();

export function useTranslations(lang: Lang, dict: Dictionary = ui) {
    return function t(key: UIKey, vars: Record<string, string | number> = {}): string {
        const own = dict[lang][key];
        if (own === undefined && lang !== defaultLang && import.meta.env?.DEV && !warned.has(key)) {
            warned.add(key);
            console.warn(`[i18n] Missing "${lang}" translation for "${key}", using "${defaultLang}".`);
        }
        const template = own ?? dict[defaultLang][key];
        return template.replace(/\{(\w+)\}/g, (match, name) => (name in vars ? String(vars[name]) : match));
    };
}

// Chemins de chaque page par langue. Ajouter ici toute nouvelle page traduite.
export const routes = {
    home: {fr: '/', en: '/en/'},
    about: {fr: '/apropos', en: '/en/about'},
    projects: {fr: '/projets', en: '/en/projects'},
} as const;
export type RouteKey = keyof typeof routes;

// `slug` n'a de sens que pour les sections (projects).
export function localizePath(route: RouteKey, lang: Lang, slug?: string): string {
    const base = routes[route][lang];
    return slug ? `${base}/${slug}` : base;
}

function normalize(path: string): string {
    const trimmed = path.replace(/\/+$/, '');
    return trimmed === '' ? '/' : trimmed;
}

// Même page dans la langue cible ; page inconnue → accueil de la langue cible.
export function getAlternatePath(pathname: string, target: Lang): string {
    const path = normalize(pathname);
    for (const key of Object.keys(routes) as RouteKey[]) {
        for (const lang of Object.keys(routes[key]) as Lang[]) {
            const base = normalize(routes[key][lang]);
            if (path === base) return routes[key][target];
            if (key !== 'home' && path.startsWith(`${base}/`)) {
                return `${routes[key][target]}${path.slice(base.length)}`;
            }
        }
    }
    return routes.home[target];
}

export function isActivePath(currentPath: string, href: string): boolean {
    const current = normalize(currentPath);
    const target = normalize(href);
    if (target === normalize(routes.home.fr) || target === normalize(routes.home.en)) return current === target;
    return current === target || current.startsWith(`${target}/`);
}

export function withTrailingSlash(path: string): string {
    return path.endsWith('/') ? path : `${path}/`;
}
