export type DashboardLayout = 'inset' | 'sidebar';

export const DEFAULT_DASHBOARD_LAYOUT: DashboardLayout = 'inset';

export function parseDashboardLayout(value: string | null | undefined): DashboardLayout {
	return value === 'sidebar' || value === 'inset' ? value : DEFAULT_DASHBOARD_LAYOUT;
}
