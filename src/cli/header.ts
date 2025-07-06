import * as ct from 'colorette';

import _package from 'package.json';

export namespace Header {
	// Symbols
	export const zs = ct.red('Z#');
	export const iz = `${ct.white('.')}${ct.blue('i')}${ct.red('z')}`;

	// Messages
	export const Zasm_error = `${ct.red(ct.bold('Z# intermediate Error'))}!`;
	export const Z_bug = `${ct.red(ct.bold('This should not happen'))}!`;
	export const Zasm_bug = hyperlink('Report', 'https://github.com/renderlabs-cloud/Z-Sharp/issues/new?template=Zasm_bug.yml');

	// URLs
	export const docs = 'https://docs.zsharp.dev';
	export const github = 'https://github.com/renderlabs-cloud/Z-Sharp';
	export const discord = 'https://discord.gg/gGcbaBjtBS';

	export type SuccessData = {
		vulnerabilities: number,
		time: number
	};

	export type FailureData = {
		errors: number
	};

	export function hyperlink(text: string, url: string, attrs?: string[]) {
		return ct.blue(`\u001b]8;${attrs || ''};${url || text}\u0007${text}\u001b]8;;\u0007`);
	};

	export function bullets(data: string[]) {
		return data.map((item) => `- ${item}`).join('\n');
	};

	export const header = ct.white(
		`
:===: ${Header.zs} :===:

${bullets([
			hyperlink('Documentation', Header.docs),
			hyperlink('GitHub', Header.github),
			hyperlink('Discord', Header.discord),
			hyperlink('Version', `https://npmjs.com/package/@zsharp/core/v/${_package.version}`)
			// ? Perhaps add a support page?
		])}
		`
	);


	/**
	 * Format a time in ms as a green string.
	 * @param time The time in ms.
	 * @returns A green colored in the format of `X.XXs`.
	 */
	export function time(time: number) {
		let timeString: string | null = null;
		if (time < 1000) {
			timeString = `${time}ms`;
		} else {
			timeString = `${(time / 1000).toFixed(2)}s`;
		};

		if (time < 1000) {
			return ct.green(timeString);
		} else if (time < 10000) {
			return ct.yellow(timeString);
		} else {
			return ct.red(timeString);
		};
	};

	/**
	 * Generates a success message for the CLI.
	 * @param data The data to include in the message.
	 * @returns The message.
	 */
	export function success(data: SuccessData) {
		return ct.white(
			`Code compilation ${ct.green('succeeded')} in ${Header.time(data.time)} with ${((data.vulnerabilities == 0) ? ct.green('0') : ((data.vulnerabilities < 5) ? ct.yellow(data.vulnerabilities) : ct.red(data.vulnerabilities)))} known vulnerabilit(ies).`
		);
	};

	/**
	 * Generates a failure message for the CLI.
	 * @param data The data to include in the message.
	 * @returns The message.
	 */
	export function failure(data: FailureData) {
		return ct.white(
			`Code compilation ${ct.red('failed')} with ${ct.red(data.errors)} error(s).`
		);
	};

	const ansiRegex = /\x1b\[[0-9;]*m/g;

	/**
	 * Formats a string as a green, double quoted string.
	 * @param data The string to format.
	 * @returns The formatted string.
	 */
	export function quote(data: string) {
		return ct.green(`'${data}'`);
	};

	/**
	 * Format a string with color.
	 * @param data The string to format.
	 * @returns The formatted string.
	 */
	export function format(data: string): string {
		let lastColor = ''; // will hold the last color code found before match

		return data.replace(/(['"])([^'"]+)\1/g, (match, quote, content, offset) => {
			// Find the last color code before this match
			lastColor = findLastColorCode(data.slice(0, offset)) || lastColor;

			return ct.green(`${quote}${content}${quote}`) + lastColor;
		}).replace(/\b(0x[0-9a-fA-F]+|\d+)\b/g, (match, _, offset) => {
			lastColor = findLastColorCode(data.slice(0, offset)) || lastColor;

			return ct.cyan(match) + lastColor;
		});
	};

	function findLastColorCode(str: string): string | null {
		const matches = [...str.matchAll(ansiRegex)];
		return matches.length ? matches[matches.length - 1][0] : null;
	};

	// Auto generated
	// !! DO NOT EDIT
	const Mooseworth = ``;
};
