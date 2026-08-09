import { json } from '@sveltejs/kit';

export const prerender = true;

/**
 * JSON Schema for `fajr-ui.json`, so an editor completes and validates the file.
 *
 * `init` writes a `$schema` key pointing here. It pointed at a URL that had
 * never been served, which is worse than omitting the key: every generated
 * config carried a dead reference, and editors that fetch it flagged an error
 * on a file that was perfectly correct.
 */
const SCHEMA = {
	$schema: 'https://json-schema.org/draft/2020-12/schema',
	$id: 'https://ebnsina.github.io/fajr-ui/r/schema.json',
	title: 'Fajr UI configuration',
	description: 'Where the CLI writes components, and which registry it reads.',
	type: 'object',
	properties: {
		$schema: { type: 'string', description: 'This file.' },
		registry: {
			type: 'string',
			format: 'uri',
			description: 'Base URL the CLI reads components from.',
			default: 'https://ebnsina.github.io/fajr-ui/r'
		},
		aliases: {
			type: 'object',
			description: 'Where each kind of file lands, relative to the project root.',
			properties: {
				components: {
					type: 'string',
					description: 'Components go here.',
					default: 'src/lib/components/ui'
				},
				lib: {
					type: 'string',
					description:
						'The helpers components import as $lib/utils, $lib/icons and so on. Must be whatever $lib resolves to, or those imports will not resolve.',
					default: 'src/lib'
				}
			},
			required: ['components', 'lib'],
			additionalProperties: false
		}
	},
	required: ['registry', 'aliases'],
	additionalProperties: false
};

export function GET() {
	return json(SCHEMA);
}
