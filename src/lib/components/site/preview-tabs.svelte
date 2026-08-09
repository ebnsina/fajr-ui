<script module lang="ts">
	import type { Snippet } from 'svelte';

	export type PreviewTabsProps = {
		code: string;
		/** Height of the preview stage; examples vary a lot in size. */
		minHeight?: string;
		children?: Snippet;
	};
</script>

<script lang="ts">
	import CodeBlock from './code-block.svelte';
	import { Tabs, TabsList, TabsPanel, TabsTrigger } from '$lib/components/ui';

	let { code, minHeight = '18rem', children }: PreviewTabsProps = $props();

	let tab = $state('preview');
</script>

<div class="not-prose flex flex-col gap-3">
	<Tabs bind:value={tab}>
		<TabsList>
			<TabsTrigger value="preview">Preview</TabsTrigger>
			<TabsTrigger value="code">Code</TabsTrigger>
		</TabsList>

		<!--
			Both panels share a minimum height. Without it the page reflows every
			time you switch, and anything below the example jumps under the cursor.
		-->
		<TabsPanel value="preview">
			<div
				class="flex w-full items-center justify-center rounded-xl border p-8"
				style="min-height: {minHeight}"
			>
				{@render children?.()}
			</div>
		</TabsPanel>

		<TabsPanel value="code">
			<CodeBlock {code} class="h-full" style="min-height: {minHeight}" />
		</TabsPanel>
	</Tabs>
</div>
