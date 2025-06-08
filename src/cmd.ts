#!/usr/bin/node
require('module-alias/register');

import { program } from 'commander';
import fs from 'fs';
import * as ct from 'colorette';
import Inquierer from '@inquirer/core';
import { confirm } from '@inquirer/prompts';

import { Z } from '~/zs';
import { FileType } from '~/file';
import { Errors } from '~/error';
import { zs } from '~/cli/header';
import { Project } from '~/project';
import { Util } from '~/util';

let project: Record<any, any> = {};

program
	.name('zs')
	.description(ct.white(`${zs} compiler`))
	;

program.command('build')
	.description(`Build ${zs} code`)
	.option('--input, -I <path>')
	.option('--output, -O <path>')
	.option('--mode, -M <string>')
	.option('--debug, -D')
	.action((options) => {
		if (!options.input) {
			throw new Errors.Command.Missing.Parameters(['input']);
		};

		project = Project.get(options.input.split('/').slice(0, -1).join('/'));
		Util.debug(project);
		const asm = Z.toAssembly(fs.readFileSync(options.input).toString(), {
			import: (path: string) => {
				return fs.readFileSync(path).toString();
			},
			cli: true,
			debug: options.debug
		}, options.input);
		fs.writeFileSync(options.output || options.input + '.iz', asm);
	})
	;

program.command('emit')
	.description(`Compile ${zs} intermediate assembly`)
	.option('--input, -I <path>')
	.option('--output, -O <path>')
	.option('--target, -T <arch>')
	.option('--agree, -A')
	.action(async (_options) => {
		if (!_options.input) {
			throw new Errors.Command.Missing.Parameters(['input']);
		};
		if (!_options.agree) {
			await confirm({
				message: 'Before emitting the code, please read the Intermediate Z# file (.iz) and accept the terms.',
				default: false
			});
		};
		const asm = fs.readFileSync(_options.input).toString();
		const binary = await Z.emit(asm, _options.output);
		fs.writeFileSync(_options.output, binary);
	})
	;

program.parse();

const options = program.opts();

