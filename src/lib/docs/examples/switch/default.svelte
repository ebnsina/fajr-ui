<script lang="ts">
	import { Label, Switch } from '$lib/components/ui';

	let notify = $state(false);
</script>

<Label><Switch bind:checked={notify} /> Catalogue notices</Label>
