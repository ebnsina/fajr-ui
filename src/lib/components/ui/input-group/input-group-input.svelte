<script lang="ts">
	import Input, { type InputProps } from '../input.svelte';

	let { class: className, value = $bindable(), ...rest }: InputProps = $props();
</script>

<!-- Unstyled: the group owns the border, background and focus ring. -->
<Input bind:value unstyled class={className} inputClass="px-3" {...rest} />
