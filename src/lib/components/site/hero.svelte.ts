/**
 * How far the home page has been scrolled past its hero.
 *
 * The header sits on near-black while the hero is behind it and on the page
 * ground once it is not. Splitting that into two questions is what keeps it
 * from flashing on load:
 *
 *   - *Is there a hero?* is answered from the route, in the header itself, so
 *     it is already correct in the prerendered HTML.
 *   - *Have we scrolled past it?* is answered here, and can only be answered on
 *     the client — but it starts false, which is the state every page loads in,
 *     so the first paint needs no correcting.
 *
 * An earlier version published "the hero is behind the header" from the page
 * instead. That could not be right at first paint: the layout renders the
 * header before the page that would set the flag, so the prerendered header was
 * always the opaque one and hydration visibly swapped it.
 */
class Hero {
	/** True once the hero no longer covers the strip the header occupies. */
	scrolledPast = $state(false);
}

export const hero = new Hero();
