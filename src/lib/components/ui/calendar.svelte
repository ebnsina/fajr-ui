<script module lang="ts">
	import type { HTMLAttributes } from 'svelte/elements';

	export type CalendarMode = 'single' | 'multiple' | 'range';

	/** Both ends are ISO dates; `end` is undefined while a range is being picked. */
	export type DateRange = { start: string; end?: string };

	export type CalendarProps = Omit<HTMLAttributes<HTMLDivElement>, 'onchange'> & {
		mode?: CalendarMode;
		/** ISO `YYYY-MM-DD` in single mode, an array in multiple, a range in range mode. */
		value?: string | string[] | DateRange;
		/** Month shown, as `YYYY-MM`. */
		month?: string;
		min?: string;
		max?: string;
		/**
		 * 0 is Sunday, 1 is Monday. Omit and it follows `locale` — the United
		 * States starts its week on Sunday, most of Europe on Monday.
		 */
		weekStartsOn?: 0 | 1;
		locale?: string;
		label?: string;
		disabled?: boolean;
	};

	/** Formats a date as `YYYY-MM-DD` in local time, avoiding UTC drift. */
	export function toISODate(date: Date): string {
		const month = String(date.getMonth() + 1).padStart(2, '0');
		const day = String(date.getDate()).padStart(2, '0');
		return `${date.getFullYear()}-${month}-${day}`;
	}

	export function fromISODate(value: string): Date | null {
		const match = /^(\d{4})-(\d{2})-(\d{2})$/.exec(value);
		if (!match) return null;
		return new Date(Number(match[1]), Number(match[2]) - 1, Number(match[3]));
	}
</script>

