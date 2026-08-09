<script lang="ts">
	import { base } from '$app/paths';
	import CodeBlock from '$lib/components/site/code-block.svelte';
	import DocsPage from '$lib/components/site/docs-page.svelte';
	import SiteFooter from '$lib/components/site/site-footer.svelte';

	const toc = [
		{ title: 'Overriding a component', id: 'overriding' },
		{ title: 'Variants', id: 'variants' },
		{ title: 'Motion', id: 'motion' },
		{ title: 'Data attributes', id: 'data-attributes' }
	];
</script>

<DocsPage title="Styling" description="Changing a component once it is in your project." {toc}>
	<p>
		Colours, radii and typefaces come from <a href="{base}/docs/theming">tokens</a>. This page is
		about the other half: reaching into a component you have copied.
	</p>

	<h2 id="overriding">Overriding a component</h2>
	<p>
		Every component merges your classes with its own using <code>tailwind-merge</code>, so a
		conflicting utility replaces the built-in one instead of fighting it. No <code>!important</code>
		, no specificity games.
	</p>
	<CodeBlock
		code="<Button class=&quot;w-full rounded-full&quot;>Full width, fully rounded</Button>"
	/>
	<p>
		Where a component has an inner element you may want to reach, it exposes a second prop rather
		than making you guess a selector — <code>inputClass</code> on Input,
		<code>textareaClass</code> on Textarea, <code>viewportClass</code> on ScrollArea.
	</p>

	<h2 id="variants">Variants</h2>
	<p>
		Variants are plain <code>cva</code> definitions exported alongside the component, so you can reuse
		the exact look on an element the component does not render:
	</p>
	<CodeBlock
		code={`import { buttonVariants } from '$lib/components/ui';

<a href="{base}/docs" class={buttonVariants({ variant: 'outline', size: 'sm' })}>
  Styled like a button
</a>`}
	/>

	<h2 id="motion">Motion</h2>
	<p>
		Durations and curves are tokens too. The curves deliberately override Tailwind's defaults, which
		are too gentle to read as intentional, and <code>ease-in</code> is never used for UI — it withholds
		movement at the moment the user is watching most closely.
	</p>
	<CodeBlock
		code={`--ease-out: cubic-bezier(0.23, 1, 0.32, 1);
--ease-in-out: cubic-bezier(0.77, 0, 0.175, 1);
--ease-drawer: cubic-bezier(0.32, 0.72, 0, 1);

--duration-press: 160ms;
--duration-popover: 180ms;
--duration-drawer: 280ms;`}
		language="css"
	/>
	<p>
		Everything that moves respects <code>prefers-reduced-motion</code>: fades and colour changes
		stay, because they aid comprehension; travel and scaling drop.
	</p>

	<h2 id="data-attributes">Data attributes</h2>
	<p>
		Components expose their state as data attributes, so you can style against it from outside
		without reading component internals:
	</p>
	<CodeBlock
		code={`<!-- Style the open state of a select trigger -->
<Select class="data-[state=open]:border-ring" />

<!-- Every part carries a data-slot for targeting -->
[data-slot="menu-item"] { … }`}
	/>
</DocsPage>

<SiteFooter />
