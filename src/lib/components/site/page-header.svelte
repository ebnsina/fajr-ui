<script lang="ts">
	import type { HTMLAttributes } from 'svelte/elements';
	import type { Snippet } from 'svelte';

	let {
		class: className,
		children,
		...rest
	}: HTMLAttributes<HTMLElement> & { children?: Snippet } = $props();
</script>

<section class={className} {...rest}>
	<div
		class="container flex flex-col items-center gap-2 px-0 py-8 text-center md:py-12 lg:py-16 xl:gap-4"
	>
		{@render children?.()}
	</div>
</section>
