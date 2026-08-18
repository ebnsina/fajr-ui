<script module lang="ts">
	import { cva, type VariantProps } from 'class-variance-authority';
	import type { HTMLAnchorAttributes, HTMLButtonAttributes } from 'svelte/elements';
	import type { Snippet } from 'svelte';

	/*
	 * The outline variants are a border and nothing else — no drop shadow, no
	 * faked inner hairline. An outlined control is defined by its line; adding
	 * elevation underneath makes it compete with the filled buttons it is meant
	 * to sit quietly beside.
	 *
	 * Secondary is flat for the same reason: no gradient and no highlight. It is the quiet option, and gloss is emphasis — a raised
	 * treatment on the button that means "not this one"was arguing with itself.
	 * Its states shift the fill toward `--color-foreground` rather than toward
	 * black, so the press reads as deeper in both themes instead of only in one.
	 *
	 * The rest of the filled variants are a gradient, and it always runs base →
	 * darker, never lighter → base.
	 *
	 * A gloss normally lightens the top, and the first version did. But the
	 * lightest pixel of a filled button is where its label contrast is worst,
	 * and lightening the top of `destructive` measured 4.48:1 against white —
	 * under the floor, on hover 4.21. `--destructive-surface` exists precisely
	 * because the lighter red failed this test once already.
	 *
	 * Anchoring the top at the token and darkening downward reads the same — lit
	 * from above — while making the brightest point exactly the colour whose
	 * contrast was verified. No variant can break the floor by gradient alone,
	 * including any accent added later.
	 */
	export const buttonVariants = cva(
		"relative inline-flex shrink-0 cursor-pointer items-center justify-center gap-2 whitespace-nowrap border font-medium text-base outline-none transition-[box-shadow,transform] duration-(--duration-press) ease-out active:scale-[0.97] data-pressed:scale-[0.97] motion-reduce:active:scale-100 motion-reduce:data-pressed:scale-100 pointer-coarse:after:absolute pointer-coarse:after:size-full pointer-coarse:after:min-h-11 pointer-coarse:after:min-w-11 focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background disabled:pointer-events-none disabled:opacity-64 data-loading:select-none data-loading:text-transparent sm:text-sm [&_svg:not([class*='opacity-'])]:opacity-80 [&_svg:not([class*='size-'])]:size-4.5 sm:[&_svg:not([class*='size-'])]:size-4 [&_svg]:pointer-events-none [&_svg]:-mx-0.5 [&_svg]:shrink-0",
		{
			defaultVariants: {
				size: 'default',
				variant: 'default'
			},
			variants: {
				/*
				 * Each size carries its own radius, at roughly a third of its height.
				 *
				 * The radius is keyed to the *rendered height*, not to the variant
				 * name — and every size steps down one notch at `sm`, so the radius
				 * steps there too. 24px takes `sm`, 28 takes `md`, 32 takes `lg`,
				 * 36 and 40 take `xl`, 44 takes `2xl`.
				 *
				 * Nothing below 44px goes past about 38%, and that cap is the point.
				 * At 44% the two corners very nearly meet — 16px either side of a
				 * 36px height leaves four pixels of straight edge — so the control
				 * stops reading as a rounded rectangle and becomes a stadium. It also
				 * turns any square of that height into a circle, which is why the
				 * square sizes briefly needed a rule of their own. Capping the ratio
				 * removes the need for one.
				 *
				 * Keying it to the variant instead leaves two buttons of identical
				 * height wearing different corners: `size="sm"` is 32px tall on a
				 * pointer, and so is `size="default"`, so one of them had to be
				 * wrong. Following the height is what makes the shape read as one
				 * family across the whole scale.
				 */
				size: {
					// Steps down with the control: 16px reads right on the 36px touch
					// height, but the same corner on the 32px pointer height is half
					// the button and starts to look like a pill.
					default: 'rounded-lg h-9 px-[calc(--spacing(3)-1px)] sm:h-8',
					icon: 'rounded-lg size-9 sm:size-8',
					'icon-lg': 'rounded-lg size-10 sm:size-9',
					'icon-sm': 'rounded-lg size-8 sm:size-7 sm:rounded-md',
					'icon-xl':
						"rounded-xl size-11 sm:size-10 sm:rounded-lg [&_svg:not([class*='size-'])]:size-5 sm:[&_svg:not([class*='size-'])]:size-4.5",
					'icon-xs':
						"rounded-md size-7 sm:size-6 sm:rounded-sm not-in-data-[slot=input-group]:[&_svg:not([class*='size-'])]:size-4 sm:not-in-data-[slot=input-group]:[&_svg:not([class*='size-'])]:size-3.5",
					lg: 'rounded-lg h-10 px-[calc(--spacing(3.5)-1px)] sm:h-9',
					sm: 'rounded-lg h-8 gap-1.5 px-[calc(--spacing(2.5)-1px)] sm:h-7 sm:rounded-md',
					xl: "rounded-2xl h-11 px-[calc(--spacing(4)-1px)] text-lg sm:h-10 sm:rounded-lg sm:text-base [&_svg:not([class*='size-'])]:size-5 sm:[&_svg:not([class*='size-'])]:size-4.5",
					xs: "h-7 gap-1 rounded-md px-[calc(--spacing(2)-1px)] text-sm sm:h-6 sm:rounded-sm sm:text-xs [&_svg:not([class*='size-'])]:size-4 sm:[&_svg:not([class*='size-'])]:size-3.5"
				},
				variant: {
					default:
						'not-disabled:inset-shadow-[0_1px_--theme(--color-white/14%)] border-primary bg-linear-to-b from-primary to-[color-mix(in_oklab,var(--color-primary),#000_7%)] text-primary-foreground shadow-[0_1px_2px_--theme(--color-black/8%)] hover:to-[color-mix(in_oklab,var(--color-primary),#000_2%)] hover:shadow-[0_2px_5px_--theme(--color-black/10%)] *:data-[slot=button-loading-indicator]:text-primary-foreground [:active,[data-pressed]]:inset-shadow-[0_1px_--theme(--color-black/10%)] [:active,[data-pressed]]:to-[color-mix(in_oklab,var(--color-primary),#000_11%)] [:disabled,:active,[data-pressed]]:shadow-none',
					destructive:
						'not-disabled:inset-shadow-[0_1px_--theme(--color-white/16%)] border-destructive-surface bg-linear-to-b from-destructive-surface to-[color-mix(in_oklab,var(--color-destructive-surface),#000_8%)] text-white shadow-[0_1px_2px_--theme(--color-black/8%)] hover:to-[color-mix(in_oklab,var(--color-destructive-surface),#000_2%)] hover:shadow-[0_2px_5px_--theme(--color-black/10%)] *:data-[slot=button-loading-indicator]:text-white [:active,[data-pressed]]:inset-shadow-[0_1px_--theme(--color-black/10%)] [:active,[data-pressed]]:to-[color-mix(in_oklab,var(--color-destructive-surface),#000_12%)] [:disabled,:active,[data-pressed]]:shadow-none',
					'destructive-outline':
						'border-input bg-popover not-dark:bg-clip-padding text-destructive-foreground hover:border-destructive/32 hover:bg-destructive/4 data-pressed:border-destructive/32 data-pressed:bg-destructive/4 *:data-[slot=button-loading-indicator]:text-foreground dark:bg-input/32',
					ghost:
						'border-transparent text-foreground hover:bg-accent data-pressed:bg-accent *:data-[slot=button-loading-indicator]:text-foreground',
					link: 'border-transparent text-foreground underline-offset-4 hover:underline data-pressed:underline *:data-[slot=button-loading-indicator]:text-foreground',
					outline:
						'border-input bg-popover not-dark:bg-clip-padding text-foreground hover:bg-accent/50 data-pressed:bg-accent/50 *:data-[slot=button-loading-indicator]:text-foreground dark:bg-input/32 dark:data-pressed:bg-input/64 dark:hover:bg-input/64',
					secondary:
						'border-transparent bg-secondary text-secondary-foreground hover:bg-[color-mix(in_oklab,var(--color-secondary),var(--color-foreground)_7%)] *:data-[slot=button-loading-indicator]:text-secondary-foreground [:active,[data-pressed]]:bg-[color-mix(in_oklab,var(--color-secondary),var(--color-foreground)_12%)]'
				}
			}
		}
	);

	export type ButtonVariant = NonNullable<VariantProps<typeof buttonVariants>['variant']>;
	export type ButtonSize = NonNullable<VariantProps<typeof buttonVariants>['size']>;

	// Anchor-only attributes are layered on top of the button ones, rather than
	// intersected, so shared members (onclick, class…) keep a single signature.
	export type ButtonProps = HTMLButtonAttributes &
		Omit<HTMLAnchorAttributes, keyof HTMLButtonAttributes> & {
			variant?: ButtonVariant;
			size?: ButtonSize;
			loading?: boolean;
			/** Renders an `<a>` instead of a `<button>`. */
			href?: string;
			ref?: HTMLElement | null;
			children?: Snippet;
		};
