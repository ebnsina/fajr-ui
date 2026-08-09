<script lang="ts">
	import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '$lib/components/ui';

	let value = $state<string | undefined>('what');

	const faqs = [
		{ value: 'what', q: 'What is it?', a: 'A set of components you copy into your project.' },
		{
			value: 'why',
			q: 'Why copy rather than install?',
			a: 'Because you own the file and can edit it directly, with no configuration layer in between.'
		},
		{
			value: 'a11y',
			q: 'Is it accessible?',
			a: 'Each component owns its keyboard handling and ARIA wiring, and leans on the platform wherever the platform is already correct.'
		}
	];
</script>

<!-- `collapsible={false}` keeps one panel open at all times. -->
<div class="w-full max-w-md">
	<Accordion bind:value collapsible={false}>
		{#each faqs as faq (faq.value)}
			<AccordionItem value={faq.value}>
				<AccordionTrigger>{faq.q}</AccordionTrigger>
				<AccordionContent>{faq.a}</AccordionContent>
			</AccordionItem>
		{/each}
	</Accordion>
</div>
