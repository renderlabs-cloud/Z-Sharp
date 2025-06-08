import * as ct from 'colorette';

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

export const header = ct.white(
	':===: ' + ct.red('Z#') + ' :===:' + '\n\n' +
	hyperlink('Documentation', 'https://docs.zsharp.dev') + '\n'
);

export const Zasm_error = `${ct.red(ct.bold('Z# intermediate Error'))}!`;
export const Z_bug = `${ct.red(ct.bold('This is definitely a bug'))}! Please report it:`;
export const Zasm_bug = hyperlink('Report', 'https://github.com/renderlabs-cloud/Z-Sharp/issues/new?template=Zasm_bug.yml');

export const zs = ct.red('Z#');

/**
 * Generates a success message for the CLI.
 * @param data The data to include in the message.
 * @returns The message.
 */
export function success(data: SuccessData) {
	return ct.white(
		'\n' +
		`Code compilation ${ct.green('succeeded')} in ${ct.green(data.time)}ms with ${((data.vulnerabilities == 0) ? ct.green('0') : ((data.vulnerabilities < 5) ? ct.yellow(data.vulnerabilities) : ct.red(data.vulnerabilities)))} known vulnerabilit(ies).`
	);
};

/**
 * Generates a failure message for the CLI.
 * @param data The data to include in the message.
 * @returns The message.
 */
export function failure(data: FailureData) {
	return ct.white(
		'\n' +
		`Code compilation ${ct.red('failed')} with ${ct.red(data.errors)} error(s).`
	);
};

/**
 * Format a string with color.
 * @param data The string to format.
 * @returns The formatted string.
 */
export function format(data: string): string {
	return data
		.replace(/(['"])([^'"]+)\1/g, (_, quote, content) => ct.green(`${quote}${content}${quote}`))
		.replace(/\b(0x[0-9a-fA-F]+|\d+)\b/g, (match) => ct.cyan(match));
}
