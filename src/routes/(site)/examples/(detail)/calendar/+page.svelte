<script lang="ts">
	import { base } from '$app/paths';
	import { Badge, Button } from '$lib/components/ui';
	import { ArrowRightIcon, Icon } from '$lib/icons';
	import CodeBlock from '$lib/components/site/code-block.svelte';
	import DocsPage from '$lib/components/site/docs-page.svelte';
	import SiteFooter from '$lib/components/site/site-footer.svelte';

	const toc = [
		{ title: 'Demo', id: 'demo' },
		{ title: 'Anatomy', id: 'anatomy' },
		{ title: 'Features', id: 'features' },
		{ title: 'Views', id: 'views' },
		{ title: 'The time grid', id: 'time-grid' },
		{ title: 'Interaction', id: 'interaction' },
		{ title: 'Data', id: 'data' },
		{ title: 'What it is built from', id: 'built-from' }
	];

	const parts = [
		['Header', 'Today, previous and next, the current period, and the view switcher.'],
		['Rail', 'A month picker for jumping about, and a checkbox per calendar to filter by.'],
		['Month grid', 'Six week rows, each cell listing its events with an overflow link.'],
		['All-day row', 'Sits above the time grid, because an all-day entry has no position in it.'],
		[
			'Time grid',
			'An hour gutter and one column per day, with events placed by start and duration.'
		],
		['Now indicator', "A line across today's column at the current time."],
		['Event chip', 'A dot for the calendar, the title, and the start time.'],
		['Detail popover', 'Opens from a chip with the full time range, location and people.']
	];

	const features = [
		['Four views', 'Month, week, day and agenda, switchable from the header or the keyboard.'],
		['Overlap layout', 'Clashing events divide the column between them and share a width.'],
		['All-day entries', 'Kept in their own row rather than pinned to an arbitrary hour.'],
		[
			'Now indicator',
			"A live line on today's column, refreshed once a minute rather than per frame."
		],
		['Working hours', 'Shaded so the working day reads before the hours around it.'],
		['Week numbers', 'ISO numbering down the side of the month grid.'],
		['Drag to reschedule', 'Move an event down the day; it lands on the nearest quarter hour.'],
		['Filtering', 'Toggle a calendar and its events leave every view at once.'],
		['Keyboard', 'M, W, D and A switch views; arrows page; T returns to today.'],
		['No layout shift', 'Paging never resizes the grid, the heading, or anything beside them.']
	];

	const built = ['Calendar', 'Popover', 'Toggle Group', 'Badge', 'Button', 'Separator', 'Label'];
</script>

<DocsPage
	title="Calendar"
	description="A scheduling screen: four views, overlapping events, and drag to reschedule."
	{toc}
