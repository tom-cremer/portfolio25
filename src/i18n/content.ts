import {getCollection, type CollectionEntry, type CollectionKey} from 'astro:content';
import {localizeEntries, type Localized} from './localize';
import type {Lang} from './ui';

export async function getLocalizedEntries<C extends CollectionKey>(collection: C, lang: Lang): Promise<Localized<CollectionEntry<C>>[]> {
    const entries = (await getCollection(collection)) as CollectionEntry<C>[];
    return localizeEntries(entries, lang);
}
