import { Debouncer, Throttler } from '@tanstack/pacer';

/**
 * Thin wrappers over Pacer's `Debouncer` and `Throttler` that return a plain
 * callable plus the controls worth reaching for from a component.
 *
 * Pacer is used rather than a hand-rolled `setTimeout` because it also gives us
 * `cancel` and `flush`. `flush` in particular matters for a search box: pressing
 * Enter should run the pending query immediately rather than wait out the tail
 * of the debounce.
 */
export type Paced<TArgs extends unknown[]> = {
	(...args: TArgs): void;
	/** Drop a pending call — use on unmount so a torn-down component stays quiet. */
	cancel: () => void;
	/** Run a pending call now. */
	flush: () => void;
};

export function debounced<TArgs extends unknown[]>(
	fn: (...args: TArgs) => void,
	wait: number
): Paced<TArgs> {
	const debouncer = new Debouncer(fn as (...args: unknown[]) => void, { wait });
	const call = ((...args: TArgs) => debouncer.maybeExecute(...args)) as Paced<TArgs>;
	call.cancel = () => debouncer.cancel();
	call.flush = () => debouncer.flush();
	return call;
}

export function throttled<TArgs extends unknown[]>(
	fn: (...args: TArgs) => void,
	wait: number
): Paced<TArgs> {
	const throttler = new Throttler(fn as (...args: unknown[]) => void, { wait });
	const call = ((...args: TArgs) => throttler.maybeExecute(...args)) as Paced<TArgs>;
	call.cancel = () => throttler.cancel();
	call.flush = () => throttler.flush();
	return call;
}
