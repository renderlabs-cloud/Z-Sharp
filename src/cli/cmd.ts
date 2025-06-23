#!/usr/bin/env node

require('module-alias/register');

import { program } from 'commander';
import fs from 'fs';
import * as ct from 'colorette';
import Inquierer from '@inquirer/core';
import { confirm } from '@inquirer/prompts';

import { Z } from '~/zs';
import { FileType } from '~/file';
import { Errors } from '~/error';
import { Header } from '~/cli/header';
import { Project } from '~/project';
import { Util } from '~/util';

import _package from 'package.json';

let config: Project.Configuration = {};

program
	.name('zs')
	.description(ct.white(`${Header.zs} compiler`))
	.version(_package.version)
	;

program.command('build')
	.description(`Build ${Header.zs} code`)
	.option('--input, -I <path>')
	.option('--output, -O <path>')
	.option('--mode, -M <string>')
	.option('--debug, -D')
	.action((options) => {
		if (!options.input) {
			throw new Errors.Command.Missing.Parameters(['input']);
		};

		Util.log(Header.header);

		config = Project.get(options.input.split('/').slice(0, -1).join('/'));
		const asm = Z.toIZ(fs.readFileSync(options.input).toString(), {
			import: [(path: string) => {
				return fs.readFileSync(path).toString();
			}],
			cli: true,
			debug: options.debug,
			base: config.base || ''
		}, config, options.input);
		fs.writeFileSync(options.output || options.input + '.iz', asm);
	})
	;

program.command('emit')
	.description(`Compile ${Header.zs} intermediate assembly`)
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
		const binary = await Z.emit(asm);
		fs.writeFileSync(_options.output, binary);
	})
	;

program.parse();



