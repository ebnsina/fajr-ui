<script lang="ts">
	import DocsPage from '$lib/components/site/docs-page.svelte';
	import SiteFooter from '$lib/components/site/site-footer.svelte';
	import { builtComponents, components } from '$lib/data/components';

	const toc = [
		{ title: 'Current Status', id: 'current-status' },
		{ title: "What's Next", id: 'whats-next' },
		{ title: 'Known Gaps', id: 'known-gaps' }
	];

	const planned = components.filter((entry) => !entry.built);
</script>

<DocsPage title="Roadmap" description="Where Fajr UI stands today, and where it goes next." {toc}>
	<p>
		<strong>Fajr UI</strong> is a component library for Svelte that you
		<strong>copy into your project</strong>
		rather than install. There is no runtime package between you and the markup — the file lands in your
		repository, and from then on it is yours to edit.
	</p>
	<p>
		The goal is a library that feels <strong>finished</strong>: accessibility, keyboard handling and
		motion built into each component rather than added afterwards, leaning on the platform wherever
		the platform is already correct.
	</p>

	<h2 id="current-status">Current Status</h2>
	<ul>
		<!--
			"55 of 55" reads as a progress bar that never moved. Once nothing is
			outstanding the count is the whole story.
		-->
		{#if planned.length === 0}
			<li>
				<strong>{components.length} components</strong> built and documented, with more coming.
			</li>
		{:else}
			<li>
				<strong>{builtComponents.length} of {components.length} components</strong> built, with more on
				the way.
			</li>
		{/if}
		<li>
			<strong>Composable parts</strong> throughout, alongside a simple form of each component — including
			Pagination, whose state exposes the computed page window so laying the control out yourself does
			not mean rewriting it.
		</li>
		<li>
			<strong>Tooltip</strong> in both forms: an action for a plain string on any element without a wrapper,
			and a component when the body needs markup.
		</li>
		<li>
			<strong>Virtualisation</strong> via <a href="/docs/components/virtual-list">Virtual List</a>,
			which renders only the rows in view.
		</li>
		<li>
			<strong>A documentation site</strong>, with a live example and props table for every
			component.
		</li>
		<li>
			<strong>Tests</strong> in three layers: the CLI's own logic, the registry's invariants, and the
			components themselves driven in a real browser. The end-to-end pass installs from the built site
			into a scratch project and checks the result — so what is deployed is what is tested.
		</li>
		<li>
			<strong>A CLI</strong> that adds components and updates them later without overwriting your edits.
		</li>
		<li>
			<strong>Theming</strong> in light and dark, with three accents, driven by one token file.
		</li>
		<li>
			<strong>Right to left</strong> throughout — one <code>dir</code> attribute, with mirrored
			glyphs and direction-aware arrow keys, shown in Arabic, Hebrew and Persian. See
			<a href="/docs/rtl">Right to left</a>.
		</li>
		<li>
			<strong>Three full screens</strong>: a dashboard, a calendar and a marketing page, each with a
			write-up of how it is put together.
		</li>
	</ul>

	<h2 id="whats-next">What's Next</h2>
	<ul>
		{#if planned.length > 0}
			<li>
				Finish the <strong>remaining components</strong>: {planned.map((e) => e.name).join(', ')}.
			</li>
		{/if}
		<li>
			<strong>Chat</strong>: a message list, a bubble with its own states, a composer that grows
			with its content, typing and delivery indicators, and a thread that stays pinned to the newest
			message without fighting you when you scroll up.
		</li>
		<li>
			<strong>AI components</strong> built on the chat primitives: a streaming response that reads correctly
			to a screen reader as it arrives, a prompt input with attachments and a model picker, tool-call
			and reasoning blocks that can be expanded, sources with citations, and a suggestion row.
		</li>
		<li>Close the <strong>known gaps</strong> below.</li>
		<li>
			More <strong>full screens</strong> — the ones that exercise combinations no single component page
			can.
		</li>
		<li>
			A <strong>studio</strong>: pick a base colour, radius and typeface, preview the whole library
			against them, and copy out the resulting token block. The tokens are already literal values in
			one file, which is the groundwork it needs.
		</li>
	</ul>

	<h2 id="known-gaps">Known Gaps</h2>
	<p>
		Things that are deliberately not done, or not done yet. Each one is a decision rather than an
		oversight, and each says what would change it.
	</p>
	<ul>
		<li>
			<strong>Component coverage is uneven.</strong> The suite covers the pieces where a silent regression
			is hardest to notice — roving focus, keyboard grids, the install path — rather than every component
			equally. Filling it out is ordinary work, not a design question.
		</li>
		<li>
			<strong>Charts lean on a pre-alpha dependency.</strong> A charting grammar is a library in its
			own right, so
			<a href="/docs/components/chart">Chart</a> wraps TanStack Charts rather than inventing one. That
			package is pre-alpha and its API still moves, so every import of it sits behind a single file and
			the version is pinned exactly — but it is the one component whose upstream could change under you.
		</li>
	</ul>
</DocsPage>

<SiteFooter />
