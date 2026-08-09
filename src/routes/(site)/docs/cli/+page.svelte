<script lang="ts">
	import { base } from '$app/paths';
	import CodeBlock from '$lib/components/site/code-block.svelte';
	import PackageManagerTabs from '$lib/components/site/package-manager-tabs.svelte';
	import { addCommand, execCommand, packageManager } from '$lib/package-manager.svelte';
	import DocsPage from '$lib/components/site/docs-page.svelte';
	import SiteFooter from '$lib/components/site/site-footer.svelte';
	import PropsTable from '$lib/components/site/props-table.svelte';

	const toc = [
		{ title: 'init', id: 'init' },
		{ title: 'add', id: 'add' },
		{ title: 'list', id: 'list' },
		{ title: 'outdated', id: 'outdated' },
		{ title: 'diff', id: 'diff' },
		{ title: 'update', id: 'update' },
		{ title: 'skill', id: 'skill' },
		{ title: 'How updates stay safe', id: 'safety' },
		{ title: 'Registry', id: 'registry' }
	];

	const options = [
		{
			name: '--dry-run',
			type: 'flag',
			description: 'Report what would happen and write nothing.'
		},
		{
			name: '--force',
			type: 'flag',
			description: 'Replace files you have edited too. Without it they are always kept.'
		},
		{ name: '-y, --yes', type: 'flag', description: 'Skip prompts.' },
		{
			name: '--registry=<url>',
			type: 'string',
			description: 'Read from a different registry than the one in the config.'
		},
		{ name: '-v, --version', type: 'flag', description: 'Print the version and exit.' },
		{
			name: 'NO_COLOR',
			type: 'env',
			description:
				'Set it, or pipe the output anywhere but a terminal, and the escape codes are dropped.'
		}
	];
</script>

<DocsPage
	title="CLI"
	description="Add components, and keep them current without losing your changes."
	{toc}
