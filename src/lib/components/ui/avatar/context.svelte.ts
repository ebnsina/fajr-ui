import { getContext, setContext } from 'svelte';

export type AvatarStatus = 'idle' | 'loaded' | 'error';

export class AvatarState {
	/** Drives which of the image and the fallback is showing. */
	status = $state<AvatarStatus>('idle');

	reset(): void {
		this.status = 'idle';
	}
}

const AVATAR_CONTEXT_KEY = Symbol('avatar');

export function setAvatarContext(state: AvatarState): AvatarState {
	return setContext(AVATAR_CONTEXT_KEY, state);
}

export function useAvatar(): AvatarState {
	const state = getContext<AvatarState | undefined>(AVATAR_CONTEXT_KEY);
	if (!state) throw new Error('Avatar parts must be used within <Avatar>.');
	return state;
}
