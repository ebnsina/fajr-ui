<script lang="ts">
	import Textarea, { type TextareaProps } from '../textarea.svelte';

	let { class: className, value = $bindable(), ...rest }: TextareaProps = $props();
</script>

<!-- Unstyled: the group owns the border, background and focus ring. -->
<Textarea bind:value unstyled class={className} {...rest} />
