<script lang="ts">
	import type { ComponentProps } from 'svelte';
	import { cn } from '$lib/utils';
	import { Icon, SpinnerIcon } from '$lib/icons';

	let { class: className, ...rest }: Omit<ComponentProps<typeof Icon>, 'icon'> = $props();
</script>

<Icon
	icon={SpinnerIcon}
	aria-label="Loading"
	role="status"
	class={cn('animate-spin motion-reduce:animate-[spin_2s_linear_infinite]', className)}
	{...rest}
/>
