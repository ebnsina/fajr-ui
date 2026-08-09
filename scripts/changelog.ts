/**
 * Writes CHANGELOG.md from src/lib/data/changelog.ts, so the file and the docs
 * page can never disagree. Run with `pnpm changelog`.
 */
import { writeFileSync } from 'node:fs';
import { CHANGE_KIND_LABEL, releases } from '../src/lib/data/changelog.ts';

const lines: string[] = [
	'# Changelog',
	'',
	'All notable changes to this project are recorded here.',
	'',
	'<!-- Generated from src/lib/data/changelog.ts by `pnpm changelog`. Do not edit by hand. -->',
	''
];

for (const release of releases) {
	lines.push(`## ${release.version} — ${release.date}`, '');
	if (release.summary) lines.push(release.summary, '');
	for (const group of release.changes) {
		lines.push(`### ${CHANGE_KIND_LABEL[group.kind]}`, '');
		for (const entry of group.entries) {
			lines.push(typeof entry === 'string' ? `- ${entry}` : `- **${entry.lead}** ${entry.text}`);
		}
		lines.push('');
	}
}

writeFileSync(new URL('../CHANGELOG.md', import.meta.url), lines.join('\n'));
console.log(`Wrote CHANGELOG.md — ${releases.length} releases`);
