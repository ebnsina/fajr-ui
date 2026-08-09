<script lang="ts">
	import { Badge, Button, Tabs, TabsList, TabsPanel, TabsTrigger } from '$lib/components/ui';
	import CodeBlock from '$lib/components/site/code-block.svelte';
	import DocsExample from '$lib/components/site/docs-example.svelte';
	import { exampleSource } from '$lib/docs/examples';
	import DocsPage from '$lib/components/site/docs-page.svelte';
	import PreviewTabs from '$lib/components/site/preview-tabs.svelte';
	import PropsTable from '$lib/components/site/props-table.svelte';
	import SiteFooter from '$lib/components/site/site-footer.svelte';
	import { getDoc } from '$lib/docs/registry';
	import { PINNED, pinned } from '$lib/registry/versions';
	import PackageManagerTabs from '$lib/components/site/package-manager-tabs.svelte';
	import { addCommand, execCommand, packageManager } from '$lib/package-manager.svelte';
	import { ArrowRightIcon, Icon } from '$lib/icons';
	import type { PageProps } from './$types';

	let { data }: PageProps = $props();

	const component = $derived(data.component);
	const doc = $derived(getDoc(component.slug));

	// Keyed to the slug so moving between components starts on the CLI tab again
	// rather than keeping whichever one the previous page was left on.
	const installTab = $derived(component.slug && 'cli');

	const BASE_DEPENDENCIES = ['clsx', 'tailwind-merge', 'class-variance-authority'];

	// Third-party packages are added to the install line rather than left for the
	// reader to discover from an import error.
	const installCommand = $derived(
		// Exact versions, not names: several of these are pre-1.0, where a minor
		// bump may break the API. `pinned` reads the same table the registry hands
		// to the CLI, so this line installs what the component was built against.
		addCommand(
			[...BASE_DEPENDENCIES, ...(doc?.dependencies ?? []).map((entry) => entry.name)].map(pinned),
			packageManager.current
		)
	);

	// Slug → the file(s) to copy. Directory components ship as a folder.
	const DIRECTORY_COMPONENTS = new Set([
		'accordion',
		'breadcrumb',
		'card',
		'chart',
		'tooltip',
		'checkbox-group',
		'collapsible',
		'dialog',
		'empty',
		'field',
		'fieldset',
		'frame',
		'menu',
		'radio-group',
		'select',
		'sidebar',
		'table',
		'tabs',
		'toast'
	]);
	const sourcePath = $derived(
		DIRECTORY_COMPONENTS.has(component.slug)
			? `src/lib/components/ui/${component.slug}/`
			: `src/lib/components/ui/${component.slug}.svelte`
	);

	const toc = $derived.by(() => {
		if (!component.built || !doc) return [];
		const entries = [{ title: 'Installation', id: 'installation' }];
		if (doc.dependencies?.length) {
			entries.push({ title: 'Dependencies', id: 'dependencies' });
		}
		entries.push({ title: 'Usage', id: 'usage' });
		if (doc.api?.length) entries.push({ title: 'API Reference', id: 'api-reference' });
		if (doc.notes?.length) entries.push({ title: 'Notes', id: 'notes' });
		for (const example of doc.examples ?? []) {
			entries.push({ title: example.title, id: `example-${example.id}` });
		}
		return entries;
	});
</script>

