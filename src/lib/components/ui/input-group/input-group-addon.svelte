<script module lang="ts">
	import type { HTMLAttributes } from 'svelte/elements';
	import type { Snippet } from 'svelte';
	import { cva, type VariantProps } from 'class-variance-authority';

	export const inputGroupAddonVariants = cva(
		"flex h-auto cursor-text select-none items-center justify-center gap-2 [&>kbd]:rounded-xs [&_svg]:-mx-0.5 [&_svg:not([class*='size-'])]:size-4.5 sm:[&_svg:not([class*='size-'])]:size-4 not-has-[button]:**:[svg:not([class*='opacity-'])]:opacity-80",
		{
			defaultVariants: { align: 'inline-start' },
			variants: {
				align: {
					'inline-start':
						'order-first ps-[calc(--spacing(3)-1px)] has-[>button]:-ms-2 has-[>kbd:last-child]:ms-[-0.35rem]',
					'inline-end':
						'order-last pe-[calc(--spacing(3)-1px)] has-[>button]:-me-2 has-[>kbd:last-child]:me-[-0.35rem]',
					'block-start':
						'order-first w-full justify-start px-[calc(--spacing(3)-1px)] pt-[calc(--spacing(3)-1px)]',
					'block-end':
						'order-last w-full justify-start px-[calc(--spacing(3)-1px)] pb-[calc(--spacing(3)-1px)]'
				}
			}
		}
	);

	export type InputGroupAlign = NonNullable<VariantProps<typeof inputGroupAddonVariants>['align']>;

	export type InputGroupAddonProps = HTMLAttributes<HTMLDivElement> & {
		/** Which edge the addon sits against. */
		align?: InputGroupAlign;
		children?: Snippet;
	};
</script>

<script lang="ts">
	import { cn } from '$lib/utils';

	let {
		class: className,
		align = 'inline-start',
		children,
		...rest
	}: InputGroupAddonProps = $props();

	// Clicking the padding beside an icon should land in the field, the way it
	// does when the icon is part of the input itself.
	function onmousedown(event: MouseEvent) {
		const target = event.target as HTMLElement;
		if (target.closest('button, a, input, select, textarea, [role="button"]')) return;
		const group = event.currentTarget as HTMLElement;
		const field = group.parentElement?.querySelector<HTMLInputElement | HTMLTextAreaElement>(
			'input, textarea'
		);
		if (!field || field === document.activeElement) return;
		event.preventDefault();
		field.focus();
	}
</script>

<div
	data-slot="input-group-addon"
	data-align={align}
	class={cn(inputGroupAddonVariants({ align }), className)}
	{onmousedown}
	{...rest}
>
	{@render children?.()}
</div>
