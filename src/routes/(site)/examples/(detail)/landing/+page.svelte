<script lang="ts">
	import { base } from '$app/paths';
	import { Badge, Button } from '$lib/components/ui';
	import { ArrowRightIcon, Icon } from '$lib/icons';
	import CodeBlock from '$lib/components/site/code-block.svelte';
	import DocsPage from '$lib/components/site/docs-page.svelte';
	import SiteFooter from '$lib/components/site/site-footer.svelte';

	const toc = [
		{ title: 'Demo', id: 'demo' },
		{ title: 'Anatomy', id: 'anatomy' },
		{ title: 'Features', id: 'features' },
		{ title: 'The hero', id: 'hero' },
		{ title: 'The product preview', id: 'preview' },
		{ title: 'The bento', id: 'bento' },
		{ title: 'Pricing', id: 'pricing' },
		{ title: 'Landmarks and headings', id: 'landmarks' },
		{ title: 'Copy lives apart', id: 'copy' },
		{ title: 'What it is built from', id: 'built-from' }
	];

	const parts = [
		['Header', 'Brand, the section links, the theme controls and the two calls to action.'],
		['Hero', 'The announcement pill, the headline, one field, and the reassurance under it.'],
		['Product preview', 'A browser frame whose contents change with a tab, at a fixed height.'],
		['Wordmark row', 'A first taste of who uses it, set as text rather than as images.'],
		[
			'Feature bento',
			'Seven tiles at three sizes, so the two claims that carry the pitch get the room.'
		],
		['Numbers', 'Four figures across a divided band, set in lining numerals.'],
		['Partners', 'The full list, each with a monogram, what kind of institution it is, and where.'],
		['Voices', 'Five quotations — one given the room, four sharing the rest — each with a figure.'],
		['Pricing', 'Three tiers and a monthly/annual switch that moves nothing but the digits.'],
		['Questions', 'The five asked first, as an accordion beside its own heading.'],
		['Closing panel', 'The last ask, on its own card so it does not read as another section.'],
		['Footer', 'Four link columns, a status line, and a legal row under a rule.']
	];

	const features = [
		[
			'Sticky header',
			'Takes its rule only once the page has scrolled, so the hero glow stays whole.'
		],
		['Mobile navigation', 'The links move into a sheet rather than wrapping onto three rows.'],
		['Tabbed preview', 'Three panes in one frame, at a fixed height, so switching moves nothing.'],
		[
			'Bento feature grid',
			'Six columns divide by two, three and four, so every row comes out flush.'
		],
		['Partner list', 'Monograms and places rather than a wall of grey wordmarks.'],
		[
			'Weighted quotations',
			'One lead quote at double width, each carrying the number it is about.'
		],
		['Billing toggle', 'A real switch, with the annual saving shown rather than implied.'],
		[
			'No layout shift',
			'Every figure that changes sits in a reserved box; nothing below it jumps.'
		],
		['Accordion FAQ', 'One question open by default, the rest a keystroke away.'],
		['A real footer', 'Four columns, a status line and a legal row — the second navigation.'],
		['Theme aware', 'Every surface, glow and rule is a token, so accents and dark mode follow.'],
		['Landmarks', 'Header, main, footer and a labelled section per band, with a skip link first.'],
		['Reduced motion', 'The one hover translation and the panel fade both stand down.'],
		[
			'No images',
			'The frame, the folio and the glow are markup and gradients, so nothing loads late.'
		]
	];

	const built = ['Tabs', 'Accordion', 'Switch', 'Sheet', 'Badge', 'Avatar', 'Input', 'Button'];
</script>

<DocsPage
	title="SaaS landing page"
	description="A marketing page: hero, product preview, feature grid, pricing and an FAQ."
	{toc}
