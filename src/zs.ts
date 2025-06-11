import { Parts } from '~/parts';
import { Syntax } from '~/syntax';
import { Feature } from '~/feature';
import { Assembler } from '~/assembler';
import { Emit } from '~/emit';
import { FileType } from '~/file';
import { Errors } from '~/error';
import { Project } from '~/project';
import { Spinner, spinnerStyles } from '~/cli/spinner';
import { header, success, failure, SuccessData, FailureData } from '~/cli/header';
import { official } from '~/official';
import { Util } from '~/util';

export namespace Z {
	export type Importer = {
		import: (path: string) => string,
		cli: boolean,
		debug: boolean
	};


	/**
	 * Starts the provided spinner.
	 *
	 * @param spinner The spinner instance to start.
	 */
	export function spin(spinner: Spinner) {
		spinner.start();
	};

	/**
	 * Compiles Z# code to assembly.
	 *
	 * @param content the content of the Z# file to compile
	 * @param importer the importer object, used to import Z# modules
	 * @param path the path of the Z# file to compile, if any
	 * @returns the compiled assembly code
	 */
	export function toAssembly(content: string, importer: Importer, config: Project.Configuration, path?: string) {
		const start = Date.now();

		let spinners: Spinner[] = [];
		let assembly: string = '';
		if (importer.cli) {
			console.log(header);
			spinners = Array.from({ length: 10 }, () => {
				const spinner = new Spinner({ text: '', style: spinnerStyles['compile'] });
				return spinner;
			});
			spinners[0].options.text = 'Parsing';
			spinners[1].options.text = 'Applying syntax';
			spinners[2].options.text = 'Compiling to assembly';
			spinners[0].start();
		};
		try {
			const parts = Parts.toParts(content, path);
			if (importer.cli) {
				spinners[0].success();
				spinners[1].start();
			};
			const scope = new Feature.Scope(importer, 'main');
			const basePosition: Errors.Position = {
				content,
			};
			const syntax = Syntax.toFeatures(parts, scope, basePosition, undefined, path);
			if (importer.cli) {
				spinners[1].success();
				spinners[2].start();
			};
			assembly = Assembler.assemble(syntax, scope, config);
			if (importer.cli) {
				spinners[2].success();
			};

			if (importer.cli) {
				const end = Date.now();
				console.log(success({
					vulnerabilities: 0, // add later
					time: end - start
				}));
			};
		} catch (_err) {
			Util.error(_err as Errors.MainError);
		};

		return assembly;
	};

	/**
	 * Emit the given Z# assembly into a binary file.
	 *
	 * @param content The Z# assembly source code.
	 * @param output The output file path.
	 *
	 * @returns The compiled binary data.
	 */
	export async function emit(content: string, output: string) {
		const compiled = await Emit.compileAssemblyToBinary(content, output);
		return compiled;
	};
};

