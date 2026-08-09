<script lang="ts">
	import { Icon, PlusIcon, TrendingDownIcon, TrendingUpIcon } from '$lib/icons';
	import {
		Avatar,
		Badge,
		Button,
		Card,
		CardDescription,
		CardHeader,
		CardPanel,
		CardTitle,
		Chart,
		Separator
	} from '$lib/components/ui';
	import { barY, defineChart, scaleBand, scaleLinear, tooltip } from '$lib/internal/chart';

	const stats = [
		{ label: 'Manuscripts', value: '1,284', delta: '+12.4%', up: true },
		{ label: 'Folios digitised', value: '48,920', delta: '+8.1%', up: true },
		{ label: 'Awaiting review', value: '38', delta: '−4.2%', up: false },
		{ label: 'Avg. turnaround', value: '32d', delta: '+1.8%', up: true }
	];

	const translations = [
		{
			title: 'The Canon of Medicine',
			scholar: 'Ibn Sina',
			from: 'Bukhara',
			when: 'Book IV',
			status: 'complete'
		},
		{
			title: 'The Book of Optics',
			scholar: 'Ibn al-Haytham',
			from: 'Cairo',
			when: 'Book II',
			status: 'in review'
		},
		{
			title: 'The Compendious Book on Calculation',
			scholar: 'Al-Khwarizmi',
			from: 'Baghdad',
			when: 'Chapter VI',
			status: 'complete'
		},
		{
			title: 'The Book of Roger',
			scholar: 'Al-Idrisi',
			from: 'Palermo',
			when: 'Climate III',
			status: 'on hold'
		},
		{
			title: 'The Method of Medicine',
			scholar: 'Al-Zahrawi',
			from: 'Córdoba',
			when: 'Volume XXX',
			status: 'in review'
		}
	] as const;

	const statusVariant = {
		complete: 'success',
		'in review': 'warning',
		'on hold': 'error'
	} as const;

	const copied = [
		{ day: 'Mon', folios: 42 },
		{ day: 'Tue', folios: 68 },
		{ day: 'Wed', folios: 55 },
		{ day: 'Thu', folios: 84 },
		{ day: 'Fri', folios: 61 },
		{ day: 'Sat', folios: 33 },
		{ day: 'Sun', folios: 47 }
	];

	/*
	 * At module scope, because it captures nothing reactive — rebuilding a
	 * definition on every render throws away the animation state. Derive it only
	 * when the data or options actually change.
	 */
	const folioChart = defineChart({
		marks: [barY(copied, { x: 'day', y: 'folios', fill: 'var(--chart-1)', radius: 4 })],
		x: { scale: () => scaleBand<string>().padding(0.32) },
		y: { scale: scaleLinear, nice: true, grid: true },
		tooltip: {
			use: tooltip,
			items: [
				{ channel: 'x', label: 'Day' },
				{ channel: 'y', label: 'Folios' }
			]
		}
	});

	const weekTotal = copied.reduce((sum, day) => sum + day.folios, 0);
	const bestDay = copied.reduce((best, day) => (day.folios > best.folios ? day : best));

	function initials(name: string): string {
		return name
			.split(/[\s-]/)
			.map((part) => part[0])
			.join('')
			.slice(0, 2)
			.toUpperCase();
	}
</script>

<div class="flex flex-col gap-6">
	<div class="flex flex-wrap items-center justify-between gap-3">
		<div>
			<h2 class="font-heading text-xl font-semibold">Good morning, Ebn</h2>
			<p class="text-sm text-muted-foreground">
				Here is where the House of Wisdom stands this week.
			</p>
		</div>
		<Button><Icon icon={PlusIcon} />Add manuscript</Button>
	</div>

	<div class="grid gap-4 *:min-w-0 sm:grid-cols-2 xl:grid-cols-4">
		{#each stats as stat (stat.label)}
			<Card>
				<CardHeader class="pb-2">
					<CardDescription>{stat.label}</CardDescription>
					<CardTitle class="text-2xl tabular-nums">{stat.value}</CardTitle>
				</CardHeader>
				<CardPanel class="pt-0">
					<Badge variant={stat.up ? 'success' : 'error'}>
						{#if stat.up}<Icon icon={TrendingUpIcon} />{:else}<Icon icon={TrendingDownIcon} />{/if}
						{stat.delta}
					</Badge>
					<span class="ms-2 text-xs text-muted-foreground">vs. last month</span>
				</CardPanel>
			</Card>
		{/each}
	</div>

	<div class="grid gap-4 *:min-w-0 lg:grid-cols-3">
		<Card class="lg:col-span-2">
			<CardHeader>
				<CardTitle>Translations in progress</CardTitle>
				<CardDescription>The five volumes currently on the desks.</CardDescription>
			</CardHeader>
			<CardPanel class="pt-0">
				<ul class="flex flex-col">
					{#each translations as entry, index (entry.title)}
						{#if index > 0}
							<Separator decorative />
						{/if}
						<li class="flex items-center gap-3 py-3">
							<Avatar>{initials(entry.scholar)}</Avatar>
							<div class="min-w-0 flex-1">
								<p class="truncate text-sm font-medium">{entry.title}</p>
								<p class="truncate text-xs text-muted-foreground">
									{entry.scholar} · {entry.from}
								</p>
							</div>
							<span class="hidden text-xs text-muted-foreground sm:block">{entry.when}</span>
							<Badge variant={statusVariant[entry.status]}>{entry.status}</Badge>
						</li>
					{/each}
				</ul>
			</CardPanel>
		</Card>

		<Card>
			<CardHeader>
				<CardTitle>Folios copied</CardTitle>
				<CardDescription>Last 7 days.</CardDescription>
			</CardHeader>
			<CardPanel class="pt-0">
				<!--
					Was seven divs with percentage heights and the days labelled only at
					either end, because that was all bare markup could carry. A real chart
					names every column, puts a scale on the values, and answers what a
					given day actually was on hover or focus.
				-->
				<Chart
					definition={folioChart}
					label="Folios copied per day, last seven days"
					height={168}
				/>

				<!--
					The two figures a reader would otherwise work out by squinting at the
					bars. They also give this card something to put in the height the
					taller panel beside it sets, rather than leaving it half empty.
				-->
				<Separator class="mt-4" decorative />
				<dl class="grid grid-cols-2 gap-4 pt-4">
					<div class="flex flex-col gap-0.5">
						<dt class="text-xs text-muted-foreground">This week</dt>
						<dd class="font-heading text-lg font-semibold tabular-nums">{weekTotal}</dd>
					</div>
					<div class="flex flex-col gap-0.5">
						<dt class="text-xs text-muted-foreground">Best day</dt>
						<dd class="font-heading text-lg font-semibold">
							{bestDay.day}
							<span class="text-sm text-muted-foreground tabular-nums">({bestDay.folios})</span>
						</dd>
					</div>
				</dl>
			</CardPanel>
		</Card>
	</div>
</div>