<script lang="ts">
	import { cn } from '$lib/utils';
	import { horizontalSign } from '$lib/internal/rtl';
	import Button from './button.svelte';

	let {
		class: className,
		mode = 'single',
		value = $bindable(),
		month = $bindable(),
		min,
		max,
		weekStartsOn,
		locale = 'en-US',
		label = 'Calendar',
		disabled,
		...rest
	}: CalendarProps = $props();

	const today = toISODate(new Date());

	/** The first selected date, whatever shape the value takes. */
	function anchorDate(current: typeof value): string | undefined {
		if (typeof current === 'string') return current;
		if (Array.isArray(current)) return current[0];
		return current?.start;
	}

	// Open on the first selected date, or the current month.
	const initialMonth = (anchorDate(value) ?? today).slice(0, 7);
	let viewMonth = $state(month ?? initialMonth);
	$effect(() => {
		if (month) viewMonth = month;
	});

	let grid = $state<HTMLElement | null>(null);
	/** The date the keyboard is on, which is not necessarily the selected one. */
	let focusedDate = $state(anchorDate(value) ?? today);

	const monthDate = $derived(
		new Date(Number(viewMonth.slice(0, 4)), Number(viewMonth.slice(5, 7)) - 1, 1)
	);

	const monthLabel = $derived(
		new Intl.DateTimeFormat(locale, { month: 'long', year: 'numeric' }).format(monthDate)
	);

	/**
	 * Where the week starts, from the locale unless the caller says otherwise.
	 *
	 * `Intl.Locale` knows this, but `getWeekInfo` is not everywhere yet, so a
	 * Monday default stands in rather than the calendar throwing. Hard-coding
	 * Monday regardless of locale is what put a Sunday-first grid next to a
	 * Monday-first one in the same view.
	 */
	const weekStart = $derived.by((): 0 | 1 => {
		if (weekStartsOn !== undefined) return weekStartsOn;
		try {
			const info = new Intl.Locale(locale) as Intl.Locale & {
				getWeekInfo?: () => { firstDay: number };
				weekInfo?: { firstDay: number };
			};
			const firstDay = info.getWeekInfo?.().firstDay ?? info.weekInfo?.firstDay ?? 1;
			// Intl numbers Monday 1 through Sunday 7; this component uses 0 or 1.
			return firstDay === 7 ? 0 : 1;
		} catch {
			return 1;
		}
	});

	const weekdays = $derived.by(() => {
		const format = new Intl.DateTimeFormat(locale, { weekday: 'short' });
		return Array.from({ length: 7 }, (_, index) => {
			// 2024-01-07 is a Sunday, so this walks a full week from the chosen start.
			const day = new Date(2024, 0, 7 + ((index + weekStart) % 7));
			return format.format(day);
		});
	});

	const days = $derived.by(() => {
		const year = monthDate.getFullYear();
		const monthIndex = monthDate.getMonth();
		const first = new Date(year, monthIndex, 1);
		// How many blanks before the 1st, given where the week starts.
		const lead = (first.getDay() - weekStart + 7) % 7;
		const length = new Date(year, monthIndex + 1, 0).getDate();

		const cells: ({ iso: string; day: number } | null)[] = Array.from({ length: lead }, () => null);
		for (let day = 1; day <= length; day++) {
			cells.push({ iso: toISODate(new Date(year, monthIndex, day)), day });
		}

		/*
		 * Padded to a full six weeks. A month occupies four, five or six rows
		 * depending on its length and which weekday it starts on, so rendering only
		 * the rows it needs made the calendar change height as you paged through it
		 * — and anything below it jumped. Six rows is the maximum any month
		 * requires, so reserving that much never shifts.
		 */
		while (cells.length < 42) cells.push(null);
		return cells;
	});

	function outOfRange(iso: string): boolean {
		return Boolean((min && iso < min) || (max && iso > max));
	}

	function isSelected(iso: string): boolean {
		if (mode === 'multiple') return Array.isArray(value) && value.includes(iso);
		if (mode === 'range') {
			const range = value as DateRange | undefined;
			if (!range) return false;
			return iso === range.start || iso === range.end;
		}
		return value === iso;
	}

	/** Strictly between the two ends, so the ends themselves stay distinct. */
	function isInRange(iso: string): boolean {
		if (mode !== 'range') return false;
		const range = value as DateRange | undefined;
		if (!range?.end) return false;
		return iso > range.start && iso < range.end;
	}

	function select(iso: string) {
		if (mode === 'multiple') {
			const list = Array.isArray(value) ? value : [];
			value = list.includes(iso) ? list.filter((entry) => entry !== iso) : [...list, iso].sort();
			return;
		}

		if (mode === 'range') {
			const range = value as DateRange | undefined;
			// A complete range restarts; an open one closes, flipping the ends if
			// the second click lands before the first.
			if (!range || range.end) {
				value = { start: iso };
			} else {
				value =
					iso < range.start ? { start: iso, end: range.start } : { start: range.start, end: iso };
			}
			return;
		}

		value = iso;
	}

	function shiftMonth(delta: number) {
		const next = new Date(monthDate.getFullYear(), monthDate.getMonth() + delta, 1);
		viewMonth = toISODate(next).slice(0, 7);
		month = viewMonth;

		/*
		 * Carry the focused day into the new month.
		 *
		 * The grid's single tab stop is the cell matching `focusedDate`. Paging
		 * used to leave it pointing at a day no longer rendered, so every cell fell
		 * to `tabindex="-1"` and the whole month became unreachable — Tab jumped
		 * straight from the Next button past the grid to whatever followed it.
		 */
		const day = Number(focusedDate.slice(8, 10));
		const lastOfMonth = new Date(next.getFullYear(), next.getMonth() + 1, 0).getDate();
		focusedDate = toISODate(
			new Date(next.getFullYear(), next.getMonth(), Math.min(day, lastOfMonth))
		);
	}

	/**
	 * The grid's one tab stop. Falls back to the first of the visible month if
	 * `focusedDate` is somehow outside it — a composite must always expose
	 * exactly one, and never zero.
	 */
	const tabStop = $derived(focusedDate.slice(0, 7) === viewMonth ? focusedDate : `${viewMonth}-01`);

	function focusDate(iso: string) {
		focusedDate = iso;
		// Following the keyboard across a month boundary should move the view too.
		if (iso.slice(0, 7) !== viewMonth) {
			viewMonth = iso.slice(0, 7);
			month = viewMonth;
		}
		queueMicrotask(() => grid?.querySelector<HTMLElement>(`[data-date="${iso}"]`)?.focus());
	}

	/**
	 * The full date, so a day announces as "Thursday, 20 August 2026" rather than
	 * as the bare number "20" — which tells a screen-reader user nothing about
	 * which month or weekday they have landed on.
	 */
	const dayFormat = $derived(
		new Intl.DateTimeFormat(locale, {
			weekday: 'long',
			day: 'numeric',
			month: 'long',
			year: 'numeric'
		})
	);

	function dayLabel(iso: string): string {
		const date = fromISODate(iso);
		return date ? dayFormat.format(date) : iso;
	}

	/**
	 * Selection, spoken.
	 *
	 * `aria-selected` sits on the `<td>`, which is the grid cell — but focus goes
	 * to the button inside it, and `aria-selected` is not a state `button`
	 * supports, so it cannot simply be repeated there. Screen readers vary in
	 * whether they announce the containing cell's state when focus moves to a
	 * widget within it, and the ones that do not left the user arrowing across a
	 * month with no way to tell which day was already chosen. Folding it into the
	 * accessible name is plain, valid, and announced everywhere.
	 */
	function buttonLabel(iso: string): string {
		return isSelected(iso) ? `${dayLabel(iso)}, selected` : dayLabel(iso);
	}

	function onkeydown(event: KeyboardEvent) {
		const current = fromISODate(focusedDate);
		if (!current) return;

		// A right-to-left month grid runs its days from the right, so Left steps
		// forward through the week. Up and down cross rows and are unaffected.
		const sign = horizontalSign(event.currentTarget as Element);
		const moves: Record<string, number> = {
			ArrowLeft: -sign,
			ArrowRight: sign,
			ArrowUp: -7,
			ArrowDown: 7
		};

		/*
		 * Page keys move by a month, not by thirty days. Thirty days from the 15th
		 * of a 31-day month lands on the 16th of the next, which is neither what
		 * the pattern specifies nor what anyone expects. The day is clamped so
		 * paging from the 31st does not skip a short month entirely.
		 */
		if (event.key === 'PageUp' || event.key === 'PageDown') {
			event.preventDefault();
			const step = event.key === 'PageUp' ? -1 : 1;
			// A local scratch date inside a key handler, read once and discarded. Nothing subscribes to it, so a reactive Date would only cost.
			// eslint-disable-next-line svelte/prefer-svelte-reactivity
			const target = new Date(current.getFullYear(), current.getMonth() + step, 1);
			const lastOfMonth = new Date(target.getFullYear(), target.getMonth() + 1, 0).getDate();
			target.setDate(Math.min(current.getDate(), lastOfMonth));
			focusDate(toISODate(target));
			return;
		}

		if (event.key === 'Home' || event.key === 'End') {
			event.preventDefault();
			const dayOfWeek = (current.getDay() - weekStart + 7) % 7;
			current.setDate(current.getDate() + (event.key === 'Home' ? -dayOfWeek : 6 - dayOfWeek));
			focusDate(toISODate(current));
			return;
		}

		const delta = moves[event.key];
		if (delta === undefined) return;
		event.preventDefault();
		current.setDate(current.getDate() + delta);
		focusDate(toISODate(current));
	}
