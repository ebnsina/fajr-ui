<script lang="ts">
	import CodeBlock from '$lib/components/site/code-block.svelte';
	import DocsPage from '$lib/components/site/docs-page.svelte';
	import SiteFooter from '$lib/components/site/site-footer.svelte';

	const toc = [
		{ title: 'Set it up', id: 'setup' },
		{ title: 'What gets written', id: 'written' },
		{ title: 'Addresses', id: 'addresses' },
		{ title: 'The rules', id: 'rules' },
		{ title: 'Kept in step', id: 'in-step' }
	];

	const endpoints = [
		['/llms.txt', 'Index: what this is, the rules, and a link per component. ~11 KB.'],
		['/llms-full.txt', 'Every component’s API, examples and notes inline. ~150 KB.'],
		['/docs/components/<slug>.md', 'One component. What you want before writing a single import.'],
		['/skill.md', 'The agent skill, as installed by the CLI.'],
		['/agents.md', 'The same rules as a block for AGENTS.md.'],
		['/r/index.json', 'Machine-readable registry: files, and dependencies with exact versions.']
	];
</script>

<DocsPage
	title="For AI agents"
	description="Documentation an agent can read, and instructions it will follow."
	{toc}
>
	<p>
		An agent writing against this library gets the same handful of things wrong: importing from a
		file inside the component folder rather than the barrel, reaching for Svelte 4 syntax, or
		hard-coding a colour that then ignores the theme. None of that is guessable — so it is written
		down, at addresses an agent can fetch.
	</p>

	<h2 id="setup">Set it up</h2>
	<p>In a project that uses Fajr UI:</p>
	<CodeBlock code="npx fajr-ui skill" language="sh" title="Terminal" />
	<p>
		Run it again whenever you update components; it refreshes what it wrote. There is nothing to
		configure and no key to obtain — these are static files on the docs site.
	</p>
	<p>
		Both paths are relative to the project, not your home directory, so they belong to the
		repository and should be committed — the point is that everyone on the team, and CI, gets the
		same instructions. If your <code>.gitignore</code> excludes <code>.claude/</code>, the
		<code>AGENTS.md</code> block still carries the same rules for agents that read it.
	</p>

	<h2 id="written">What gets written</h2>
	<div class="not-prose overflow-x-auto rounded-xl border">
		<table class="w-full min-w-[34rem] border-collapse text-left text-sm">
			<thead class="bg-muted/48">
				<tr>
					<th scope="col" class="px-4 py-2.5 font-medium">File</th>
					<th scope="col" class="px-4 py-2.5 font-medium">What it is</th>
				</tr>
			</thead>
			<tbody>
				<tr class="border-t">
					<td class="px-4 py-2.5 align-top font-mono text-xs">.claude/skills/fajr-ui/SKILL.md</td>
					<td class="px-4 py-2.5 align-top text-muted-foreground">
						An agent skill. Loaded when the work involves UI, so the rules are in context without
						filling it the rest of the time.
					</td>
				</tr>
				<tr class="border-t">
					<td class="px-4 py-2.5 align-top font-mono text-xs">AGENTS.md</td>
					<td class="px-4 py-2.5 align-top text-muted-foreground">
						The same rules, for agents that read this file rather than skills. Written between
						markers and refreshed in place, so anything else in the file is left alone.
					</td>
				</tr>
			</tbody>
		</table>
	</div>

	<h2 id="addresses">Addresses</h2>
	<p>
		Fetch these directly if you would rather wire them up yourself — into a system prompt, a
		retrieval index, or an editor's context.
	</p>
	<div class="not-prose overflow-x-auto rounded-xl border">
		<table class="w-full min-w-[34rem] border-collapse text-left text-sm">
			<thead class="bg-muted/48">
				<tr>
					<th scope="col" class="px-4 py-2.5 font-medium">Path</th>
					<th scope="col" class="px-4 py-2.5 font-medium">Contents</th>
				</tr>
			</thead>
			<tbody>
				{#each endpoints as [path, what] (path)}
					<tr class="border-t">
						<td class="px-4 py-2.5 align-top font-mono text-xs">{path}</td>
						<td class="px-4 py-2.5 align-top text-muted-foreground">{what}</td>
					</tr>
				{/each}
			</tbody>
		</table>
	</div>
	<p>
		The per-component address is the page URL with <code>.md</code> on the end, which is the one an agent
		guesses first. It costs one request instead of the whole catalogue.
	</p>
	<CodeBlock
		code="curl https://fajr-ui.dev/docs/components/dialog.md"
		language="sh"
		title="Terminal"
	/>

	<h2 id="rules">The rules</h2>
	<p>
		The instructions are short on purpose. A skill is read on every relevant turn, so it carries
		what an agent gets wrong and where to fetch the rest — not the API, which would go stale in
		context and is one request away anyway.
	</p>
	<p>
		They cover the import path, Svelte 5 runes rather than Svelte 4 syntax, tokens rather than
		literal colours, and the fact that a component is a local file to be edited rather than wrapped.
		The chart helpers get their own line, because they come from a different module than the
		components and there are two different things called <code>tooltip</code>.
	</p>

	<h2 id="in-step">Kept in step</h2>
	<p>
		Every one of these is generated from the modules this site renders — the component list, the
		props tables, the example files, the version pins. There is no second copy of the API to
		maintain, which is the usual reason a machine-readable export drifts and starts handing out
		props that no longer exist.
	</p>
	<p>
		The examples in them are the same files rendered on each component page, read at build time. If
		an example changes, so does what an agent is told.
	</p>
</DocsPage>

<SiteFooter />
