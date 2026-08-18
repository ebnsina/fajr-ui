<script lang="ts">
	import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '$lib/components/ui';

	let value = $state<string[]>(['shelfmark']);

	const faqs = [
		{
			value: 'shelfmark',
			q: 'What does a shelfmark record?',
			a: 'The room, the case and the position on the shelf — in that order, so a volume can be refiled without consulting the catalogue.'
		},
		{
			value: 'arrival',
			q: 'How is a new acquisition entered?',
			a: 'It is weighed, collated and given a provisional mark, then catalogued once the discipline has been settled.'
		},
		{
			value: 'bequest',
			q: 'Where do the Samarkand volumes sit?',
			a: 'In the third room, alongside the astronomical tables they were bequeathed with.'
		}
	];
</script>

<div class="w-full max-w-md">
	<Accordion type="multiple" bind:value>
		{#each faqs as faq (faq.value)}
			<AccordionItem value={faq.value}>
				<AccordionTrigger>{faq.q}</AccordionTrigger>
				<AccordionContent>{faq.a}</AccordionContent>
			</AccordionItem>
		{/each}
	</Accordion>
</div>
