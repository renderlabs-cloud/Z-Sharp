import util from 'node:util';
import * as ct from 'colorette';

import { Errors } from '~/error';
import { failure, format } from '~/cli/header';

export namespace Util {
	/**
	 * Trim an object down to a certain depth by recursively replacing children with `null` once a certain depth is reached.
	 *
	 * @param obj The object to trim.
	 * @param maxDepth The maximum depth to trim to.
	 * @param currentDepth The current depth of the object. Defaults to 0.
	 *
	 * @returns The trimmed object, or `null` if the object is too deep.
	 */
	export function trimDepth<T>(obj: T, maxDepth: number, currentDepth: number = 0): T | null {
		if (currentDepth >= maxDepth || obj === null || typeof obj !== 'object') {
			return null;
		};

		const result: any = {};
		for (const key in obj) {
			if (Object.prototype.hasOwnProperty.call(obj, key)) {
				const trimmed = trimDepth(obj[key], maxDepth, currentDepth + 1);
				if (trimmed !== null) {
					result[key] = trimmed;
				};
			};
		};
		return result;
	};
	/**
	 * Logs the error message, stack trace, and failure details, then exits the process.
	 *
	 * @param err An instance of `Errors.MainError` containing the error details to be logged.
	 */
	export function error(err: Errors.MainError) {
		console.log(err.message, err.stack);
		console.log(failure({
			errors: err.count || 1
		}));
		console.debug(err.stack);
		process.exit(1);
	};

	export function debug(...args: any[]) {
		for (const arg of args) {
			console.log(`[${ct.magenta('DEBUG')}:${new Error().stack?.split('\n')[2].replace('\t', '')}]: ${util.inspect(arg, { colors: true, depth: Infinity })}`);
		};
	};
};