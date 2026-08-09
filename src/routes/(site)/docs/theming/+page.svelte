<script lang="ts">
	import CodeBlock from '$lib/components/site/code-block.svelte';
	import DocsPage from '$lib/components/site/docs-page.svelte';
	import SiteFooter from '$lib/components/site/site-footer.svelte';
	import { ACCENTS, accent } from '$lib/accent.svelte';
	import { CheckIcon, Icon } from '$lib/icons';
	import { cn } from '$lib/utils';

	let accentButtons = $state<(HTMLElement | null)[]>([]);

	/**
	 * Arrows move between the options and select as they go, which is what a
	 * radio group does natively. Without this the group would cost one Tab press
	 * per colour and Tab would walk out of it mid-set.
	 */
	function onAccentKeydown(event: KeyboardEvent) {
		const last = ACCENTS.length - 1;
		const index = ACCENTS.findIndex((entry) => entry.value === accent.current);
		let next: number | undefined;
		if (event.key === 'ArrowRight' || event.key === 'ArrowDown')
			next = index === last ? 0 : index + 1;
		else if (event.key === 'ArrowLeft' || event.key === 'ArrowUp')
			next = index === 0 ? last : index - 1;
		else return;

		event.preventDefault();
		accent.set(ACCENTS[next].value);
		accentButtons[next]?.focus();
	}

	const toc = [
		{ title: 'Tokens, not classes', id: 'tokens' },
		{ title: 'How a token resolves', id: 'how-tokens-resolve' },
		{ title: 'Adding a token', id: 'adding-tokens' },
		{ title: 'Accents', id: 'accents' },
		{ title: 'Dark mode', id: 'dark-mode' },
		{ title: 'Choosing your own', id: 'choosing' }
	];

	const colorTokens = [
		['--background / --foreground', 'Page surface and its text'],
		['--card / --card-foreground', 'Raised surfaces'],
		['--popover / --popover-foreground', 'Floating surfaces: menus, dialogs, tooltips'],
		['--primary / --primary-foreground', 'The main action'],
		['--secondary, --muted, --accent', 'Quieter fills, in increasing prominence'],
		['--destructive, --success, --warning, --info', 'Status tones'],
		['--border, --input, --ring', 'Edges, control edges, focus rings'],
		['--code-*', 'The code block surface and its syntax colours'],
		['--chart-1 … --chart-5', 'The categorical series palette, generated from --chart-hue'],
		['--sidebar-*', 'The sidebar\u2019s own surface, so it can differ from the page']
	];
</script>

<DocsPage
	title="Theming"
	description="Every colour, radius and typeface resolves from tokens defined once."
	{toc}
