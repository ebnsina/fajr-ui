export { default as Tooltip } from './tooltip.svelte';
export type { TooltipProps, TooltipTriggerProps } from './tooltip.svelte';

export { TooltipState, useTooltip } from './context.svelte';

/*
 * The action ships alongside the component, and neither replaces the other:
 *
 *   `tooltip` action  — a plain string on any element, no wrapper, no snippet.
 *   `Tooltip`         — markup in the body, when a sentence is not enough.
 *
 * Both put `aria-describedby` on the element that actually takes focus.
 */
export { tooltip } from '$lib/actions/tooltip';
export type { TooltipOptions, TooltipSide } from '$lib/actions/tooltip';
