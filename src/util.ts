import util from 'node:util';
import * as ct from 'colorette';
import os from 'os';
import { Worker } from 'worker_threads';

import { Errors } from '~/error';
import { Header } from '~/cli/header';

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
	 * Replaces all instances of `~` in the given path with the actual home directory
	 * as determined by the `os.homedir()` function.
	 *
	 * @param path The path to be modified.
	 *
	 * @returns The modified path.
	 */
	export function OSPath(path: string) {
		return path
			.replace(/~/g, os.homedir());
	};
	/**
	 * Replaces backslashes with forward slashes and all instances of `@` with
	 * `~/.zsharp/modules/` in the given path.
	 *
	 * @param path The path to be modified.
	 *
	 * @returns The modified path.
	 */
	export function modPath(path: string) {
		return Util.OSPath(
			path
				.replace(/\\/g, '/')
				.replace(/\@/g, '~/.zsharp/modules/')
		);
	};

	export async function runInWorker<T, R>(func: (...args: any) => Promise<R>, ...args: any): Promise<R> {
		return new Promise<R>((resolve, reject) => {
			const worker = new Worker((() => {
				const { parentPort } = require('worker_threads');
				parentPort?.postMessage(func());
			}).toString(), {
				eval: true
			});
			worker.on('error', reject);
			worker.on('message', (result) => {
				resolve(result);
			});
		});
	};

	/**
	 * Logs the error message, stack trace, and failure details, then exits the process.
	 *
	 * @param err An instance of `Errors.MainError` containing the error details to be logged.
	 */
	export function error(err: Errors.MainError): never {
		console.log(err.message, err.stack);
		console.log(Header.failure({
			errors: err.count || 1
		}));
		console.debug(err.stack);
		process.exit(1);
	};

	/**
	 * Logs debug information for the provided arguments, including a stack trace.
	 *
	 * @param args A list of arguments to be logged as debug information.
	 */

	export function debug(...args: any[]) {
		for (const arg of args) {
			console.log(`[${ct.magenta('DEBUG')}:${new Error().stack?.split('\n')[2].replace('\t', '')}]: ${util.inspect(arg, { colors: true, depth: Infinity })}`);
		};
	};

	/**
	 * Logs the provided arguments.
	 *
	 * @param args A list of arguments to be logged.
	 */
	export function log(...args: any[]) {
		console.log(...args);
	};
};