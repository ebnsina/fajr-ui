import { untrack } from 'svelte';

/**
 * A reactive list that child components add themselves to on mount.
 *
 * The add/remove halves are untracked deliberately. Callers register from an
 * `$effect`, and reading the current list in order to append to it would make
 * that effect depend on state it also writes — an update loop. Keeping the
 * untracking here means no caller has to remember it.
 */
export class TrackedList {
	#items = $state<string[]>([]);

	get items(): string[] {
		return this.#items;
	}

	get length(): number {
		return this.#items.length;
	}

	/** Returns a cleanup function, so it can be returned straight from `$effect`. */
	add(item: string): () => void {
		untrack(() => {
			this.#items = [...this.#items, item];
		});
		return () =>
			untrack(() => {
				this.#items = this.#items.filter((entry) => entry !== item);
			});
	}

	/** Space-separated for `aria-describedby`; `undefined` omits the attribute. */
	get joined(): string | undefined {
		return this.#items.length > 0 ? this.#items.join(' ') : undefined;
	}

	has(item: string): boolean {
		return this.#items.includes(item);
	}

	/** Neighbour by offset, wrapping at both ends. */
	neighbour(from: string, delta: number): string | undefined {
		const index = this.#items.indexOf(from);
		if (index === -1) return undefined;
		return this.#items[(index + delta + this.#items.length) % this.#items.length];
	}
}
