/*
 * The whole site is static files on GitHub Pages, so every route is prerendered
 * at build time.
 *
 * Setting it here rather than per route is what makes the build the check: a
 * page that cannot be prerendered — one reading cookies or a request header —
 * fails `pnpm build` instead of failing silently in production, where there is
 * no server to fall back to.
 */
export const prerender = true;
