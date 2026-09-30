import {test} from 'node:test';
import assert from 'node:assert/strict';
import {availableLangs, byNewest, localizeEntries, splitId} from './localize.ts';

const entries = [{id: 'horixt'}, {id: 'tethr'}, {id: 'en/horixt'}, {id: 'en/english-only'}];

test('splitId derives lang and slug from the entry id', () => {
    assert.deepEqual(splitId('horixt'), {lang: 'fr', slug: 'horixt'});
    assert.deepEqual(splitId('en/horixt'), {lang: 'en', slug: 'horixt'});
});

test('FR lists only French entries', () => {
    const result = localizeEntries(entries, 'fr');
    assert.deepEqual(result.map((r) => r.slug), ['horixt', 'tethr']);
    assert.ok(result.every((r) => r.lang === 'fr' && !r.isFallback));
});

test('EN uses the English entry when present, French fallback otherwise', () => {
    const bySlug = Object.fromEntries(localizeEntries(entries, 'en').map((r) => [r.slug, r]));
    assert.equal(bySlug.horixt.entry.id, 'en/horixt');
    assert.equal(bySlug.horixt.isFallback, false);
    assert.equal(bySlug.tethr.entry.id, 'tethr');
    assert.equal(bySlug.tethr.lang, 'fr');
    assert.equal(bySlug.tethr.isFallback, true);
});

test('EN-only entries appear in EN, not in FR', () => {
    assert.ok(localizeEntries(entries, 'en').some((r) => r.slug === 'english-only' && !r.isFallback));
    assert.ok(!localizeEntries(entries, 'fr').some((r) => r.slug === 'english-only'));
});

test('availableLangs lists languages with real content, FR first', () => {
    assert.deepEqual(availableLangs(entries, 'horixt'), ['fr', 'en']);
    assert.deepEqual(availableLangs(entries, 'tethr'), ['fr']);
    assert.deepEqual(availableLangs(entries, 'english-only'), ['en']);
});

test('byNewest sorts by pubDate descending without mutating', () => {
    const items = [
        {entry: {data: {pubDate: new Date(2024, 0, 1)}}, n: 'old'},
        {entry: {data: {pubDate: new Date(2025, 0, 1)}}, n: 'new'},
    ];
    assert.deepEqual(byNewest(items).map((i) => i.n), ['new', 'old']);
    assert.equal(items[0].n, 'old');
});