</script>

<script lang="ts">
	import { cn } from '$lib/utils';
	import { press } from '$lib/actions/press';
	import Spinner from './spinner.svelte';

	let {
		class: className,
		variant,
		size,
		href,
		type = 'button',
		loading = false,
		disabled,
		ref = $bindable(null),
		children,
		...rest
	}: ButtonProps = $props();

	const isDisabled = $derived(Boolean(loading || disabled));

	/*
	 * A busy button keeps its place in the tab order.
	 *
	 * Setting the native `disabled` attribute while loading blurred the very
	 * button that had just been pressed — the browser drops focus from a control
	 * that becomes disabled, so focus fell back to the document and the next Tab
	 * started from the top of the page. A disabled button is also skipped in
	 * browse mode, so the pending state was never read back.
	 *
	 * `aria-disabled` conveys the state without removing the element, and the
	 * click is stopped here rather than by the platform. `disabled` proper is
	 * reserved for when the author asks for it. The anchor branch already worked
	 * this way.
	 */
	const loadingGuard = $derived(
		loading
			? {
					onclick: (event: MouseEvent) => {
						event.preventDefault();
						event.stopPropagation();
					}
				}
			: {}
	);

	// Handlers are declared against HTMLButtonElement so the common case stays
	// well-typed; they are structurally identical on the anchor branch.
	const anchorRest = $derived(rest as HTMLAnchorAttributes);
</script>

{#snippet content()}
	{@render children?.()}
	{#if loading}
		<Spinner class="pointer-events-none absolute" data-slot="button-loading-indicator" />
	{/if}
{/snippet}

{#if href !== undefined}
	<a
		bind:this={ref}
		href={isDisabled ? undefined : href}
		class={cn(buttonVariants({ className, size, variant }))}
		data-slot="button"
		data-loading={loading ? '' : undefined}
		aria-disabled={isDisabled || undefined}
		role={isDisabled ? 'link' : undefined}
		tabindex={isDisabled ? -1 : undefined}
		use:press={{ disabled: isDisabled }}
		{...anchorRest}
	>
		{@render content()}
	</a>
{:else}
	<button
		bind:this={ref}
		{type}
		class={cn(buttonVariants({ className, size, variant }))}
		data-slot="button"
		data-loading={loading ? '' : undefined}
		aria-disabled={isDisabled || undefined}
		{...rest}
		{...loadingGuard}
		{disabled}
		use:press={{ disabled: isDisabled }}
	>
		{@render content()}
	</button>
{/if}
