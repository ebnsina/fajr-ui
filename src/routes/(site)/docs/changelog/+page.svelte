<script lang="ts">
	import { Badge } from '$lib/components/ui';
	import DocsPage from '$lib/components/site/docs-page.svelte';
	import SiteFooter from '$lib/components/site/site-footer.svelte';
	import { CHANGE_KIND_LABEL, releases, type ChangeKind } from '$lib/data/changelog';

	const toc = releases.map((release) => ({
		title: release.version,
		id: `v${release.version.replaceAll('.', '-')}`
	}));

	const KIND_VARIANT: Record<ChangeKind, 'success' | 'info' | 'warning' | 'error'> = {
		added: 'success',
		changed: 'info',
		fixed: 'warning',
		removed: 'error'
	};

	const dateFormat = new Intl.DateTimeFormat('en-GB', {
		day: 'numeric',
		month: 'long',
		year: 'numeric'
	});
</script>

<DocsPage title="Changelog" description="Everything that has changed, newest first." {toc}>
	{#each releases as release, index (release.version)}
		<h2 id="v{release.version.replaceAll('.', '-')}">
			{release.version}
			{#if index === 0}<Badge variant="info" class="ms-2 align-middle">Latest</Badge>{/if}
		</h2>
		<p class="text-sm text-muted-foreground">
			<time datetime={release.date}>{dateFormat.format(new Date(release.date))}</time>
			{#if release.summary}— {release.summary}{/if}
		</p>

		{#each release.changes as group (group.kind)}
			<h3 class="not-prose mt-6 mb-2 flex items-center gap-2">
				<Badge variant={KIND_VARIANT[group.kind]}>{CHANGE_KIND_LABEL[group.kind]}</Badge>
			</h3>
			<ul>
				{#each group.entries as entry (typeof entry === 'string' ? entry : entry.lead)}
					<li>
						{#if typeof entry === 'string'}
							{entry}
						{:else}
							<strong class="font-medium text-foreground">{entry.lead}</strong>
							{entry.text}
						{/if}
					</li>
				{/each}
			</ul>
		{/each}
	{/each}
</DocsPage>

<SiteFooter />
