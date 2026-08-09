<script lang="ts">
	import { page } from '$app/state';
	import { goto } from '$app/navigation';
	import { GithubIcon, Icon, ManuscriptIcon, MenuIcon, SearchIcon } from '$lib/icons';
	import {
		Button,
		Command,
		Kbd,
		Separator,
		Sheet,
		SheetPopup,
		toast,
		type CommandGroupData
	} from '$lib/components/ui';
	import { getComponent } from '$lib/data/components';
	import { docsNav } from '$lib/data/docs-nav';
	import { mode } from '$lib/mode.svelte';
	import ModeSwitcher from './mode-switcher.svelte';

	const navItems = [
		{ href: '/docs', label: 'Docs' },
		{ href: '/examples', label: 'Examples' }
	];

	let mobileNavOpen = $state(false);
	let commandOpen = $state(false);

	// Built from the same nav data the sidebar uses, so the palette can never
	// drift out of step with what actually exists.
	/**
	 * The install command for whatever is highlighted in the palette.
	 *
	 * Every component's nav entry is keyed by its href, so the highlighted key
	 * tells us which one the cursor is on without a second list to keep in step.
	 */
	let activeKey = $state<string | undefined>();
	const activeComponent = $derived(
		activeKey?.startsWith('/docs/components/')
			? getComponent(activeKey.split('/').pop() ?? '')
			: undefined
	);
	const installCommand = $derived(
		activeComponent ? `npx fajr-ui add ${activeComponent.slug}` : undefined
	);

	async function copyInstall() {
		if (!installCommand) return;
		try {
			await navigator.clipboard.writeText(installCommand);
			toast.success('Copied', { description: installCommand });
		} catch {
			// Clipboard access can be refused; claiming success would be a lie.
			toast.error('Could not copy', { description: installCommand });
		}
	}

	const commandGroups: CommandGroupData[] = $derived([
		...docsNav.map((section) => ({
			heading: section.title,
			items: section.items.map((item) => ({
				id: item.href,
				label: item.title,
				icon: ManuscriptIcon,
				onselect: () => goto(item.href)
			}))
		})),
		{
			heading: 'Theme',
			items: [
				{
					id: 'theme-light',
					label: 'Light',
					keywords: 'theme mode',
					onselect: () => mode.set('light')
				},
				{
					id: 'theme-dark',
					label: 'Dark',
					keywords: 'theme mode',
					onselect: () => mode.set('dark')
				},
				{
					id: 'theme-system',
					label: 'System',
					keywords: 'theme mode',
					onselect: () => mode.set('system')
				}
			]
		}
	]);

	function onkeydown(event: KeyboardEvent) {
		if (event.key.toLowerCase() === 'k' && (event.metaKey || event.ctrlKey)) {
			event.preventDefault();
			commandOpen = !commandOpen;
			return;
		}

		/*
		 * Copy the install command for the highlighted component. Only while the
		 * palette is open and only when there is nothing selected — otherwise this
		 * would steal the shortcut from someone copying their own text.
		 */
		if (
			commandOpen &&
			installCommand &&
			event.key.toLowerCase() === 'c' &&
			(event.metaKey || event.ctrlKey) &&
			!window.getSelection()?.toString()
		) {
			event.preventDefault();
			copyInstall();
		}
	}

	function isCurrent(href: string): boolean {
		return page.url.pathname.startsWith(href);
	}
</script>

<header
	class="sticky top-0 z-40 w-full bg-sidebar/80 backdrop-blur-sm before:absolute before:inset-x-0 before:bottom-0 before:h-px before:bg-border/64"
>
	<div
		class="relative container flex h-(--header-height) w-full items-center justify-between gap-2 px-4 sm:px-6"
	>
		<Button
			size="icon"
			variant="ghost"
			class="lg:hidden"
			aria-label="Open menu"
			onclick={() => (mobileNavOpen = true)}
		>
			<Icon icon={MenuIcon} />
		</Button>

		<div
			class="flex shrink-0 items-center gap-1.5 font-heading text-[1.375em] font-bold [font-variation-settings:'GEOM'_50,'opsz'_32] sm:text-2xl"
		>
			<a href="/" aria-label="Home">Fajr UI</a>
		</div>

		<div class="ms-auto flex items-center gap-2 md:flex-1 md:justify-end">
			<nav aria-label="Main" class="hidden items-center gap-2 lg:flex">
				{#each navItems as item (item.href)}
					<Button
						href={item.href}
						variant="ghost"
						class={isCurrent(item.href) ? 'text-primary' : undefined}
					>
						{item.label}
					</Button>
				{/each}
			</nav>

			<Button
				variant="outline"
				size="sm"
				class="hidden gap-2 text-muted-foreground md:inline-flex"
				onclick={() => (commandOpen = true)}
			>
				<Icon icon={SearchIcon} />
				Search…
				<kbd class="ms-4 font-mono text-xs">⌘K</kbd>
			</Button>

			<Separator orientation="vertical" class="h-5 max-md:hidden" decorative />

			<Button
				size="icon"
				variant="ghost"
				href="https://github.com/ebnsina/fajr-ui"
				target="_blank"
				rel="noreferrer"
				aria-label="GitHub"
			>
				<Icon icon={GithubIcon} />
			</Button>
			<ModeSwitcher />
		</div>
	</div>
</header>

<svelte:window {onkeydown} />

<Command
	bind:open={commandOpen}
	bind:activeKey
	groups={commandGroups}
	placeholder="Search documentation…"
>
	{#snippet footer()}
		<span class="flex items-center gap-1.5">Go to page <Kbd>⏎</Kbd></span>

		{#if installCommand}
			<!--
				The install command for whatever is highlighted, so adding a component
				never needs a trip to its page. A button as well as a legend: the
				shortcut is the fast path, not the only one.
			-->
			<Button
				variant="ghost"
				size="sm"
				onclick={copyInstall}
				class="ms-auto min-w-0 gap-2 px-1.5 font-normal text-muted-foreground hover:text-foreground"
			>
				<span class="truncate font-mono text-xs">{installCommand}</span>
				<span class="flex shrink-0 items-center gap-1"><Kbd>⌘</Kbd><Kbd>C</Kbd></span>
			</Button>
		{/if}
	{/snippet}
</Command>

<Sheet bind:open={mobileNavOpen} side="left">
	<SheetPopup title="Menu" class="w-[min(18rem,calc(100vw-3rem))] bg-sidebar">
		<nav class="flex h-full w-full flex-col gap-6 overflow-y-auto p-4">
			<div class="flex flex-col gap-1">
				{#each navItems as item (item.href)}
					<a
						href={item.href}
						class="rounded-lg px-2 py-1.5 text-sm font-medium hover:bg-accent"
						onclick={() => (mobileNavOpen = false)}
					>
						{item.label}
					</a>
				{/each}
			</div>
			{#each docsNav as section (section.title)}
				<div class="flex flex-col gap-1">
					<p class="px-2 text-xs font-medium text-muted-foreground">{section.title}</p>
					{#each section.items as item (item.href)}
						<a
							href={item.href}
							class="rounded-lg px-2 py-1.5 text-sm hover:bg-accent"
							onclick={() => (mobileNavOpen = false)}
						>
							{item.title}
						</a>
					{/each}
				</div>
			{/each}
		</nav>
	</SheetPopup>
</Sheet>
