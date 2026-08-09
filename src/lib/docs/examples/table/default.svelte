<script lang="ts">
	import {
		Badge,
		Table,
		TableBody,
		TableCaption,
		TableCell,
		TableFooter,
		TableHead,
		TableHeader,
		TableRow
	} from '$lib/components/ui';

	const manuscripts = [
		{
			title: 'The Canon of Medicine',
			scholar: 'Ibn Sina',
			status: 'copied',
			tone: 'success',
			folios: 1240
		},
		{
			title: 'The Book of Optics',
			scholar: 'Ibn al-Haytham',
			status: 'in review',
			tone: 'warning',
			folios: 860
		},
		{
			title: 'The Compendious Book',
			scholar: 'Al-Khwarizmi',
			status: 'copied',
			tone: 'success',
			folios: 320
		},
		{
			title: 'The Book of Roger',
			scholar: 'Al-Idrisi',
			status: 'on hold',
			tone: 'error',
			folios: 540
		}
	] as const;

	const TONE_DOT = {
		success: 'bg-success',
		warning: 'bg-warning',
		error: 'bg-destructive'
	} as const;

	const totalFolios = manuscripts.reduce((sum, entry) => sum + entry.folios, 0);
</script>

<div class="w-full max-w-2xl">
	<Table>
		<TableCaption>Manuscripts in the scriptorium.</TableCaption>
		<TableHeader>
			<TableRow>
				<TableHead>Title</TableHead>
				<TableHead>Status</TableHead>
				<TableHead>Scholar</TableHead>
				<TableHead class="text-right">Folios</TableHead>
			</TableRow>
		</TableHeader>
		<TableBody>
			{#each manuscripts as entry (entry.title)}
				<TableRow>
					<TableCell class="font-medium">{entry.title}</TableCell>
					<TableCell>
						<Badge variant="outline">
							<span class="size-1.5 rounded-full {TONE_DOT[entry.tone]}"></span>
							{entry.status}
						</Badge>
					</TableCell>
					<TableCell>{entry.scholar}</TableCell>
					<TableCell class="text-right tabular-nums">{entry.folios.toLocaleString()}</TableCell>
				</TableRow>
			{/each}
		</TableBody>
		<TableFooter>
			<TableRow>
				<TableCell colspan={3}>Total folios</TableCell>
				<TableCell class="text-right tabular-nums">{totalFolios.toLocaleString()}</TableCell>
			</TableRow>
		</TableFooter>
	</Table>
</div>
