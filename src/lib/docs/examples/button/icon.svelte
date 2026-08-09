<script lang="ts">
	import { Button } from '$lib/components/ui';
	import { Icon, PlusIcon } from '$lib/icons';
</script>

<Button size="icon">
	<Icon icon={PlusIcon} />
	<span class="sr-only">Add manuscript</span>
</Button>
