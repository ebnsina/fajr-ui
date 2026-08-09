<script module lang="ts">
	import type { HTMLImgAttributes } from 'svelte/elements';

	export type AvatarImageProps = HTMLImgAttributes;
</script>

<script lang="ts">
	import { cn } from '$lib/utils';
	import { useAvatar } from './context.svelte';

	let { class: className, src, alt = '', ...rest }: AvatarImageProps = $props();

	const avatar = useAvatar();

	// A changed source is a new load, so the fallback shows again rather than
	// leaving the previous person's photo up while the next one downloads.
	$effect(() => {
		void src;
		avatar.reset();
	});
</script>

<!--
	Kept mounted but hidden until it loads: an <img> that never fires `load`
	because it 404s is exactly the case the fallback exists for.
-->
{#if src && avatar.status !== 'error'}
	<img
		{src}
		{alt}
		data-slot="avatar-image"
		class={cn('size-full object-cover', avatar.status !== 'loaded' && 'hidden', className)}
		onload={() => (avatar.status = 'loaded')}
		onerror={() => (avatar.status = 'error')}
		{...rest}
	/>
{/if}
