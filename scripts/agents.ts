/**
 * Writes the agent files into this repository.
 *
 * The same content the site serves at /skill.md and /agents.md, checked in so
 * it is visible in the source and shows up in a diff when the rules change —
 * a build artifact nobody can see is a rule nobody reviews. It also means an
 * agent working on this repository reads the same instructions we hand to
 * everyone using the library.
 *
 * AGENTS.md is edited between markers, so the conventions written above the
 * block survive regeneration. Run with `pnpm agents`.
 */
import { existsSync } from 'node:fs';
import { mkdir, readFile, writeFile } from 'node:fs/promises';
import { dirname } from 'node:path';
import { agentsMarkdown, skillMarkdown } from '../src/lib/llms/rules.ts';

const root = new URL('../', import.meta.url);
const START = '<!-- fajr-ui:start -->';
const END = '<!-- fajr-ui:end -->';

const skillPath = new URL('.claude/skills/fajr-ui/SKILL.md', root);
await mkdir(dirname(skillPath.pathname), { recursive: true });
await writeFile(skillPath, skillMarkdown(), 'utf8');

const agentsPath = new URL('AGENTS.md', root);
const block = agentsMarkdown();
const existing = existsSync(agentsPath.pathname) ? await readFile(agentsPath, 'utf8') : '';

let next: string;
if (existing.includes(START) && existing.includes(END)) {
	next =
		existing.slice(0, existing.indexOf(START)) +
		block +
		existing.slice(existing.indexOf(END) + END.length);
} else {
	next = existing ? `${existing.replace(/\s+$/, '')}\n\n${block}\n` : `${block}\n`;
}
await writeFile(agentsPath, next, 'utf8');

console.log('Wrote .claude/skills/fajr-ui/SKILL.md and refreshed the AGENTS.md block.');
