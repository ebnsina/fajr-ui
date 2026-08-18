<script lang="ts">
	import { base } from '$app/paths';
	const year = new Date().getFullYear();
</script>

<footer
	class="relative mt-8 py-6 text-muted-foreground before:absolute before:inset-x-0 before:top-0 before:h-px before:bg-border/64"
>
	<div class="container flex w-full items-center justify-center gap-2 px-4 sm:px-6">
		<p>
			© {year}
			<a class="font-heading font-bold text-foreground" href="{base}/">Fajr UI</a>
			– open source, open heart, open mind. Built by
			<a class="text-foreground underline-offset-4 hover:underline" href="https://fajlabs.com"
				>Fajr Labs</a
			>.
		</p>
	</div>
</footer>
