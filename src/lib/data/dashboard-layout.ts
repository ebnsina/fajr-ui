export type DashboardLayout = 'inset' | 'sidebar';

export const DASHBOARD_LAYOUT_COOKIE = 'dashboard_layout';
export const DASHBOARD_LAYOUT_MAX_AGE = 60 * 60 * 24 * 365;

export const DEFAULT_DASHBOARD_LAYOUT: DashboardLayout = 'inset';

export function parseDashboardLayout(value: string | undefined): DashboardLayout {
	return value === 'sidebar' || value === 'inset' ? value : DEFAULT_DASHBOARD_LAYOUT;
}
