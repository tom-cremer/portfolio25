import {test} from 'node:test';
import assert from 'node:assert/strict';
import {reachablePositions} from './glide-bullets.ts';

test('bound slider: one position per step until the last full view', () => {
    assert.equal(reachablePositions(5, 3), 3);
    assert.equal(reachablePositions(5, 2), 4);
    assert.equal(reachablePositions(6, 3), 4);
    assert.equal(reachablePositions(5, 1), 5);
});

test('fewer slides than per-view: a single position', () => {
    assert.equal(reachablePositions(2, 3), 1);
    assert.equal(reachablePositions(0, 3), 1);
});
