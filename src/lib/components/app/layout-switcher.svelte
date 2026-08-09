<script lang="ts">
	import { Button } from '$lib/components/ui';
	import type { DashboardLayout } from '$lib/data/dashboard-layout';
	import { Icon, LayoutFullIcon, LayoutInsetIcon } from '$lib/icons';

	let { layout = $bindable() }: { layout: DashboardLayout } = $props();

	const next = $derived<DashboardLayout>(layout === 'inset' ? 'sidebar' : 'inset');
	const label = $derived(
		next === 'inset' ? 'Switch to inset layout' : 'Switch to full-width layout'
	);

	/*
	 * The choice lasts for the visit and is not persisted.
	 *
	 * It used to be stored in a cookie and read back on the server so the first
	 * paint was already right. The site is prerendered now, so there is no
	 * server to read it — restoring a saved choice could only happen after
	 * hydration, which means watching the layout jump. A `?layout=` link still
	 * pins either variant, so both remain directly shareable.
	 */
	function toggle() {
		layout = next;
	}
</script>

<Button size="icon" variant="ghost" aria-label={label} title={label} onclick={toggle}>
	<Icon icon={layout === 'inset' ? LayoutFullIcon : LayoutInsetIcon} />
</Button>
