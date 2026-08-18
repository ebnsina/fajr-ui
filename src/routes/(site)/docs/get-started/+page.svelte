<script lang="ts">
	import { base } from '$app/paths';
	import CodeBlock from '$lib/components/site/code-block.svelte';
	import PackageManagerTabs from '$lib/components/site/package-manager-tabs.svelte';
	import { addCommand, execCommand, packageManager } from '$lib/package-manager.svelte';
	import DocsPage from '$lib/components/site/docs-page.svelte';
	import SiteFooter from '$lib/components/site/site-footer.svelte';
	import { builtComponents } from '$lib/data/components';

	const toc = [
		{ title: 'Requirements', id: 'requirements' },
		{ title: 'With the CLI', id: 'cli' },
		{ title: 'By hand', id: 'by-hand' },
		{ title: 'Install dependencies', id: 'install' },
		{ title: 'Add the tokens', id: 'tokens' },
		{ title: 'Add the utility', id: 'utility' },
		{ title: 'Copy a component', id: 'copy' },
		{ title: 'Dark mode', id: 'dark-mode' }
	];
</script>

<DocsPage
	title="Get Started"
	description="Add the tokens, copy a component, and you are running."
	{toc}
>
	<h2 id="requirements">Requirements</h2>
	<p>
		Svelte 5 and Tailwind CSS v4. The components use runes (<code>$state</code>,
		<code>$derived</code>, <code>$props</code>) and Tailwind v4 features such as
		<code>@theme</code> and the <code>--alpha()</code> function, so neither is optional.
	</p>

	<h2 id="cli">With the CLI</h2>
	<div class="not-prose"><PackageManagerTabs /></div>
	<p>
		The quickest route. <code>init</code> writes a small config saying where components should land;
		<code>add</code> copies them in along with anything they compose.
	</p>
	<CodeBlock
		code={[
			execCommand('fajr-ui@latest init', packageManager.current),
			execCommand('fajr-ui@latest add button dialog', packageManager.current)
		].join('\n')}
		language="bash"
		title="Terminal"
	/>
	<p>
		Asking for <code>dialog</code> also brings <code>button</code>, <code>spinner</code> and
		<code>scroll-area</code>, because the dialog is built from them. The CLI prints any npm packages
		the components need, and never installs them behind your back.
	</p>
	<p>
		Because the files are yours once copied, updating is the interesting part — the CLI records what
		it wrote and refuses to overwrite anything you have since edited. See
		<a href="{base}/docs/cli">the CLI reference</a> for <code>outdated</code>, <code>diff</code> and
		<code>update</code>.
	</p>

	<h2 id="by-hand">By hand</h2>
	<p>
		There is nothing magic about the CLI — it copies files. If you would rather not run it, follow
		the four steps below and paste the component source straight from its documentation page.
	</p>

	<h2 id="install">Install dependencies</h2>
	<p>Three small utilities are shared by every component:</p>
	<CodeBlock
		code={addCommand(
			'clsx tailwind-merge class-variance-authority'.split(' '),
			packageManager.current
		)}
		language="bash"
		title="Terminal"
	/>
	<p>Components that render an icon also need an icon set:</p>
	<CodeBlock
		code={addCommand(
			'@hugeicons/svelte @hugeicons/core-free-icons'.split(' '),
			packageManager.current
		)}
		language="bash"
		title="Terminal"
	/>

	<h2 id="tokens">Add the tokens</h2>
	<p>
		<code>fajr-ui init</code> writes this file for you; the step is here for the by-hand path. Run
		<code>fajr-ui add theme</code> to fetch it on its own, or copy
		<code>src/lib/styles/theme.css</code> across. It defines every colour, radius, font and motion
		curve the components read, in both light and dark — see
		<a href="{base}/docs/theming">Theming</a> for what each one does.
	</p>
	<p>
		Do this before adding a component rather than after. The components name their colours through
		these tokens and carry no fallback of their own, so without the file every border falls through
		to the surrounding text colour — which looks like a broken component rather than a missing
		stylesheet.
	</p>
	<CodeBlock
		code={`@import 'tailwindcss';

/* Design tokens, fonts and base layer. */
@import './lib/styles/theme.css';`}
		language="css"
		title="app.css"
	/>

	<h2 id="utility">Add the utility</h2>
	<p>
		Every component merges incoming classes with <code>cn</code>, so later utilities win over the
		component's own:
	</p>
	<CodeBlock
		code={`import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]): string {
  return twMerge(clsx(inputs));
}`}
		language="ts"
		title="src/lib/utils.ts"
	/>

	<h2 id="copy">Copy a component</h2>
	<p>
		There is no install step for the components themselves. Copy the file — or the folder, for
		components built from several parts — into <code>src/lib/components/ui</code>, and edit it
		directly. Each component's page lists the exact path to copy.
	</p>
	<!--
		`<\/script>` inside these samples is not a pointless escape: unescaped, the
		Svelte parser ends this component's own script block at that point. Removing
		it produced 148 type errors. The rule cannot see the enclosing element.
	-->
	<!-- eslint-disable no-useless-escape -->
	<CodeBlock
		code={`<script lang="ts">
  import { Button } from '$lib/components/ui';
<\/script>

<Button>Get started</Button>`}
	/>
	<p>
		{builtComponents.length} components are available today. Anything not yet built says so on its page
		rather than pretending otherwise.
	</p>

	<h2 id="dark-mode">Dark mode</h2>
	<p>
		The tokens switch on a <code>dark</code> class on the root element. Set it before first paint so the
		theme never flashes:
	</p>
	<CodeBlock
		code={`<script>
  try {
    const stored = localStorage.getItem('fajr-ui-mode');
    const dark =
      stored === 'dark' ||
      ((!stored || stored === 'system') &&
        window.matchMedia('(prefers-color-scheme: dark)').matches);
    document.documentElement.classList.toggle('dark', dark);
  } catch {}
<\/script>`}
		language="html"
		title="app.html — in <head>"
	/>
	<!-- eslint-enable no-useless-escape -->
</DocsPage>

<SiteFooter />
