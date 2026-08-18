import { describe, expect, it } from 'vitest';
import { ARCHETYPES, GLYPHS, glyphFor } from './glyphs';
import { components } from './components';

/*
 * The home page draws a wireframe for every component. A missing entry falls
 * back to the plain three-line placeholder rather than to an empty card, which
 * is the right behaviour at runtime and the wrong thing to discover by looking
 * at the page — the fallback is indistinguishable from Skeleton's own glyph.
 * These tests are what makes the fallback a temporary state.
 */
describe('component glyphs', () => {
	const built = components.filter((component) => component.built);

	it('draws every built component', () => {
		const missing = built.filter((component) => !ARCHETYPES[component.slug]);
		expect(missing.map((component) => component.slug)).toEqual([]);
	});

	it('names no component that is not on the roster', () => {
		const known = new Set(components.map((component) => component.slug));
		expect(Object.keys(ARCHETYPES).filter((slug) => !known.has(slug))).toEqual([]);
	});

	it('resolves every archetype to shapes', () => {
		for (const component of built) expect(glyphFor(component.slug).length).toBeGreaterThan(0);
	});

	/*
	 * Every shape is drawn into a 120×64 box with no clipping, so one that runs
	 * past the edge is not cropped — it overlaps the card's padding and reads as
	 * a misalignment on that one tile only.
	 */
	it('keeps every rectangle inside the box', () => {
		const escaped: string[] = [];
		for (const [name, shapes] of Object.entries(GLYPHS)) {
			for (const shape of shapes) {
				if (!Array.isArray(shape)) continue;
				const [x, y, width, height] = shape;
				if (x < 0 || y < 0 || x + width > 120 || y + height > 64) {
					escaped.push(`${name}: ${x},${y} ${width}×${height}`);
				}
			}
		}
		expect(escaped).toEqual([]);
	});

	/*
	 * Paths are checked the same way, on their coordinate pairs. A stray digit in
	 * a chevron is the easiest thing to typo here and the hardest to see: it draws
	 * a line off the edge of one tile in one shelf.
	 */
	it('keeps every path inside the box', () => {
		const escaped: string[] = [];
		for (const [name, shapes] of Object.entries(GLYPHS)) {
			for (const shape of shapes) {
				if (Array.isArray(shape)) continue;
				const numbers = shape.d.match(/-?\d+(\.\d+)?/g)?.map(Number) ?? [];
				// Arc commands carry radii and flags between the coordinate pairs, so
				// only the plain line-and-move paths can be read as x,y in sequence.
				if (/[Aa]/.test(shape.d)) continue;
				for (let i = 0; i < numbers.length; i += 2) {
					const [x, y] = [numbers[i], numbers[i + 1]];
					if (x < 0 || x > 120 || y < 0 || y > 64) escaped.push(`${name}: ${x},${y}`);
				}
			}
		}
		expect(escaped).toEqual([]);
	});

	// A radius over half the shorter side renders as a smaller pill than asked
	// for, silently, so a typo here shows up as a shape that is subtly the wrong
	// size rather than as an error.
	it('asks for no radius larger than the shape', () => {
		const wrong: string[] = [];
		for (const [name, shapes] of Object.entries(GLYPHS)) {
			for (const shape of shapes) {
				if (!Array.isArray(shape)) continue;
				const [, , width, height, radius] = shape;
				if (radius > Math.min(width, height) / 2)
					wrong.push(`${name}: r${radius} on ${width}×${height}`);
			}
		}
		expect(wrong).toEqual([]);
	});
});
