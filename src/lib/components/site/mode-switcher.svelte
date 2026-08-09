<script lang="ts">
	import { Button } from '$lib/components/ui';
	import { Icon, MoonIcon, SunIcon } from '$lib/icons';
	import { mode } from '$lib/mode.svelte';
</script>

<Button
	size="icon"
	variant="ghost"
	aria-label="Toggle theme"
	title="Toggle theme"
	onclick={() => mode.toggle()}
>
	<Icon icon={SunIcon} class="hidden dark:block" />
	<Icon icon={MoonIcon} class="block dark:hidden" />
</Button>
