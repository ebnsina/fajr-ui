<script lang="ts">
	import { Label, RadioGroup, RadioGroupItem } from '$lib/components/ui';

	let access = $state('reading');
</script>

<RadioGroup bind:value={access} label="Where to work" orientation="vertical">
	<Label><RadioGroupItem value="reading" /> Reading room</Label>
	<Label><RadioGroupItem value="copying" /> Copying desk</Label>
	<Label><RadioGroupItem value="restricted" /> Restricted vault</Label>
</RadioGroup>
