<script lang="ts">
	import {
		Badge,
		Button,
		Card,
		CardDescription,
		CardHeader,
		CardPanel,
		CardTitle,
		Progress,
		Separator,
		ToggleGroup,
		ToggleGroupItem
	} from '$lib/components/ui';
	import { ArrowRightIcon, Icon, ManuscriptIcon } from '$lib/icons';
	import CodeBlock from '$lib/components/site/code-block.svelte';
	import DocsPage from '$lib/components/site/docs-page.svelte';
	import SiteFooter from '$lib/components/site/site-footer.svelte';

	const toc = [
		{ title: 'Turning it on', id: 'turning-on' },
		{ title: 'Try it', id: 'try-it' },
		{ title: 'What flips, and what does not', id: 'what-flips' },
		{ title: 'Numerals and code', id: 'numerals' },
		{ title: 'Typography', id: 'typography' }
	];

	type Copy = {
		label: string;
		dir: 'ltr' | 'rtl';
		title: string;
		scholar: string;
		status: string;
		shelfmark: string;
		folios: string;
		place: string;
		progress: string;
		open: string;
		later: string;
	};

	/**
	 * The three right-to-left scripts a component library actually meets, plus
	 * English to switch back against. Each carries its own direction, because
	 * direction is a property of the language rather than a separate setting.
	 */
	const LANGUAGES: Record<string, Copy> = {
		ar: {
			label: 'العربية',
			dir: 'rtl',
			title: 'كتاب المناظر',
			scholar: 'ابن الهيثم',
			status: 'قيد الرقمنة',
			shelfmark: 'رقم الحفظ',
			folios: 'عدد الأوراق',
			place: 'مكان النسخ',
			progress: 'اكتمل التصوير',
			open: 'فتح المخطوط',
			later: 'لاحقًا'
		},
		he: {
			label: 'עברית',
			dir: 'rtl',
			title: 'ספר האופטיקה',
			scholar: 'אבן אל-היית׳ם',
			status: 'בתהליך דיגיטציה',
			shelfmark: 'מספר מדף',
			folios: 'מספר דפים',
			place: 'מקום ההעתקה',
			progress: 'הצילום הושלם',
			open: 'פתיחת כתב היד',
			later: 'מאוחר יותר'
		},
		fa: {
			label: 'فارسی',
			dir: 'rtl',
			title: 'کتاب المناظر',
			scholar: 'ابن هیثم',
			status: 'در حال دیجیتال‌سازی',
			shelfmark: 'شماره قفسه',
			folios: 'تعداد برگ‌ها',
			place: 'محل کتابت',
			progress: 'تصویربرداری انجام‌شده',
			open: 'گشودن نسخه',
			later: 'بعداً'
		},
		en: {
			label: 'English',
			dir: 'ltr',
			title: 'Book of Optics',
			scholar: 'Ibn al-Haytham',
			status: 'Digitising',
			shelfmark: 'Shelfmark',
			folios: 'Folios',
			place: 'Copied at',
			progress: 'Imaging complete',
			open: 'Open manuscript',
			later: 'Later'
		}
	};

	let language = $state('ar');
	const copy = $derived(LANGUAGES[language]);
</script>

<DocsPage
	title="Right to left"
	description="One attribute flips the library. Here it is, in Arabic, Hebrew and Persian."
	{toc}
