<script lang="ts">
	import { Badge, Button } from '$lib/components/ui';
	import { ArrowRightIcon, Icon } from '$lib/icons';
	import CodeBlock from '$lib/components/site/code-block.svelte';
	import DocsPage from '$lib/components/site/docs-page.svelte';
	import SiteFooter from '$lib/components/site/site-footer.svelte';

	const toc = [
		{ title: 'Demo', id: 'demo' },
		{ title: 'Anatomy', id: 'anatomy' },
		{ title: 'Features', id: 'features' },
		{ title: 'Layouts', id: 'layouts' },
		{ title: 'The sidebar', id: 'sidebar' },
		{ title: 'Responsiveness', id: 'responsiveness' },
		{ title: 'What it is built from', id: 'built-from' }
	];

	const parts = [
		['Sidebar', 'Branding, the navigation tree, and the account row pinned to the bottom.'],
		['Rail', 'A thin strip along the sidebar edge that collapses and expands it.'],
		['Header', 'The trigger, the current page name, search, and the theme controls.'],
		['Stat cards', 'Four figures with their change against the previous period.'],
		['Work queue', 'The rows currently in progress, each with a status badge.'],
		[
			'Chart panel',
			'A bar series with its own scale, a tooltip, and the week summarised beneath it.'
		]
	];

	const features = [
		['Two layouts', 'Inset or full width, one prop apart, chosen from the header.'],
		[
			'Layout persistence',
			'The choice is a cookie read on the server, so the first paint matches.'
		],
		['Collapsible sidebar', 'A rail collapses it to icons; the keyboard shortcut does the same.'],
		['Mobile fallback', 'On a narrow screen the sidebar becomes a sheet rather than shrinking.'],
		['Nested navigation', 'A section expands in place instead of navigating to find its children.'],
		['Stat cards', 'Four figures, each with its change against the previous period.'],
		['Work queue', 'Rows in progress with a status badge, readable at a glance.'],
		['A real chart', 'Every day named, values on a scale, and a tooltip — not seven sized divs.'],
		['Responsive grid', 'One, two or four columns, with children that cannot overflow the page.'],
		['Theme controls', 'Light and dark, and the accent, switchable from the header.']
	];

	const built = ['Sidebar', 'Card', 'Chart', 'Badge', 'Avatar', 'Separator', 'Input', 'Button'];
</script>

<DocsPage
	title="Dashboard"
	description="An application shell: collapsible sidebar, stat cards and a work queue."
	{toc}
