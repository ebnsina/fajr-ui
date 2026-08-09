import { DASHBOARD_LAYOUT_COOKIE, parseDashboardLayout } from '$lib/data/dashboard-layout';
import type { DashboardLayout } from '$lib/data/dashboard-layout';
import type { LayoutServerLoad } from './$types';

/**
 * Resolve the layout on the server so the first paint already matches — no
 * flash from inset to full-width on hydration.
 *
 * A `?layout=` param wins for that visit, which is what makes each variant
 * directly linkable. It deliberately does NOT write the cookie: link
 * preloading runs this load on hover, so persisting here would rewrite the
 * user's saved preference just for pointing at a link. Only the switcher saves.
 */
export const load: LayoutServerLoad = ({ cookies, url }): { dashboardLayout: DashboardLayout } => {
	const requested = url.searchParams.get('layout');
	if (requested === 'inset' || requested === 'sidebar') {
		return { dashboardLayout: requested };
	}

	return { dashboardLayout: parseDashboardLayout(cookies.get(DASHBOARD_LAYOUT_COOKIE)) };
};
