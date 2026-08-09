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

	It is a `<main id="main-content">` because the site layout's skip link targets
	that id and these pages are the only ones that never rendered one — the link
	was present in the header, focusable, and landed nowhere.
-->
<main id="main-content" tabindex="-1" class="container w-full py-4 outline-none">
	{@render children()}
</main>
