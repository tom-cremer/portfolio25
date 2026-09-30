import {test} from 'node:test';
import assert from 'node:assert/strict';
import {getAlternatePath, getLang, isActivePath, localizePath, useTranslations, withTrailingSlash} from './utils.ts';
import type {Dictionary} from './ui.ts';

test('getLang maps locales, defaulting to fr', () => {
    assert.equal(getLang('en'), 'en');
    assert.equal(getLang('fr'), 'fr');
    assert.equal(getLang(undefined), 'fr');
    assert.equal(getLang('de'), 'fr');
});

test('useTranslations returns the string for the language', () => {
    assert.equal(useTranslations('fr')('nav.home'), 'Accueil');
    assert.equal(useTranslations('en')('nav.home'), 'Home');
});

test('useTranslations falls back to French when an EN key is missing', () => {
    const dict = {fr: {'nav.home': 'Accueil'}, en: {}} as unknown as Dictionary;
    assert.equal(useTranslations('en', dict)('nav.home'), 'Accueil');
});

test('useTranslations interpolates {vars} and leaves unknown ones', () => {
    const dict = {fr: {'nav.home': 'Depuis {years} ans {x}'}, en: {}} as unknown as Dictionary;
    assert.equal(useTranslations('fr', dict)('nav.home', {years: 3}), 'Depuis 3 ans {x}');
});

test('localizePath builds FR and EN paths', () => {
    assert.equal(localizePath('home', 'fr'), '/');
    assert.equal(localizePath('home', 'en'), '/en/');
    assert.equal(localizePath('about', 'en'), '/en/about');
    assert.equal(localizePath('projects', 'fr', 'horixt'), '/projets/horixt');
    assert.equal(localizePath('projects', 'en', 'horixt'), '/en/projects/horixt');
});

test('getAlternatePath maps pages across languages', () => {
    assert.equal(getAlternatePath('/', 'en'), '/en/');
    assert.equal(getAlternatePath('/en/', 'fr'), '/');
    assert.equal(getAlternatePath('/apropos', 'en'), '/en/about');
    assert.equal(getAlternatePath('/en/about', 'fr'), '/apropos');
    assert.equal(getAlternatePath('/projets', 'en'), '/en/projects');
    assert.equal(getAlternatePath('/projets/horixt', 'en'), '/en/projects/horixt');
    assert.equal(getAlternatePath('/en/projects/horixt', 'fr'), '/projets/horixt');
});

test('getAlternatePath returns the same page for its own language', () => {
    assert.equal(getAlternatePath('/apropos', 'fr'), '/apropos');
    assert.equal(getAlternatePath('/en/projects/tethr', 'en'), '/en/projects/tethr');
});

test('getAlternatePath ignores trailing slashes', () => {
    assert.equal(getAlternatePath('/apropos/', 'en'), '/en/about');
    assert.equal(getAlternatePath('/en', 'fr'), '/');
    assert.equal(getAlternatePath('/projets/horixt/', 'en'), '/en/projects/horixt');
});

test('getAlternatePath sends unknown pages to the target home', () => {
    assert.equal(getAlternatePath('/nope', 'en'), '/en/');
    assert.equal(getAlternatePath('/en/nope', 'fr'), '/');
});

test('isActivePath matches sections, exact-matches homes', () => {
    assert.equal(isActivePath('/', '/'), true);
    assert.equal(isActivePath('/apropos', '/'), false);
    assert.equal(isActivePath('/en/', '/en/'), true);
    assert.equal(isActivePath('/en/about', '/en/'), false);
    assert.equal(isActivePath('/projets/horixt/', '/projets'), true);
    assert.equal(isActivePath('/en/projects', '/en/projects'), true);
    assert.equal(isActivePath('/apropos/', '/apropos'), true);
    assert.equal(isActivePath('/', '/#contact'), false);
});

test('withTrailingSlash adds exactly one slash', () => {
    assert.equal(withTrailingSlash('/apropos'), '/apropos/');
    assert.equal(withTrailingSlash('/en/'), '/en/');
    assert.equal(withTrailingSlash('/'), '/');
});
