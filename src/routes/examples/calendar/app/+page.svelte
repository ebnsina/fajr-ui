<script lang="ts">
	import PageMeta from '$lib/components/site/page-meta.svelte';
	import { base } from '$app/paths';
	import {
		Badge,
		Button,
		Calendar,
		Checkbox,
		DatePicker,
		Dialog,
		DialogClose,
		DialogFooter,
		DialogHeader,
		DialogPanel,
		DialogTitle,
		Field,
		FieldLabel,
		Input,
		Label,
		Popover,
		PopoverPopup,
		PopoverTrigger,
		Select,
		SelectItem,
		Separator,
		ToggleGroup,
		ToggleGroupItem
	} from '$lib/components/ui';
	import { cn } from '$lib/utils';
	import AccentSwitcher from '$lib/components/site/accent-switcher.svelte';
	import ModeSwitcher from '$lib/components/site/mode-switcher.svelte';
	import {
		BUSINESS_END,
		BUSINESS_START,
		CALENDARS,
		HOUR_END,
		HOUR_HEIGHT,
		HOUR_START,
		LOCALES,
		SNAP_MINUTES,
		firstDayOf,
		formatTime,
		isRTL,
		layOut,
		makeSchedule,
		toISODate,
		weekNumber,
		weekdayNames,
		type CalendarId,
		type ScheduleEvent
	} from '$lib/data/schedule';

	type View = 'month' | 'week' | 'day' | 'agenda';

	// A fixed anchor so the example reads the same for everyone rather than
	// depending on when it happens to be opened.
	const ANCHOR = new Date(2026, 7, 1);
	const today = toISODate(new Date());

	let view = $state<View>('week');
	let cursor = $state(new Date(ANCHOR));
	let visible = $state<CalendarId[]>(CALENDARS.map((entry) => entry.id));
	let picked = $state<string | undefined>(toISODate(ANCHOR));
	let events = $state<ScheduleEvent[]>(makeSchedule(ANCHOR));

	const shown = $derived(events.filter((event) => visible.includes(event.calendar)));

	const byDate = $derived.by(() => {
		// Rebuilt from scratch on every recompute and never mutated afterwards, so its own reactivity would never fire.
		// eslint-disable-next-line svelte/prefer-svelte-reactivity
		const map = new Map<string, ScheduleEvent[]>();
		for (const event of shown) {
			const list = map.get(event.date) ?? [];
			list.push(event);
			map.set(event.date, list);
		}
		for (const list of map.values()) list.sort((a, b) => (a.start ?? -1) - (b.start ?? -1));
		return map;
	});

	const heading = $derived.by(() => {
		if (view === 'day') {
			return new Intl.DateTimeFormat(locale, {
				weekday: 'long',
				day: 'numeric',
				month: 'long',
				year: 'numeric'
			}).format(focusDate);
		}
		return new Intl.DateTimeFormat(locale, { month: 'long', year: 'numeric' }).format(cursor);
	});

	const focusDate = $derived(picked ? new Date(`${picked}T00:00:00`) : cursor);

	/*
	 * Locale drives more than the words: which day the week starts on, and
	 * whether time reads on a twelve or twenty-four hour clock. Deriving all
	 * three from one setting is what stops a German calendar showing "2pm".
	 */
	let locale = $state('en-US');
	const firstDay = $derived(firstDayOf(locale));
	const dayNames = $derived(weekdayNames(locale, firstDay));
	const rtl = $derived(isRTL(locale));
	const time = (minutes: number) => formatTime(minutes, locale);

	/** Always six rows, so paging never changes the grid's height. */
	const monthCells = $derived.by(() => {
		const first = new Date(cursor.getFullYear(), cursor.getMonth(), 1);
		const lead = (first.getDay() - (firstDay % 7) + 7) % 7;
		return Array.from({ length: 42 }, (_, index) => {
			const date = new Date(first.getFullYear(), first.getMonth(), index + 1 - lead);
			return { date, iso: toISODate(date), outside: date.getMonth() !== cursor.getMonth() };
		});
	});

	const columns = $derived.by(() => {
		if (view === 'day') return [{ date: focusDate, iso: toISODate(focusDate) }];
		const offset = (focusDate.getDay() - (firstDay % 7) + 7) % 7;
		return Array.from({ length: 7 }, (_, index) => {
			const date = new Date(
				focusDate.getFullYear(),
				focusDate.getMonth(),
				focusDate.getDate() - offset + index
			);
			return { date, iso: toISODate(date) };
		});
	});

	const agenda = $derived.by(() => {
		const days: { date: Date; iso: string; list: ScheduleEvent[] }[] = [];
		for (let index = 0; index < 30; index++) {
			const date = new Date(
				focusDate.getFullYear(),
				focusDate.getMonth(),
				focusDate.getDate() + index
			);
			const iso = toISODate(date);
			const list = byDate.get(iso) ?? [];
			if (list.length) days.push({ date, iso, list });
		}
		return days;
	});

	const hours = Array.from({ length: HOUR_END - HOUR_START }, (_, index) => HOUR_START + index);

	// The current-time line, refreshed each minute rather than on every frame.
	let nowMinutes = $state(new Date().getHours() * 60 + new Date().getMinutes());
	$effect(() => {
		const timer = setInterval(() => {
			const now = new Date();
			nowMinutes = now.getHours() * 60 + now.getMinutes();
		}, 60_000);
		return () => clearInterval(timer);
	});
	const nowOffset = $derived(((nowMinutes - HOUR_START * 60) / 60) * HOUR_HEIGHT);
	const nowVisible = $derived(nowMinutes >= HOUR_START * 60 && nowMinutes <= HOUR_END * 60);

	function move(step: number) {
		// A local copy, stepped and then formatted. The state it feeds is the ISO string, not this.
		// eslint-disable-next-line svelte/prefer-svelte-reactivity
		const next = new Date(view === 'day' || view === 'agenda' ? focusDate : cursor);
		if (view === 'month') next.setMonth(next.getMonth() + step);
		else if (view === 'week') next.setDate(next.getDate() + step * 7);
		else next.setDate(next.getDate() + step);
		cursor = next;
		if (view !== 'month') picked = toISODate(next);
	}

	function goToday() {
		cursor = new Date();
		picked = today;
	}

	const tokenFor = (id: CalendarId) => CALENDARS.find((entry) => entry.id === id)?.token ?? '';

	/*
	 * Dragging moves an event between columns and down the day, snapping to the
	 * quarter hour. Pointer capture keeps the gesture alive when the pointer
	 * leaves the chip, which is most of the drag.
	 */
	let dragging = $state<string | null>(null);
	let dragOffset = $state(0);
	let grid = $state<HTMLElement | null>(null);

	function startDrag(event: PointerEvent, item: ScheduleEvent) {
		if (event.button !== 0 || item.start === null) return;
		event.preventDefault();
		(event.currentTarget as HTMLElement).setPointerCapture(event.pointerId);
		dragging = item.id;
		dragOffset = 0;
	}

	function onDragMove(event: PointerEvent, item: ScheduleEvent) {
		if (dragging !== item.id) return;
		dragOffset = event.movementY + dragOffset;
	}

	function endDrag(event: PointerEvent, item: ScheduleEvent) {
		if (dragging !== item.id) return;
		dragging = null;

		const deltaMinutes = Math.round((dragOffset / HOUR_HEIGHT) * 60);
		const snapped = Math.round(deltaMinutes / SNAP_MINUTES) * SNAP_MINUTES;
		dragOffset = 0;
		if (snapped === 0) return;

		const nextStart = Math.min(
			HOUR_END * 60 - item.minutes,
			Math.max(HOUR_START * 60, (item.start ?? 0) + snapped)
		);
		events = events.map((entry) => (entry.id === item.id ? { ...entry, start: nextStart } : entry));
	}

	/*
	 * Creating an event. Clicking empty space in any view opens the form with the
	 * date and time already filled in from where the click landed, so the common
	 * case is a title and Enter.
	 */
	let composing = $state(false);
	let draft = $state({
		title: '',
		date: today,
		start: 9 * 60,
		minutes: 60,
		calendar: 'scriptorium' as CalendarId,
		allDay: false
	});

	function compose(date: string, start: number | null) {
		draft = {
			title: '',
			date,
			start: start ?? 9 * 60,
			minutes: 60,
			calendar: visible[0] ?? 'scriptorium',
			allDay: start === null
		};
		composing = true;
	}

	/** Turns a click in a day column into the quarter hour it landed on. */
	function composeFromClick(event: MouseEvent, iso: string) {
		if (event.target !== event.currentTarget) return;
		const bounds = (event.currentTarget as HTMLElement).getBoundingClientRect();
		const minutes = ((event.clientY - bounds.top) / HOUR_HEIGHT) * 60 + HOUR_START * 60;
		compose(iso, Math.round(minutes / SNAP_MINUTES) * SNAP_MINUTES);
	}

	function save() {
		if (!draft.title.trim()) return;
		events = [
			...events,
			{
				id: `evt-${crypto.randomUUID()}`,
				title: draft.title.trim(),
				date: draft.date,
				start: draft.allDay ? null : draft.start,
				minutes: draft.minutes,
				calendar: draft.calendar
			}
		];
		// A new event on a hidden calendar would vanish the moment it was made.
		if (!visible.includes(draft.calendar)) visible = [...visible, draft.calendar];
		composing = false;
	}

	/** Arrows page, and the first letter of each view switches to it. */
	/*
	 * Single-character shortcuts, so they must stand down wherever a keystroke
	 * could mean something else. Guarding `HTMLInputElement` alone was not
	 * enough: with focus on the locale combobox, "d" switched the view to Day
	 * instead of jumping to a language, and "n" opened the new-event dialog.
	 */
	function onkeydown(event: KeyboardEvent) {
		if (
			(event.target as HTMLElement | null)?.closest(
				'input, textarea, select, [contenteditable], [role="combobox"], [role="listbox"], [role="textbox"]'
			) ||
			composing
		)
			return;
		if (event.key === 'n') {
			compose(picked ?? today, null);
			event.preventDefault();
			return;
		}
		const map: Record<string, View> = { m: 'month', w: 'week', d: 'day', a: 'agenda' };
		if (map[event.key]) {
			view = map[event.key];
		} else if (event.key === 'ArrowLeft') {
			move(-1);
		} else if (event.key === 'ArrowRight') {
			move(1);
		} else if (event.key.toLowerCase() === 't') {
			goToday();
		} else {
			return;
		}
		event.preventDefault();
	}