>
	<p>
		The CLI copies component source into your project. It is not a package manager and there is no
		runtime — once a file lands it is yours, and nothing reaches back into it unless you ask.
	</p>

	<p>
		Every component page carries its own <strong>CLI</strong> tab with the exact command. If you
		would rather not leave the keyboard, open the palette with <strong>⌘K</strong>, highlight a
		component, and the footer shows its install command — <strong>⌘C</strong> copies it.
	</p>

	<div class="not-prose"><PackageManagerTabs /></div>

	<h2 id="init">init</h2>
	<p>Writes <code>fajr-ui.json</code>, which records where components should be written.</p>
	<CodeBlock
		code={execCommand(`fajr-ui@latest init`, packageManager.current)}
		language="bash"
		title="Terminal"
	/>
	<CodeBlock
		code={`{
  "$schema": "https://ebnsina.github.io/fajr-ui/r/schema.json",
  "registry": "https://ebnsina.github.io/fajr-ui/r",
  "aliases": {
    "components": "src/lib/components/ui",
    "lib": "src/lib"
  }
}`}
		language="json"
		title="fajr-ui.json"
	/>
	<p>
		The two aliases are followed independently. <code>components</code> takes the components
		themselves; <code>lib</code> takes the handful of helpers they import as
		<code>$lib/utils</code>, <code>$lib/icons</code> and so on — so it has to be whatever
		<code>$lib</code> resolves to in your project, or those imports will not resolve. Move components
		wherever you like; the helpers still land where their imports expect them.
	</p>

	<h2 id="add">add</h2>
	<p>
		Copies one or more components in, following each one's dependencies so you never end up with a
		half-assembled component.
	</p>
	<CodeBlock
		code={execCommand(`fajr-ui@latest add dialog`, packageManager.current)}
		language="bash"
		title="Terminal"
	/>
	<CodeBlock
		code={`added 16 files
  dialog/dialog.svelte
  dialog/dialog-header.svelte
  ...
  Also added, because the above compose them: button, spinner, scroll-area

  Install the packages these need:
  ${addCommand(['class-variance-authority@0.7.1'], packageManager.current)}`}
		language="plaintext"
		title="Output"
	/>
	<p>
		Files that already exist are left alone and reported, so a second <code>add</code> can never quietly
		undo your work. The install line is written for whichever package manager your project already uses,
		read from its lockfile.
	</p>
	<p>
		Versions are exact rather than ranges. Some of these packages are pre-1.0, where a minor release
		may change the API, so an install reproduces what the component was built against rather than
		whatever is latest that day.
	</p>

	<h2 id="list">list</h2>
	<p>Every component in the registry, marking the ones you already have.</p>
	<CodeBlock
		code={execCommand(`fajr-ui@latest list`, packageManager.current)}
		language="bash"
		title="Terminal"
	/>

	<h2 id="outdated">outdated</h2>
	<p>
		What has changed upstream since you installed, and what you have edited. Reads nothing but the
		registry and your own files.
	</p>
	<CodeBlock
		code={execCommand(`fajr-ui@latest outdated`, packageManager.current)}
		language="bash"
		title="Terminal"
	/>
	<CodeBlock
		code={`dialog             up to date
button             1 edited locally
spinner            1 outdated
scroll-area        up to date`}
		language="plaintext"
		title="Output"
	/>

	<h2 id="diff">diff</h2>
	<p>The same information line by line, before you change anything.</p>
	<CodeBlock
		code={execCommand(`fajr-ui@latest diff button`, packageManager.current)}
		language="bash"
		title="Terminal"
	/>

	<h2 id="update">update</h2>
	<p>
		Applies upstream changes. Files you have edited are skipped and listed; everything else is
		brought current.
	</p>
	<CodeBlock
		code={[
			execCommand('fajr-ui@latest update --dry-run', packageManager.current),
			execCommand('fajr-ui@latest update', packageManager.current),
			execCommand('fajr-ui@latest update button --force', packageManager.current)
		].join('\n')}
		language="bash"
		title="Terminal"
	/>

	<h2 id="skill">skill</h2>
	<p>
		Writes the library's instructions into your project, so a coding agent working here knows the
		conventions without being told them every session. Both files are fetched from the registry your
		config points at, so they stay in step with the components you actually have.
	</p>
	<CodeBlock
		code={execCommand('fajr-ui@latest skill', packageManager.current)}
		language="bash"
		title="Terminal"
	/>
	<CodeBlock
		code={`wrote 2 files
  .claude/skills/fajr-ui/SKILL.md
  AGENTS.md`}
		language="plaintext"
		title="Output"
	/>
	<p>
		<code>AGENTS.md</code> is yours, so it is edited between markers rather than overwritten — run
		it again and only the block between them is refreshed. See
		<a href="{base}/docs/ai">For AI agents</a> for what the files contain.
	</p>

	<h2 id="safety">How updates stay safe</h2>
	<p>
		Components you own are easy to install and hard to update — the moment you edit one, any tool
		that overwrites it destroys your work. The CLI handles this with a lockfile rather than a
		convention.
	</p>
	<ul>
		<li>
			<strong>On write</strong>, <code>fajr-ui.lock.json</code> records a hash of the exact content written
			to each file.
		</li>
		<li>
			<strong>On update</strong>, each file on disk is hashed again. Matching the record means you
			have not touched it, so replacing it is safe. Not matching means you have, so it is kept and
			reported.
		</li>
		<li>
			<strong>The record never adopts your edit.</strong> It always holds the last content the CLI itself
			wrote, so an edited file stays flagged on every future run rather than becoming the new baseline
			and being overwritten a run later.
		</li>
		<li>
			<strong>Nothing is implicit.</strong> <code>--dry-run</code> shows the plan,
			<code>diff</code> shows the content, and <code>--force</code> is the only way to lose an edit.
		</li>
	</ul>

	<h2 id="registry">Registry</h2>
	<p>
		Each component is served as JSON containing its files, the npm packages it imports, and the
		other components it composes. It is generated from the same source this site renders, so it
		cannot drift from what the documentation shows.
	</p>
	<CodeBlock
		code={`GET /r/index.json      → every component
GET /r/dialog.json     → one component, with its files inline
GET /r/schema.json     → JSON Schema for fajr-ui.json`}
		language="plaintext"
		title="Endpoints"
	/>
	<p>
		Each file in an item names the root it belongs to — <code>components</code> or <code>lib</code> —
		and a path relative to it, which is what lets the two aliases be set independently.
	</p>
	<p>
		Point <code>registry</code> in your config at any URL serving the same shape to install from your
		own fork.
	</p>

	<h2 id="options">Options</h2>
	<div class="not-prose">
		<PropsTable title="Flags" rows={options} />
	</div>
</DocsPage>

<SiteFooter />
