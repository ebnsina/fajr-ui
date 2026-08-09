<script module lang="ts">
	import type { Snippet } from 'svelte';
	import type { AvatarRootProps } from './avatar-root.svelte';

	export type AvatarProps = AvatarRootProps & {
		src?: string;
		alt?: string;
		/** Shown while the image loads, or if it fails / is absent. */
		children?: Snippet;
	};
</script>

<script lang="ts">
	import AvatarRoot from './avatar-root.svelte';
	import AvatarImage from './avatar-image.svelte';
	import AvatarFallback from './avatar-fallback.svelte';

	let { src, alt = '', label, children, ...rest }: AvatarProps = $props();

	/*
	 * An `alt` names the person, so it should keep naming them when the image is
	 * gone. The image element is removed on error, taking its `alt` with it and
	 * leaving only the initials — so the same avatar announced one thing while
	 * loading and nothing afterwards. Promoting it to the root fixes that; an
	 * empty `alt` still means decorative and names nothing.
	 */
	const name = $derived(label ?? (alt || undefined));
</script>

<!-- The common case. Reach for the parts when the fallback needs its own markup. -->
<AvatarRoot label={name} {...rest}>
	<AvatarImage {src} {alt} />
	<AvatarFallback>{@render children?.()}</AvatarFallback>
</AvatarRoot>