>
	<p>
		Components are written with logical properties throughout — <code>ms</code> and
		<code>me</code> rather than <code>ml</code> and <code>mr</code>,
		<code>ps</code>/<code>pe</code> rather than <code>pl</code>/<code>pr</code>,
		<code>start</code>/<code>end</code> rather than <code>left</code>/<code>right</code>. Setting
		the direction is the whole of it; there is no second stylesheet and no wrapper component.
	</p>

	<h2 id="turning-on">Turning it on</h2>
	<CodeBlock code="<html dir=&quot;rtl&quot;>" language="html" />
	<p>
		It works on any element, not only the document. These pages are in English and stay
		left-to-right; the panel below sets <code>dir</code> on itself, which is why it reads the other way
		while everything around it does not.
	</p>

	<h2 id="try-it">Try it</h2>
	<p>
		Switch the language. Nothing in the panel is direction-aware — it is the same Card, Badge,
		Progress, Separator and Button documented everywhere else on this site, with one
		<code>dir</code> on the wrapper around them.
	</p>

	<div class="not-prose overflow-hidden rounded-xl border">
		<div class="flex flex-wrap items-center gap-3 border-b bg-muted/32 px-4 py-3">
			<ToggleGroup bind:value={language} variant="outline" size="sm" label="Language">
				{#each Object.entries(LANGUAGES) as [code, entry] (code)}
					<ToggleGroupItem value={code}>{entry.label}</ToggleGroupItem>
				{/each}
			</ToggleGroup>
			<span class="ms-auto font-mono text-xs text-muted-foreground">dir="{copy.dir}"</span>
		</div>

		<!--
			`lang` alongside `dir`. The direction drives the layout; the language
			tells the browser which font and shaping to use, and a screen reader
			which voice to read it in. Setting one without the other is half the job.
		-->
		<div dir={copy.dir} lang={language} class="flex justify-center bg-muted/16 p-6 lg:p-10">
			<Card class="w-full max-w-md">
				<CardHeader>
					<div class="flex items-center gap-3">
						<span
							aria-hidden="true"
							class="grid size-9 shrink-0 place-items-center rounded-lg bg-muted text-muted-foreground"
						>
							<Icon icon={ManuscriptIcon} class="size-4.5" />
						</span>
						<div class="flex min-w-0 flex-col">
							<CardTitle>{copy.title}</CardTitle>
							<CardDescription>{copy.scholar}</CardDescription>
						</div>
						<!-- `ms-auto` is logical, so the badge sits at whichever end the
						     reading finishes on without being told which. -->
						<Badge variant="warning" class="ms-auto">{copy.status}</Badge>
					</div>
				</CardHeader>

				<CardPanel class="flex flex-col gap-5 pt-0">
					<!--
						A width-based fill. It starts at the inline start, so it grows from
						the right in a right-to-left panel with no rule of its own.
					-->
					<div class="flex flex-col gap-2">
						<div class="flex items-baseline justify-between gap-2 text-sm">
							<span class="text-muted-foreground">{copy.progress}</span>
							<span class="font-medium tabular-nums">68%</span>
						</div>
						<Progress value={68} label={copy.progress} />
					</div>

					<Separator decorative />

					<dl class="grid grid-cols-3 gap-4 text-sm">
						<div class="flex flex-col gap-0.5">
							<dt class="text-muted-foreground">{copy.shelfmark}</dt>
							<dd class="font-mono text-xs font-medium">MS 4021</dd>
						</div>
						<div class="flex flex-col gap-0.5">
							<dt class="text-muted-foreground">{copy.folios}</dt>
							<dd class="font-medium tabular-nums">412</dd>
						</div>
						<div class="flex flex-col gap-0.5">
							<dt class="text-muted-foreground">{copy.place}</dt>
							<dd class="truncate font-medium">
								{language === 'en' ? 'Cairo' : language === 'he' ? 'קהיר' : 'القاهرة'}
							</dd>
						</div>
					</dl>

					<div class="flex flex-wrap gap-2">
						<Button>
							{copy.open}
							<!-- Mirrored, because this arrow means "onward" rather than "right". -->
							<Icon icon={ArrowRightIcon} class="rtl:-scale-x-100" />
						</Button>
						<Button variant="outline">{copy.later}</Button>
					</div>
				</CardPanel>
			</Card>
		</div>
	</div>
	<p class="text-sm text-muted-foreground">
		Every component in that panel is unchanged. The only direction-aware thing in it is the arrow on
		the button.
	</p>

	<h2 id="what-flips">What flips, and what does not</h2>
	<p>
		Layout flips. Meaning does not. A sheet asked for <code>side="right"</code> opens on the right in
		both directions, because the author named a side rather than an edge of the text — the same for a
		toast position and for which side a sidebar sits on.
	</p>
	<p>
		Two kinds of thing cannot be expressed logically at all. A CSS transform is physical whatever
		<code>dir</code> says, so Switch carries an explicit right-to-left rule; without it the thumb
		travels out of its own track. And an SVG has no direction, so a glyph meaning
		<em>forward</em> has to be told to mirror:
	</p>
	<CodeBlock code={`<Icon icon={ArrowRightIcon} class="rtl:-scale-x-100" />`} language="svelte" />
	<p>
		The library already does this for its own directional glyphs — the chevrons in Breadcrumb,
		Pagination, Calendar and submenus, and the Sidebar trigger. Arrows you add need the class, and
		only where the arrow means direction: a plus sign or a search glyph must not be flipped.
	</p>
	<p>
		Keyboard handling follows the same rule. Arrow keys track what the reader sees, so in a
		right-to-left row <strong>Left</strong> moves <em>forward</em> through Tabs, Toolbar, Slider and the
		Calendar grid, and opens a submenu. Vertical axes are untouched, because up and down mean the same
		thing in every direction.
	</p>

	<h2 id="numerals">Numerals and code</h2>
	<p>
		Digits are a formatting decision, not a direction one. Use <code>Intl.NumberFormat</code> with the
		locale you mean and the direction will not interfere:
	</p>
	<CodeBlock
		code={`new Intl.NumberFormat('ar-EG').format(1204); // ١٬٢٠٤
new Intl.NumberFormat('ar-EG-u-nu-latn').format(1204); // 1,204`}
		language="js"
	/>
	<p>
		Code is forced back to left-to-right wherever it appears. In a right-to-left page an unmarked
		block starts its scroll at the wrong edge, and an inline identifier has its punctuation
		reordered — <code>foo();</code> renders as <code>;()foo</code>. The base layer handles it:
	</p>
	<CodeBlock
		code={`code, pre, kbd, samp {
  direction: ltr;
  unicode-bidi: isolate;
}`}
		language="css"
		title="theme.css"
	/>

	<h2 id="typography">Typography</h2>
	<p>
		The display face carries no Arabic, Hebrew or Persian, so those glyphs fall through to the next
		family in the stack that has them. Those families are named explicitly rather than left to the
		operating system — otherwise the same page is one face on a Mac, another on Windows and a third
		on Linux. Fallback happens per glyph, so Latin in the same sentence still renders in the display
		face.
	</p>
	<CodeBlock
		code={`--font-sans:
  'Fajr Display', ui-sans-serif, system-ui, -apple-system, 'Noto Sans Arabic',
  'Noto Naskh Arabic', 'Geeza Pro', 'Segoe UI', Tahoma, Roboto, sans-serif;`}
		language="css"
		title="theme.css"
	/>
</DocsPage>

<SiteFooter />
