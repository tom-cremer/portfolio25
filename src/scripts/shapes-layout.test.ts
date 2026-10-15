import {test} from 'node:test';
import assert from 'node:assert/strict';
import {mulberry32, pickShapes, restingLayout, shapeCount, shapeRadius, SHAPE_COLORS} from './shapes-layout.ts';

test('shape count grows with width within bounds', () => {
    assert.equal(shapeCount(320), 10);
    assert.equal(shapeCount(1200), 20);
    assert.equal(shapeCount(2560), 26);
});

test('shape radius stays readable on mobile and capped on large screens', () => {
    assert.equal(shapeRadius(320), 18);
    assert.equal(shapeRadius(1200), 24);
    assert.equal(shapeRadius(2560), 32);
});

test('seeded random is deterministic', () => {
    const a = mulberry32(42);
    const b = mulberry32(42);
    assert.deepEqual([a(), a(), a()], [b(), b(), b()]);
});

test('picked shapes use the banner palette', () => {
    const palette = Object.values(SHAPE_COLORS) as string[];
    const shapes = pickShapes(50, mulberry32(1));
    assert.equal(shapes.length, 50);
    shapes.forEach((shape) => assert.ok(palette.includes(shape.color)));
});

test('resting layout sits on the floor without overlap', () => {
    const radius = 24;
    const placements = restingLayout(20, radius, 1200, 400, mulberry32(7));
    assert.equal(placements.length, 20);
    placements.forEach((p) => assert.equal(p.y, 400 - radius));
    const xs = placements.map((p) => p.x);
    for (let i = 1; i < xs.length; i++) assert.ok(xs[i] - xs[i - 1] >= radius * 2);
    assert.ok(xs[0] >= radius && xs[xs.length - 1] <= 1200 - radius);
});

test('resting layout drops shapes that do not fit', () => {
    const placements = restingLayout(20, 24, 320, 400, mulberry32(7));
    assert.equal(placements.length, Math.floor(320 / (24 * 2.2)));
});
