import { expect, test } from '@playwright/test';
import { components } from '../src/lib/data/components';

/*
 * Catches surfaces and edges that render but cannot be seen.
 *
 * This is the class of defect that kept being found by eye: a fill the same
 * colour as what is behind it, or a border indistinguishable from the surface
 * it sits on. Both are invisible to a type checker, invisible to axe (which
 * only measures *text* contrast), and only obvious once someone happens to look
 * at that one component in that one theme.
 *
 * Dark mode is checked separately rather than assumed, because a token that
 * resolves to near-black in one theme and near-white in the other will fail in
 * exactly one of them — which is how the selected tab came to be invisible in
 * dark while looking correct in light.
 */
const BASE = 'http://localhost:4173/fajr-ui';
const SLUGS = components.filter((component) => component.built).map((component) => component.slug);

/*
 * Known-good exceptions, each one checked by hand.
 *
 * The avatar root paints a ground for a transparent image and is otherwise
 * covered by the image or the fallback, so its own fill is never the thing you
 * are looking at.
 */
const ALLOWED = new Set(['avatar', 'table-cell']);

const AUDIT = `() => {
	const probe = document.createElement('span');
	probe.style.cssText = 'position:absolute;opacity:0';
	document.body.appendChild(probe);

	// A token written in oklch() is *reported* as oklch(), whose numbers are
	// lightness/chroma/hue. Forcing it back through an sRGB mix makes the browser
	// serialise real channels.
	//
	// The number pattern has to allow a sign and an exponent, and the reason is
	// this exact audit failing in CI while passing on every local run. Converting
	// an oklab colour to sRGB lands slightly outside the gamut, and a channel
	// comes back as \`5.96046e-8\` or \`-0.00012\` rather than as a plain decimal.
	// A digits-and-dots pattern tears \`5.96046e-8\` into two numbers, everything
	// after it shifts one place, and the alpha read is really a channel — so a
	// 3%-opaque fill was taken for an opaque one. The border above it was then
	// measured against white instead of against the page, which reported a
	// perfectly visible line as invisible.
	//
	// Which serialisation arrives is also not guaranteed, so both are handled:
	// \`color(srgb …)\` is 0–1 per channel, \`rgb()\` is 0–255.
	const NUMBER = /-?\\d*\\.?\\d+(?:e[-+]?\\d+)?/gi;
	const parse = (value) => {
		if (!value || value === 'transparent' || value === 'none') return null;
		probe.style.color = 'rgb(1, 2, 3)';
		probe.style.color = 'color-mix(in srgb, ' + value + ' 100%, transparent)';
		const serialised = getComputedStyle(probe).color;
		const n = serialised.match(NUMBER)?.map(Number);
		if (!n || n.length < 3) return null;
		const alpha = n.length > 3 ? n[3] : 1;
		if (alpha <= 0.001) return null;
		const scale = serialised.startsWith('color(') ? 255 : 1;
		// Out-of-gamut conversions overshoot either end; the luminance maths below
		// is only defined on a real channel.
		const clamp = (v) => Math.min(255, Math.max(0, v * scale));
		return [clamp(n[0]), clamp(n[1]), clamp(n[2]), alpha];
	};
	const lum = ([r, g, b]) => {
		const f = (v) => { v /= 255; return v <= 0.04045 ? v / 12.92 : ((v + 0.055) / 1.055) ** 2.4; };
		return 0.2126 * f(r) + 0.7152 * f(g) + 0.0722 * f(b);
	};
	const ratio = (a, b) => { const [x, y] = [lum(a), lum(b)].sort((p, q) => q - p); return (x + 0.05) / (y + 0.05); };
	const behind = (el) => {
		let node = el;
		while (node) {
			const c = parse(getComputedStyle(node).backgroundColor);
			if (c && c[3] > 0.5) return c;
			node = node.parentElement;
		}
		return [255, 255, 255, 1];
	};

	const found = [];
	for (const el of document.querySelectorAll('[id$="-panel-preview"] [data-slot]')) {
		const box = el.getBoundingClientRect();
		if (box.height < 14 || box.width < 24) continue;
		const cs = getComputedStyle(el);
		const slot = el.dataset.slot;
		const own = parse(cs.backgroundColor);
		const ground = behind(el.parentElement);
		const width = parseFloat(cs.borderTopWidth) || 0;
		const edge = parse(cs.borderTopColor);
		// A shadow is definition too: a white thumb on a grey track measures ~1.04
		// and is perfectly legible because its edge is drawn by the shadow.
		const shadowed = cs.boxShadow && cs.boxShadow !== 'none';

		if (own && own[3] > 0.02 && width === 0 && !shadowed) {
			const blended = own.slice(0, 3).map((v, i) => v * own[3] + ground[i] * (1 - own[3]));
			if (ratio(blended, ground.slice(0, 3)) < 1.06) found.push(slot + ' (fill)');
		}
		if (width > 0 && edge && edge[3] > 0.02) {
			const surface = own && own[3] > 0.5 ? own.slice(0, 3) : ground.slice(0, 3);
			const line = edge.slice(0, 3).map((v, i) => v * edge[3] + surface[i] * (1 - edge[3]));
			if (ratio(line, surface) < 1.08) found.push(slot + ' (border)');
		}
	}
	probe.remove();
	return [...new Set(found)];
}`;

for (const theme of ['light', 'dark'] as const) {
	test(`no invisible surfaces in ${theme} mode`, async ({ page }) => {
		const offenders: string[] = [];
		for (const slug of SLUGS) {
			await page.goto(`${BASE}/docs/components/${slug}`, { waitUntil: 'domcontentloaded' });
			await page.evaluate(
				(t) => document.documentElement.classList.toggle('dark', t === 'dark'),
				theme
			);
			await page.waitForTimeout(120);
			// Invoked, not just evaluated: `page.evaluate` given a string returns the
			// expression's value, and the expression here *is* a function.
			const hits = (await page.evaluate(`(${AUDIT})()`)) as string[];
			for (const hit of hits) {
				if (!ALLOWED.has(String(hit).split(' ')[0])) offenders.push(`${slug}: ${hit}`);
			}
		}
		expect([...new Set(offenders)]).toEqual([]);
	});
}
