import { Parts } from '~/parts';
import { Syntax } from '~/syntax';
import { Feature } from '~/feature';
import { Assembler } from '~/assembler';
import { Emit } from '~/emit';
import { FileType } from '~/file';
import { Errors } from '~/error';
import { Project } from '~/project';
import { Header } from '~/cli/header';
import { official } from '~/official';
import { Module } from '~/module';
import { BuiltIn } from '~/builtin';
import { Util } from '~/util';

import ora, { Ora } from 'ora';
import * as ct from 'colorette';

export namespace Z {
	export type ImportFunction = (path: string) => string;
	export type Importer = {
		import: ImportFunction[],
		debug: boolean,
		cli: boolean,
		base: string
	};

	/**
	 * Compiles Z# code to assembly.
	 *
	 * @param content the content of the Z# file to compile
	 * @param importer the importer object, used to import Z# modules
	 * @param path the path of the Z# file to compile, if any
	 * @returns the compiled Z# intermediate assembly
	 */
	export function toIZ(content: string, importer: Importer, config: Project.Configuration, path?: string) {
		const start = Date.now();

		let assembly: string = '';
		let spinner: Ora | null = null;
		let message: string = '';
		let features: (typeof Feature.Feature<any>)[] = official;

		for (const mod of config.Mods || []) {
			features.push(...(Module.get(mod.source, importer.base)?.implements?.features || []));
		};

		if (importer.cli) {
			message = path ? `Compiling ${path}` : 'Compiling';
			spinner = ora({
				text: message,
				color: 'blue',
				spinner: 'dots',
			});
			spinner.start();
		};
		try {
			const parts = Parts.toParts(content, path);
			let scope = new Feature.Scope(importer, 'main');
			scope = BuiltIn.inject(scope);
			const basePosition: Errors.Position = {
				content,
			};
			const syntax = Syntax.toFeatures(parts, scope, basePosition, features, path);
			assembly = Assembler.assemble(syntax, scope, config);

			if (importer.cli) {
				const end = Date.now();
				spinner?.stopAndPersist({
					text: message + ' - ' + Header.time(end - start),
					symbol: ct.green('⠿')
				});
				console.log(Header.success({
					vulnerabilities: 0, // add later
					time: end - start
				}));
			};
		} catch (_err) {
			if (importer.cli) {
				spinner?.stopAndPersist({
					text: message,
					symbol: ct.red('⠿')
				});
			};
			Util.error(_err as Errors.MainError);
		};

		return assembly;
	};

	/**
	 * Emit the given Z# intermediate assembly into a binary file.
	 *
	 * @param content The Z# intermediate assembly source code.
	 * @param output The output file path.
	 *
	 * @returns The compiled binary data.
	 */
	export async function emit(content: string) {
		const compiled = await Emit.compileIZToELF(content);
		return compiled;
	};
};

