<script module lang="ts">
	import { cva, type VariantProps } from 'class-variance-authority';
	import type { HTMLAttributes } from 'svelte/elements';
	import type { Snippet } from 'svelte';

	export const alertVariants = cva(
		'relative grid w-full grid-cols-[0_1fr] items-start gap-x-2 gap-y-0.5 rounded-xl border px-3.5 py-3 text-card-foreground text-sm has-[>svg]:grid-cols-[calc(--spacing(4))_1fr] has-data-[slot=alert-action]:grid-cols-[1fr_auto] has-[>svg]:has-data-[slot=alert-action]:grid-cols-[calc(--spacing(4))_1fr_auto] [&>svg]:h-lh [&>svg]:w-4 [&>svg]:shrink-0',
		{
			defaultVariants: { variant: 'default' },
			variants: {
				variant: {
					default: 'bg-transparent [&>svg]:text-muted-foreground dark:bg-input/32',
					error: 'border-destructive/32 bg-destructive/4 [&>svg]:text-destructive',
					info: 'border-info/32 bg-info/4 [&>svg]:text-info',
					success: 'border-success/32 bg-success/4 [&>svg]:text-success',
					warning: 'border-warning/32 bg-warning/4 [&>svg]:text-warning'
				}
			}
		}
	);

	export type AlertVariant = NonNullable<VariantProps<typeof alertVariants>['variant']>;

	export type AlertProps = HTMLAttributes<HTMLDivElement> & {
		variant?: AlertVariant;
		/**
		 * `true` uses the icon matching the variant, `false` shows none, or pass a
		 * specific icon. The default variant has no icon, since there is no state
		 * to signal.
		 */
		icon?: boolean | IconSvgElement;
		children?: Snippet;
	};
</script>

<script lang="ts">
	import type { IconSvgElement } from '@hugeicons/svelte';
	import { cn } from '$lib/utils';
	import { ErrorIcon, Icon, InfoIcon, SuccessIcon, WarningIcon } from '$lib/icons';

	let { class: className, variant, icon = true, children, ...rest }: AlertProps = $props();

	// An icon repeats the tone in a second channel, so the message does not rely
	// on colour alone to say what kind it is.
	const VARIANT_ICON = {
		info: InfoIcon,
		success: SuccessIcon,
		warning: WarningIcon,
		error: ErrorIcon
	} as const;

	const resolvedIcon = $derived.by(() => {
		if (icon === false) return undefined;
		if (icon !== true) return icon;
		return variant && variant !== 'default' ? VARIANT_ICON[variant] : undefined;
	});
</script>

<!--
	`status` rather than `alert`: these render with the page rather than
	interrupting it, so they should not preempt whatever a screen reader is saying.
-->
<div role="status" data-slot="alert" class={cn(alertVariants({ className, variant }))} {...rest}>
	{#if resolvedIcon}
		<Icon icon={resolvedIcon} aria-hidden="true" />
	{/if}
	{@render children?.()}
</div>
