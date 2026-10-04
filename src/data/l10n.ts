import type {Lang} from '../i18n/ui.ts';

export type L10n = Record<Lang, string>;

export const localize = (text: L10n, lang: Lang): string => text[lang];

const locales = {fr: 'fr-BE', en: 'en-GB'} as const;

const monthYear = (yearMonth: string, lang: Lang, month: 'long' | 'short') => {
    const [year, m] = yearMonth.split('-').map(Number);
    return new Date(year, m - 1, 1).toLocaleDateString(locales[lang], {month, year: 'numeric'});
};

// "depuis octobre 2025" / "since October 2025", ou "oct. 2025 – nov. 2026" / "Oct 2025 – Nov 2026"
export function formatPeriod(start: string, end: string | undefined, lang: Lang): string {
    if (!end) return lang === 'fr' ? `depuis ${monthYear(start, lang, 'long')}` : `since ${monthYear(start, lang, 'long')}`;
    return `${monthYear(start, lang, 'short')} – ${monthYear(end, lang, 'short')}`;
}