<DocsPage title={component.name} description={component.description} {toc}>
	{#if !component.built}
		<div class="not-prose flex flex-col items-start gap-4 rounded-xl border border-dashed p-8">
			<Badge variant="secondary">Not built yet</Badge>
			<p class="text-sm text-muted-foreground">
				<strong class="text-foreground">{component.name}</strong> is on the roadmap but has not been built
				yet. Components are added in dependency order — primitives first, then the pieces that compose
				them.
			</p>
			<Button href="/docs" variant="outline" size="sm">
				Back to the introduction<Icon icon={ArrowRightIcon} />
			</Button>
		</div>
	{:else if doc}
		{#if doc.hero}
			<!-- The example's own file is what is rendered and what is shown. -->
			<PreviewTabs
				code={exampleSource(component.slug, doc.hero.id) ?? ''}
				minHeight={doc.hero.minHeight ?? '14rem'}
			>
				<DocsExample slug={component.slug} id={doc.hero.id} />
			</PreviewTabs>
		{/if}

		<h2 id="installation">Installation</h2>
		<p>
			Components are copied into your project rather than installed, so you own the file and can
			edit it directly. Either route produces the same files.
		</p>
		<div class="not-prose">
			<Tabs value={installTab}>
				<TabsList>
					<TabsTrigger value="cli">CLI</TabsTrigger>
					<TabsTrigger value="manual">Manual</TabsTrigger>
				</TabsList>

				<TabsPanel value="cli" class="flex flex-col gap-3 pt-4">
					<PackageManagerTabs class="self-start" />
					<CodeBlock
						code={execCommand(`fajr-ui add ${component.slug}`, packageManager.current)}
						language="bash"
						title="Terminal"
					/>
					<p class="text-sm text-muted-foreground">
						Copies this component and everything it composes, installs the packages it needs at the
						versions it was built against, and records what it wrote — so
						<code class="font-mono">npx fajr-ui update</code> can bring later changes in without touching
						lines you have edited.
					</p>
				</TabsPanel>

				<TabsPanel value="manual" class="flex flex-col gap-3 pt-4">
					<PackageManagerTabs class="self-start" />
					<p class="text-sm text-muted-foreground">Install the shared utilities once:</p>
					<CodeBlock code={installCommand} language="bash" title="Terminal" />
					<p class="text-sm text-muted-foreground">Then copy the source into your project:</p>
					<CodeBlock code={sourcePath} language="bash" title="Copy from" />
				</TabsPanel>
			</Tabs>
		</div>

		{#if doc.dependencies?.length}
			<h2 id="dependencies">Dependencies</h2>
			<p>
				Most components in this library depend on nothing beyond the shared utilities. This one is
				an exception, so here is exactly what it pulls in, the version it was built against, and
				where to read the upstream API. The install line above pins these versions rather than
				taking whatever is latest — some of them are pre-1.0 and still change shape between minor
				releases.
			</p>
			<div class="not-prose overflow-x-auto rounded-xl border">
				<table class="w-full text-sm">
					<thead class="border-b bg-muted/48">
						<tr>
							<th class="px-4 py-2.5 text-left font-medium text-muted-foreground">Package</th>
							<th class="px-4 py-2.5 text-left font-medium text-muted-foreground">Version</th>
							<th class="px-4 py-2.5 text-left font-medium text-muted-foreground">Why</th>
							<th class="px-4 py-2.5 text-left font-medium text-muted-foreground">Reference</th>
						</tr>
					</thead>
					<tbody>
						{#each doc.dependencies as dependency (dependency.name)}
							<tr class="border-b align-top last:border-0">
								<td class="px-4 py-3 font-mono text-xs">{dependency.name}</td>
								<td class="px-4 py-3 font-mono text-xs tabular-nums">
									{PINNED[dependency.name] ?? '—'}
								</td>
								<td class="px-4 py-3 text-muted-foreground">{dependency.purpose}</td>
								<td class="px-4 py-3">
									<a
										class="underline underline-offset-4"
										href={dependency.docs}
										target="_blank"
										rel="noreferrer noopener"
									>
										API reference
									</a>
								</td>
							</tr>
						{/each}
					</tbody>
				</table>
			</div>
		{/if}

		<h2 id="usage">Usage</h2>
		<CodeBlock
			code={doc.usage ?? (doc.hero ? (exampleSource(component.slug, doc.hero.id) ?? '') : '')}
		/>

		{#if doc.api?.length}
			<h2 id="api-reference">API Reference</h2>
			<div class="not-prose flex flex-col gap-6">
				{#each doc.api as section, index (index)}
					<PropsTable title={section.title} rows={section.rows} />
				{/each}
			</div>
		{/if}

		{#if doc.notes?.length}
			<h2 id="notes">Notes</h2>
			<ul>
				{#each doc.notes as note (note)}
					<li>{note}</li>
				{/each}
			</ul>
		{/if}

		{#each doc.examples ?? [] as example (example.id)}
			<h2 id="example-{example.id}">{example.title}</h2>
			{#if example.description}
				<p>{example.description}</p>
			{/if}
			<PreviewTabs
				code={exampleSource(component.slug, example.id) ?? ''}
				minHeight={example.minHeight}
			>
				<DocsExample slug={component.slug} id={example.id} />
			</PreviewTabs>
		{/each}
	{:else}
		<p class="text-muted-foreground">Documentation for this component is still being written.</p>
	{/if}
</DocsPage>

<SiteFooter />
