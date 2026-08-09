import { chromium } from 'playwright';
const b = await chromium.launch();
const errs = [];
const p = await (
	await b.newContext({ viewport: { width: 1400, height: 1000 }, deviceScaleFactor: 2 })
).newPage();
p.on('console', (m) => m.type() === 'error' && errs.push(m.text()));
p.on('pageerror', (e) => errs.push(String(e)));

for (const slug of ['field', 'checkbox', 'switch', 'alert', 'progress', 'kbd', 'textarea']) {
	const r = await p.goto(`http://localhost:5174/docs/components/${slug}`, {
		waitUntil: 'networkidle'
	});
	if (r.status() !== 200) errs.push(`${slug}: status ${r.status()}`);
	await p.waitForTimeout(400);
	await p.screenshot({ path: `c-${slug}.png` });
}

// Field must actually wire label→control and aria-describedby
await p.goto('http://localhost:5174/docs/components/field', { waitUntil: 'networkidle' });
await p.waitForTimeout(400);
const wiring = await p.evaluate(() => {
	const labels = [...document.querySelectorAll('[data-slot="field-label"]')];
	return labels.map((l) => {
		const c = document.getElementById(l.getAttribute('for') || '');
		return {
			for: !!l.getAttribute('for'),
			controlFound: !!c,
			describedBy: c?.getAttribute('aria-describedby') || null,
			invalid: c?.getAttribute('aria-invalid') || null,
			disabled: c?.hasAttribute('disabled')
		};
	});
});
errs.push('field wiring: ' + JSON.stringify(wiring, null, 1));

// Checkbox keyboard toggle via Space
await p.goto('http://localhost:5174/docs/components/checkbox', { waitUntil: 'networkidle' });
await p.waitForTimeout(300);
const cb = p.locator('input[type=checkbox]').first();
const before = await cb.isChecked();
await cb.focus();
await p.keyboard.press('Space');
errs.push(`checkbox space toggle: ${before} -> ${await cb.isChecked()}`);

// Switch keyboard toggle
await p.goto('http://localhost:5174/docs/components/switch', { waitUntil: 'networkidle' });
await p.waitForTimeout(300);
const sw = p.getByRole('switch').first();
const sBefore = await sw.getAttribute('aria-checked');
await sw.focus();
await p.keyboard.press('Space');
await p.waitForTimeout(150);
errs.push(`switch space toggle: ${sBefore} -> ${await sw.getAttribute('aria-checked')}`);

console.log(errs.join('\n'));
await b.close();
