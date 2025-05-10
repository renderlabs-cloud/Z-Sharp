import { chalk } from '@mnrendra/chalk';

export function hyperlink(text: string, url: string, attrs?: string[]) {
  return `\u001b]8;${attrs || ''};${url || text}\u0007${text}\u001b]8;;\u0007`;
};

export const zHeader = chalk.white(
	':===: ' + chalk.red('Z#') + ' :===:' + '\n\n' +
	chalk.blue(hyperlink('Documentation', 'https://z.labz.online')) + '\n\n'
);
