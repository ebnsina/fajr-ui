<script module lang="ts">
	import { cva, type VariantProps } from 'class-variance-authority';
	import type { HTMLAnchorAttributes, HTMLButtonAttributes } from 'svelte/elements';
	import type { Snippet } from 'svelte';

	/*
	 * Every variant is flat. No gradient, no faked inner hairline, no drop
	 * shadow — a button is a filled rectangle with a label on it.
	 *
	 * The filled variants carried a gloss for a while and it was removed in
	 * stages: outline first, then secondary, then these. Each removal was asked
	 * for on its own and the reasoning turned out to be the same one every time,
	 * so it is worth writing down once. Gloss is emphasis, and a set where every
	 * button is emphasised has no emphasis in it. What separates `default` from
	 * `secondary` from `ghost` is which fill they carry, and a raised treatment
	 * on all three only blurs that.
	 *
	 * The states are the fill, mixed:
	 *
	 * `default` and `secondary` mix toward `--color-foreground`. That direction
	 * is chosen for contrast, not for looks — the label is the inverse token, so
	 * moving the fill toward the foreground can only hold or widen the gap
	 * against it, in either theme. Mixing toward the background would close it
	 * in both.
	 *
	 * `destructive` mixes toward black instead, and cannot be allowed to
	 * lighten. Its label is white, its lightest pixel is where that contrast is
	 * worst, and the lighter red measured 4.48:1 — under the floor — which is
	 * why `--destructive-surface` exists at all. Darkening is the only safe
	 * direction there, and it applies to any accent added later too.
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
						'border-transparent bg-primary text-primary-foreground hover:bg-[color-mix(in_oklab,var(--color-primary),var(--color-foreground)_10%)] *:data-[slot=button-loading-indicator]:text-primary-foreground [:active,[data-pressed]]:bg-[color-mix(in_oklab,var(--color-primary),var(--color-foreground)_16%)]',
					destructive:
						'border-transparent bg-destructive-surface text-white hover:bg-[color-mix(in_oklab,var(--color-destructive-surface),#000_8%)] *:data-[slot=button-loading-indicator]:text-white [:active,[data-pressed]]:bg-[color-mix(in_oklab,var(--color-destructive-surface),#000_14%)]',
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
