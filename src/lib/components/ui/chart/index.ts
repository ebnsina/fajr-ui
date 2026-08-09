export { default as Chart } from './chart.svelte';
export { default as ChartLegend } from './chart-legend.svelte';

export type { ChartProps } from './chart.svelte';
export type { ChartLegendProps, ChartSeries } from './chart-legend.svelte';

/*
 * The definition helpers — `defineChart`, the marks, the scales, `tooltip` —
 * are deliberately NOT re-exported here. Two reasons:
 *
 * 1. `tooltip` is already taken. This barrel exports the tooltip *action*, and
 *    a chart tooltip is a different thing entirely; re-exporting both under one
 *    name shadows one of them silently.
 * 2. They are vendor API, and `$lib/internal/chart` is the single place this
 *    project touches it. Importing them from two places would defeat the seam
 *    the moment the upstream API moves.
 *
 * So: components from here, definitions from `$lib/internal/chart`.
 */