>
	<p>
		A calendar exercises more of a component library than almost anything else — dense grids,
		floating panels, filtering, pointer gestures and keyboard navigation all at once. This one is
		assembled entirely from the components in this library; nothing here is a calendar package.
	</p>

	<h2 id="demo">Demo</h2>
	<p>It wants the whole viewport, so it opens on its own.</p>
	<div class="not-prose flex flex-wrap gap-2">
		<Button href="{base}/examples/calendar/app"
			>Open the calendar<Icon icon={ArrowRightIcon} /></Button
		>
	</div>

	<h2 id="anatomy">Anatomy</h2>
	<p>Eight regions, each one doing a single job:</p>
	<!--
		A drawn diagram rather than ASCII in a code block: a code block says "this is
		something you would type", which a picture of the layout is not.
	-->
	<div class="not-prose overflow-hidden rounded-xl border bg-card text-xs">
		<div class="flex items-center gap-2 border-b bg-muted/48 px-3 py-2 font-medium">
			<span class="text-muted-foreground">Header</span>
			<span class="text-muted-foreground/64">Today · ‹ › · period</span>
			<span class="ms-auto text-muted-foreground/64">Month Week Day Agenda</span>
		</div>
		<div class="flex min-h-56">
			<div class="flex w-32 shrink-0 flex-col gap-2 border-e bg-muted/24 p-3">
				<span class="font-medium text-muted-foreground">Rail</span>
				<span
					class="rounded-md border border-dashed px-2 py-3 text-center text-muted-foreground/64"
				>
					Month picker
				</span>
				<span
					class="rounded-md border border-dashed px-2 py-2 text-center text-muted-foreground/64"
				>
					Filters
				</span>
			</div>

			<div class="flex min-w-0 flex-1 flex-col">
				<div class="flex items-center gap-2 border-b px-3 py-1.5 text-muted-foreground">
					<span class="w-16 shrink-0 font-medium">All day</span>
					<span class="h-4 flex-1 rounded-sm bg-warning/24"></span>
				</div>

				<div class="flex flex-1">
					<div class="flex w-16 shrink-0 flex-col border-e text-end text-muted-foreground/64">
						{#each ['8am', '9am', '10am'] as hour (hour)}
							<span class="flex-1 border-b px-2 pt-1 tabular-nums">{hour}</span>
						{/each}
					</div>

					<div class="relative grid flex-1 grid-cols-3">
						{#each Array.from({ length: 3 }, (_, i) => i) as column (column)}
							<div class="flex flex-col border-e">
								{#each Array.from({ length: 3 }, (_, i) => i) as row (row)}
									<span class="flex-1 border-b"></span>
								{/each}
							</div>
						{/each}

						<!-- Two clashing events sharing a column, and the now indicator. -->
						<span class="absolute top-1 left-[2%] h-10 w-[14%] rounded-sm bg-primary/24"></span>
						<span class="absolute top-1 left-[18%] h-10 w-[14%] rounded-sm bg-info/24"></span>
						<span class="absolute top-14 left-[35%] h-8 w-[30%] rounded-sm bg-success/24"></span>
						<span class="absolute inset-x-0 top-12 flex items-center">
							<span class="size-1.5 rounded-full bg-destructive"></span>
							<span class="h-px flex-1 bg-destructive"></span>
						</span>
					</div>
				</div>
			</div>
		</div>
	</div>

	<p class="text-sm text-muted-foreground">
		The month view swaps the time grid for six week rows; agenda drops the grid entirely.
	</p>

	<div class="not-prose overflow-x-auto rounded-xl border">
		<table class="w-full min-w-[34rem] border-collapse text-left text-sm">
			<thead class="bg-muted/48">
				<tr>
					<th scope="col" class="px-4 py-2.5 font-medium">Region</th>
					<th scope="col" class="px-4 py-2.5 font-medium">Job</th>
				</tr>
			</thead>
			<tbody>
				{#each parts as [name, job] (name)}
					<tr class="border-t">
						<td class="px-4 py-2.5 align-top font-medium">{name}</td>
						<td class="px-4 py-2.5 align-top text-muted-foreground">{job}</td>
					</tr>
				{/each}
			</tbody>
		</table>
	</div>

	<h2 id="features">Features</h2>
	<div class="not-prose overflow-x-auto rounded-xl border">
		<table class="w-full min-w-[34rem] border-collapse text-left text-sm">
			<thead class="bg-muted/48">
				<tr>
					<th scope="col" class="px-4 py-2.5 font-medium">Feature</th>
					<th scope="col" class="px-4 py-2.5 font-medium">What it does</th>
				</tr>
			</thead>
			<tbody>
				{#each features as [name, detail] (name)}
					<tr class="border-t">
						<td class="px-4 py-2.5 align-top font-medium">{name}</td>
						<td class="px-4 py-2.5 align-top text-muted-foreground">{detail}</td>
					</tr>
				{/each}
			</tbody>
		</table>
	</div>

	<h2 id="views">Views</h2>
	<p>
		<strong>Month</strong> gives an overview: six week rows, three events per cell and a link to the
		day for the rest. <strong>Week</strong> and <strong>Day</strong> share one time grid, differing
		only in how many columns it has. <strong>Agenda</strong> drops the grid entirely and lists the next
		thirty days that have anything in them, which is the view that reads on a phone.
	</p>
	<p>
		The month grid always renders forty-two cells. A month spans four to six week rows depending on
		its length and the weekday it starts on, so rendering only the rows it needs would make the grid
		change height as you page — and everything below it would jump.
	</p>

	<h2 id="time-grid">The time grid</h2>
	<p>
		One hour is fifty-six pixels, defined once and used for every calculation, so the gutter, the
		event positions, the now indicator and the drag arithmetic cannot disagree. An event's offset is
		the distance from the first hour shown; its height is its duration.
	</p>
	<CodeBlock
		code={`const top = ((event.start - HOUR_START * 60) / 60) * HOUR_HEIGHT;
const height = Math.max(22, (event.minutes / 60) * HOUR_HEIGHT);`}
		language="ts"
	/>
	<p>
		Overlapping events are swept in start order, each taking the first lane whose previous occupant
		has finished. Everything in one run of clashes shares a lane count, which is what stops a
		two-event clash rendering as one wide chip and one narrow one.
	</p>

	<h2 id="interaction">Interaction</h2>
	<ul>
		<li>
			<strong>Drag to reschedule.</strong> Pointer capture keeps the gesture alive once the pointer leaves
			the chip — which is most of any real drag — and the drop lands on the nearest quarter hour rather
			than wherever the pointer happened to be.
		</li>
		<li>
			<strong>Click for detail.</strong> Every chip is a popover trigger, so the panel is positioned,
			dismissed on Escape and outside click, and returns focus, without any of that being written here.
		</li>
		<li>
			<strong>Keyboard.</strong> <code>M</code>, <code>W</code>, <code>D</code> and <code>A</code>
			switch views, arrows page forward and back, and <code>T</code> returns to today.
		</li>
	</ul>

	<h2 id="data">Data</h2>
	<p>
		Events are generated from a seeded pseudo-random source, so the server and the browser produce
		the same schedule and nothing changes on hydration. Dates are plain
		<code>YYYY-MM-DD</code> strings built from local parts —
		<code>toISOString</code> converts to UTC and can land on the previous day west of Greenwich.
	</p>
	<CodeBlock
		code={`type ScheduleEvent = {
  id: string;
  title: string;
  date: string;            // YYYY-MM-DD, local
  start: number | null;    // minutes from midnight; null is all-day
  minutes: number;         // duration
  calendar: CalendarId;
  location?: string;
  people?: string[];
};`}
		language="ts"
	/>

	<h2 id="built-from">What it is built from</h2>
	<div class="not-prose flex flex-wrap gap-1.5">
		{#each built as component (component)}
			<Badge
				variant="outline"
				href="{base}/docs/components/{component.toLowerCase().replace(' ', '-')}"
			>
				{component}
			</Badge>
		{/each}
	</div>
	<p>
		The grids, the lane packing and the drag maths are ordinary markup and arithmetic in the page
		itself. That is the point: none of it needed a calendar library, and none of it is hidden behind
		one.
	</p>
	<div class="not-prose pt-2 pb-2">
		<Button href="{base}/examples/calendar/app" variant="outline">
			Open the calendar<Icon icon={ArrowRightIcon} />
		</Button>
	</div>
</DocsPage>

<SiteFooter />
