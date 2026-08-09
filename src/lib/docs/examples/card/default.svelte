<script lang="ts">
	import {
		Button,
		Card,
		CardDescription,
		CardFooter,
		CardHeader,
		CardPanel,
		CardTitle
	} from '$lib/components/ui';
</script>

<Card class="w-full max-w-sm">
	<CardHeader>
		<CardTitle>The Canon of Medicine</CardTitle>
		<CardDescription>Ibn Sina · Bukhara</CardDescription>
	</CardHeader>
	<CardPanel>
		<p class="text-sm text-muted-foreground">Five books, copied in the scriptorium at Baghdad.</p>
	</CardPanel>
	<CardFooter>
		<Button size="sm">Open</Button>
	</CardFooter>
</Card>
