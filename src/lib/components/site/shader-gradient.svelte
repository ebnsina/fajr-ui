<script lang="ts">
	/**
	 * A flowing mesh gradient, drawn on a WebGL canvas.
	 *
	 * The look being reproduced is ShaderGradient's, but not its implementation:
	 * both of its packages peer-depend on React, and the maintained one pulls
	 * three.js and react-three-fiber behind it. Adding a renderer and a second
	 * framework to a library whose entire claim is that it ships no runtime was
	 * not a trade worth making, so this is the effect written directly — one
	 * fragment shader, no dependencies.
	 *
	 * What produces the silky, marbled quality is domain warping: noise sampled
	 * at coordinates that are themselves displaced by noise, twice over. Plain
	 * fbm gives clouds; warping it gives the folded, liquid bands the reference
	 * has. It is also why the shader samples fbm five times per pixel, which is
	 * the cost driver here and the reason the loop pauses so readily below.
	 */
	type Props = {
		class?: string;
		/**
		 * Which surface to draw.
		 *
		 * `fold` is the warped one — five fbm samples a pixel, and the right
		 * amount of incident for something the size of a hero that a visitor
		 * looks at once.
		 *
		 * `halo` is a single broad falloff with grain over it. Six of them tile
		 * the catalogue, and at that size the folds stopped reading as folds and
		 * started reading as noise — the detail was competing with the mock UI
		 * sitting on top of it rather than lighting it. It is also about a fifth
		 * of the work per pixel.
		 */
		variant?: 'fold' | 'halo';
		/** Decorrelates instances, so two on screen are not the same image. */
		seed?: number;
		/** Multiplier on the drift. The card surfaces run slower than the hero. */
		speed?: number;
		/** How far the ramp is pushed toward white at its hottest. */
		intensity?: number;
	};

	let {
		class: className = '',
		variant = 'fold',
		seed = 0,
		speed = 1,
		intensity = 1
	}: Props = $props();

	let canvas = $state<HTMLCanvasElement | null>(null);

	const VERT = `
		attribute vec2 a_pos;
		void main() { gl_Position = vec4(a_pos, 0.0, 1.0); }
	`;

	const PRELUDE = `
		precision mediump float;
		uniform vec2 u_res;
		uniform float u_time;
		uniform float u_seed;
		uniform float u_intensity;

		/*
		 * The two ends of the ramp, supplied rather than baked in.
		 *
		 * They used to be constants — near-black and white — which meant the
		 * surface stayed black in the light theme no matter what the page did
		 * around it. They are now read from the page's own --color-background and
		 * --color-foreground, so the gradient inverts with the theme and an accent
		 * can be introduced by changing one token rather than this file.
		 */
		uniform vec3 u_ground;
		uniform vec3 u_light;

		/*
		 * Static grain, keyed to the pixel and not to time. Animated grain
		 * shimmers, which on six tiled surfaces is a page that will not sit
		 * still; frozen grain reads as film and costs one hash.
		 */
		float grain(vec2 co) {
			return fract(sin(dot(co, vec2(12.9898, 78.233))) * 43758.5453);
		}

		vec2 hash(vec2 p) {
			p = vec2(dot(p, vec2(127.1, 311.7)), dot(p, vec2(269.5, 183.3)));
			return -1.0 + 2.0 * fract(sin(p) * 43758.5453123);
		}

		float noise(vec2 p) {
			const float K1 = 0.366025404;
			const float K2 = 0.211324865;
			vec2 i = floor(p + (p.x + p.y) * K1);
			vec2 a = p - i + (i.x + i.y) * K2;
			float m = step(a.y, a.x);
			vec2 o = vec2(m, 1.0 - m);
			vec2 b = a - o + K2;
			vec2 c = a - 1.0 + 2.0 * K2;
			vec3 h = max(0.5 - vec3(dot(a, a), dot(b, b), dot(c, c)), 0.0);
			vec3 n = h * h * h * h * vec3(dot(a, hash(i)), dot(b, hash(i + o)), dot(c, hash(i + 1.0)));
			return dot(n, vec3(70.0));
		}

		float fbm(vec2 p) {
			float v = 0.0;
			float amp = 0.5;
			for (int i = 0; i < 4; i++) {
				v += amp * noise(p);
				p *= 2.02;
				amp *= 0.5;
			}
			return v;
		}
`;

	const FRAG_FOLD = `
		${PRELUDE}

		void main() {
			// Normalised against the shorter edge, so the pattern keeps its
			// proportions in a wide hero and a narrow card alike.
			vec2 uv = gl_FragCoord.xy / u_res;
			vec2 p = (gl_FragCoord.xy - 0.5 * u_res) / min(u_res.x, u_res.y);
			/*
			 * Below 1.0, so one fold fills the surface. The first pass ran at 1.7
			 * with warps of 3.0 and 3.5, which packed enough detail into a card to
			 * read as marble rather than as light — the giveaway that a gradient
			 * has too much frequency is that you start seeing texture instead of
			 * shape.
			 */
			p *= 0.85;
			p += u_seed;

			float t = u_time;

			// Two rounds of warping. One is a smudge; two is the fold.
			vec2 q = vec2(fbm(p + vec2(0.0, 0.0)), fbm(p + vec2(5.2, 1.3)));
			vec2 r = vec2(
				fbm(p + 1.8 * q + vec2(1.7, 9.2) + 0.15 * t),
				fbm(p + 1.8 * q + vec2(8.3, 2.8) - 0.13 * t)
			);
			float f = fbm(p + 2.2 * r);

			// Monochrome ramp. The accent, when there is one, replaces the white
			// here and nowhere else.
			float v = clamp(f * 0.75 + 0.55, 0.0, 1.0);
			// Gentle curve. At 2.2 this crushed everything but the hot core to
			// near-black, which is what made the surface look dirty rather than lit.
			v = pow(v, 1.25) * u_intensity;

			// Light falls off toward the bottom, so the surface reads as lit from
			// above rather than as a flat texture.
			v *= mix(0.28, 1.35, 1.0 - uv.y);

			vec3 col = mix(u_ground, u_light, clamp(v, 0.0, 1.0));
			gl_FragColor = vec4(col, 1.0);
		}
	`;

	/*
	 * The simple surface: one broad falloff, drifting, with grain over it.
	 *
	 * Deliberately not warped. What makes this read as light rather than as
	 * texture is that there is only one shape in it — the eye resolves a single
	 * soft source instantly and then reads the UI on top, which is the job at
	 * card size. The one noise sample is there only so the falloff is not a
	 * perfect circle.
	 */
	const FRAG_HALO = `
		${PRELUDE}

		void main() {
			vec2 uv = gl_FragCoord.xy / u_res;
			vec2 p = (gl_FragCoord.xy - 0.5 * u_res) / min(u_res.x, u_res.y);

			/*
			 * The source sits just above the frame and wanders across it.
			 *
			 * Y is positive, which is the whole point: gl_FragCoord counts up from
			 * the bottom, so the first version's negative offset put the light
			 * under the mock panel — the brightest part of the surface was the
			 * part covered by opaque UI, and the card read as almost black.
			 */
			vec2 c = vec2(
				sin(u_time * 0.16 + u_seed) * 0.40,
				cos(u_time * 0.12 + u_seed) * 0.14 + 0.46
			);

			// Wide, and barely curved. A tight falloff on a card this size is a
			// spotlight; the reference's is nearly a flat wash.
			float v = smoothstep(1.55, 0.0, length(p - c));
			v = pow(v, 1.15) * u_intensity;

			// Enough asymmetry to stop it reading as a vignette, no more.
			v *= 0.82 + 0.34 * noise(p * 0.7 + vec2(u_seed) + u_time * 0.04);

			vec3 col = mix(u_ground, u_light, clamp(v, 0.0, 1.0));
			col += (grain(gl_FragCoord.xy) - 0.5) * 0.05;

			gl_FragColor = vec4(col, 1.0);
		}
	`;

	/*
	 * Compilation failures are reported, not swallowed.
	 *
	 * A shader that does not compile still links into a usable-looking program
	 * and draws solid black — which on a dark page is indistinguishable from a
	 * surface that is simply dim. That cost a round of tuning brightness values
	 * on a shader that was never running: the halo variant called `noise` while
	 * the helper was still scoped to the other one. The log is the difference
	 * between reading the error and guessing at the design.
	 */
	function compile(gl: WebGLRenderingContext, type: number, src: string) {
		const shader = gl.createShader(type)!;
		gl.shaderSource(shader, src);
		gl.compileShader(shader);
		if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
			console.error('shader-gradient: shader failed to compile\n', gl.getShaderInfoLog(shader));
		}
		return shader;
	}

	$effect(() => {
		const el = canvas;
		if (!el) return;

		const gl = el.getContext('webgl', { antialias: false, alpha: false });
		// No WebGL is not an error worth surfacing — the parent paints a solid
		// ground underneath, so the surface simply stays flat.
		if (!gl) return;

		const program = gl.createProgram()!;
		gl.attachShader(program, compile(gl, gl.VERTEX_SHADER, VERT));
		gl.attachShader(
			program,
			compile(gl, gl.FRAGMENT_SHADER, variant === 'halo' ? FRAG_HALO : FRAG_FOLD)
		);
		gl.linkProgram(program);
		if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
			console.error('shader-gradient: program failed to link\n', gl.getProgramInfoLog(program));
			return;
		}
		gl.useProgram(program);

		// One triangle covering the viewport, rather than two for a quad: fewer
		// vertices and no seam down the diagonal where the interpolants meet.
		const buffer = gl.createBuffer();
		gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
		gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 3, -1, -1, 3]), gl.STATIC_DRAW);
		const loc = gl.getAttribLocation(program, 'a_pos');
		gl.enableVertexAttribArray(loc);
		gl.vertexAttribPointer(loc, 2, gl.FLOAT, false, 0, 0);

		const uRes = gl.getUniformLocation(program, 'u_res');
		const uTime = gl.getUniformLocation(program, 'u_time');
		const uGround = gl.getUniformLocation(program, 'u_ground');
		const uLight = gl.getUniformLocation(program, 'u_light');
		gl.uniform1f(gl.getUniformLocation(program, 'u_seed'), seed);
		gl.uniform1f(gl.getUniformLocation(program, 'u_intensity'), intensity);

		/*
		 * Capped at 1.5, not `devicePixelRatio`. This is a soft gradient with no
		 * edges to alias, so a retina buffer quadruples a five-fbm-per-pixel
		 * shader's work for something nobody can see.
		 */
		function resize() {
			if (!el || !gl) return;
			const dpr = Math.min(window.devicePixelRatio || 1, 1.5);
			const w = Math.max(1, Math.round(el.clientWidth * dpr));
			const h = Math.max(1, Math.round(el.clientHeight * dpr));
			if (el.width === w && el.height === h) return;
			el.width = w;
			el.height = h;
			gl.viewport(0, 0, w, h);
			gl.uniform2f(uRes, w, h);
		}

		/*
		 * Reads the two ramp colours off the canvas itself.
		 *
		 * The tokens are written in `oklch()` and `color-mix()`, which no amount
		 * of string parsing should be attempting. Instead the canvas carries
		 * `color: var(--color-foreground)` and `background-color:
		 * var(--color-background)`, and the browser hands back both already
		 * resolved to `rgb()` — so this works for whatever syntax the theme is
		 * written in, including whatever it is changed to later.
		 */
		function readColour(value: string): [number, number, number] {
			const parts = value.match(/[\d.]+/g)?.map(Number);
			if (!parts || parts.length < 3) return [0, 0, 0];
			/*
			 * Two serialisations, two scales.
			 *
			 * `color(srgb r g b)` is already 0–1, which is what the shader wants.
			 * `rgb(r, g, b)` is 0–255 and has to be divided. Reading the first three
			 * numbers and always dividing by 255 — which is what this did — turns
			 * `color(srgb 1 1 1)` into 0.004 and every ramp into black on black.
			 */
			return value.startsWith('color(')
				? [parts[0], parts[1], parts[2]]
				: [parts[0] / 255, parts[1] / 255, parts[2] / 255];
		}

		function syncColours() {
			if (!el || !gl) return;
			const computed = getComputedStyle(el);
			gl.uniform3fv(uGround, readColour(computed.backgroundColor));
			gl.uniform3fv(uLight, readColour(computed.color));
		}
		syncColours();

		/*
		 * The theme is toggled by adding `.dark` to `<html>`, which fires no
		 * event. Observing that one attribute is what keeps the surface from
		 * staying inverted until the next resize.
		 */
		const theme = new MutationObserver(() => {
			syncColours();
			if (motion.matches) still();
		});
		theme.observe(document.documentElement, { attributes: true, attributeFilter: ['class'] });

		const observer = new ResizeObserver(resize);
		observer.observe(el);
		resize();

		/*
		 * Two things stop the loop, and both matter on a page carrying seven of
		 * these: the surface being off screen, and the user having asked for less
		 * motion. Under reduced motion it still draws — once, at a fixed time —
		 * so the gradient is present but still.
		 */
		const motion = window.matchMedia('(prefers-reduced-motion: reduce)');
		let visible = false;
		let frame = 0;
		const start = performance.now();

		function draw(now: number) {
			if (!gl) return;
			gl.uniform1f(uTime, ((now - start) / 1000) * speed);
			gl.drawArrays(gl.TRIANGLES, 0, 3);
			frame = requestAnimationFrame(draw);
		}

		function still() {
			if (!gl) return;
			gl.uniform1f(uTime, 0);
			gl.drawArrays(gl.TRIANGLES, 0, 3);
		}

		function sync() {
			cancelAnimationFrame(frame);
			if (motion.matches) still();
			else if (visible) frame = requestAnimationFrame(draw);
		}

		const io = new IntersectionObserver(
			([entry]) => {
				visible = entry.isIntersecting;
				sync();
			},
			{ rootMargin: '150px' }
		);
		io.observe(el);
		motion.addEventListener('change', sync);
		sync();

		return () => {
			cancelAnimationFrame(frame);
			observer.disconnect();
			theme.disconnect();
			io.disconnect();
			motion.removeEventListener('change', sync);
			// Frees the drawing buffer rather than waiting on the GC. Browsers cap
			// live WebGL contexts at around sixteen, and this page can hold seven.
			gl.getExtension('WEBGL_lose_context')?.loseContext();
		};
	});
</script>

<!--
	The two inline properties are not decoration — they are the input. The shader
	reads its ramp colours back off this element via `getComputedStyle`. The
	background also stands in before the first frame is drawn.

	They are wrapped in `color-mix(in srgb, … 100%, transparent)` rather than used
	directly, and that wrapper is the whole point: a token written in `oklch()`
	is *reported* by `getComputedStyle` as `oklch(0.97 0 0)`, whose three numbers
	are lightness, chroma and hue — not red, green and blue. Forcing the mix
	through sRGB makes the browser serialise it as `color(srgb r g b)`, which is
	channels, which is what can actually be handed to a shader.
-->
<canvas
	bind:this={canvas}
	aria-hidden="true"
	class={className}
	style="color: color-mix(in srgb, var(--color-foreground) 100%, transparent); background-color: color-mix(in srgb, var(--color-background) 100%, transparent);"
></canvas>