</script>

<PageMeta
	title="Calendar"
	description="A month view with keyboard navigation, built from the library's calendar and popover."
/>
<svelte:window {onkeydown} />

<!-- Logical properties throughout mean an RTL locale needs only `dir`. -->
<div dir={rtl ? 'rtl' : 'ltr'} class="flex h-svh flex-col bg-sidebar">
	<header class="flex h-14 shrink-0 items-center gap-2 border-b bg-background px-4">
		<a
			href="{base}/examples/calendar"
			class="font-heading font-bold [font-variation-settings:'GEOM'_50,'opsz'_32]"
		>
			Fajr UI
		</a>
		<Separator orientation="vertical" class="mx-1 h-4" decorative />

		<Button size="sm" variant="outline" onclick={goToday}>Today</Button>
		<div class="flex items-center">
			<Button size="icon-sm" variant="ghost" aria-label="Previous" onclick={() => move(-1)}>
				<svg
					aria-hidden="true"
					viewBox="0 0 24 24"
					fill="none"
					stroke="currentColor"
					stroke-width="2"
					stroke-linecap="round"
					stroke-linejoin="round"><path d="m15 18-6-6 6-6" /></svg
				>
			</Button>
			<Button size="icon-sm" variant="ghost" aria-label="Next" onclick={() => move(1)}>
				<svg
					aria-hidden="true"
					viewBox="0 0 24 24"
					fill="none"
					stroke="currentColor"
					stroke-width="2"
					stroke-linecap="round"
					stroke-linejoin="round"><path d="m9 18 6-6-6-6" /></svg
				>
			</Button>
		</div>

		<!-- A width floor and tabular figures, so the label cannot resize as it changes. -->
		<h1
			class="min-w-60 truncate font-heading text-base font-semibold tabular-nums"
			aria-live="polite"
		>
			{heading}
		</h1>

		<div class="ms-auto flex items-center gap-2">
			<ToggleGroup bind:value={view} variant="outline" label="View">
				<ToggleGroupItem value="month" size="sm">Month</ToggleGroupItem>
				<ToggleGroupItem value="week" size="sm">Week</ToggleGroupItem>
				<ToggleGroupItem value="day" size="sm">Day</ToggleGroupItem>
				<ToggleGroupItem value="agenda" size="sm">Agenda</ToggleGroupItem>
			</ToggleGroup>
			<Select bind:value={locale} class="w-36" aria-label="Language and region">
				{#each LOCALES as entry (entry.value)}
					<SelectItem value={entry.value}>{entry.label}</SelectItem>
				{/each}
			</Select>
			<AccentSwitcher />
			<ModeSwitcher />
		</div>
	</header>

	<div class="flex min-h-0 flex-1">
		<aside class="hidden w-68 shrink-0 flex-col gap-4 border-e bg-background p-4 lg:flex">
			<Calendar
				bind:value={picked}
				class="w-full [--cell-size:--spacing(8)] sm:[--cell-size:--spacing(8)]"
			/>
			<Separator decorative />
			<div class="flex flex-col gap-2">
				<p class="text-sm font-medium">Calendars</p>
				{#each CALENDARS as entry (entry.id)}
					<Label class="flex items-center gap-2.5 font-normal">
						<input
							type="checkbox"
							class="sr-only"
							checked={visible.includes(entry.id)}
							onchange={() =>
								(visible = visible.includes(entry.id)
									? visible.filter((id) => id !== entry.id)
									: [...visible, entry.id])}
						/>
						<span
							aria-hidden="true"
							class={cn(
								'flex size-4 shrink-0 items-center justify-center rounded-[0.25rem] border transition-colors',
								visible.includes(entry.id) ? 'border-transparent' : 'border-input'
							)}
							style={visible.includes(entry.id) ? `background: ${entry.token}` : ''}
						>
							{#if visible.includes(entry.id)}
								<svg
									class="size-3 text-background"
									aria-hidden="true"
									viewBox="0 0 24 24"
									fill="none"
									stroke="currentColor"
									stroke-width="3"
									stroke-linecap="round"
									stroke-linejoin="round"><path d="M20 6 9 17l-5-5" /></svg
								>
							{/if}
						</span>
						{entry.label}
					</Label>
				{/each}
			</div>
			<Separator decorative />
			<dl class="flex flex-col gap-1 text-xs text-muted-foreground">
				<div class="flex justify-between">
					<dt>Views</dt>
					<dd class="font-mono">M W D A</dd>
				</div>
				<div class="flex justify-between">
					<dt>Page</dt>
					<dd class="font-mono">← →</dd>
				</div>
				<div class="flex justify-between">
					<dt>Today</dt>
					<dd class="font-mono">T</dd>
				</div>
				<div class="flex justify-between">
					<dt>New event</dt>
					<dd class="font-mono">N</dd>
				</div>
			</dl>
		</aside>

		<main class="flex min-w-0 flex-1 flex-col overflow-hidden bg-background">
			{#if view === 'month'}
				<div class="grid shrink-0 grid-cols-[3rem_repeat(7,minmax(0,1fr))] border-b">
					<div class="px-2 py-1.5 text-center text-xs font-medium text-muted-foreground">Wk</div>
					{#each dayNames as day (day)}
						<div class="px-2 py-1.5 text-center text-xs font-medium text-muted-foreground">
							{day}
						</div>
					{/each}
				</div>

				<div
					class="grid min-h-0 flex-1 grid-cols-[3rem_repeat(7,minmax(0,1fr))] grid-rows-6 overflow-auto"
				>
					{#each monthCells as cell, index (cell.iso)}
						{#if index % 7 === 0}
							<div
								class="flex items-start justify-center border-e border-b bg-muted/32 p-1.5 text-xs text-muted-foreground tabular-nums"
							>
								{weekNumber(cell.date)}
							</div>
						{/if}
						{@const list = byDate.get(cell.iso) ?? []}
						<!-- svelte-ignore a11y_click_events_have_key_events, a11y_no_static_element_interactions -->
						<div
							class={cn(
								'flex min-h-24 min-w-0 cursor-pointer flex-col gap-0.5 border-e border-b p-1.5',
								cell.outside && 'bg-muted/32'
							)}
							onclick={(e) => {
								if (e.target === e.currentTarget) compose(cell.iso, null);
							}}
						>
							<span
								class={cn(
									'flex size-6 shrink-0 items-center justify-center self-start rounded-full text-xs tabular-nums',
									cell.outside && 'text-muted-foreground',
									cell.iso === today && 'bg-primary font-medium text-primary-foreground'
								)}
							>
								{cell.date.getDate()}
							</span>
							{#each list.slice(0, 3) as event (event.id)}
								{@render chip(event)}
							{/each}
							{#if list.length > 3}
								<Button
									variant="link"
									size="xs"
									class="h-auto justify-start px-1 py-0 font-normal text-muted-foreground"
									onclick={() => {
										picked = cell.iso;
										view = 'day';
									}}
								>
									{list.length - 3} more
								</Button>
							{/if}
						</div>
					{/each}
				</div>
			{:else if view === 'agenda'}
				<div class="min-h-0 flex-1 overflow-auto">
					{#if agenda.length === 0}
						<p class="p-8 text-center text-sm text-muted-foreground">Nothing scheduled.</p>
					{/if}
					{#each agenda as day (day.iso)}
						<div class="flex gap-4 border-b px-6 py-4">
							<div class="w-24 shrink-0">
								<p
									class={cn(
										'text-sm font-medium tabular-nums',
										day.iso === today && 'text-primary'
									)}
								>
									{new Intl.DateTimeFormat(locale, { day: 'numeric', month: 'short' }).format(
										day.date
									)}
								</p>
								<p class="text-xs text-muted-foreground">
									{new Intl.DateTimeFormat(locale, { weekday: 'long' }).format(day.date)}
								</p>
							</div>
							<div class="flex min-w-0 flex-1 flex-col gap-1">
								{#each day.list as event (event.id)}
									<div class="flex items-center gap-2.5">
										<span
											aria-hidden="true"
											class="size-1.5 shrink-0 rounded-full"
											style="background: {tokenFor(event.calendar)}"
										></span>
										<span class="w-20 shrink-0 text-xs text-muted-foreground tabular-nums">
											{event.start === null ? 'All day' : formatTime(event.start)}
										</span>
										<span class="truncate text-sm">{event.title}</span>
										{#if event.location}
											<span class="ms-auto hidden shrink-0 text-xs text-muted-foreground sm:block"
												>{event.location}</span
											>
										{/if}
									</div>
								{/each}
							</div>
						</div>
					{/each}
				</div>
			{:else}
				{@const cols = columns}
				<div
					class="grid shrink-0 border-b"
					style="grid-template-columns: 3.5rem repeat({cols.length}, minmax(0,1fr))"
				>
					<div></div>
					{#each cols as day (day.iso)}
						<div class="px-2 py-1.5 text-center">
							<p class="text-xs font-medium text-muted-foreground">
								{new Intl.DateTimeFormat(locale, { weekday: 'short' }).format(day.date)}
							</p>
							<p
								class={cn(
									'mx-auto mt-0.5 flex size-6 items-center justify-center rounded-full text-sm tabular-nums',
									day.iso === today && 'bg-primary font-medium text-primary-foreground'
								)}
							>
								{day.date.getDate()}
							</p>
						</div>
					{/each}
				</div>

				<!-- All-day entries sit above the time grid; they have no position in it. -->
				<div
					class="grid shrink-0 border-b bg-muted/24"
					style="grid-template-columns: 3.5rem repeat({cols.length}, minmax(0,1fr))"
				>
					<div class="px-2 py-1 text-end text-xs text-muted-foreground">All day</div>
					{#each cols as day (day.iso)}
						{@const allDay = (byDate.get(day.iso) ?? []).filter((event) => event.start === null)}
						<div class="min-h-8 border-s p-1">
							{#each allDay as event (event.id)}
								{@render chip(event)}
							{/each}
						</div>
					{/each}
				</div>

				<div class="min-h-0 flex-1 overflow-auto">
					<div
						bind:this={grid}
						class="relative grid"
						style="grid-template-columns: 3.5rem repeat({cols.length}, minmax(0,1fr))"
					>
						<div>
							{#each hours as hour (hour)}
								<div class="h-14 border-b pe-2 text-end">
									<span class="text-xs text-muted-foreground tabular-nums">{time(hour * 60)}</span>
								</div>
							{/each}
						</div>

						{#each cols as day (day.iso)}
							{@const laid = layOut(byDate.get(day.iso) ?? [])}
							<!-- svelte-ignore a11y_click_events_have_key_events, a11y_no_static_element_interactions -->
							<div
								class="relative cursor-pointer border-s"
								onclick={(e) => composeFromClick(e, day.iso)}
							>
								{#each hours as hour (hour)}
									<!-- Outside working hours is shaded, so the working day reads first. -->
									<div
										class={cn(
											'pointer-events-none h-14 border-b',
											(hour < BUSINESS_START || hour >= BUSINESS_END) && 'bg-muted/24'
										)}
									></div>
								{/each}

								{#if day.iso === today && nowVisible}
									<div
										class="pointer-events-none absolute inset-x-0 z-20 flex items-center"
										style="top: {nowOffset}px"
									>
										<span class="size-2 shrink-0 rounded-full bg-destructive"></span>
										<span class="h-px flex-1 bg-destructive"></span>
									</div>
								{/if}

								{#each laid as event (event.id)}
									{@const top = (((event.start ?? 0) - HOUR_START * 60) / 60) * HOUR_HEIGHT}
									{@const height = Math.max(22, (event.minutes / 60) * HOUR_HEIGHT)}
									{@const width = 100 / event.lanes}
									<Popover>
										<PopoverTrigger
											variant="ghost"
											class={cn(
												'absolute h-auto flex-col items-start gap-0 overflow-hidden rounded-md px-1.5 py-1 text-start text-xs font-normal',
												dragging === event.id && 'z-30 opacity-80 shadow-lg/10'
											)}
											style="top: {top +
												(dragging === event.id
													? dragOffset
													: 0)}px; height: {height}px; left: calc({event.lane *
												width}% + 2px); width: calc({width}% - 4px); background: color-mix(in srgb, {tokenFor(
												event.calendar
											)} 12%, transparent)"
											onpointerdown={(e: PointerEvent) => startDrag(e, event)}
											onpointermove={(e: PointerEvent) => onDragMove(e, event)}
											onpointerup={(e: PointerEvent) => endDrag(e, event)}
											onpointercancel={(e: PointerEvent) => endDrag(e, event)}
										>
											<span class="flex w-full items-center gap-1.5">
												<span
													aria-hidden="true"
													class="size-1.5 shrink-0 rounded-full"
													style="background: {tokenFor(event.calendar)}"
												></span>
												<span class="truncate font-medium">{event.title}</span>
											</span>
											<span class="w-full truncate ps-3 text-muted-foreground">
												{time(event.start ?? 0)}
											</span>
										</PopoverTrigger>
										<PopoverPopup side="right" align="start" label={event.title}>
											{@render detail(event)}
										</PopoverPopup>
									</Popover>
								{/each}
							</div>
						{/each}
					</div>
				</div>
			{/if}
		</main>
	</div>
</div>

<Dialog bind:open={composing} title="New event">
	<DialogHeader>
		<DialogTitle>New event</DialogTitle>
	</DialogHeader>
	<DialogPanel>
		<form
			class="flex flex-col gap-4"
			onsubmit={(e) => {
				e.preventDefault();
				save();
			}}
		>
			<Field>
				<FieldLabel>Title</FieldLabel>
				<Input bind:value={draft.title} autofocus placeholder="Copy Book IV" />
			</Field>

			<div class="grid grid-cols-2 gap-3">
				<Field>
					<FieldLabel>Date</FieldLabel>
					<!-- `DatePicker`, not `<input type="date">`: the native control paints
					     its own calendar in the operating system's style, ignores the
					     theme, and looks different on every platform. -->
					<DatePicker bind:value={draft.date} {locale} />
				</Field>
				<Field>
					<FieldLabel>Calendar</FieldLabel>
					<Select bind:value={draft.calendar}>
						{#each CALENDARS as entry (entry.id)}
							<SelectItem value={entry.id}>{entry.label}</SelectItem>
						{/each}
					</Select>
				</Field>
			</div>

			<Label class="flex items-center gap-2.5 font-normal">
				<Checkbox bind:checked={draft.allDay} />
				All day
			</Label>

			{#if !draft.allDay}
				<div class="grid grid-cols-2 gap-3">
					<Field>
						<FieldLabel>Starts</FieldLabel>
						<Select bind:value={() => String(draft.start), (next) => (draft.start = Number(next))}>
							{#each Array.from({ length: (HOUR_END - HOUR_START) * 4 }, (_, i) => HOUR_START * 60 + i * SNAP_MINUTES) as minutes (minutes)}
								<SelectItem value={String(minutes)}>{time(minutes)}</SelectItem>
							{/each}
						</Select>
					</Field>
					<Field>
						<FieldLabel>Lasts</FieldLabel>
						<Select
							bind:value={() => String(draft.minutes), (next) => (draft.minutes = Number(next))}
						>
							{#each [15, 30, 45, 60, 90, 120, 180] as minutes (minutes)}
								<SelectItem value={String(minutes)}>{minutes} min</SelectItem>
							{/each}
						</Select>
					</Field>
				</div>
			{/if}

			<!--
				Not a visible control: a hidden submit so Enter in any field submits the
				form. The visible Save lives in the footer, outside the form element.
			-->
			<button type="submit" class="sr-only">Save</button>
		</form>
	</DialogPanel>
	<DialogFooter>
		<DialogClose variant="outline">Cancel</DialogClose>
		<Button onclick={save} disabled={!draft.title.trim()}>Save</Button>
	</DialogFooter>
</Dialog>

{#snippet chip(event: ScheduleEvent)}
	<Popover>
		<PopoverTrigger
			variant="ghost"
			class="h-auto w-full justify-start gap-1.5 truncate rounded-sm px-1 py-0.5 text-start text-xs font-normal"
		>
			<span
				aria-hidden="true"
				class="size-1.5 shrink-0 rounded-full"
				style="background: {tokenFor(event.calendar)}"
			></span>
			<span class="truncate">
				{#if event.start !== null}{time(event.start)}{/if}
				{event.title}
			</span>
		</PopoverTrigger>
		<PopoverPopup side="bottom" align="start" label={event.title}>
			{@render detail(event)}
		</PopoverPopup>
	</Popover>
{/snippet}

{#snippet detail(event: ScheduleEvent)}
	<div class="flex w-64 flex-col gap-2 p-4">
		<div class="flex items-start gap-2">
			<span
				aria-hidden="true"
				class="mt-1.5 size-2 shrink-0 rounded-full"
				style="background: {tokenFor(event.calendar)}"
			></span>
			<div class="min-w-0">
				<p class="text-sm font-medium">{event.title}</p>
				<p class="text-xs text-muted-foreground">
					{new Intl.DateTimeFormat(locale, {
						weekday: 'long',
						day: 'numeric',
						month: 'long'
					}).format(new Date(`${event.date}T00:00:00`))}
					{#if event.start !== null}
						· {time(event.start)}–{time(event.start + event.minutes)}
					{:else}
						· All day
					{/if}
				</p>
			</div>
		</div>
		{#if event.location}<p class="text-xs text-muted-foreground">{event.location}</p>{/if}
		{#if event.people?.length}
			<div class="flex flex-wrap gap-1">
				{#each event.people as person (person)}<Badge variant="secondary">{person}</Badge>{/each}
			</div>
		{/if}
	</div>
{/snippet}
