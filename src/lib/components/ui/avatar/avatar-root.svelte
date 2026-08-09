<script module lang="ts">
	import type { HTMLAttributes } from 'svelte/elements';
	import type { Snippet } from 'svelte';

	export type AvatarRootProps = HTMLAttributes<HTMLSpanElement> & {
		/**
		 * Who this represents. Give it whenever the avatar is not accompanied by
		 * the same name in text — it becomes the accessible name and, unlike the
		 * image's `alt`, it survives the image failing to load.
		 */
		label?: string;
		children?: Snippet;
	};
</script>

<script lang="ts">
	import { cn } from '$lib/utils';
	import { AvatarState, setAvatarContext } from './context.svelte';

	let { class: className, label, children, ...rest }: AvatarRootProps = $props();

	setAvatarContext(new AvatarState());
</script>

<span
	role={label ? 'img' : undefined}
	aria-label={label}
	data-slot="avatar"
	class={cn(
		'inline-flex size-8 shrink-0 items-center justify-center overflow-hidden rounded-full bg-background align-middle text-xs font-medium select-none',
		className
	)}
	{...rest}
>
	{@render children?.()}
</span>
