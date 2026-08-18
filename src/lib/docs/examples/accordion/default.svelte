<script lang="ts">
	import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '$lib/components/ui';

	let value = $state<string | undefined>('entry');

	const faqs = [
		{
			value: 'entry',
			q: 'Who may enter the reading room?',
			a: 'Any reader with a letter from a recognised madrasa, and anyone the librarian has admitted in person.'
		},
		{
			value: 'loan',
			q: 'How long may a volume be held?',
			a: 'Forty days for a bound work, ten for loose folios. The librarian records both against your shelfmark.'
		},
		{
			value: 'copy',
			q: 'May folios be copied?',
			a: 'At the copying desk, with the librarian’s seal. Nothing leaves the room to be copied elsewhere.'
		}
	];
</script>

<div class="w-full max-w-md">
	<Accordion bind:value>
		{#each faqs as faq (faq.value)}
			<AccordionItem value={faq.value}>
				<AccordionTrigger>{faq.q}</AccordionTrigger>
				<AccordionContent>{faq.a}</AccordionContent>
			</AccordionItem>
		{/each}
	</Accordion>
</div>
