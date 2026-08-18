import AxeBuilder from '@axe-core/playwright';
import { expect, test } from '@playwright/test';

/*
 * WAI-ARIA conformance, checked against the built site.
 *
 * Two passes, because they catch different things. The first walks pages as
 * they load. The second opens the overlays — a static scan never sees a dialog,
 * a listbox or a menu, which is exactly where ARIA tends to be wrong.
 *
 * `best-practice` is included alongside the WCAG tags on purpose: the rules
 * that caught the real problems here — a landmark list full of identically
 * named regions, a `<ul>` with a `<div>` in it — are all in that set rather
 * than in WCAG A/AA.
 */
/*
 * The full URL, including the base path. There is no `baseURL` in the
 * Playwright config, and the site is not served from the root — a bare `/docs`
 * lands on a 404, which axe then reports as a page full of violations rather
 * than as a missing page.
 */
const BASE = 'http://localhost:4173/fajr-ui';

const TAGS = ['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa', 'best-practice'];

const PAGES = [
	'/',
	'/docs',
	'/docs/get-started',
	'/docs/theming',
	'/docs/components/button',
	'/docs/components/checkbox',
	'/docs/components/select',
	'/docs/components/data-table',
	'/docs/components/calendar',
	'/docs/components/accordion',
	'/examples',
	'/examples/dashboard/app'
];

for (const path of PAGES) {
	test(`${path} has no accessibility violations`, async ({ page }) => {
		await page.goto(BASE + path, { waitUntil: 'networkidle' });
		const { violations } = await new AxeBuilder({ page }).withTags(TAGS).analyze();
		expect(violations.map((v) => `${v.id} (${v.nodes.length})`)).toEqual([]);
	});
}

/*
 * Overlays, in their open state.
 *
 * Triggers are selected structurally — by slot, role, or position inside the
 * lead preview panel — never by their label. The demo copy is content and gets
 * rewritten; a selector like `button:has-text("Open popover")` turns into a
 * silent no-op the moment someone improves the wording.
 */
const OVERLAYS = [
	{ path: '/docs/components/dialog', name: 'dialog' },
	{ path: '/docs/components/alert-dialog', name: 'alert dialog' },
	{ path: '/docs/components/sheet', name: 'sheet' },
	{ path: '/docs/components/drawer', name: 'drawer', trigger: '[id$="-panel-preview"] button' },
	{ path: '/docs/components/menu', name: 'menu' },
	{ path: '/docs/components/popover', name: 'popover', trigger: '[data-slot=popover-trigger]' },
	{ path: '/docs/components/command', name: 'command palette' },
	{ path: '/docs/components/select', name: 'select', trigger: '[data-slot=select-trigger]' },
	{ path: '/docs/components/combobox', name: 'combobox', trigger: '[role=combobox]' }
];

const OPEN = [
	'dialog[open]',
	'[role=listbox]',
	'[role=menu]',
	'[popover]:popover-open',
	'[data-state=open]'
].join(', ');

for (const { path, name, trigger } of OVERLAYS) {
	test(`${name} has no accessibility violations when open`, async ({ page }) => {
		await page.goto(BASE + path, { waitUntil: 'networkidle' });

		await page
			.locator(trigger ?? '[id$="-panel-preview"] button')
			.first()
			.click();

		// Proves the case was actually exercised. Without it a trigger that stopped
		// working would turn this into a test that always passes.
		await expect(page.locator(OPEN).first()).toBeVisible();

		/*
		 * Let the entrance settle before measuring.
		 *
		 * "Visible" is true as soon as the element is painted, which for the drawer
		 * is the first frame of a 280ms slide — and mid-transition its text is
		 * being composited over a partly transparent surface, so the contrast rule
		 * measures a colour that exists for a few frames and never at rest. That
		 * produced a `color-contrast` failure here that could not be reproduced by
		 * opening the same drawer by hand.
		 */
		await page.waitForTimeout(500);

		const { violations } = await new AxeBuilder({ page }).withTags(TAGS).analyze();
		expect(violations.map((v) => `${v.id} (${v.nodes.length})`)).toEqual([]);
	});
}
