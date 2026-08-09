<script lang="ts">
	import { Button } from '$lib/components/ui';
	import {
		DASHBOARD_LAYOUT_COOKIE,
		DASHBOARD_LAYOUT_MAX_AGE,
		type DashboardLayout
	} from '$lib/data/dashboard-layout';
	import { Icon, LayoutFullIcon, LayoutInsetIcon } from '$lib/icons';

	let { layout = $bindable() }: { layout: DashboardLayout } = $props();

	const next = $derived<DashboardLayout>(layout === 'inset' ? 'sidebar' : 'inset');
	const label = $derived(
		next === 'inset' ? 'Switch to inset layout' : 'Switch to full-width layout'
	);

	function toggle() {
		layout = next;
		document.cookie = `${DASHBOARD_LAYOUT_COOKIE}=${layout}; path=/; max-age=${DASHBOARD_LAYOUT_MAX_AGE}`;
	}
</script>

<Button size="icon" variant="ghost" aria-label={label} title={label} onclick={toggle}>
	<Icon icon={layout === 'inset' ? LayoutFullIcon : LayoutInsetIcon} />
</Button>
