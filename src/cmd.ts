require('module-alias/register');

import { program } from 'commander';
import fs from 'fs';

import { Z } from '~/zs';
import { FileType } from '~/file';
import { ErrorType } from '~/error';

const project = JSON.parse(fs.readFileSync('Z#.project.json').toString());

program
	.name('Z#')
	.description('Z# compiler')
;

program.command('build')
	.description('Compile Z# code')
	.option('--input, -I <path>')
	.option('--output, -O <path>')
	.option('--mode, -M <string>')
	.action((_options) => {
		for (const option in _options) {
			if (project?.[option] && _options[option] !== project?.[option]) {
				throw new ErrorType.Command.Conflicting.Parameters([option, option]);
			};
		};
		
		const options = { ..._options, ...project};
		if (!options.input) {
			throw new ErrorType.Command.Missing.Parameters(['input']);	
		};

		const asm = Z.toAssembly(fs.readFileSync(options.input).toString(), { 
			import: (path: string) => {
				return fs.readFileSync(path).toString();
			}
		});
		fs.writeFileSync(options.output || options.input + '.asm', asm);
	})
;

program.parse();

const options = program.opts();