>
	<p>
		The shape most internal tools take. It is here because the sidebar is the one component that
		owns a whole page rather than a corner of it — its state, its collapse behaviour and its mobile
		fallback only make sense in a real layout.
	</p>

	<h2 id="demo">Demo</h2>
	<p>It takes the whole viewport, so it opens on its own.</p>
	<div class="not-prose flex flex-wrap gap-2">
		<Button href="/examples/dashboard/app?layout=inset">
			Inset layout<Icon icon={ArrowRightIcon} />
		</Button>
		<Button href="/examples/dashboard/app?layout=sidebar" variant="outline">
			Full-width layout<Icon icon={ArrowRightIcon} />
		</Button>
	</div>

	<h2 id="anatomy">Anatomy</h2>
	<div class="not-prose overflow-hidden rounded-xl border bg-card text-xs">
		<div class="flex min-h-56">
			<div class="flex w-36 shrink-0 flex-col gap-2 border-e bg-muted/32 p-3">
				<span class="font-medium">Sidebar</span>
				<span
					class="rounded-md border border-dashed px-2 py-1.5 text-center text-muted-foreground/64"
				>
					Brand
				</span>
				<span
					class="rounded-md border border-dashed px-2 py-4 text-center text-muted-foreground/64"
				>
					Navigation
				</span>
				<span
					class="mt-auto rounded-md border border-dashed px-2 py-1.5 text-center text-muted-foreground/64"
				>
					Account
				</span>
			</div>

			<div class="flex min-w-0 flex-1 flex-col">
				<div class="flex items-center gap-2 border-b px-3 py-2">
					<span class="font-medium text-muted-foreground">Header</span>
					<span class="ms-auto h-4 w-24 rounded-sm bg-muted"></span>
				</div>
				<div class="flex flex-1 flex-col gap-2 p-3">
					<!-- Flex rather than a grid: the diagram only needs proportions. -->
					<div class="flex gap-2">
						{#each Array.from({ length: 4 }, (_, i) => i) as card (card)}
							<span class="h-10 flex-1 rounded-md border bg-muted/32"></span>
						{/each}
					</div>
					<!-- Explicit widths: the diagram only needs the proportion, and a
					     percentage cannot collapse the way a flex basis can. -->
					<div class="flex h-24 gap-2">
						<span class="w-[64%] rounded-md border bg-muted/32"></span>
						<span class="w-[34%] rounded-md border bg-muted/32"></span>
					</div>
				</div>
			</div>
		</div>
	</div>

	<div class="not-prose overflow-x-auto rounded-xl border">
		<table class="w-full min-w-[34rem] border-collapse text-left text-sm">
			<thead class="bg-muted/48">
				<tr>
					<th scope="col" class="px-4 py-2.5 font-medium">Region</th>
					<th scope="col" class="px-4 py-2.5 font-medium">Job</th>
				</tr>
			</thead>
			<tbody>
				{#each parts as [name, job] (name)}
					<tr class="border-t">
						<td class="px-4 py-2.5 align-top font-medium">{name}</td>
						<td class="px-4 py-2.5 align-top text-muted-foreground">{job}</td>
					</tr>
				{/each}
			</tbody>
		</table>
	</div>

	<h2 id="features">Features</h2>
	<div class="not-prose overflow-x-auto rounded-xl border">
		<table class="w-full min-w-[34rem] border-collapse text-left text-sm">
			<thead class="bg-muted/48">
				<tr>
					<th scope="col" class="px-4 py-2.5 font-medium">Feature</th>
					<th scope="col" class="px-4 py-2.5 font-medium">What it does</th>
				</tr>
			</thead>
			<tbody>
				{#each features as [name, detail] (name)}
					<tr class="border-t">
						<td class="px-4 py-2.5 align-top font-medium">{name}</td>
						<td class="px-4 py-2.5 align-top text-muted-foreground">{detail}</td>
					</tr>
				{/each}
			</tbody>
		</table>
	</div>

	<h2 id="layouts">Layouts</h2>
	<p>
		The same screen in two arrangements. <strong>Inset</strong> floats the content as a rounded card
		on the sidebar's ground, which suits a roomy display. <strong>Full width</strong> runs the content
		to the sidebar edge, which suits a dense one. It is one prop.
	</p>
	<CodeBlock code="<Sidebar variant=&quot;inset&quot; />" language="svelte" />
	<p>
		The choice is stored in a cookie and read on the server, so the first paint already matches — a
		layout that flips after hydration is worse than not offering the choice.
	</p>

	<h2 id="sidebar">The sidebar</h2>
	<p>
		Collapsed and expanded states, the keyboard shortcut, the rail and the mobile fallback all come
		from the component. On a narrow screen it becomes a sheet rather than shrinking, because a
		56-pixel icon rail on a phone is neither navigation nor content.
	</p>
	<CodeBlock
		code={`<SidebarProvider>
  <AppSidebar variant={layout} />
  <SidebarInset>
    <header>…</header>
    <main>…</main>
  </SidebarInset>
</SidebarProvider>`}
		language="svelte"
	/>

	<h2 id="responsiveness">Responsiveness</h2>
	<p>
		The stat row is one column on a phone, two on a tablet and four on a desktop; the queue and the
		chart stack below it until there is room to sit side by side. Grid children carry
		<code>min-w-0</code> so a long title cannot push the page wider than the screen — the default
		<code>min-width: auto</code> on a grid item refuses to shrink below its content, which is the usual
		cause of a dashboard that scrolls sideways on a phone.
	</p>

	<h2 id="built-from">What it is built from</h2>
	<div class="not-prose flex flex-wrap gap-1.5">
		{#each built as component (component)}
			<Badge variant="outline" href="/docs/components/{component.toLowerCase()}">{component}</Badge>
		{/each}
	</div>
	<div class="not-prose pt-2 pb-2">
		<Button href="/examples/dashboard/app" variant="outline">
			Open the dashboard<Icon icon={ArrowRightIcon} />
		</Button>
	</div>
</DocsPage>

<SiteFooter />
