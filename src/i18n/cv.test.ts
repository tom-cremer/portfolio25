import {test} from 'node:test';
import assert from 'node:assert/strict';
import {cvUrl} from './cv.ts';

const only = (...files: string[]) => (path: string) => files.includes(path);

test('cvUrl returns the CV for the language', () => {
    const exists = only('/cv/tom-cremer-cv-fr.pdf', '/cv/tom-cremer-cv-en.pdf');
    assert.equal(cvUrl('fr', exists), '/cv/tom-cremer-cv-fr.pdf');
    assert.equal(cvUrl('en', exists), '/cv/tom-cremer-cv-en.pdf');
});

test('cvUrl falls back to the other language', () => {
    assert.equal(cvUrl('en', only('/cv/tom-cremer-cv-fr.pdf')), '/cv/tom-cremer-cv-fr.pdf');
    assert.equal(cvUrl('fr', only('/cv/tom-cremer-cv-en.pdf')), '/cv/tom-cremer-cv-en.pdf');
});

test('cvUrl is undefined when no CV exists', () => {
    assert.equal(cvUrl('fr', only()), undefined);
});
