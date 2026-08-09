<script lang="ts">
	let { children } = $props();
</script>

<!--
	Example write-ups reuse the documentation reading column, which brings its own
	card and table of contents but expects a container around it — the docs layout
	normally supplies that, and these pages sit outside it. Without this they
	render flush against the viewport edge.

	The `(detail)` group keeps the URLs at /examples/<name> while letting the
	gallery index at /examples keep its own full-bleed layout.
-->
<div class="container w-full py-4">
	{@render children()}
</div>
