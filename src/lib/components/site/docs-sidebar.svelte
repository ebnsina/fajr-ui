<script lang="ts">
	import { page } from '$app/state';
	import {
		Badge,
		Sidebar,
		SidebarContent,
		SidebarGroup,
		SidebarGroupContent,
		SidebarGroupLabel,
		SidebarMenu,
		SidebarMenuButton,
		SidebarMenuItem,
		type SidebarProps
	} from '$lib/components/ui';
	import { docsNav } from '$lib/data/docs-nav';

	let { ...rest }: SidebarProps = $props();
</script>

<Sidebar
	collapsible="none"
	class="sticky top-(--header-height) z-30 hidden h-[calc(100svh-var(--header-height))] bg-transparent lg:flex"
	{...rest}
>
	<!--
		A landmark, so the documentation nav can be jumped to — and past — rather
		than being seventy anonymous links in a stack of divs.
	-->
	<SidebarContent class="px-4 py-2">
		<div class="h-(--top-spacing) shrink-0"></div>
		<nav aria-label="Documentation" class="contents">
			{#each docsNav as section (section.title)}
				<SidebarGroup class="gap-1">
					<SidebarGroupLabel class="h-7 px-0 text-sidebar-accent-foreground">
						{section.title}
					</SidebarGroupLabel>
					<SidebarGroupContent>
						<SidebarMenu class="gap-0.5">
							{#each section.items as item (item.href)}
								<SidebarMenuItem>
									<SidebarMenuButton
										href={item.href}
										isActive={page.url.pathname === item.href}
										class="ps-3.5 hover:bg-transparent active:bg-transparent"
									>
										{item.title}
										{#if item.badge}
											<Badge variant="info">{item.badge}</Badge>
										{/if}
									</SidebarMenuButton>
								</SidebarMenuItem>
							{/each}
						</SidebarMenu>
					</SidebarGroupContent>
				</SidebarGroup>
			{/each}
		</nav>
	</SidebarContent>
</Sidebar>