>
	<h2 id="tokens">Tokens, not classes</h2>
	<p>
		Nothing is hard-coded to a colour. Components reference semantic tokens, which resolve to
		different values in light and dark. Restyling the whole set means changing these once, in
		<code>theme.css</code>, rather than editing components.
	</p>
	<div class="not-prose overflow-x-auto rounded-xl border">
		<table class="w-full min-w-[32rem] border-collapse text-left text-sm">
			<thead class="bg-muted/48">
				<tr>
					<th scope="col" class="px-4 py-2.5 font-medium">Token</th>
					<th scope="col" class="px-4 py-2.5 font-medium">Used for</th>
				</tr>
			</thead>
			<tbody>
				{#each colorTokens as [token, use] (token)}
					<tr class="border-t">
						<td class="px-4 py-2.5 align-top font-mono text-xs">{token}</td>
						<td class="px-4 py-2.5 align-top text-muted-foreground">{use}</td>
					</tr>
				{/each}
			</tbody>
		</table>
	</div>
	<p>
		Radii derive from a single <code>--radius</code>, so rounding the whole set tighter or softer is
		one line.
	</p>
	<CodeBlock
		code={`:root {\n  --radius: 0.625rem;\n  --primary: var(--color-blue-600);\n}`}
		language="css"
	/>

	<h2 id="how-tokens-resolve">How a token resolves</h2>
	<p>
		Every token is a plain custom property declared twice — once on <code>:root</code> and once on
		<code>.dark</code> — and exposed to Tailwind through <code>@theme inline</code>. The
		<code>inline</code> matters: it makes utilities emit <code>var(--token)</code> rather than
		baking the value in, which is what lets the <code>.dark</code> block override them at runtime.
	</p>
	<CodeBlock
		code={`:root {
  --background: #fff;
  --foreground: oklch(26.9% 0 0);
}

.dark {
  --background: oklch(14.5% 0 0);
  --foreground: oklch(98.5% 0 0);
}

@theme inline {
  --color-background: var(--background);
  --color-foreground: var(--foreground);
}`}
		language="css"
		title="theme.css"
	/>
	<p>
		The values are literals, not references to Tailwind's palette, so the file stands on its own:
		you can drop a different set of colours in wholesale without the components knowing.
	</p>

	<h2 id="adding-tokens">Adding a token</h2>
	<p>
		Declare it under <code>:root</code> and <code>.dark</code>, then expose it under
		<code>@theme inline</code>. Tailwind generates the matching utilities from the name.
	</p>
	<CodeBlock
		code={`:root {
  --brand: oklch(0.84 0.16 84);
  --brand-foreground: oklch(0.28 0.07 46);
}

.dark {
  --brand: oklch(0.41 0.11 46);
  --brand-foreground: oklch(0.99 0.02 95);
}

@theme inline {
  --color-brand: var(--brand);
  --color-brand-foreground: var(--brand-foreground);
}`}
		language="css"
		title="theme.css"
	/>
	<p>
		<code>bg-brand</code> and <code>text-brand-foreground</code> now work anywhere, and follow the theme
		without another line of code.
	</p>

	<h2 id="accents">Accents</h2>
	<p>
		An accent is a second axis, independent of light and dark: <code>data-accent</code> on the root element
		swaps the primary surface, its foreground, the focus ring, and the hue the chart palette is built
		from. Nothing else. Because it touches so little, switching accent cannot disturb contrast anywhere
		in the system.
	</p>

	<!-- Applying it to the whole page is a truer demonstration than a swatch row. -->
	<div
		role="radiogroup"
		aria-label="Accent colour"
		class="not-prose flex flex-wrap gap-2 rounded-xl border p-4"
	>
		{#each ACCENTS as entry, index (entry.value)}
			{@const selected = entry.value === accent.current}
			<!--
				One choice out of a set, so `radio` rather than a pressed button, and
				one tab stop for the group with arrows moving between options.

				Selection is a ring and a tick, never a filled surface. Inverting the
				fill hid the swatch it was meant to show — a near-black dot on a
				near-black button.
			-->
			<button
				bind:this={accentButtons[index]}
				type="button"
				role="radio"
				aria-checked={selected}
				tabindex={selected ? 0 : -1}
				onclick={() => accent.set(entry.value)}
				onkeydown={onAccentKeydown}
				class={cn(
					'flex cursor-pointer items-center gap-2.5 rounded-lg border px-3 py-2 text-sm transition-[background-color,border-color,box-shadow] outline-none',
					selected
						? 'border-primary/48 bg-accent/40 ring-2 ring-primary/24'
						: 'border-input hover:bg-accent/40',
					'focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background'
				)}
			>
				<span
					aria-hidden="true"
					class="size-4 shrink-0 rounded-full border border-black/16 dark:border-white/24"
					style="background: {entry.swatch}"
				></span>
				<span class={selected ? 'font-medium' : undefined}>{entry.label}</span>
				<Icon
					icon={CheckIcon}
					class={cn('size-4 shrink-0 text-primary', !selected && 'invisible')}
					aria-hidden="true"
				/>
			</button>
		{/each}
	</div>
	<p class="text-sm text-muted-foreground">
		These change the whole site, not just this box. This is the only place to switch — an accent is
		a decision you make once for a project, not a control worth a permanent seat in the header.
	</p>
	<CodeBlock
		code={`[data-accent='orange'] {
  --primary: #d63200;
  --primary-foreground: #fff;
  --ring: #d63200;
  --chart-hue: 34;              /* the accent's own hue, in OKLCH */
  --chart-c-1: var(--chart-c);  /* series 1 takes it; grey without an accent */
}

.dark[data-accent='orange'] {
  --primary: #ff5c26;
  --primary-foreground: oklch(16% 0 0);
  --ring: #ff5c26;
}`}
		language="css"
		title="theme.css"
	/>
	<p>
		<code>--chart-hue</code> is declared once, on the light block: the dark rule matches the same element
		at higher specificity but never redeclares it, so one value serves both. Charts build their five series
		from it — the first two on the hue itself at two lightnesses, the rest a quarter turn apart:
	</p>
	<CodeBlock
		code={`/* 1 and 2 share the accent's hue at two lightnesses */
--chart-1: oklch(var(--chart-l-1) var(--chart-c-1) var(--chart-hue));
--chart-2: oklch(var(--chart-l-2) calc(var(--chart-c-1) * 0.4) var(--chart-hue));
/* 3-5 are muted and a quarter turn apart */
--chart-3: oklch(var(--chart-l) var(--chart-c) calc(var(--chart-hue) + 90));
--chart-4: oklch(var(--chart-l) var(--chart-c) calc(var(--chart-hue) + 180));
--chart-5: oklch(var(--chart-l) var(--chart-c) calc(var(--chart-hue) + 270));`}
		language="css"
		title="theme.css"
	/>
	<p>
		Series 1 and 2 are one colour at two lightnesses, so a one- or two-series chart — which is most
		of them — stays in a single hue rather than opening with a saturated second colour beside it.
		Colour arrives at series 3. Keeping those a quarter turn clear of the base matters: an earlier
		arrangement placed one only 60° away, so under the blue accent series 5 came out teal next to a
		blue series 1.
	</p>
	<p>
		Under black there is no hue to follow, so series 1 keeps its chroma at zero and a single-series
		chart comes out grey — which is usually what you want from a black theme. The other four hold
		their hues, so a chart with several series still reads.
	</p>
	<p>
		The obvious version — pointing series 1 at <code>--primary</code> and leaving a fixed palette behind
		it — puts a rose accent beside a rose series and gives you two lines nobody can tell apart. Rotating
		instead means the accent leads and the rest keep out of its way. Holding lightness and chroma constant
		is what keeps it safe: in OKLCH equal lightness is equal perceived lightness, so one contrast measurement
		covers every hue. The worst case across every accent and all five series is 3.92:1 in light and 4.02:1
		in dark — above the 3:1 floor for non-text.
	</p>
	<p>
		Each accent is measured twice: its label against its own surface (4.5:1) and the surface against
		the page (3:1, so the control has a visible edge). In light mode both carry white text; in dark
		mode both are lightened and carry near-black. No accent needs a special case, which is the point
		of there being two rather than six.
	</p>
	<p>
		The orange started life as <code>#ff3e00</code>, which does not quite work here: white text on
		it measures 3.53:1, under the 4.5 floor, so it had to take dark text while every other accent
		took white. Deepened one step to <code>#d63200</code> it reaches 4.87:1 and the exception disappears.
		The hue is unchanged at 34°, so it reads the same.
	</p>
	<p>
		Earlier versions shipped burgundy, medium violet red, rose and dark olive green as well. Each
		one worked, and each one needed its own paragraph explaining which floor it had scraped past and
		why its foreground differed from the rest. Two accents that behave identically are worth more
		than six that each need a footnote — and adding your own is the four lines above.
	</p>

	<h2 id="dark-mode">Dark mode</h2>
	<p>
		Dark is a class on the root element, not a media query, so a user can choose it independently of
		their operating system. Add <code>.dark</code> and every token below it resolves to its dark value.
	</p>
	<CodeBlock code="document.documentElement.classList.toggle('dark', prefersDark);" language="js" />
	<p>
		Apply it in a small inline script before the page paints, otherwise the light theme renders
		first and flashes as the script catches up.
	</p>

	<h2 id="choosing">Choosing your own</h2>
	<p>
		An accent is one pair of values. To add your own, copy any block above and measure it: the label
		against the surface at 4.5:1, and the surface against the page at 3:1 so the control keeps a
		visible edge. Whichever of white or near-black passes is the foreground \u2014 it is not always
		white, and assuming so is how most brand palettes fail.
	</p>
	<CodeBlock
		code={`[data-accent='mine'] {
  --primary: #0f766e;
  --primary-foreground: #fff;
  --ring: #0f766e;
}

.dark[data-accent='mine'] {
  --primary: #5eead4;
  --primary-foreground: oklch(16% 0 0);
  --ring: #5eead4;
}`}
		language="css"
		title="theme.css"
	/>
</DocsPage>

<SiteFooter />
