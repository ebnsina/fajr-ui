<script lang="ts">
	import { base } from '$app/paths';
	import {
		Breadcrumb,
		BreadcrumbItem,
		BreadcrumbLink,
		BreadcrumbList,
		BreadcrumbPage,
		BreadcrumbSeparator
	} from '$lib/components/ui';
</script>

<Breadcrumb>
	<BreadcrumbList>
		<BreadcrumbItem><BreadcrumbLink href="{base}/">Home</BreadcrumbLink></BreadcrumbItem>
		<BreadcrumbSeparator />
		<BreadcrumbItem><BreadcrumbLink href="{base}/docs">Docs</BreadcrumbLink></BreadcrumbItem>
		<BreadcrumbSeparator />
		<BreadcrumbItem><BreadcrumbPage>Breadcrumb</BreadcrumbPage></BreadcrumbItem>
	</BreadcrumbList>
</Breadcrumb>
