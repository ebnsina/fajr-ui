/**
 * The only file in this project that imports TanStack Charts.
 *
 * Charts is pre-alpha and moves fast — nineteen releases before the 0.7.2 this
 * was built against, and a 0.x minor is allowed to break the API. Everything
 * else imports from here, so an upstream rename is a change to one file rather
 * than to every chart in the codebase. The same seam already isolates the
 * highlighter and the debouncer.
 *
 * The exact version lives in `$lib/registry/versions`, which is what the CLI
 * hands to your package manager, so an install reproduces this surface rather
 * than whatever shipped that morning.
 *
 * Nothing is renamed on the way through. A wrapper that invented its own names
 * would be a second API to learn and to keep true; the point of the seam is the
 * single import site, not a translation layer.
 */
export { areaY, barX, barY, defineChart, dot, lineY, stack } from '@tanstack/charts';
export { tooltip } from '@tanstack/charts/tooltip';

export { scaleBand } from '@tanstack/charts-scales/band';
export { scaleLinear } from '@tanstack/charts-scales/linear';
export { scalePoint } from '@tanstack/charts-scales/point';

export type { ChartDefinition, ChartPoint } from '@tanstack/svelte-charts';

/**
 * The categorical palette, as CSS custom properties for the chart container.
 *
 * Charts reads `--ts-chart-N` at the container boundary, so mapping our own
 * `--chart-N` tokens onto them hands the library the theme without rebuilding
 * the chart definition — light, dark and every accent follow for free, because
 * the tokens themselves already switch.
 *
 * Those tokens are generated from the accent's hue: series 1 sits on it, and
 * the rest are rotated 72° apart so none of them can land on top of it. See the
 * palette block in `$lib/styles/theme.css` for why the obvious version of this
 * — pointing series 1 at `--primary` over a fixed palette — does not work.
 */
export const CHART_PALETTE = Array.from(
	{ length: 5 },
	(_, index) => `--ts-chart-${index + 1}: var(--chart-${index + 1});`
).join(' ');
