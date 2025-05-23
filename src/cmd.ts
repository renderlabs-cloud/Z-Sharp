#!/usr/bin/node
require('module-alias/register');

import { program } from 'commander';
import Path from 'path';
import fs from 'fs';
import chalk from '@mnrendra/chalk';

import { Z } from '~/zs';
import { FileType } from '~/file';
import { Errors } from '~/error';
import { zs } from'~/cli/header';

let project: Record<any, any> = { };

function getProject(path: string) {
	try {
		return JSON.parse(fs.readFileSync(Path.resolve(path + '/.zsharp.json')).toString());
	} catch (err) {
		if (path == Path.resolve(path)) {
			return { };
		};
		return getProject(Path.resolve(path + '/../'));
	};
};

program
	.name('zs')
	.description(chalk.white(`${zs} compiler`))
;

program.command('build')
	.description(`Compile ${zs} code`)
	.option('--input, -I <path>')
	.option('--output, -O <path>')
	.option('--mode, -M <string>')
	.action((_options) => {
		for (const option in _options) {
			if (project?.[option] && _options[option] !== project?.[option]) {
				throw new Errors.Command.Conflicting.Parameters([option, option]);
			};
		};

		const options = { ..._options, ...project };

		if (!options.input) {
			throw new Errors.Command.Missing.Parameters(['input']);
		};

		project = getProject(options.input.split('/').slice(0, -1).join('/'));
		const asm = Z.toAssembly(fs.readFileSync(options.input).toString(), {
			import: (path: string) => {
				return fs.readFileSync(path).toString();
			},
			cli: true
		}, options.input);
		fs.writeFileSync(options.output || options.input + '.iz', asm);
	})
;

program.parse();

const options = program.opts();
	
