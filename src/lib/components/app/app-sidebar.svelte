<script lang="ts">
	import { page } from '$app/state';
	import { ChevronsUpDownIcon, Icon } from '$lib/icons';
	import {
		Avatar,
		Sidebar,
		SidebarContent,
		SidebarFooter,
		SidebarGroup,
		SidebarGroupContent,
		SidebarGroupLabel,
		SidebarHeader,
		SidebarMenu,
		SidebarMenuBadge,
		SidebarMenuButton,
		SidebarMenuItem,
		SidebarMenuSub,
		SidebarMenuSubButton,
		SidebarMenuSubItem,
		SidebarRail,
		type SidebarProps
	} from '$lib/components/ui';
	import { navMain, navSecondary, type NavItem } from './nav-data';

	let { variant = 'inset', ...rest }: SidebarProps = $props();

	function isActive(href: string): boolean {
		return page.url.pathname === href;
	}

	/** A parent is "current section" when the URL sits on it or below it. */
	function inSection(item: NavItem): boolean {
		return page.url.pathname === item.href || page.url.pathname.startsWith(`${item.href}/`);
	}
</script>

{#snippet navGroup(items: NavItem[])}
	<SidebarMenu>
		{#each items as item (item.href)}
			{@const icon = item.icon}
			<SidebarMenuItem>
				<SidebarMenuButton href={item.href} isActive={isActive(item.href)} tooltip={item.title}>
					<Icon {icon} />
					<span>{item.title}</span>
				</SidebarMenuButton>
				{#if item.badge}
					<SidebarMenuBadge>{item.badge}</SidebarMenuBadge>
				{/if}
				{#if item.items && inSection(item)}
					<SidebarMenuSub>
						{#each item.items as sub (sub.href)}
							<SidebarMenuSubItem>
								<SidebarMenuSubButton href={sub.href} isActive={isActive(sub.href)}>
									<span>{sub.title}</span>
								</SidebarMenuSubButton>
							</SidebarMenuSubItem>
						{/each}
					</SidebarMenuSub>
				{/if}
			</SidebarMenuItem>
		{/each}
	</SidebarMenu>
{/snippet}

<Sidebar collapsible="icon" {variant} {...rest}>
	<SidebarHeader>
		<SidebarMenu>
			<SidebarMenuItem>
				<SidebarMenuButton size="lg" href="/examples/dashboard/app">
					<span
						class="flex aspect-square size-8 items-center justify-center rounded-lg bg-primary text-sm font-semibold text-primary-foreground"
					>
						F
					</span>
					<span class="grid flex-1 text-left leading-tight">
						<span class="truncate font-semibold text-foreground">Fajr UI</span>
						<span class="truncate text-xs">ebnsina</span>
					</span>
					<Icon icon={ChevronsUpDownIcon} class="ms-auto" />
				</SidebarMenuButton>
			</SidebarMenuItem>
		</SidebarMenu>
	</SidebarHeader>

	<SidebarContent>
		<!--
			Landmarks, so the application's navigation can be jumped to and past.
			Without them the whole sidebar was an anonymous stack of divs and the
			only landmarks on the page were `main` and `header`.
		-->
		<SidebarGroup>
			<SidebarGroupLabel>House of Wisdom</SidebarGroupLabel>
			<SidebarGroupContent>
				<nav aria-label="Main">
					{@render navGroup(navMain)}
				</nav>
			</SidebarGroupContent>
		</SidebarGroup>

		<SidebarGroup class="mt-auto">
			<SidebarGroupContent>
				<nav aria-label="Secondary">
					{@render navGroup(navSecondary)}
				</nav>
			</SidebarGroupContent>
		</SidebarGroup>
	</SidebarContent>

	<SidebarFooter>
		<SidebarMenu>
			<SidebarMenuItem>
				<SidebarMenuButton size="lg">
					<Avatar class="size-8 rounded-lg">EB</Avatar>
					<span class="grid flex-1 text-left leading-tight">
						<span class="truncate font-medium text-foreground">ebnsina</span>
						<span class="truncate text-xs">Bayt al-Hikma</span>
					</span>
					<Icon icon={ChevronsUpDownIcon} class="ms-auto" />
				</SidebarMenuButton>
			</SidebarMenuItem>
		</SidebarMenu>
	</SidebarFooter>

	<SidebarRail />
</Sidebar>
