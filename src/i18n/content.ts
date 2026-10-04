import {getCollection, type CollectionEntry, type CollectionKey} from 'astro:content';
import {byNewest, localizeEntries, type Localized} from './localize';
import type {Lang} from './ui';

export async function getLocalizedEntries<C extends CollectionKey>(collection: C, lang: Lang): Promise<Localized<CollectionEntry<C>>[]> {
    const entries = (await getCollection(collection)) as CollectionEntry<C>[];
    return localizeEntries(entries, lang);
}

// Les `limit` entrées les plus récentes (projets et études de cas confondus).
export async function getLatestEntries(lang: Lang, limit = 6) {
    return byNewest(await getLocalizedEntries('projets', lang)).slice(0, limit);
}
