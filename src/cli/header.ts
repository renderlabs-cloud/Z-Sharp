import { chalk } from '@mnrendra/chalk';

export type SuccessData = {
	vulnerabilities: number,
	time: number
};

export type FailureData = {
	errors: number
};

export function hyperlink(text: string, url: string, attrs?: string[]) {
	return `\u001b]8;${attrs || ''};${url || text}\u0007${text}\u001b]8;;\u0007`;
};

export const header = chalk.white(
	':===: ' + chalk.red('Z#') + ' :===:' + '\n\n' +
	chalk.blue(hyperlink('Documentation', 'https://docs.zsharp.dev')) + '\n'
);

export const Z_bug = chalk.red('This is a bug! Please report it:', 'https://github.com/renderlabs-cloud/Z-Sharp/issues/new?template=Zasm_bug.yml');
export const Zasm_bug = hyperlink('Report', '');

export const zs = chalk.red('Z#');

export function success(data: SuccessData) {
	return chalk.white(
		'\n' +
		`Code compilation ${chalk.green('succeeded')} in ${chalk.green(data.time)}ms with ${((data.vulnerabilities == 0) ? chalk.green('0') : ((data.vulnerabilities < 5) ? chalk.yellow(data.vulnerabilities) : chalk.red(data.vulnerabilities)))} known vulnerabilit(ies).`
	);
};

export function failure(data: FailureData) {
	return chalk.white(
		'\n' +
		`Code compilation ${chalk.red('failed')} with ${chalk.red(data.errors)} error(s).`
	);
};
