import type { Pluggable, PluggableList } from 'unified';

import { asidesPlugin } from './asidePlugin';

export const rehypePlugins: PluggableList = checkOptions([asidesPlugin, {}]);

/**
 * Adds autocomplete and typechecking to plugin tuples.
 */
function checkOptions<TPlugins extends Pluggable[]>(
	...p: {
		[I in keyof TPlugins]: TPlugins[I] extends [infer TPlugin extends (...args: never[]) => unknown, unknown]
			? [TPlugin, ...Parameters<TPlugin>]
			: TPlugins[I];
	}
) {
	return p;
}