</script>

<!--
	Days sit in a dense grid, so the usual trick of overlaying a 44px ::after would
	make neighbouring days overlap and steal each other's taps. The cell itself
	grows on a coarse pointer instead.
-->
<div
	data-slot="calendar"
	class={cn(
		'w-fit [--cell-size:--spacing(10)] sm:[--cell-size:--spacing(9)] pointer-coarse:[--cell-size:--spacing(11)] sm:pointer-coarse:[--cell-size:--spacing(11)]',
		className
	)}
	{...rest}
>
	<div class="flex items-center justify-between gap-2 pb-2">
		<Button
			size="icon-sm"
			variant="ghost"
			aria-label="Previous month"
			onclick={() => shiftMonth(-1)}
		>
			<svg
				aria-hidden="true"
				class="rtl:-scale-x-100"
				viewBox="0 0 24 24"
				fill="none"
				stroke="currentColor"
				stroke-width="2"
				stroke-linecap="round"
				stroke-linejoin="round"
			>
				<path d="m15 18-6-6 6-6" />
			</svg>
		</Button>
		<!-- Announced on change, so month navigation is audible. -->
		<div aria-live="polite" class="text-sm font-medium">{monthLabel}</div>
		<Button size="icon-sm" variant="ghost" aria-label="Next month" onclick={() => shiftMonth(1)}>
			<svg
				aria-hidden="true"
				class="rtl:-scale-x-100"
				viewBox="0 0 24 24"
				fill="none"
				stroke="currentColor"
				stroke-width="2"
				stroke-linecap="round"
				stroke-linejoin="round"
			>
				<path d="m9 18 6-6-6-6" />
			</svg>
		</Button>
	</div>

	<!--
		A real table: the column headers associate each cell with its weekday, so a
		screen reader announces "Tuesday 14" rather than a bare number.
	-->
	<!--
		`aria-multiselectable` where more than one day can be held at once. Without
		it a multiple- or range-mode grid announces exactly like a single-date one,
		so there is nothing to say that picking a second day adds to the selection
		rather than replacing it.
	-->
	<table
		bind:this={grid}
		role="grid"
		aria-label={label}
		aria-multiselectable={mode === 'single' ? undefined : 'true'}
		class="border-collapse"
		{onkeydown}
	>
		<thead>
			<tr>
				{#each weekdays as weekday (weekday)}
					<th scope="col" class="size-(--cell-size) pb-1 text-xs font-normal text-muted-foreground">
						{weekday}
					</th>
				{/each}
			</tr>
		</thead>
		<tbody>
			{#each Array.from( { length: Math.ceil(days.length / 7) }, (_, week) => days.slice(week * 7, week * 7 + 7) ) as row, weekIndex (weekIndex)}
				<tr>
					{#each row as cell, dayIndex (cell?.iso ?? `blank-${dayIndex}`)}
						{@const selected = cell ? isSelected(cell.iso) : false}
						{@const inRange = cell ? isInRange(cell.iso) : false}
						<!-- Selection lives on the grid cell; the button inside is the control. -->
						<!--
							A blank cell still claims a full cell's height. Without it the
							padded trailing rows collapse to nothing and the calendar changes
							height month to month, which is the shift the padding exists to
							prevent.
						-->
						<td
							role="gridcell"
							aria-selected={cell ? selected : undefined}
							class="size-(--cell-size) p-0"
						>
							{#if cell}
								{@const isToday = cell.iso === today}
								{@const unavailable = disabled || outOfRange(cell.iso)}
								<button
									type="button"
									data-date={cell.iso}
									aria-current={isToday ? 'date' : undefined}
									disabled={unavailable}
									tabindex={cell.iso === tabStop ? 0 : -1}
									aria-label={buttonLabel(cell.iso)}
									onclick={() => {
										select(cell.iso);
										focusedDate = cell.iso;
									}}
									class={cn(
										'relative size-(--cell-size) cursor-default rounded-lg text-base transition-colors duration-100 ease-out outline-none hover:bg-accent focus-visible:z-10 focus-visible:ring-2 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-64 sm:text-sm',
										selected && 'bg-primary text-primary-foreground hover:bg-primary/90',
										inRange && 'rounded-none bg-accent text-accent-foreground',
										!selected &&
											isToday &&
											'font-medium after:absolute after:inset-x-0 after:bottom-1.5 after:mx-auto after:size-1 after:rounded-full after:bg-foreground'
									)}
								>
									{cell.day}
								</button>
							{/if}
						</td>
					{/each}
				</tr>
			{/each}
		</tbody>
	</table>
</div>
