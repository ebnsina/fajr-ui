import { untrack } from 'svelte';

export type ToastTone = 'default' | 'success' | 'warning' | 'error' | 'info' | 'loading';

export type ToastAction = {
	label: string;
	onclick: () => void;
};

export type ToastOptions = {
	description?: string;
	tone?: ToastTone;
	/** Milliseconds before it dismisses itself; `0` keeps it until dismissed. */
	duration?: number;
	action?: ToastAction;
	onDismiss?: () => void;
};

export type Toast = ToastOptions & {
	id: number;
	title: string;
	tone: ToastTone;
	duration: number;
};

const DEFAULT_DURATION = 5000;
/** Errors stay longer: they usually carry something the user must act on. */
const ERROR_DURATION = 8000;

let nextId = 0;

class ToastState {
	toasts = $state<Toast[]>([]);
	/** Paused while hovered, focused, or the tab is in the background. */
	paused = $state(false);

	#timers = new Map<number, { remaining: number; startedAt: number; timer?: number }>();

	add(title: string, options: ToastOptions = {}): number {
		const tone = options.tone ?? 'default';
		const id = nextId++;
		const toast: Toast = {
			...options,
			id,
			title,
			tone,
			duration: options.duration ?? (tone === 'error' ? ERROR_DURATION : DEFAULT_DURATION)
		};

		untrack(() => {
			// Newest first, so the stack grows away from the corner it sits in.
			this.toasts = [toast, ...this.toasts];
		});

		if (toast.duration > 0) {
			this.#timers.set(id, { remaining: toast.duration, startedAt: Date.now() });
			if (!this.paused) this.#start(id);
		}
		return id;
	}

	dismiss(id: number): void {
		const entry = this.#timers.get(id);
		if (entry?.timer) clearTimeout(entry.timer);
		this.#timers.delete(id);

		untrack(() => {
			const toast = this.toasts.find((item) => item.id === id);
			this.toasts = this.toasts.filter((item) => item.id !== id);
			toast?.onDismiss?.();
		});
	}

	clear(): void {
		for (const id of [...this.#timers.keys()]) this.dismiss(id);
		untrack(() => (this.toasts = []));
	}

	#start(id: number): void {
		const entry = this.#timers.get(id);
		if (!entry) return;
		entry.startedAt = Date.now();
		entry.timer = setTimeout(() => this.dismiss(id), entry.remaining) as unknown as number;
	}

	/**
	 * Pausing preserves the time already elapsed rather than restarting, so a
	 * toast the user glanced at does not get a fresh five seconds each time the
	 * pointer passes over it.
	 */
	pause(): void {
		if (this.paused) return;
		this.paused = true;
		for (const entry of this.#timers.values()) {
			if (!entry.timer) continue;
			clearTimeout(entry.timer);
			entry.timer = undefined;
			entry.remaining = Math.max(0, entry.remaining - (Date.now() - entry.startedAt));
		}
	}

	resume(): void {
		if (!this.paused) return;
		this.paused = false;
		for (const id of this.#timers.keys()) this.#start(id);
	}
}

export const toaster = new ToastState();

type ToastFn = {
	(title: string, options?: ToastOptions): number;
	success: (title: string, options?: ToastOptions) => number;
	error: (title: string, options?: ToastOptions) => number;
	warning: (title: string, options?: ToastOptions) => number;
	info: (title: string, options?: ToastOptions) => number;
	loading: (title: string, options?: ToastOptions) => number;
	dismiss: (id: number) => void;
	clear: () => void;
};

/**
 * Call from anywhere — no context, no hook. `<Toaster />` mounted once is the
 * only setup, which is the whole point of the API.
 */
export const toast: ToastFn = Object.assign(
	(title: string, options?: ToastOptions) => toaster.add(title, options),
	{
		success: (title: string, options?: ToastOptions) =>
			toaster.add(title, { ...options, tone: 'success' }),
		error: (title: string, options?: ToastOptions) =>
			toaster.add(title, { ...options, tone: 'error' }),
		warning: (title: string, options?: ToastOptions) =>
			toaster.add(title, { ...options, tone: 'warning' }),
		info: (title: string, options?: ToastOptions) =>
			toaster.add(title, { ...options, tone: 'info' }),
		/** Stays until resolved — a spinner with a deadline would be a lie. */
		loading: (title: string, options?: ToastOptions) =>
			toaster.add(title, { ...options, tone: 'loading', duration: 0 }),
		dismiss: (id: number) => toaster.dismiss(id),
		clear: () => toaster.clear()
	}
);
