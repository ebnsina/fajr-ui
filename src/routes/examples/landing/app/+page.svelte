<script lang="ts">
	import {
		Accordion,
		AccordionContent,
		AccordionItem,
		AccordionTrigger,
		Avatar,
		Badge,
		Button,
		Input,
		Label,
		Separator,
		Sheet,
		SheetClose,
		SheetHeader,
		SheetPanel,
		SheetPopup,
		SheetTitle,
		SheetTrigger,
		Switch,
		Table,
		TableBody,
		TableCell,
		TableHead,
		TableHeader,
		TableRow,
		Tabs,
		TabsList,
		TabsPanel,
		TabsTrigger,
		toast
	} from '$lib/components/ui';
	import {
		ArrowRightIcon,
		ArrowUpRightIcon,
		CheckIcon,
		CodeIcon,
		CollectionIcon,
		Icon,
		LayersIcon,
		MenuIcon,
		OfflineIcon,
		ScribeIcon,
		SearchIcon,
		ShieldIcon,
		SparkleIcon,
		TranslationIcon
	} from '$lib/icons';
	import AccentSwitcher from '$lib/components/site/accent-switcher.svelte';
	import CodeBlock from '$lib/components/site/code-block.svelte';
	import ModeSwitcher from '$lib/components/site/mode-switcher.svelte';
	import {
		FAQS,
		FEATURES,
		FOOTER,
		LEGAL,
		NAV,
		PARTNERS,
		PRODUCT,
		STATS,
		TESTIMONIALS,
		TIERS,
		type Testimonial
	} from '$lib/data/landing';

	/** The data file names an icon; the page decides what that name draws. */
	const ICONS: Record<string, typeof CollectionIcon> = {
		catalogue: CollectionIcon,
		transcribe: ScribeIcon,
		translate: TranslationIcon,
		rights: ShieldIcon,
		search: SearchIcon,
		api: CodeIcon,
		offline: OfflineIcon
	};

	/**
	 * Written out rather than interpolated, because Tailwind scans source text —
	 * a class built as `lg:col-span-${n}` is never generated.
	 */
	const SPAN: Record<number, string> = {
		2: 'lg:col-span-2',
		3: 'lg:col-span-3',
		4: 'sm:col-span-2 lg:col-span-4'
	};

	const featured = $derived(TESTIMONIALS.find((entry) => entry.featured) ?? TESTIMONIALS[0]);
	const supporting = $derived(TESTIMONIALS.filter((entry) => entry !== featured));

	let menu = $state(false);
	let yearly = $state(true);
	let pane = $state('catalogue');
	let faq = $state<string | undefined>(FAQS[0].id);
	let email = $state('');
	let scrollY = $state(0);

	const YEAR = new Date().getFullYear();

	const SAMPLE = `{
  "id": "MS-4021",
  "title": "Book of Optics",
  "scholar": "Ibn al-Haytham",
  "folios": 412,
  "rights": "public-domain"
}`;

	function join(event: SubmitEvent) {
		event.preventDefault();
		toast.success('Check your inbox', {
			description: `A sign-in link is on its way to ${email || 'your address'}.`
		});
		email = '';
	}
</script>

<svelte:head>
	<title>{PRODUCT} — a SaaS landing page — Fajr UI</title>
	<meta
		name="description"
		content="A marketing page built from the library: hero, feature grid, pricing with a billing toggle, testimonials and an FAQ."
	/>
</svelte:head>

<svelte:window bind:scrollY />

<a
	href="#main"
	class="sr-only focus-visible:not-sr-only focus-visible:absolute focus-visible:start-4 focus-visible:top-4 focus-visible:z-50 focus-visible:rounded-lg focus-visible:border focus-visible:bg-popover focus-visible:px-3 focus-visible:py-2 focus-visible:text-sm focus-visible:font-medium focus-visible:shadow-lg/5"
>
	Skip to content
</a>

