import type {Lang} from './ui.ts';

export interface Localized<E> {
    entry: E;
    slug: string;
    lang: Lang;       // langue réelle du contenu affiché
    isFallback: boolean; // true = page EN affichant le contenu FR
}

const EN_PREFIX = 'en/';

export function splitId(id: string): { lang: Lang; slug: string } {
    return id.startsWith(EN_PREFIX) ? {lang: 'en', slug: id.slice(EN_PREFIX.length)} : {lang: 'fr', slug: id};
}

export function localizeEntries<E extends { id: string }>(entries: E[], lang: Lang): Localized<E>[] {
    const fr = new Map<string, E>();
    const en = new Map<string, E>();
    for (const entry of entries) {
        const {lang: entryLang, slug} = splitId(entry.id);
        (entryLang === 'en' ? en : fr).set(slug, entry);
    }
    if (lang === 'fr') {
        return [...fr].map(([slug, entry]) => ({entry, slug, lang: 'fr', isFallback: false}));
    }
    const slugs = new Set([...fr.keys(), ...en.keys()]);
    return [...slugs].map((slug) => {
        const english = en.get(slug);
        return english
            ? {entry: english, slug, lang: 'en', isFallback: false}
            : {entry: fr.get(slug)!, slug, lang: 'fr', isFallback: true};
    });
}

export function availableLangs(entries: { id: string }[], slug: string): Lang[] {
    const langs = new Set(entries.map((e) => splitId(e.id)).filter((s) => s.slug === slug).map((s) => s.lang));
    return (['fr', 'en'] as Lang[]).filter((l) => langs.has(l));
}

export function byNewest<T extends { entry: { data: { pubDate: Date } } }>(items: T[]): T[] {
    return [...items].sort((a, b) => b.entry.data.pubDate.getTime() - a.entry.data.pubDate.getTime());
}
