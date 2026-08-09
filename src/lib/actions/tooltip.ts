import type { Action } from 'svelte/action';
import { place, trackAnchor, type Side } from '$lib/internal/position';

export type TooltipSide = Side;

export type TooltipOptions = {
	content?: string;
	side?: TooltipSide;
	/** Skip rendering entirely — e.g. a sidebar tooltip while expanded. */
	disabled?: boolean;
};

export type TooltipParam = string | TooltipOptions | undefined;

const OPEN_DELAY = 600;
/**
 * After one tooltip closes, the next opens immediately and without animation.
 * Moving along a toolbar should feel like reading labels, not like waiting for
 * each one in turn.
 */
const INSTANT_WINDOW = 400;
const GAP = 6;

let lastClosedAt = 0;

function normalize(param: TooltipParam): TooltipOptions {
	if (typeof param === 'string') return { content: param };
	return param ?? {};
}

/**
 * Attaches a tooltip to the element it is used on.
 *
 * Deliberately an action rather than a wrapper component: wrapping a trigger in
 * an extra element breaks sibling selectors (`peer-*`) that surrounding layout
 * may depend on, and puts `aria-describedby` on the wrong node.
 */
export const tooltip: Action<HTMLElement, TooltipParam> = (node, param) => {
	let options = normalize(param);
	let popup: HTMLDivElement | null = null;
	let openTimer: ReturnType<typeof setTimeout> | undefined;
	let hideTimer: ReturnType<typeof setTimeout> | undefined;
	let open = false;
	const id = `tooltip-${Math.random().toString(36).slice(2, 9)}`;

	function build(): HTMLDivElement {
		if (popup) return popup;
		const element = document.createElement('div');
		element.id = id;
		element.setAttribute('role', 'tooltip');
		// The top layer means the tooltip is never clipped by an ancestor's
		// `overflow: hidden` and never loses a z-index fight.
		element.setAttribute('popover', 'manual');
		element.className =
			'pointer-events-none fixed z-50 m-0 w-max max-w-64 scale-[0.97] text-balance rounded-md border bg-popover p-0 px-2 py-1 text-popover-foreground text-xs opacity-0 shadow-md/5 not-dark:bg-clip-padding before:pointer-events-none before:absolute before:inset-0 before:rounded-[calc(var(--radius-md)-1px)] before:shadow-[0_1px_--theme(--color-black/4%)] dark:before:shadow-[0_-1px_--theme(--color-white/6%)] transition-[opacity,scale] duration-(--duration-popover) ease-out motion-reduce:transition-none';
		document.body.appendChild(element);
		popup = element;
		return element;
	}

	let stopTracking: (() => void) | undefined;

	function reposition() {
		if (!popup) return;
		const placement = place(node.getBoundingClientRect(), popup.getBoundingClientRect(), {
			side: options.side ?? 'top',
			offset: GAP
		});
		popup.style.left = `${placement.left}px`;
		popup.style.top = `${placement.top}px`;
		popup.style.transformOrigin = placement.transformOrigin;
	}

	function show() {
		if (open || options.disabled || !options.content) return;
		open = true;
		clearTimeout(hideTimer);

		const element = build();
		element.textContent = options.content;
		element.showPopover();
		node.setAttribute('aria-describedby', id);

		// Measure only once it is laid out, then reveal.
		reposition();
		const instant = Date.now() - lastClosedAt < INSTANT_WINDOW;
		element.style.transitionDuration = instant ? '0ms' : '';
		requestAnimationFrame(() => {
			element.classList.remove('opacity-0', 'scale-[0.97]');
			element.classList.add('opacity-100', 'scale-100');
		});

		stopTracking = trackAnchor(node, reposition);
	}

	function hide() {
		clearTimeout(openTimer);
		if (!open || !popup) return;
		open = false;
		lastClosedAt = Date.now();
		node.removeAttribute('aria-describedby');

		const element = popup;
		element.classList.remove('opacity-100', 'scale-100');
		element.classList.add('opacity-0', 'scale-[0.97]');
		stopTracking?.();
		stopTracking = undefined;

		// Stay mounted for the fade, then leave the top layer.
		hideTimer = setTimeout(() => element.hidePopover(), 200);
	}

	function scheduleShow() {
		clearTimeout(openTimer);
		const delay = Date.now() - lastClosedAt < INSTANT_WINDOW ? 0 : OPEN_DELAY;
		openTimer = setTimeout(show, delay);
	}

	function onpointerenter(event: PointerEvent) {
		// Touch fires pointerenter on tap, which would show a tooltip the user
		// never asked for and cannot dismiss.
		if (event.pointerType === 'touch') return;
		scheduleShow();
	}

	function onfocus() {
		// Only keyboard focus, so clicking a button does not summon a tooltip.
		if (node.matches(':focus-visible')) show();
	}

	function onkeydown(event: KeyboardEvent) {
		if (event.key === 'Escape') hide();
	}

	node.addEventListener('pointerenter', onpointerenter);
	node.addEventListener('pointerleave', hide);
	node.addEventListener('pointerdown', hide);
	node.addEventListener('focus', onfocus);
	node.addEventListener('blur', hide);
	node.addEventListener('keydown', onkeydown);

	return {
		update(next: TooltipParam) {
			options = normalize(next);
			if (options.disabled || !options.content) hide();
			else if (open && popup) {
				popup.textContent = options.content;
				reposition();
			}
		},
		destroy() {
			clearTimeout(openTimer);
			clearTimeout(hideTimer);
			stopTracking?.();
			node.removeEventListener('pointerenter', onpointerenter);
			node.removeEventListener('pointerleave', hide);
			node.removeEventListener('pointerdown', hide);
			node.removeEventListener('focus', onfocus);
			node.removeEventListener('blur', hide);
			node.removeEventListener('keydown', onkeydown);
			popup?.remove();
		}
	};
};
