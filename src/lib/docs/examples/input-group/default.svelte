<script lang="ts">
	import { InputGroup, InputGroupAddon, InputGroupInput, Kbd } from '$lib/components/ui';
	import { Icon, SearchIcon } from '$lib/icons';
</script>

<div class="w-full max-w-sm">
	<InputGroup>
		<InputGroupAddon><Icon icon={SearchIcon} /></InputGroupAddon>
		<InputGroupInput placeholder="Search the catalogue…" />
		<InputGroupAddon align="inline-end"><Kbd>⌘K</Kbd></InputGroupAddon>
	</InputGroup>
</div>
