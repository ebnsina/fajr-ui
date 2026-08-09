<script module lang="ts">
	import type { HTMLAttributes } from 'svelte/elements';
	import type { Snippet } from 'svelte';

	export type AvatarFallbackProps = HTMLAttributes<HTMLSpanElement> & { children?: Snippet };
</script>

<script lang="ts">
	import { cn } from '$lib/utils';
	import { useAvatar } from './context.svelte';

	let { class: className, children, ...rest }: AvatarFallbackProps = $props();

	const avatar = useAvatar();
</script>

<!--
	Hidden from assistive technology. Initials are a picture of a name, not the
	name: beside the person's own label they were read out as loose letters —
	"H A, Hunayn ibn Ishaq" on every row. A name for the avatar belongs on the
	root, where it survives the image loading, failing, or never being given.
-->
{#if avatar.status !== 'loaded'}
	<span
		aria-hidden="true"
		data-slot="avatar-fallback"
		class={cn('flex size-full items-center justify-center rounded-full bg-muted', className)}
		{...rest}
	>
		{@render children?.()}
	</span>
{/if}