<div class="flex min-h-svh flex-col bg-background text-foreground">
	<!--
		The header floats over the hero rather than sitting on a band of its own:
		a rule under it would cut the glow in half. It takes its border only once
		the page has scrolled, so the seam appears when there is something to seam.
		The border is always present and only changes colour, so nothing reflows.
	-->
	<header
		class="sticky top-0 z-40 border-b bg-background/72 backdrop-blur-md transition-colors {scrollY >
		8
			? 'border-border'
			: 'border-transparent'}"
	>
		<div class="mx-auto flex h-16 w-full max-w-6xl items-center gap-3 px-4 lg:px-6">
			<a
				href="/examples/landing"
				class="flex items-center gap-2 rounded-md font-heading text-lg font-bold outline-none [font-variation-settings:'GEOM'_50,'opsz'_32] focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background"
			>
				<span
					aria-hidden="true"
					class="grid size-7 place-items-center rounded-lg bg-primary text-primary-foreground"
				>
					<Icon icon={ScribeIcon} class="size-4" />
				</span>
				{PRODUCT}
			</a>

			<nav aria-label="Primary" class="ms-6 hidden items-center gap-1 md:flex">
				{#each NAV as link (link.href)}
					<a
						href={link.href}
						class="rounded-md px-3 py-2 text-sm font-medium text-muted-foreground transition-colors outline-none hover:text-foreground focus-visible:ring-2 focus-visible:ring-ring"
					>
						{link.label}
					</a>
				{/each}
			</nav>

			<div class="ms-auto flex items-center gap-1.5">
				<AccentSwitcher />
				<ModeSwitcher />
				<Separator orientation="vertical" class="mx-1 hidden h-5 sm:block" decorative />
				<Button href="#pricing" variant="ghost" class="hidden sm:inline-flex">Sign in</Button>
				<Button href="#pricing" class="hidden sm:inline-flex">Start free</Button>

				<Sheet bind:open={menu} side="right">
					<SheetTrigger variant="ghost" size="icon" class="md:hidden" aria-label="Open menu">
						<Icon icon={MenuIcon} />
					</SheetTrigger>
					<SheetPopup class="w-[min(20rem,calc(100vw-3rem))]">
						<SheetHeader>
							<SheetTitle>{PRODUCT}</SheetTitle>
						</SheetHeader>
						<SheetPanel>
							<nav aria-label="Primary" class="flex flex-col">
								{#each NAV as link (link.href)}
									<a
										href={link.href}
										onclick={() => (menu = false)}
										class="rounded-md px-2 py-3 text-sm font-medium outline-none hover:bg-accent focus-visible:ring-2 focus-visible:ring-ring"
									>
										{link.label}
									</a>
								{/each}
							</nav>
						</SheetPanel>
						{@render menuActions()}
					</SheetPopup>
				</Sheet>
			</div>
		</div>
	</header>

	<main id="main" class="flex-1">
		<!-- Hero -->
		<section class="relative isolate overflow-hidden">
			<!--
				Decoration only, so it is hidden from assistive technology and cannot
				be clicked through to. Both layers are built from theme tokens, which
				is what keeps the glow correct under every accent and in dark mode.
			-->
			<div aria-hidden="true" class="pointer-events-none absolute inset-x-0 top-0 -z-10 h-[46rem]">
				<div
					class="absolute inset-0 bg-[radial-gradient(ellipse_58%_46%_at_50%_-8%,color-mix(in_oklab,var(--color-primary)_16%,transparent),transparent_72%)]"
				></div>
				<div
					class="absolute inset-0 bg-[linear-gradient(to_right,var(--color-border)_1px,transparent_1px),linear-gradient(to_bottom,var(--color-border)_1px,transparent_1px)] [mask-image:radial-gradient(ellipse_56%_44%_at_50%_0%,black,transparent_74%)] bg-size-[56px_56px] opacity-40"
				></div>
			</div>

			<div class="mx-auto w-full max-w-6xl px-4 pt-16 pb-14 lg:px-6 lg:pt-24 lg:pb-20">
				<div class="flex flex-col items-center text-center">
					<a
						href="#features"
						class="group inline-flex items-center gap-2 rounded-full border bg-card/64 py-1 ps-1 pe-3 text-sm shadow-xs/5 backdrop-blur-sm transition-colors outline-none hover:bg-card focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background"
					>
						<Badge class="gap-1"><Icon icon={SparkleIcon} />New</Badge>
						<span class="text-muted-foreground">Translation memory is out of beta</span>
						<Icon
							icon={ArrowRightIcon}
							class="size-3.5 text-muted-foreground transition-transform group-hover:translate-x-0.5 motion-reduce:transition-none"
							aria-hidden="true"
						/>
					</a>

					<h1
						class="mt-6 max-w-3xl font-heading text-4xl/[1.08] font-bold text-balance sm:text-5xl/[1.06] lg:text-6xl/[1.04]"
					>
						The archive your collection
						<span class="text-primary">already deserves</span>
					</h1>

					<p class="mt-5 max-w-xl text-lg text-pretty text-muted-foreground">
						Catalogue, transcribe and publish manuscripts in one place — from a single scholar's
						desk to a library of two million folios.
					</p>

					<!--
						A single field and a button. Asking for anything more here would be
						asking a stranger to fill in a form before they know what this is.
					-->
					<form onsubmit={join} class="mt-8 flex w-full max-w-md flex-col gap-2 sm:flex-row">
						<Label class="sr-only" for="hero-email">Work email</Label>
						<Input
							id="hero-email"
							bind:value={email}
							type="email"
							size="lg"
							required
							placeholder="you@library.org"
							class="flex-1"
						/>
						<Button type="submit" size="lg">Start free<Icon icon={ArrowRightIcon} /></Button>
					</form>
					<p class="mt-3 text-sm text-muted-foreground">
						Free for one collection. No card, no sales call.
					</p>
				</div>

				<!-- Product preview -->
				<div id="product" class="mt-14 scroll-mt-24 lg:mt-20">
					<Tabs bind:value={pane}>
						<div class="flex justify-center">
							<TabsList>
								<TabsTrigger value="catalogue">Catalogue</TabsTrigger>
								<TabsTrigger value="transcribe">Transcribe</TabsTrigger>
								<TabsTrigger value="publish">Publish</TabsTrigger>
							</TabsList>
						</div>

						<!--
							One frame, three panels. The frame carries the chrome and a fixed
							height so switching panels never resizes the page beneath it.
						-->
						<div
							class="mt-6 overflow-hidden rounded-2xl border bg-card text-card-foreground shadow-xl/5 not-dark:bg-clip-padding"
						>
							<div class="flex items-center gap-2 border-b bg-muted/40 px-4 py-2.5">
								<span aria-hidden="true" class="flex gap-1.5">
									{#each ['bg-destructive/40', 'bg-warning/40', 'bg-success/40'] as dot (dot)}
										<span class="size-2.5 rounded-full {dot}"></span>
									{/each}
								</span>
								<span
									class="mx-auto hidden rounded-md border bg-background px-3 py-1 font-mono text-xs text-muted-foreground sm:block"
								>
									qalam.app/collections/optics
								</span>
							</div>

							<div class="h-[24rem] overflow-hidden sm:h-[26rem]">
								<TabsPanel value="catalogue" class="h-full">
									{@render cataloguePane()}
								</TabsPanel>
								<TabsPanel value="transcribe" class="h-full">
									{@render transcribePane()}
								</TabsPanel>
								<TabsPanel value="publish" class="h-full">
									{@render publishPane()}
								</TabsPanel>
							</div>
						</div>
					</Tabs>
				</div>

				<!-- A first taste of who uses it; the full list has its own section. -->
				<div class="mt-14 lg:mt-20">
					<h2 id="trusted" class="text-center text-sm text-muted-foreground">
						Keeping the catalogues of
					</h2>
					<ul
						aria-labelledby="trusted"
						class="mt-5 flex flex-wrap items-center justify-center gap-x-8 gap-y-3"
					>
						{#each PARTNERS.slice(0, 6) as partner (partner.name)}
							<li
								class="font-heading text-base font-semibold text-muted-foreground [font-variation-settings:'GEOM'_50] sm:text-lg"
							>
								{partner.name}
							</li>
						{/each}
					</ul>
				</div>
			</div>
		</section>

		<!-- Features -->
		<section
			id="features"
			aria-labelledby="features-title"
			class="scroll-mt-20 border-t bg-sidebar/40"
		>
			<div class="mx-auto w-full max-w-6xl px-4 py-16 lg:px-6 lg:py-24">
				{@render eyebrow('Features')}
				<h2
					id="features-title"
					class="mt-3 max-w-2xl font-heading text-3xl font-bold text-balance lg:text-4xl"
				>
					Everything a manuscript needs, and nothing it does not
				</h2>
				<p class="mt-4 max-w-xl text-pretty text-muted-foreground lg:text-lg">
					Built with keepers, scribes and the people who answer to a board.
				</p>

				<!--
					A bento rather than a uniform grid: the two claims that carry the
					pitch get the room, the rest get a sentence each. Six columns divide
					by two, three and four, so 4+2, 2+2+2 and 3+3 all come out flush
					without a single orphan tile.
				-->
				<ul class="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-6">
					{#each FEATURES as feature (feature.title)}
						<li
							class="flex flex-col gap-3 rounded-xl border bg-card p-5 text-card-foreground shadow-xs/5 not-dark:bg-clip-padding {SPAN[
								feature.span
							]}"
						>
							<span
								aria-hidden="true"
								class="grid size-9 place-items-center rounded-lg border bg-background text-primary"
							>
								<Icon icon={ICONS[feature.icon]} class="size-4.5" />
							</span>
							<h3 class="font-heading font-semibold">{feature.title}</h3>
							<p class="max-w-prose text-sm text-pretty text-muted-foreground">{feature.body}</p>
							{#if feature.art === 'record'}
								{@render recordArt()}
							{:else if feature.art === 'permissions'}
								{@render permissionsArt()}
							{/if}
						</li>
					{/each}
				</ul>
			</div>
		</section>

		<!-- Numbers -->
		<section aria-labelledby="numbers-title" class="border-t">
			<h2 id="numbers-title" class="sr-only">By the numbers</h2>
			<div class="mx-auto w-full max-w-6xl px-4 lg:px-6">
				<dl class="grid grid-cols-2 divide-border sm:grid-cols-4 sm:divide-x">
					{#each STATS as stat (stat.label)}
						<div class="flex flex-col items-center gap-1 px-4 py-8 text-center lg:py-10">
							<dt class="order-2 text-sm text-muted-foreground">{stat.label}</dt>
							<dd class="order-1 font-heading text-3xl font-bold tabular-nums lg:text-4xl">
								{stat.value}
							</dd>
						</div>
					{/each}
				</dl>
			</div>
		</section>

		<!-- Partners -->
		<section id="partners" aria-labelledby="partners-title" class="scroll-mt-20 border-t">
			<div class="mx-auto w-full max-w-6xl px-4 py-16 lg:px-6 lg:py-24">
				<div class="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
					<div>
						{@render eyebrow('Partners')}
						<h2 id="partners-title" class="mt-3 font-heading text-3xl font-bold lg:text-4xl">
							Who keeps their catalogue here
						</h2>
						<p class="mt-4 max-w-xl text-pretty text-muted-foreground lg:text-lg">
							Libraries, observatories, teaching hospitals and private archives across eleven
							countries — from a hundred folios to two million.
						</p>
					</div>
					<Button href="#pricing" variant="outline" class="self-start lg:self-auto">
						Become a partner<Icon icon={ArrowUpRightIcon} />
					</Button>
				</div>

				<!--
					A monogram tile stands in for a logo. Inventing artwork for an
					institution that does not exist would be the wrong kind of realism,
					and a wall of grey wordmarks says less than a name with a place on it.
				-->
				<ul class="mt-10 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
					{#each PARTNERS as partner (partner.name)}
						<li
							class="flex items-center gap-3 rounded-xl border bg-card p-4 text-card-foreground shadow-xs/5 not-dark:bg-clip-padding"
						>
							<span
								aria-hidden="true"
								class="grid size-10 shrink-0 place-items-center rounded-lg bg-muted font-heading text-sm font-bold text-muted-foreground"
							>
								{partner.mark}
							</span>
							<span class="flex min-w-0 flex-col">
								<span class="truncate text-sm font-medium">{partner.name}</span>
								<span class="truncate text-sm text-muted-foreground">
									{partner.kind} · {partner.place}
								</span>
							</span>
						</li>
					{/each}
				</ul>
			</div>
		</section>

		<!-- Testimonials -->
		<section aria-labelledby="voices-title" class="border-t bg-sidebar/40">
			<div class="mx-auto w-full max-w-6xl px-4 py-16 lg:px-6 lg:py-24">
				{@render eyebrow('Voices')}
				<h2
					id="voices-title"
					class="mt-3 max-w-2xl font-heading text-3xl font-bold text-balance lg:text-4xl"
				>
					From the people who keep the folios
				</h2>

				<!--
					One quotation gets the room and the rest share a column beside it. A
					uniform row of three gives the strongest thing anyone said the same
					weight as the weakest.
				-->
				<!-- Six cells over three columns: the lead takes two, the four others
				     take one each, so both rows come out flush. -->
				<div class="mt-10 grid gap-4 lg:grid-cols-3">
					{@render quote(featured, true)}
					{#each supporting as person (person.name)}
						{@render quote(person, false)}
					{/each}
				</div>
			</div>
		</section>

		<!-- Pricing -->
		<section id="pricing" aria-labelledby="pricing-title" class="scroll-mt-20 border-t">
			<div class="mx-auto w-full max-w-6xl px-4 py-16 lg:px-6 lg:py-24">
				<div class="flex flex-col items-center text-center">
					{@render eyebrow('Pricing')}
					<h2
						id="pricing-title"
						class="mt-3 max-w-2xl font-heading text-3xl font-bold text-balance lg:text-4xl"
					>
						Priced per editor, not per folio
					</h2>
					<p class="mt-4 max-w-xl text-pretty text-muted-foreground lg:text-lg">
						Readers are always free and always unlimited. You pay for the people who can change a
						record.
					</p>

					<!--
						The switch carries the whole control: the words either side are its
						label, so `aria-label` says what turning it on does rather than
						leaving a screen reader to infer it from the text beside it.
					-->
					<div class="mt-8 flex items-center gap-3">
						<span class:text-muted-foreground={yearly} class="text-sm font-medium">Monthly</span>
						<Switch bind:checked={yearly} aria-label="Bill annually and save 20%" />
						<span class:text-muted-foreground={!yearly} class="text-sm font-medium">Annually</span>
						<Badge variant="success">Save 20%</Badge>
					</div>
				</div>

				<!--
					No `items-start`: the tiers hold different numbers of features, so
					letting each take its natural height left the row ragged along the
					bottom — the middle card overhanging its neighbours by thirty pixels.
					Stretching evens them up; the featured one is marked by its border,
					not by being a different size.
				-->
				<div class="mt-10 grid gap-4 lg:grid-cols-3">
					{#each TIERS as tier (tier.id)}
						{@const price = yearly ? tier.yearly : tier.monthly}
						<div
							class="relative flex flex-col gap-6 rounded-2xl border bg-card p-6 text-card-foreground shadow-xs/5 not-dark:bg-clip-padding data-featured:border-primary/48 data-featured:shadow-lg/5 lg:p-7"
							data-featured={tier.featured ? '' : undefined}
						>
							{#if tier.featured}
								<!-- Centred on the card's top edge: a badge tucked into one corner
							     reads as a sticker, one on the axis reads as a crown. -->
								<Badge class="absolute -top-2.5 left-1/2 -translate-x-1/2">Most chosen</Badge>
							{/if}

							<div class="flex flex-col gap-1">
								<h3 class="font-heading text-lg font-semibold">{tier.name}</h3>
								<p class="text-sm text-muted-foreground">{tier.blurb}</p>
							</div>

							<!--
								Fixed heights on the figure and the note beneath it: the price
								changes with the toggle and the note only exists on one setting,
								so without them every card below would jump on each flip.
							-->
							<div class="flex flex-col">
								<p class="flex h-12 items-baseline gap-1.5">
									{#if price === null}
										<span class="font-heading text-4xl font-bold">Let's talk</span>
									{:else}
										<span class="font-heading text-4xl font-bold tabular-nums">
											${price}
										</span>
										<span class="text-sm text-muted-foreground">per editor / month</span>
									{/if}
								</p>
								<p class="h-5 text-sm text-muted-foreground">
									{#if price !== null && price > 0 && yearly}
										Billed annually, ${price * 12} a year
									{/if}
								</p>
							</div>

							<Button
								href="#pricing"
								size="lg"
								variant={tier.featured ? 'default' : 'outline'}
								class="w-full"
							>
								{tier.cta}
							</Button>

							<ul class="flex flex-col gap-2.5 border-t pt-6 text-sm">
								{#each tier.includes as line (line)}
									<li class="flex gap-2.5">
										<Icon
											icon={CheckIcon}
											class="mt-0.5 size-4 shrink-0 text-primary"
											aria-hidden="true"
										/>
										<span class="text-pretty text-muted-foreground">{line}</span>
									</li>
								{/each}
							</ul>
						</div>
					{/each}
				</div>
			</div>
		</section>

		<!-- Questions -->
		<section id="faq" aria-labelledby="faq-title" class="scroll-mt-20 border-t bg-sidebar/40">
			<div class="mx-auto w-full max-w-6xl px-4 py-14 lg:px-6 lg:py-20">
				<!--
					A narrower intro column: at 20rem it left a tall column of nothing
					under the button while the questions — the reason anyone is here —
					were squeezed into what was left.
				-->
				<div class="grid gap-8 lg:grid-cols-[15rem_1fr] lg:gap-12">
					<div class="flex flex-col">
						{@render eyebrow('Questions')}
						<h2
							id="faq-title"
							class="mt-3 font-heading text-3xl font-bold text-balance lg:text-4xl"
						>
							The ones we are asked first
						</h2>
						<p class="mt-4 text-pretty text-muted-foreground">
							Anything else, write to us — a person answers.
						</p>
						<Button href="#pricing" variant="outline" class="mt-6 self-start">
							Ask a question<Icon icon={ArrowUpRightIcon} />
						</Button>
					</div>

					<Accordion bind:value={faq}>
						{#each FAQS as item (item.id)}
							<AccordionItem value={item.id}>
								<AccordionTrigger>{item.q}</AccordionTrigger>
								<AccordionContent>{item.a}</AccordionContent>
							</AccordionItem>
						{/each}
					</Accordion>
				</div>
			</div>
		</section>

		<!-- Closing call to action -->
		<section aria-labelledby="cta-title" class="border-t">
			<div class="mx-auto w-full max-w-6xl px-4 py-16 lg:px-6 lg:py-24">
				<div
					class="relative isolate overflow-hidden rounded-2xl border bg-card px-6 py-14 text-center text-card-foreground shadow-xs/5 not-dark:bg-clip-padding lg:px-16"
				>
					<!--
						The same two layers as the hero — a wash of the accent and the faint
						grid — so the page opens and closes on the same note. The single
						gradient it had before stopped abruptly against the panel's top
						edge, reading as a band rather than as light.
					-->
					<div aria-hidden="true" class="absolute inset-0 -z-10">
						<div
							class="absolute inset-0 bg-[radial-gradient(ellipse_60%_70%_at_50%_-10%,color-mix(in_oklab,var(--color-primary)_18%,transparent),transparent_72%)]"
						></div>
						<div
							class="absolute inset-0 bg-[linear-gradient(to_right,var(--color-border)_1px,transparent_1px),linear-gradient(to_bottom,var(--color-border)_1px,transparent_1px)] [mask-image:radial-gradient(ellipse_60%_70%_at_50%_0%,black,transparent_72%)] bg-size-[56px_56px] opacity-40"
						></div>
					</div>
					<h2
						id="cta-title"
						class="mx-auto max-w-2xl font-heading text-3xl font-bold text-balance lg:text-4xl"
					>
						Your catalogue is older than every tool you have run it on
					</h2>
					<p class="mx-auto mt-4 max-w-xl text-pretty text-muted-foreground lg:text-lg">
						Bring it across in an afternoon. Keep the identifiers, keep the provenance, keep the
						right to leave.
					</p>
					<div class="mt-8 flex flex-wrap justify-center gap-3">
						<Button href="#pricing" size="xl">Start free<Icon icon={ArrowRightIcon} /></Button>
						<Button href="#pricing" size="xl" variant="outline">Book a walkthrough</Button>
					</div>
				</div>
			</div>
		</section>
	</main>

	<footer class="border-t bg-sidebar/40">
		<div class="mx-auto w-full max-w-6xl px-4 py-12 lg:px-6 lg:py-16">
			<div class="grid gap-10 lg:grid-cols-[1fr_2fr] lg:gap-16">
				<div class="flex flex-col gap-4">
					<p
						class="flex items-center gap-2 font-heading text-lg font-bold [font-variation-settings:'GEOM'_50,'opsz'_32]"
					>
						<span
							aria-hidden="true"
							class="grid size-7 place-items-center rounded-lg bg-primary text-primary-foreground"
						>
							<Icon icon={ScribeIcon} class="size-4" />
						</span>
						{PRODUCT}
					</p>
					<p class="max-w-xs text-sm text-pretty text-muted-foreground">
						An archive for manuscripts — catalogue, transcribe and publish, from one desk or three
						hundred.
					</p>
					<!--
						A status line is the thing people look for in a footer when
						something is wrong, so it says the state rather than just linking.
					-->
					<p class="flex items-center gap-2 text-sm">
						<span aria-hidden="true" class="size-2 rounded-full bg-success"></span>
						<a
							href="#faq"
							class="rounded-md text-muted-foreground outline-none hover:text-foreground focus-visible:ring-2 focus-visible:ring-ring"
						>
							All systems operational
						</a>
					</p>
				</div>

				<nav aria-label="Footer" class="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
					{#each FOOTER as group (group.title)}
						<div class="flex flex-col gap-3">
							<h2 class="text-sm font-medium">{group.title}</h2>
							<ul class="flex flex-col gap-2.5">
								{#each group.links as link (link.label)}
									<li>
										<a
											href={link.href}
											class="rounded-md text-sm text-muted-foreground outline-none hover:text-foreground focus-visible:ring-2 focus-visible:ring-ring"
										>
											{link.label}
										</a>
									</li>
								{/each}
							</ul>
						</div>
					{/each}
				</nav>
			</div>

			<Separator class="my-8" decorative />

			<div class="flex flex-col gap-4 sm:flex-row sm:items-center">
				<p class="text-sm text-muted-foreground">© {YEAR} {PRODUCT}</p>
				<ul class="flex flex-wrap gap-x-6 gap-y-2 sm:ms-auto">
					{#each LEGAL as link (link.label)}
						<li>
							<a
								href={link.href}
								class="rounded-md text-sm text-muted-foreground outline-none hover:text-foreground focus-visible:ring-2 focus-visible:ring-ring"
							>
								{link.label}
							</a>
						</li>
					{/each}
				</ul>
			</div>
		</div>
	</footer>
</div>

{#snippet eyebrow(text: string)}
	<p class="text-sm font-medium tracking-[0.14em] text-primary uppercase">{text}</p>
{/snippet}

{#snippet quote(person: Testimonial, lead: boolean)}
	<!--
		A quotation is a figure and its attribution is the caption — the pairing is
		what `figure`/`figcaption` exist for, and it keeps the name attached to the
		words for a screen reader as well as for a reader.
	-->
	<figure
		class="flex flex-col gap-4 rounded-xl border bg-card p-6 text-card-foreground shadow-xs/5 not-dark:bg-clip-padding {lead
			? 'lg:col-span-2 lg:p-8'
			: ''}"
	>
		{#if person.metric}
			<p class="flex items-baseline gap-2">
				<span
					class="font-heading font-bold text-primary tabular-nums {lead
						? 'text-3xl lg:text-4xl'
						: 'text-2xl'}"
				>
					{person.metric.value}
				</span>
				<span class="text-sm text-muted-foreground">{person.metric.label}</span>
			</p>
		{/if}
		<blockquote class="flex-1 text-pretty {lead ? 'text-lg lg:text-xl' : ''}">
			<!--
				Real quotation marks rather than a quote icon, and the opening one is
				hung into the margin so the first line still begins on the same edge as
				every line under it.
			-->
			<span aria-hidden="true" class="-ms-[0.42em] text-primary">“</span>{person.quote}<span
				aria-hidden="true"
				class="text-primary">”</span
			>
		</blockquote>
		<!--
			Spacing rather than a rule. The divider sat at whatever height the
			attribution happened to start, so a role that wrapped to two lines
			pushed it up and the line no longer aligned with its neighbours across
			the row. Nothing was holding them level, and nothing could without
			forcing every attribution to the same height.
		-->
		<figcaption class="mt-auto flex items-center gap-3 pt-5">
			<Avatar class="shrink-0">{person.initials}</Avatar>
			<span class="flex min-w-0 flex-col">
				<span class="text-sm font-medium">{person.name}</span>
				<!--
					Wraps rather than truncating: the institution is the half a single
					line cuts off, and it is the half that carries the weight.
				-->
				<span class="text-sm text-pretty text-muted-foreground">{person.role}</span>
			</span>
		</figcaption>
	</figure>
{/snippet}

{#snippet recordArt()}
	<!-- One record with its parts hanging off it, drawn rather than screenshotted. -->
	<div aria-hidden="true" class="mt-auto flex flex-wrap items-center gap-2 pt-2">
		<span class="rounded-md border bg-background px-2.5 py-1 font-mono text-xs">MS-4021</span>
		<span class="h-px w-4 bg-border"></span>
		{#each ['412 folios', 'Provenance', 'Condition', 'Shelfmark', '3 editions'] as part (part)}
			<span class="rounded-md border border-dashed px-2.5 py-1 text-xs text-muted-foreground">
				{part}
			</span>
		{/each}
	</div>
{/snippet}

{#snippet permissionsArt()}
	<div aria-hidden="true" class="mt-auto flex flex-col gap-2 pt-2">
		{#each [['Star tables', 'Public', 'success'], ['Acquisitions', 'Embargoed', 'warning']] as [scope, state, tone] (scope)}
			<span class="flex items-center gap-2 rounded-md border bg-background px-2.5 py-1.5 text-xs">
				<span class="truncate text-muted-foreground">{scope}</span>
				<Badge variant={tone as 'success' | 'warning'} class="ms-auto">{state}</Badge>
			</span>
		{/each}
	</div>
{/snippet}

{#snippet menuActions()}
	<div class="flex flex-col gap-2 border-t p-4">
		<SheetClose variant="outline" size="lg">Sign in</SheetClose>
		<SheetClose size="lg">Start free</SheetClose>
	</div>
{/snippet}

{#snippet row(shelf: string, title: string, scholar: string, tone: 'info' | 'success' | 'warning')}
	<TableRow>
		<TableCell class="font-mono text-xs text-muted-foreground">{shelf}</TableCell>
		<TableCell class="font-medium">{title}</TableCell>
		<TableCell class="hidden text-muted-foreground sm:table-cell">{scholar}</TableCell>
		<TableCell class="text-end">
			<Badge variant={tone}>
				{tone === 'success' ? 'Published' : tone === 'info' ? 'In review' : 'Draft'}
			</Badge>
		</TableCell>
	</TableRow>
{/snippet}

{#snippet cataloguePane()}
	<div class="flex h-full flex-col">
		<div class="flex items-center gap-2 border-b px-4 py-3">
			<div class="relative w-full max-w-64">
				<Icon
					icon={SearchIcon}
					class="pointer-events-none absolute start-2.5 top-1/2 z-10 size-4 -translate-y-1/2 text-muted-foreground"
					aria-hidden="true"
				/>
				<Input
					type="search"
					placeholder="Search the collection…"
					inputClass="ps-8"
					aria-label="Search the collection"
					tabindex={-1}
				/>
			</div>
			<Badge variant="outline" class="ms-auto hidden sm:inline-flex">1,284 works</Badge>
		</div>
		<div class="min-h-0 flex-1 overflow-hidden">
			<Table>
				<TableHeader>
					<TableRow>
						<TableHead>Shelfmark</TableHead>
						<TableHead>Work</TableHead>
						<TableHead class="hidden sm:table-cell">Scholar</TableHead>
						<TableHead class="text-end">Status</TableHead>
					</TableRow>
				</TableHeader>
				<TableBody>
					{@render row('MS 4021', 'Book of Optics', 'Ibn al-Haytham', 'success')}
					{@render row('MS 0118', 'The Canon of Medicine', 'Ibn Sina', 'success')}
					{@render row('MS 2277', 'The Compendious Book', 'Al-Khwarizmi', 'info')}
					{@render row('MS 3390', 'Book of Fixed Stars', 'Al-Sufi', 'info')}
					{@render row('MS 0742', 'Kitab al-Hawi', 'Al-Razi', 'warning')}
					{@render row('MS 5104', 'Zij-i Ilkhani', 'Al-Tusi', 'warning')}
					{@render row('MS 1856', 'Book of Ingenious Devices', 'Banu Musa', 'info')}
					{@render row('MS 6630', 'Book of Roger', 'Al-Idrisi', 'success')}
				</TableBody>
			</Table>
		</div>
	</div>
{/snippet}

{#snippet transcribePane()}
	<div class="grid h-full grid-cols-1 divide-border sm:grid-cols-2 sm:divide-x">
		<!-- Stands in for the folio scan: ruled lines, no text to mistranslate. -->
		<div aria-hidden="true" class="hidden flex-col gap-3 bg-muted/24 p-6 sm:flex">
			<div class="flex flex-col gap-2 rounded-lg border bg-card p-4 shadow-xs/5">
				{#each [92, 100, 84, 96, 72, 100, 88, 60] as width, line (line)}
					<span class="h-2 rounded-full bg-muted-foreground/16" style="width: {width}%"></span>
				{/each}
				<span class="mt-2 h-16 rounded-md border border-dashed border-primary/32 bg-primary/8"
				></span>
			</div>
		</div>

		<div class="flex min-w-0 flex-col">
			<div class="flex items-center gap-2 border-b px-4 py-2.5 text-sm text-muted-foreground">
				<Icon icon={ScribeIcon} class="size-4" aria-hidden="true" />
				Folio 41 verso
				<Badge variant="outline" class="ms-auto">Line 12 of 24</Badge>
			</div>
			<div class="flex min-h-0 flex-1 flex-col gap-3 overflow-hidden p-4">
				{#each ['On the manner in which sight occurs', 'and the reason the eye is not the source', 'of the light by which it sees'] as line, index (line)}
					<p
						class="rounded-md px-2 py-1.5 text-sm {index === 1
							? 'bg-primary/8 ring-1 ring-primary/24'
							: ''}"
					>
						<span class="me-2 font-mono text-xs text-muted-foreground tabular-nums">
							{11 + index}
						</span>
						{line}
					</p>
				{/each}
				<div class="mt-auto flex items-center gap-2 rounded-lg border bg-muted/32 p-3 text-sm">
					<Icon icon={TranslationIcon} class="size-4 shrink-0 text-primary" aria-hidden="true" />
					<span class="min-w-0 text-pretty text-muted-foreground">
						Rendered this phrase before — <span class="text-foreground">“the manner of seeing”</span
						>, by Y. ibn Marwan.
					</span>
				</div>
			</div>
		</div>
	</div>
{/snippet}

{#snippet publishPane()}
	<div class="flex h-full flex-col gap-4 p-6">
		<div class="flex flex-wrap items-center gap-2">
			<Icon icon={LayersIcon} class="size-4 text-primary" aria-hidden="true" />
			<span class="text-sm font-medium">Public catalogue</span>
			<Badge variant="success" class="ms-auto">Live</Badge>
		</div>
		<!-- The site's own code block, so the sample is highlighted by the same
		     tokenizer as every snippet in the documentation. -->
		<CodeBlock
			code={SAMPLE}
			language="json"
			title="GET /v1/collections/optics/works/4021"
			class="min-h-0 flex-1 overflow-hidden"
		/>
		<p class="text-sm text-muted-foreground">
			The same identifiers your printed catalogue uses, on endpoints that do not change under you.
		</p>
	</div>
{/snippet}