>
	<p>
		A landing page is a different kind of test from an application screen. Nothing here is stateful
		in an interesting way; what it exercises instead is typography at large sizes, vertical rhythm,
		and whether a set of components can carry a page that has to look expensive rather than merely
		correct.
	</p>
	<p>
		The product is invented — an archive for manuscripts — so the copy has something concrete to
		say. Read it as a layout, not a pitch.
	</p>

	<h2 id="demo">Demo</h2>
	<p>It is a full page, so it opens on its own.</p>
	<div class="not-prose flex flex-wrap gap-2">
		<Button href="{base}/examples/landing/app"
			>Open the landing page<Icon icon={ArrowRightIcon} /></Button
		>
	</div>

	<h2 id="anatomy">Anatomy</h2>
	<p>Ten bands, stacked. Each one answers a single question a visitor is about to ask:</p>
	<!--
		A drawn diagram rather than ASCII in a code block: a code block says "this
		is something you would type", which a picture of the layout is not.
	-->
	<div class="not-prose overflow-hidden rounded-xl border bg-card text-xs">
		<div class="flex items-center gap-2 border-b bg-muted/48 px-3 py-2">
			<span class="font-medium text-muted-foreground">Header</span>
			<span class="text-muted-foreground/64">Product · Pricing · Questions</span>
			<span class="ms-auto h-4 w-16 rounded-sm bg-primary/32"></span>
		</div>

		<div class="flex flex-col gap-2 p-3">
			<!-- Hero: centred stack, narrowing towards the field. -->
			<div class="flex flex-col items-center gap-1.5 rounded-md border border-dashed py-4">
				<span class="h-3 w-24 rounded-full bg-muted"></span>
				<span class="h-5 w-[62%] rounded-sm bg-muted-foreground/24"></span>
				<span class="h-5 w-[46%] rounded-sm bg-muted-foreground/24"></span>
				<span class="mt-1 flex gap-1">
					<span class="h-4 w-28 rounded-sm bg-muted"></span>
					<span class="h-4 w-16 rounded-sm bg-primary/32"></span>
				</span>
				<span class="mt-1 text-muted-foreground/64">Hero</span>
			</div>

			<!-- Product preview: a frame with a tab strip above it. -->
			<div class="flex flex-col items-center gap-1.5">
				<span class="flex gap-1">
					{#each ['bg-muted-foreground/24', 'bg-muted', 'bg-muted'] as tab, index (index)}
						<span class="h-3 w-12 rounded-sm {tab}"></span>
					{/each}
				</span>
				<span
					class="flex h-16 w-full items-start justify-center rounded-md border bg-muted/32 pt-1 text-muted-foreground/64"
				>
					Product preview
				</span>
			</div>

			<!-- Wordmarks. -->
			<div class="flex justify-center gap-2 py-1">
				{#each Array.from({ length: 5 }, (_, index) => index) as mark (mark)}
					<span class="h-2.5 w-14 rounded-full bg-muted"></span>
				{/each}
			</div>

			<!-- Feature grid: three across. -->
			<div class="flex gap-2">
				{#each Array.from({ length: 3 }, (_, index) => index) as card (card)}
					<span
						class="flex h-12 flex-1 items-start justify-center rounded-md border bg-muted/32 pt-1 text-muted-foreground/64"
					>
						{card === 1 ? 'Feature grid' : ''}
					</span>
				{/each}
			</div>

			<!-- Numbers band. -->
			<div class="flex divide-x rounded-md border">
				{#each ['2.4M', '340', '61', '99.98%'] as figure (figure)}
					<span class="flex-1 py-1.5 text-center tabular-nums">{figure}</span>
				{/each}
			</div>

			<!-- Pricing: three tiers, the middle one raised. -->
			<div class="flex items-end gap-2">
				{#each [0, 1, 2] as tier (tier)}
					<span
						class="flex flex-1 items-start justify-center rounded-md border pt-1 text-muted-foreground/64 {tier ===
						1
							? 'h-16 border-primary/48 bg-primary/8'
							: 'h-12 bg-muted/32'}"
					>
						{tier === 1 ? 'Pricing' : ''}
					</span>
				{/each}
			</div>

			<!-- Questions: heading beside the accordion. -->
			<div class="flex gap-2">
				<span
					class="w-28 shrink-0 rounded-md border border-dashed py-3 text-center text-muted-foreground/64"
				>
					Questions
				</span>
				<span class="flex flex-1 flex-col gap-1">
					{#each [0, 1, 2] as question (question)}
						<span class="h-3.5 rounded-sm border bg-muted/32"></span>
					{/each}
				</span>
			</div>

			<!-- Closing panel. -->
			<div
				class="flex h-10 items-center justify-center rounded-md border bg-primary/8 text-muted-foreground/64"
			>
				Closing panel
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

	<h2 id="hero">The hero</h2>
	<p>
		The background is two layers of pure decoration — a radial wash of the primary colour and a
		faint grid, both masked out towards the bottom edge so neither ends on a visible line. Both are
		built from theme tokens, which is what keeps them right under every accent and in dark mode
		without a second set of rules.
	</p>
	<CodeBlock
		code="bg-[radial-gradient(ellipse_58%_46%_at_50%_-8%,color-mix(in_oklab,var(--color-primary)_16%,transparent),transparent_72%)]"
		language="html"
	/>
	<p>
		The whole layer is <code>aria-hidden</code> and <code>pointer-events-none</code>. It is scenery;
		it should be neither announced nor clickable.
	</p>
	<p>
		The form asks for one thing. A landing page that opens with a name, a company and a team size is
		asking a stranger to fill in a form before they know what the product is.
	</p>

	<h2 id="preview">The product preview</h2>
	<p>
		Three panes inside one browser frame, switched by tabs. The frame owns a fixed height, and the
		panes fill it. Without that the page would grow and shrink by a couple of hundred pixels every
		time someone clicked a tab, and everything below would slide.
	</p>
	<CodeBlock
		code={`<div class="h-[24rem] overflow-hidden sm:h-[26rem]">
  <TabsPanel value="catalogue" class="h-full">…</TabsPanel>
  <TabsPanel value="transcribe" class="h-full">…</TabsPanel>
  <TabsPanel value="publish" class="h-full">…</TabsPanel>
</div>`}
		language="svelte"
	/>
	<p>
		Nothing in the frame is an image. The folio is a stack of rounded bars, the browser chrome is
		three dots and a rule, and the API response goes through the same highlighter as every snippet
		in these pages. Screenshots on a marketing page date faster than the product does, and they
		arrive after the text.
	</p>

	<h2 id="bento">The bento</h2>
	<p>
		A uniform grid of six cards gives the strongest claim the same weight as the weakest. This one
		runs on <strong>six columns</strong>, which divide evenly by two, three and four — so tiles of
		4+2, 2+2+2 and 3+3 all come out flush without a single orphan, and the two claims that carry the
		pitch get twice the room and a small drawn flourish each.
	</p>
	<p>
		The span is data on the feature, not a class in the markup. It has to be looked up rather than
		interpolated, because Tailwind scans your source as text: a class assembled as
		<code>lg:col-span-&#123;n&#125;</code> never appears in the source, so it is never generated.
	</p>
	<CodeBlock
		code={`const SPAN: Record<number, string> = {
  2: 'lg:col-span-2',
  3: 'lg:col-span-3',
  4: 'sm:col-span-2 lg:col-span-4'
};`}
		language="ts"
	/>
	<p>
		The partner list takes the same view of logos. There is no artwork to invent for an institution
		that does not exist, so each one gets a monogram, what kind of place it is, and where it is —
		which says more than a row of grey wordmarks would.
	</p>

	<h2 id="pricing">Pricing</h2>
	<p>
		The monthly/annual control is a <a href="{base}/docs/components/switch">Switch</a>, not two
		buttons: it is one setting with two states, and <code>role="switch"</code> is announced as on or off
		rather than as a pair of choices where one happens to be pressed.
	</p>
	<p>
		The figure and the note beneath it both sit in a box of fixed height. The price changes with the
		toggle, and the “billed annually” line exists on only one of the two settings — so without a
		reserved box, every card and everything below it would jump on each flip.
	</p>
	<CodeBlock
		code={`<p class="flex h-12 items-baseline gap-1.5">…</p>
<p class="h-5 text-muted-foreground text-sm">
  {#if price !== null && price > 0 && yearly}
    Billed annually, \${price * 12} a year
  {/if}
</p>`}
		language="svelte"
	/>
	<p>
		Prices are set in <code>tabular-nums</code>, so <strong>$19</strong> and <strong>$24</strong> occupy
		the same width and the digits do not shuffle as they change.
	</p>

	<h2 id="landmarks">Landmarks and headings</h2>
	<p>
		A marketing page is mostly one long column, which makes it easy to navigate badly. Each band is
		a <code>section</code> labelled by its own heading, so the landmark list reads as an outline of the
		page rather than a row of unnamed regions:
	</p>
	<CodeBlock
		code={`<section id="pricing" aria-labelledby="pricing-title">
  <h2 id="pricing-title">Priced per editor, not per folio</h2>
  …
</section>`}
		language="svelte"
	/>
	<p>
		The numbers band has no visible heading, so it carries a screen-reader-only one rather than
		going unlabelled. Each quotation is a <code>figure</code> with a
		<code>figcaption</code>, which is what keeps the name attached to the words. The section links
		in the header point at ids that carry <code>scroll-mt</code>, so a jump does not land underneath
		the sticky header.
	</p>

	<h2 id="copy">Copy lives apart</h2>
	<p>
		Every string — the navigation, the features, the tiers, the quotations, the questions — is in
		one data module, and the page is layout and behaviour only. A landing page is mostly content,
		and interleaving the two makes each harder to change without disturbing the other.
	</p>
	<CodeBlock
		code={`export const TIERS: Tier[] = [
  {
    id: 'academy',
    name: 'Academy',
    blurb: 'For a department working together.',
    monthly: 24,
    yearly: 19,
    featured: true,
    includes: ['Unlimited collections, 50,000 folios', …]
  }
];`}
		language="ts"
	/>

	<h2 id="built-from">What it is built from</h2>
	<div class="not-prose flex flex-wrap gap-1.5">
		{#each built as component (component)}
			<Badge variant="outline" href="{base}/docs/components/{component.toLowerCase()}"
				>{component}</Badge
			>
		{/each}
	</div>
	<p>
		The bands, the gradients and the type scale are ordinary markup and Tailwind. Nothing on this
		page needed a page builder, and nothing on it is hidden behind one.
	</p>
	<div class="not-prose pt-2 pb-2">
		<Button href="{base}/examples/landing/app" variant="outline">
			Open the landing page<Icon icon={ArrowRightIcon} />
		</Button>
	</div>
</DocsPage>

<SiteFooter />
