import {existsSync} from 'node:fs';
import {join} from 'node:path';

// Logo d'un outil s'il existe dans public/assets/logos/, sinon undefined (affiché en texte).
export function logoFor(name: string): string | undefined {
    const slug = name.toLowerCase().replace(/[^a-z0-9]/g, '');
    const path = `/assets/logos/${slug}.svg`;
    return existsSync(join(process.cwd(), 'public', path)) ? path : undefined;
}
