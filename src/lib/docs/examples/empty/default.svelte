<script lang="ts">
	import {
		Button,
		Empty,
		EmptyActions,
		EmptyDescription,
		EmptyMedia,
		EmptyTitle
	} from '$lib/components/ui';
	import { Icon, ManuscriptIcon, PlusIcon } from '$lib/icons';
</script>

<div class="w-full max-w-md">
	<Empty>
		<EmptyMedia><Icon icon={ManuscriptIcon} /></EmptyMedia>
		<EmptyTitle>No manuscripts yet</EmptyTitle>
		<EmptyDescription>Anything added to this collection will be listed here.</EmptyDescription>
		<EmptyActions>
			<Button size="sm"><Icon icon={PlusIcon} />Add a manuscript</Button>
		</EmptyActions>
	</Empty>
</div>
