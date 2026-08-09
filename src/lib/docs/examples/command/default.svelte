<script lang="ts">
	import { Button, Command, Kbd, type CommandGroupData } from '$lib/components/ui';
	import { ManuscriptIcon, OverviewIcon } from '$lib/icons';

	let open = $state(false);

	const groups: CommandGroupData[] = [
		{
			heading: 'Pages',
			items: [
				{ id: 'docs', label: 'Docs', keywords: 'documentation guide', icon: ManuscriptIcon },
				{ id: 'dashboard', label: 'Dashboard', keywords: 'example app', icon: OverviewIcon }
			]
		},
		{
			heading: 'Overview',
			items: [
				{ id: 'introduction', label: 'Introduction', icon: ManuscriptIcon },
				{ id: 'get-started', label: 'Get Started', icon: ManuscriptIcon },
				{ id: 'styling', label: 'Styling', icon: ManuscriptIcon },
				{ id: 'changelog', label: 'Changelog', icon: ManuscriptIcon },
				{ id: 'roadmap', label: 'Roadmap', icon: ManuscriptIcon }
			]
		}
	];
</script>

<Button variant="outline" onclick={() => (open = true)}>
	Open palette <Kbd class="ms-2">⌘K</Kbd>
</Button>

<Command bind:open {groups} placeholder="Search documentation…">
	{#snippet footer()}
		<span class="flex items-center gap-1.5">Go to page <Kbd>⏎</Kbd></span>
	{/snippet}
</Command>
