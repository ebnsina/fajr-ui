<script lang="ts">
	import {
		Frame,
		FrameDescription,
		FrameFooter,
		FrameHeader,
		FramePanel,
		FrameTitle
	} from '$lib/components/ui';
</script>

<div class="w-full max-w-md">
	<Frame>
		<FrameHeader>
			<FrameTitle>Section header</FrameTitle>
			<FrameDescription>Brief description about the section</FrameDescription>
		</FrameHeader>
		<FramePanel>
			<FrameTitle>Section title</FrameTitle>
			<FrameDescription>Section description</FrameDescription>
		</FramePanel>
		<FrameFooter class="text-sm text-muted-foreground">Footer</FrameFooter>
	</Frame>
</div>
