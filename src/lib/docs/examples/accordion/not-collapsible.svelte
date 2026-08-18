<script lang="ts">
	import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '$lib/components/ui';

	let value = $state<string | undefined>('vault');

	const faqs = [
		{
			value: 'vault',
			q: 'Which works stay in the vault?',
			a: 'Anything older than four centuries, and every unique copy, whatever its age.'
		},
		{
			value: 'seal',
			q: 'What does the librarian’s seal mean?',
			a: 'That the volume was released deliberately, and that its return is somebody’s named responsibility.'
		},
		{
			value: 'damage',
			q: 'How is damage reported?',
			a: 'On the conservation slip tucked into the binding, before the volume is refiled rather than after.'
		}
	];
</script>

<!-- `collapsible={false}` keeps one panel open at all times. -->
<div class="w-full max-w-md">
	<Accordion collapsible={false} bind:value>
		{#each faqs as faq (faq.value)}
			<AccordionItem value={faq.value}>
				<AccordionTrigger>{faq.q}</AccordionTrigger>
				<AccordionContent>{faq.a}</AccordionContent>
			</AccordionItem>
		{/each}
	</Accordion>
</div>
