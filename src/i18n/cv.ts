import {existsSync} from 'node:fs';
import {join} from 'node:path';
import type {Lang} from './ui.ts';

const publicFileExists = (publicPath: string) => existsSync(join(process.cwd(), 'public', publicPath));

// CV de la langue demandée, sinon celui de l'autre langue, sinon undefined (lien masqué).
export function cvUrl(lang: Lang, exists: (publicPath: string) => boolean = publicFileExists): string | undefined {
    const own = `/cv/tom-cremer-cv-${lang}.pdf`;
    if (exists(own)) return own;
    const other = `/cv/tom-cremer-cv-${lang === 'fr' ? 'en' : 'fr'}.pdf`;
    return exists(other) ? other : undefined;
}
