#!/usr/bin/env node

require('module-alias/register');

import fs from 'fs';
import Path from 'path';
import Process from 'process';
import { program } from 'commander';
import * as ct from 'colorette';
import Inquierer from '@inquirer/core';
import { confirm, select } from '@inquirer/prompts';

import { Z } from '~/zs';
import { FileType } from '~/file';
import { Errors } from '~/error';
import { Header } from '~/cli/header';
import { Project } from '~/project';
import { Util } from '~/util';

import _package from 'package.json';

Process.addListener('SIGINT', Util.terminate);
Process.addListener('SIGTERM', Util.terminate);

const home = process.env.HOME || process.env.USERPROFILE || '~';
const folder = Path.join(home, '.zsharp');
if (!fs.existsSync(folder)) {
	const termsAgreement = select<string>({
		choices: [
			'I agree',
			'I disagree'
		],
		message: `
Welcome to ${Header.zs}!
${Header.zs} is licensed under a custom open-source license (MIT-based, no resale).
By using ${Header.zs}, you agree to the license terms at: ${Header.hyperlink('https://zsharp.dev/license', 'https://zsharp.dv/license')}
		`,
		default: 'I disagree'
	});
	termsAgreement.then((v) => {
		if (v == 'I disagree') {
			Util.terminate();
		};
		fs.mkdirSync(folder);
	});
};

let config: Project.Configuration = {};

program
	.addHelpText('after', `
THIS SOFTWARE IS FREE AND MAY NOT BE SOLD UNDER ANY CIRCUMSTANCES.

If you paid for this software, you were scammed — demand a full refund immediately.
If the seller refuses, you are encouraged to pursue legal action.

Any attempt to sell this software, or modified versions of it, is strictly prohibited
and may result in prosecution.

"We are always watching"
	`)
	;


program
	.name('zs')
	.description(ct.white(`${Header.zs} compiler`))
	.version(_package.version)
	.usage('<command> [options]')
	;

program.command('build')
	.description(`Build ${Header.zs} code`)
	.option('--input, -I <path>')
	.option('--output, -O <path>')
	.option('--mode, -M <string>')
	.option('--debug, -D')
	.action(async (options) => {
		if (!options.input) {
			throw new Errors.Command.Missing.Parameters(['input']);
		};

		Util.log(Header.header);

		config = Project.get(options.input.split('/').slice(0, -1).join('/'));
		const asm = await Z.toIZ(fs.readFileSync(options.input).toString(), {
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
	.action(async (_options) => {
		if (!_options.input) {
			throw new Errors.Command.Missing.Parameters(['input']);
		};
		const asm = fs.readFileSync(_options.input).toString();
		const binary = await Z.emit(asm);
		fs.writeFileSync(_options.output, binary);
	})
	;

program.command('reset')
	.description(`Reset the ${Header.zs} configuration`)
	.action(async () => {
		fs.rmSync(folder, { recursive: true, force: true });	
	})
	;

if (fs.existsSync(folder)) {
	program.parse();
};
