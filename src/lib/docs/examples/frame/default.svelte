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
			<FrameTitle>Acquisitions</FrameTitle>
			<FrameDescription>What reached the library this month</FrameDescription>
		</FrameHeader>
		<FramePanel>
			<FrameTitle>The Samarkand bequest</FrameTitle>
			<FrameDescription>Fourteen volumes and two astrolabes, uncatalogued.</FrameDescription>
		</FramePanel>
		<FrameFooter class="text-sm text-muted-foreground">Recorded 12 Rajab</FrameFooter>
	</Frame>
</div>
