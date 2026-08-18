<script lang="ts">
	import { Button, Command, Kbd, type CommandGroupData } from '$lib/components/ui';
	import { ManuscriptIcon, OverviewIcon } from '$lib/icons';

	let open = $state(false);

	const groups: CommandGroupData[] = [
		{
			heading: 'Manuscripts',
			items: [
				{
					id: 'canon',
					label: 'The Canon of Medicine',
					keywords: 'ibn sina bukhara medicine',
					icon: ManuscriptIcon
				},
				{
					id: 'optics',
					label: 'The Book of Optics',
					keywords: 'ibn al-haytham basra light',
					icon: ManuscriptIcon
				},
				{
					id: 'compendious',
					label: 'The Compendious Book',
					keywords: 'al-khwarizmi algebra baghdad',
					icon: ManuscriptIcon
				},
				{
					id: 'zij',
					label: 'Zij-i Ilkhani',
					keywords: 'al-tusi maragheh tables',
					icon: ManuscriptIcon
				}
			]
		},
		{
			heading: 'Actions',
			items: [
				{ id: 'acquire', label: 'Record an acquisition', icon: OverviewIcon },
				{ id: 'copy', label: 'Start a copy', icon: OverviewIcon },
				{ id: 'bindery', label: 'Send to the bindery', icon: OverviewIcon },
				{ id: 'shelf', label: 'Refile on the shelf', icon: OverviewIcon }
			]
		}
	];
</script>

<Button variant="outline" onclick={() => (open = true)}>
	Search the archive <Kbd class="ms-2">⌘K</Kbd>
</Button>

<Command bind:open {groups} placeholder="Search manuscripts and actions…">
	{#snippet footer()}
		<span class="flex items-center gap-1.5">Open <Kbd>⏎</Kbd></span>
	{/snippet}
</Command>
