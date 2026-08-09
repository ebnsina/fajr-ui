<script lang="ts">
	import { base } from '$app/paths';
	import { Button } from '$lib/components/ui';
	import { ArrowRightIcon, Icon } from '$lib/icons';
	import CodeBlock from '$lib/components/site/code-block.svelte';
	import { execCommand, packageManager } from '$lib/package-manager.svelte';
	import DocsPage from '$lib/components/site/docs-page.svelte';
	import SiteFooter from '$lib/components/site/site-footer.svelte';
	import { builtComponents, components } from '$lib/data/components';

	const toc = [
		{ title: 'How it works', id: 'how-it-works' },
		{ title: 'Getting a component', id: 'getting-a-component' },
		{ title: 'Hand-rolled, ARIA first', id: 'aria-first' },
		{ title: 'Idiomatic Svelte', id: 'idiomatic-svelte' },
		{ title: 'Theming', id: 'theming' },
		{ title: 'Where to go next', id: 'next' }
	];

	const next = [
		[
			'Get started',
			'Install the dependencies and add your first component.',
			`${base}/docs/get-started`
		],
		[
			'The CLI',
			'Add components, see what changed upstream, and update without losing your edits.',
			`${base}/docs/cli`
		],
		['Theming', 'Light, dark and three accents, from one token file.', `${base}/docs/theming`],
		[
			'Examples',
			'Complete screens — a dashboard, a calendar and a marketing page.',
			`${base}/examples`
		]
	];
</script>

<DocsPage
	title="Introduction"
	description="Accessible components you copy into your project and own outright — no runtime, no lock-in."
	{toc}
>
	<p>
		Fajr UI is a set of {components.length} components for Svelte that you own. Every component is plain
		Svelte and Tailwind — no compiled runtime, no configuration layer between you and the markup. Styling
		lives in ordinary utility classes, so changing a component means editing it, not overriding it.
	</p>

	<h2 id="how-it-works">How it works</h2>
	<p>
		A component is a file. It lands in <code>src/lib/components/ui</code> in your repository, and from
		that moment it is yours: rename it, delete half of it, change its props. Nothing upstream is watching,
		and nothing breaks when this library changes.
	</p>
	<p>
		That is also the trade. Copying means you do not get fixes for free — so the
		<a href="{base}/docs/cli">CLI</a> exists to tell you what has changed upstream and merge it in without
		touching the lines you edited.
	</p>

	<h2 id="getting-a-component">Getting a component</h2>
	<p>Either way works, and they produce the same file.</p>
	<CodeBlock
		code={execCommand(`fajr-ui add dialog`, packageManager.current)}
		language="shell"
		title="With the CLI"
	/>
	<p>
		Or open the component's page, copy the source, and paste it in. Every page shows the whole file,
		not an excerpt — see <a href="{base}/docs/get-started">Get started</a> for what has to be in place
		first.
	</p>

	<h2 id="aria-first">Hand-rolled, ARIA first</h2>
	<p>
		There is no headless dependency. Each component owns its own keyboard handling, focus management
		and ARIA wiring, and leans on the platform wherever the platform is already correct. Sheet is a
		native <code>&lt;dialog&gt;</code> driven by <code>showModal()</code>, which supplies a real
		focus trap, Escape handling, an inert background and top-layer stacking without a line of custom
		focus code.
	</p>
	<p>
		Every text colour clears 4.5:1 against the surface behind it in both themes, controls clear a
		44-pixel target on a coarse pointer without changing size on a mouse, and every animation has a
		reduced-motion path.
	</p>

	<h2 id="idiomatic-svelte">Idiomatic Svelte</h2>
	<p>
		The API is Svelte's. Components that can render as either a button or a link switch on an
		<code>href</code> prop rather than a render callback. Shared state is Svelte context holding a
		class of <code>$state</code>. Controlled values are <code>$bindable</code>, so
		<code>bind:value</code> works the way you expect, and reactive helpers like
		<code>MediaQuery</code> come from Svelte itself instead of a custom hook.
	</p>

	<h2 id="theming">Theming</h2>
	<p>
		Colours, radii and typography all resolve from CSS custom properties defined once, in light and
		dark. Every value is literal rather than a reference to a palette, so the token file stands
		alone and a whole scheme can be swapped in one place. Three accents ship with it; see
		<a href="{base}/docs/theming">Theming</a> for how to add your own.
	</p>

	<h2 id="next">Where to go next</h2>
	<div class="not-prose grid gap-3 sm:grid-cols-2">
		{#each next as [title, blurb, href] (href)}
			<a
				{href}
				class="group flex flex-col gap-1 rounded-xl border bg-card p-4 text-card-foreground shadow-xs/5 transition-shadow outline-none not-dark:bg-clip-padding hover:shadow-md/5 focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background"
			>
				<span class="flex items-center gap-1.5 font-medium">
					{title}
					<Icon
						icon={ArrowRightIcon}
						class="size-4 transition-transform group-hover:translate-x-0.5 motion-reduce:transition-none"
						aria-hidden="true"
					/>
				</span>
				<span class="text-sm text-pretty text-muted-foreground">{blurb}</span>
			</a>
		{/each}
	</div>
	<!--
		A link to the catalogue rather than the catalogue itself. This section used
		to list every component name inline, which duplicated the grid on the home
		page and grew a line longer with each one added.
	-->
	<div class="not-prose pt-2 pb-2">
		<Button href="{base}/" variant="outline">
			See all {builtComponents.length} components<Icon icon={ArrowRightIcon} />
		</Button>
	</div>
</DocsPage>

<SiteFooter />
