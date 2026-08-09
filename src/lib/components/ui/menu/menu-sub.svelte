<script module lang="ts">
	import type { Snippet } from 'svelte';

	export type MenuSubProps = {
		open?: boolean;
		children?: Snippet;
	};
</script>

<script lang="ts">
	import { MenuSubState, setMenuSubContext } from './sub-context.svelte';

	const baseId = $props.id();

	let { open = $bindable(false), children }: MenuSubProps = $props();

	setMenuSubContext(
		new MenuSubState({
			baseId,
			open: () => open,
			setOpen: (next) => (open = next)
		})
	);
</script>

{@render children?.()}
