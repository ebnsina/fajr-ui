<script lang="ts">
	import { OtpField } from '$lib/components/ui';

	let otp = $state('');
</script>

<OtpField bind:value={otp} />
